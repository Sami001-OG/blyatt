import { useEffect, useId, useRef, type CSSProperties } from 'react'
import type { Project } from '../data/projects'
import { Icon } from './Icons'

type ProjectModalProps = {
  project: Project
  onClose: () => void
}

export function ProjectGlyph({ visual, accent }: { visual: Project['visual']; accent: string }) {
  if (visual === 'signal') {
    return (
      <div className="project-glyph project-glyph-signal" style={{ '--glyph-accent': accent } as CSSProperties}>
        <span className="glyph-signal-axis glyph-signal-axis-one" />
        <span className="glyph-signal-axis glyph-signal-axis-two" />
        <span className="glyph-signal-pulse" />
        <span className="glyph-signal-node glyph-signal-node-one" />
        <span className="glyph-signal-node glyph-signal-node-two" />
        <span className="glyph-signal-node glyph-signal-node-three" />
      </div>
    )
  }

  if (visual === 'atlas') {
    return (
      <div className="project-glyph project-glyph-atlas" style={{ '--glyph-accent': accent } as CSSProperties}>
        <span className="glyph-atlas-orbit glyph-atlas-orbit-one" />
        <span className="glyph-atlas-orbit glyph-atlas-orbit-two" />
        <span className="glyph-atlas-core" />
        <span className="glyph-atlas-node glyph-atlas-node-one" />
        <span className="glyph-atlas-node glyph-atlas-node-two" />
        <span className="glyph-atlas-node glyph-atlas-node-three" />
      </div>
    )
  }

  return (
    <div className="project-glyph project-glyph-current" style={{ '--glyph-accent': accent } as CSSProperties}>
      <span className="glyph-current-line glyph-current-line-one" />
      <span className="glyph-current-line glyph-current-line-two" />
      <span className="glyph-current-line glyph-current-line-three" />
      <span className="glyph-current-cursor" />
    </div>
  )
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-topline">
          <span className="eyebrow"><span>{project.number}</span> {project.status}</span>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Close case study">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="modal-layout">
          <div className="modal-visual">
            <ProjectGlyph visual={project.visual} accent={project.accent} />
            <span className="modal-visual-caption">A spatial study / {project.year}</span>
          </div>
          <div className="modal-copy">
            <p className="modal-category">{project.category}</p>
            <h2 id={titleId}>{project.title}</h2>
            <p className="modal-lede">{project.description}</p>
            <div className="modal-rule" />
            <dl className="case-study-list">
              <div>
                <dt>Context</dt>
                <dd>{project.context}</dd>
              </div>
              <div>
                <dt>Problem</dt>
                <dd>{project.problem}</dd>
              </div>
              <div>
                <dt>Approach</dt>
                <dd>{project.solution}</dd>
              </div>
            </dl>
            <div className="modal-stack">
              <span className="eyebrow">Working set</span>
              <div className="tag-list">
                {project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <span><Icon name="spark" size={15} /> Concept study — replace with verified work before publishing.</span>
          <button className="text-button" type="button" onClick={onClose}>Return to index <Icon name="arrow-right" size={16} /></button>
        </div>
      </section>
    </div>
  )
}
