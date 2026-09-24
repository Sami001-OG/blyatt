import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Project } from '../data/projects'
import type { EnvironmentState } from '../lib/environment'

type SceneCanvasProps = {
  projects: Project[]
  environment: EnvironmentState
  reducedMotion: boolean
  scrollProgressRef: { current: number }
  activeProjectId: string | null
  onProjectSelect: (project: Project) => void
}

type Landmark = {
  group: THREE.Group
  ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>
  core: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
}

const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
      child.geometry.dispose()
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => material.dispose())
    }
  })
}

export function SceneCanvas({
  projects,
  environment,
  reducedMotion,
  scrollProgressRef,
  activeProjectId,
  onProjectSelect,
}: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const environmentRef = useRef(environment)
  const reducedMotionRef = useRef(reducedMotion)
  const activeProjectRef = useRef(activeProjectId)
  const hoveredIdRef = useRef<string | null>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    environmentRef.current = environment
  }, [environment])

  useEffect(() => {
    reducedMotionRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    activeProjectRef.current = activeProjectId
  }, [activeProjectId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: true,
        powerPreference: 'default',
      })
    } catch {
      setWebglAvailable(false)
      return
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x081316, 0.045)
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0.2, 0.2, 8.6)

    renderer.setClearColor(0x071013, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    const world = new THREE.Group()
    world.position.y = 0.15
    scene.add(world)

    const ambient = new THREE.HemisphereLight(0xd4eee5, 0x071013, 1.1)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight(0xffd5a1, 1.4)
    sun.position.set(-4, 6, 5)
    scene.add(sun)
    const fill = new THREE.PointLight(0x8ed7ff, 2.2, 12, 2)
    fill.position.set(4, -1, 4)
    scene.add(fill)

    const worldMaterial = new THREE.MeshStandardMaterial({
      color: 0x183a3a,
      roughness: 0.5,
      metalness: 0.5,
      transparent: true,
      opacity: 0.9,
    })
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xb8e5c3,
      transparent: true,
      opacity: 0.36,
    })

    const coreGeometry = new THREE.IcosahedronGeometry(1.34, 2)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x8bb8aa,
      emissive: 0x0c2926,
      emissiveIntensity: 1.1,
      roughness: 0.32,
      metalness: 0.58,
      transparent: true,
      opacity: 0.2,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.name = 'core'
    world.add(core)

    const coreEdges = new THREE.LineSegments(new THREE.EdgesGeometry(coreGeometry), edgeMaterial)
    coreEdges.scale.setScalar(1.005)
    world.add(coreEdges)

    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xe2f6c7, transparent: true, opacity: 0.95 }),
    )
    world.add(innerCore)

    const coreLight = new THREE.PointLight(0xd7f36b, 3.6, 6, 2)
    coreLight.position.set(0, 0.1, 0.3)
    world.add(coreLight)

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd7f36b,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.012, 8, 128), ringMaterial)
    ring.rotation.x = Math.PI / 2.6
    ring.rotation.z = 0.22
    world.add(ring)

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.22, 0.006, 8, 128),
      new THREE.MeshBasicMaterial({ color: 0x8ed7ff, transparent: true, opacity: 0.35 }),
    )
    outerRing.rotation.x = Math.PI / 2.1
    outerRing.rotation.y = -0.35
    world.add(outerRing)

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.004, 6, 128),
      new THREE.MeshBasicMaterial({ color: 0xf09a70, transparent: true, opacity: 0.22 }),
    )
    orbitRing.rotation.x = Math.PI / 2
    orbitRing.rotation.z = -0.6
    world.add(orbitRing)

    const grid = new THREE.GridHelper(28, 28, 0x47756c, 0x193b38)
    grid.position.y = -1.55
    grid.position.z = -1
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
    gridMaterials.forEach((material) => {
      material.transparent = true
      material.opacity = 0.22
    })
    world.add(grid)

    const groundRing = new THREE.Mesh(
      new THREE.RingGeometry(2.25, 2.27, 128),
      new THREE.MeshBasicMaterial({ color: 0x8ed7ff, transparent: true, opacity: 0.26, side: THREE.DoubleSide }),
    )
    groundRing.rotation.x = -Math.PI / 2
    groundRing.position.y = -1.5
    world.add(groundRing)

    const starPositions: number[] = []
    for (let index = 0; index < 180; index += 1) {
      const angle = index * 2.39996
      const radius = 5.5 + (index % 9) * 0.34
      starPositions.push(
        Math.cos(angle) * radius,
        1.3 + ((index * 17) % 31) * 0.11,
        -2.5 - ((index * 11) % 17) * 0.35,
      )
    }
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({
      color: 0xe6f4e5,
      size: 0.025,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    const projectPositions = [
      new THREE.Vector3(-2.9, 0.15, 0.25),
      new THREE.Vector3(2.85, 0.55, -0.45),
      new THREE.Vector3(0.2, -0.42, -2.1),
    ]
    const landmarks: Landmark[] = []

    projects.forEach((project, index) => {
      const group = new THREE.Group()
      group.position.copy(projectPositions[index])
      group.rotation.y = index * 0.7 - 0.25
      group.userData.projectId = project.id

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.86, 0.18, 6), worldMaterial)
      base.position.y = -0.82
      base.userData.projectId = project.id
      group.add(base)

      const body = new THREE.Mesh(
        index === 0 ? new THREE.OctahedronGeometry(0.58, 1) : index === 1 ? new THREE.TorusKnotGeometry(0.42, 0.12, 64, 12) : new THREE.IcosahedronGeometry(0.56, 1),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? 0x7e9e5d : index === 1 ? 0x5b8b99 : 0xa8735f,
          emissive: index === 0 ? 0x253b1c : index === 1 ? 0x102e3b : 0x3a201a,
          emissiveIntensity: 0.9,
          roughness: 0.32,
          metalness: 0.52,
          transparent: true,
          opacity: 0.82,
        }),
      )
      body.position.y = -0.12
      body.userData.projectId = project.id
      group.add(body)

      const bodyEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(body.geometry),
        new THREE.LineBasicMaterial({ color: 0xe6f4dc, transparent: true, opacity: 0.3 }),
      )
      bodyEdges.position.copy(body.position)
      group.add(bodyEdges)

      const mast = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -0.75, 0),
          new THREE.Vector3(0, 0.92, 0),
        ]),
        new THREE.LineBasicMaterial({ color: index === 0 ? 0xd7f36b : index === 1 ? 0x8ed7ff : 0xff9c7d, transparent: true, opacity: 0.45 }),
      )
      group.add(mast)

      const signal = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 12),
        new THREE.MeshBasicMaterial({ color: project.accent, transparent: true, opacity: 0.95 }),
      )
      signal.position.y = 0.95
      group.add(signal)

      const landmarkRing = new THREE.Mesh(
        new THREE.RingGeometry(0.86, 0.875, 64),
        new THREE.MeshBasicMaterial({ color: project.accent, transparent: true, opacity: 0.38, side: THREE.DoubleSide }),
      )
      landmarkRing.rotation.x = -Math.PI / 2
      landmarkRing.position.y = -0.91
      group.add(landmarkRing)
      landmarks.push({ group, ring: landmarkRing, core: body })

      world.add(group)
    })

    const clickableObjects = landmarks.map((landmark) => landmark.group)
    const pointer = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    const clock = new THREE.Clock()
    let frame = 0
    let isVisible = true
    let contextLost = false

    const setHover = (id: string | null) => {
      if (hoveredIdRef.current === id) return
      hoveredIdRef.current = id
      canvas.style.cursor = id ? 'pointer' : 'default'
    }

    const pickProject = (event: Pick<PointerEvent, 'clientX' | 'clientY'>) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(clickableObjects, true)[0]
      const projectId = hit?.object.userData.projectId as string | undefined
      setHover(projectId ?? null)
      return projectId
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current) return
      pickProject(event)
    }

    const handlePointerLeave = () => setHover(null)

    const handleClick = (event: MouseEvent) => {
      const projectId = pickProject(event)
      if (!projectId) return
      const project = projects.find((item) => item.id === projectId)
      if (project) onProjectSelect(project)
    }

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible'
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      setWebglAvailable(false)
    }

    const handleContextRestored = () => {
      contextLost = false
    }

    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)
    document.addEventListener('visibilitychange', handleVisibility)

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 720 ? 1.2 : 1.65))
      renderer.setSize(width, height, false)
    }

    window.addEventListener('resize', resize)

    const render = () => {
      if (isVisible && !contextLost) {
        const elapsed = clock.getElapsedTime()
        const progress = scrollProgressRef.current
        const state = environmentRef.current
        const still = reducedMotionRef.current
        const activeId = activeProjectRef.current
        const hoverId = hoveredIdRef.current
        const accent = new THREE.Color(state.accent)
        const secondary = new THREE.Color(state.secondary)
        const skyColor = new THREE.Color(state.skyTop).lerp(new THREE.Color(0x071013), 0.32)
        renderer.setClearColor(skyColor, 1)

        starMaterial.opacity = state.starVisibility * (still ? 0.72 : 0.45 + Math.sin(elapsed * 0.45) * 0.08)
        coreMaterial.color.lerp(new THREE.Color(0x8bb8aa).lerp(accent, 0.18), 0.02)
        coreMaterial.emissive.lerp(accent, 0.02)
        coreMaterial.emissiveIntensity = 0.7 + state.sunIntensity * 0.28
        ringMaterial.color.lerp(accent, 0.035)
        outerRing.material.color.lerp(secondary, 0.035)
        orbitRing.material.opacity = 0.14 + state.starVisibility * 0.16
        coreLight.color.lerp(accent, 0.04)
        coreLight.intensity = 2.5 + state.sunIntensity * 0.8
        ambient.intensity = state.ambientIntensity
        sun.intensity = state.sunIntensity
        fill.intensity = 1.3 + state.artificialLight * 1.1

        world.rotation.y = still ? progress * 0.16 : elapsed * 0.035 + progress * 0.22
        world.rotation.x = still ? 0 : Math.sin(elapsed * 0.19) * 0.025
        core.rotation.x = still ? 0 : elapsed * 0.08
        core.rotation.y = still ? 0.35 : elapsed * 0.12
        coreEdges.rotation.copy(core.rotation)
        innerCore.scale.setScalar(still ? 1 : 1 + Math.sin(elapsed * 1.4) * 0.06)
        ring.rotation.z = still ? 0.22 : elapsed * 0.045
        outerRing.rotation.z = still ? -0.35 : -0.35 + elapsed * 0.025
        orbitRing.rotation.z = still ? -0.6 : -0.6 + elapsed * 0.018
        groundRing.rotation.z = still ? 0 : elapsed * 0.025
        stars.rotation.y = still ? 0 : elapsed * 0.004

        landmarks.forEach((landmark) => {
          const projectId = landmark.group.userData.projectId as string
          const isActive = projectId === activeId
          const isHovered = projectId === hoverId
          const targetScale = isActive ? 1.18 : isHovered ? 1.1 : 1
          const scale = still ? targetScale : THREE.MathUtils.lerp(landmark.group.scale.x, targetScale, 0.08)
          landmark.group.scale.setScalar(scale)
          landmark.group.rotation.y += (isActive ? 0.003 : 0.0008) * (still ? 0 : 1)
          landmark.ring.material.opacity = isActive || isHovered ? 0.72 : 0.38
          landmark.core.rotation.y += still ? 0 : 0.003
        })

        const targetX = still ? 0 : pointer.x * 0.24
        const targetY = still ? 0 : pointer.y * 0.14
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + Math.sin(progress * Math.PI) * 0.18, 0.035)
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + 0.15 - progress * 0.16, 0.035)
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.5 - progress * 1.15, 0.025)
        camera.lookAt(0, 0.05 + progress * 0.08, 0)
        renderer.render(scene, camera)
      }
      frame = window.requestAnimationFrame(render)
    }

    resize()
    frame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      disposeObject(world)
      disposeObject(stars)
      renderer.dispose()
    }
  }, [onProjectSelect, projects, scrollProgressRef])

  return (
    <div className="scene-layer" aria-hidden="true">
      <canvas ref={canvasRef} className={`scene-canvas${webglAvailable ? '' : ' is-unavailable'}`} />
      <div className={`scene-fallback${webglAvailable ? ' scene-fallback-ambient' : ' scene-fallback-active'}`}>
        <span className="scene-fallback-orbit" />
        <span className="scene-fallback-dot" />
      </div>
      <div className="scene-vignette" />
    </div>
  )
}
