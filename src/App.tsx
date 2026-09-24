import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Icon } from './components/Icons'
import { ProjectGlyph, ProjectModal } from './components/ProjectModal'
import { capabilities, projects, stackGroups, type Project } from './data/projects'
import { useLocalTime } from './hooks/useLocalTime'
import { useReducedMotion } from './hooks/useReducedMotion'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'approach', label: 'Approach' },
  { id: 'contact', label: 'Contact' },
]

const contactEmail = 'hello@yourdomain.com'
const SceneCanvas = lazy(() => import('./components/SceneCanvas').then((module) => ({ default: module.SceneCanvas })))

function App() {
  const environment = useLocalTime()
  const reducedMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollProgressRef = useRef(0)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
      scrollProgressRef.current = progress
      shellRef.current?.style.setProperty('--scroll-progress', String(progress))
      setIsScrolled((previous) => {
        const next = window.scrollY > 24
        return previous === next ? previous : next
      })
    }
    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-34% 0px -56% 0px', threshold: [0, 0.2, 0.6] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project)
    setActiveProjectId(project.id)
    setMenuOpen(false)
  }, [])

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null)
    setActiveProjectId(null)
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const shellStyle = useMemo(() => ({
    '--accent': environment.accent,
    '--secondary': environment.secondary,
    '--sky-top': environment.skyTop,
    '--sky-bottom': environment.skyBottom,
    '--horizon': environment.horizon,
  } as CSSProperties), [environment])

  return (
    <div ref={shellRef} className={`app-shell phase-${environment.phase}${isScrolled ? ' is-scrolled' : ''}`} style={shellStyle} data-phase={environment.phase}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="top-rule" />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Aster home">
          <span className="brand-mark">A<span>/</span></span>
          <span className="brand-name">Aster</span>
        </a>
        <nav id="site-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              className={activeSection === item.id ? 'is-active' : ''}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span>{item.label}</span>
              <i />
            </a>
          ))}
        </nav>
        <div className="header-meta">
          <span className="status-dot" />
          <span className="header-meta-label">Open to thoughtful work</span>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={21} />
        </button>
      </header>

      <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
        <SceneCanvas
          projects={projects}
          environment={environment}
          reducedMotion={reducedMotion}
          scrollProgressRef={scrollProgressRef}
          activeProjectId={activeProjectId}
          onProjectSelect={handleProjectSelect}
        />
      </Suspense>
      <div className="grain-layer" />

      <main id="main-content">
        <section id="home" className="hero section-shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span>00</span> Independent engineering practice</div>
              <h1>
                <span>Make the</span>
                <span className="hero-accent-line">complex feel</span>
                <span>inevitable<span className="hero-period">.</span></span>
              </h1>
              <p className="hero-lede">Aster is a portfolio for thoughtful software, spatial interfaces, and the systems that make them feel simple.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  <span>Explore the work</span>
                  <Icon name="arrow-up-right" size={17} />
                </a>
                <a className="button button-quiet" href="#approach">
                  <span>Read the approach</span>
                  <Icon name="arrow-right" size={17} />
                </a>
              </div>
            </div>

            <aside className="hero-aside" aria-label="Current environment">
              <div className="aside-line" />
              <div className="time-readout">
                <div className="time-readout-top">
                  <span className="eyebrow">Local time</span>
                  <Icon name={environment.phase === 'night' ? 'moon' : 'sun'} size={17} />
                </div>
                <strong>{environment.time}</strong>
                <span>{environment.date} · {environment.label}</span>
              </div>
              <div className="hero-coordinate">
                <span>FIELD / 01</span>
                <span>DEPTH / 03</span>
                <span>MODE / EXPLORE</span>
              </div>
            </aside>
          </div>

          <div className="hero-bottomline">
            <div className="hero-note"><Icon name="spark" size={15} /> A living environment tuned to your local hour</div>
            <a className="scroll-cue" href="#work"><span>Scroll to enter</span><Icon name="arrow-down" size={16} /></a>
          </div>
        </section>

        <section id="work" className="work-section section-shell section-space">
          <div className="section-intro">
            <div className="eyebrow"><span>01</span> Selected field studies</div>
            <div className="section-intro-copy">
              <h2>Useful things,<br /><em>made visible.</em></h2>
              <p>These concept studies are placeholders for verified work. Each one starts with a real interaction problem, then gives the system a shape you can feel.</p>
            </div>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <button
                className="project-card"
                key={project.id}
                type="button"
                style={{ '--project-accent': project.accent } as CSSProperties}
                onClick={() => handleProjectSelect(project)}
                aria-label={`Open ${project.title} case study`}
              >
                <div className="project-card-visual">
                  <ProjectGlyph visual={project.visual} accent={project.accent} />
                  <span className="project-card-index">{project.number}</span>
                  <span className="project-card-status">{project.status}</span>
                </div>
                <div className="project-card-copy">
                  <div className="project-card-meta"><span>{project.category}</span><span>{project.year}</span></div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span className="project-card-link">Read the study <Icon name="arrow-up-right" size={16} /></span>
                </div>
              </button>
            ))}
          </div>

          <div className="work-footnote"><span className="footnote-rule" /> No borrowed metrics. No invented outcomes. Just a clear place to put the work you can prove.</div>
        </section>

        <section id="approach" className="approach-section section-shell section-space">
          <div className="approach-grid">
            <div className="approach-sticky">
              <div className="eyebrow"><span>02</span> The operating system</div>
              <h2>Clarity is<br /><em>a feature.</em></h2>
              <p>Good work does not need to announce its complexity. It needs to make the next decision easier to see.</p>
              <div className="approach-stamp"><span>ASTER</span><span>BUILD / 001</span></div>
            </div>
            <div className="principle-list">
              {capabilities.map((capability) => (
                <article className="principle" key={capability.label}>
                  <span className="principle-number">{capability.label}</span>
                  <div>
                    <h3>{capability.title}</h3>
                    <p>{capability.body}</p>
                  </div>
                  <Icon name="arrow-up-right" size={17} />
                </article>
              ))}
            </div>
          </div>

          <div className="system-map" aria-label="A visual map of the design and engineering process">
            <div className="system-map-head"><span className="eyebrow">A small system for big questions</span><span>Signal / Structure / Surface</span></div>
            <div className="system-map-body">
              <div className="system-node system-node-origin"><span className="node-pulse" /><strong>Question</strong><small>Start with the tension.</small></div>
              <div className="system-connector connector-one"><span /></div>
              <div className="system-node system-node-structure"><Icon name="layers" size={19} /><strong>Structure</strong><small>Make relationships visible.</small></div>
              <div className="system-connector connector-two"><span /></div>
              <div className="system-node system-node-surface"><Icon name="cursor" size={19} /><strong>Surface</strong><small>Let the idea meet a hand.</small></div>
              <div className="system-connector connector-three"><span /></div>
              <div className="system-node system-node-next"><Icon name="arrow-up-right" size={19} /><strong>Next</strong><small>Leave the trail clearer.</small></div>
            </div>
          </div>
        </section>

        <section className="stack-section section-shell section-space">
          <div className="stack-heading">
            <div className="eyebrow"><span>03</span> Working language</div>
            <p>Tools change. The habit of making the trade-off visible does not.</p>
          </div>
          <div className="stack-grid">
            {stackGroups.map((group) => (
              <div className="stack-group" key={group.label}>
                <div className="stack-group-label"><span>{group.label}</span><i /></div>
                <ul>
                  {group.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section section-shell section-space">
          <div className="contact-panel">
            <div className="contact-topline"><div className="eyebrow"><span>04</span> The next coordinate</div><span className="contact-orbit" /></div>
            <div className="contact-content">
              <h2>Have a good<br /><em>question?</em></h2>
              <p>Tell me what you are trying to make clearer. The first useful conversation is usually enough to find the shape of the work.</p>
              <div className="contact-actions">
                <a className="button button-primary" href={`mailto:${contactEmail}`}>
                  <span>Start a conversation</span>
                  <Icon name="arrow-up-right" size={17} />
                </a>
                <button className="copy-button" type="button" onClick={handleCopyEmail} aria-label={`Copy ${contactEmail}`}>
                  <span>{copied ? 'Copied to clipboard' : contactEmail}</span>
                  <Icon name={copied ? 'check' : 'copy'} size={16} />
                </button>
              </div>
            </div>
            <div className="contact-bottomline"><span>Replace this placeholder with a verified address before publishing.</span><span>© {new Date().getFullYear()} Aster practice</span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <span>Built as a starting point, not a finished identity.</span>
        <a href="#home">Return to the surface <Icon name="arrow-up-right" size={14} /></a>
      </footer>

      {selectedProject && <ProjectModal project={selectedProject} onClose={handleCloseProject} />}
    </div>
  )
}

export default App
