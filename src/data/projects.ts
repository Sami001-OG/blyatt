export type Project = {
  id: string
  number: string
  title: string
  category: string
  year: string
  status: string
  description: string
  context: string
  problem: string
  solution: string
  stack: string[]
  features: string[]
  accent: string
  visual: 'signal' | 'atlas' | 'current'
}

export const projects: Project[] = [
  {
    id: 'signal-garden',
    number: '01',
    title: 'Signal Garden',
    category: 'Interactive systems / concept study',
    year: '2026',
    status: 'Concept study',
    description: 'A calm control surface for turning noisy signals into a sequence a person can act on.',
    context: 'A visual study in progressive disclosure: many inputs can still produce a quiet, legible decision surface.',
    problem: 'Dense operational data tends to hide the one change that matters. The interface needs to preserve context without making every signal compete for attention.',
    solution: 'A layered canvas pairs a living signal map with a focused review lane. The scene communicates rhythm; the panel communicates the decision.',
    stack: ['TypeScript', 'WebGL', 'Interaction design', 'Data visualization'],
    features: ['Layered signal field', 'Focus-by-selection', 'Responsive data fallback', 'Reduced-motion mode'],
    accent: '#d7f36b',
    visual: 'signal',
  },
  {
    id: 'atlas-of-edges',
    number: '02',
    title: 'Atlas of Edges',
    category: 'Knowledge tooling / concept study',
    year: '2026',
    status: 'Concept study',
    description: 'A spatial index for understanding how a system changes when one boundary moves.',
    context: 'An experiment in making architectural relationships explorable without turning a product into a dashboard.',
    problem: 'Architecture diagrams are often accurate and inert. A team needs to see the consequence of a change, not only the shape of the current system.',
    solution: 'Nodes stay semantic while the camera carries the reader between layers. The structure remains readable as a linear list when motion is unavailable.',
    stack: ['React', 'Three.js', 'Systems design', 'Prototyping'],
    features: ['Semantic node map', 'Layer-by-layer camera', 'Keyboard-readable outline', 'Graceful canvas fallback'],
    accent: '#8ed7ff',
    visual: 'atlas',
  },
  {
    id: 'quiet-current',
    number: '03',
    title: 'Quiet Current',
    category: 'Developer tooling / concept study',
    year: '2026',
    status: 'Concept study',
    description: 'A small, local-first workspace for turning rough notes into a navigable technical brief.',
    context: 'A study in removing ceremony from the moment an idea needs to become understandable to another person.',
    problem: 'Notes accumulate faster than they become useful. The missing layer is a lightweight path from fragments to a coherent decision.',
    solution: 'A local document model keeps the source close, while a narrow command surface helps the writer shape, link, and export without a cloud dependency.',
    stack: ['React', 'TypeScript', 'Local-first data', 'Interaction design'],
    features: ['Local document model', 'Command surface', 'Portable export', 'Keyboard-first editing'],
    accent: '#ff9c7d',
    visual: 'current',
  },
]

export const capabilities = [
  {
    label: '01',
    title: 'Make the invisible legible',
    body: 'Good interfaces give complex systems a shape people can reason about. I start with the mental model, then choose the smallest visual language that can carry it.',
  },
  {
    label: '02',
    title: 'Prototype the behavior',
    body: 'A static frame can hide the hard part. I build the transition, the empty state, and the edge case early so the idea is tested in motion.',
  },
  {
    label: '03',
    title: 'Leave a useful trace',
    body: 'The best work makes the next decision easier. Clear boundaries, honest constraints, and a system that can keep learning are part of the deliverable.',
  },
]

export const stackGroups = [
  {
    label: 'Build',
    items: ['TypeScript', 'React', 'Node.js', 'CSS systems', 'WebGL'],
  },
  {
    label: 'Shape',
    items: ['Interaction design', 'Prototyping', 'Data visualization', 'Technical writing'],
  },
  {
    label: 'Operate',
    items: ['Git', 'Linux', 'CI/CD', 'Testing', 'Performance budgets'],
  },
]
