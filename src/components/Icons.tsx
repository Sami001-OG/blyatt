type IconName =
  | 'arrow-up-right'
  | 'arrow-right'
  | 'arrow-down'
  | 'close'
  | 'menu'
  | 'sun'
  | 'moon'
  | 'spark'
  | 'copy'
  | 'check'
  | 'mail'
  | 'layers'
  | 'cursor'

type IconProps = {
  name: IconName
  size?: number
  strokeWidth?: number
}

export function Icon({ name, size = 18, strokeWidth = 1.7 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'arrow-up-right') {
    return (
      <svg {...common}>
        <path d="M5 19 19 5" />
        <path d="M8 5h11v11" />
      </svg>
    )
  }

  if (name === 'arrow-right') {
    return (
      <svg {...common}>
        <path d="M4 12h15" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    )
  }

  if (name === 'arrow-down') {
    return (
      <svg {...common}>
        <path d="M12 4v15" />
        <path d="m6 13 6 6 6-6" />
      </svg>
    )
  }

  if (name === 'close') {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    )
  }

  if (name === 'menu') {
    return (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    )
  }

  if (name === 'sun') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
    )
  }

  if (name === 'moon') {
    return (
      <svg {...common}>
        <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
      </svg>
    )
  }

  if (name === 'spark') {
    return (
      <svg {...common}>
        <path d="m12 2 1.4 6.6L20 10l-6.6 1.4L12 18l-1.4-6.6L4 10l6.6-1.4L12 2Z" />
        <path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
      </svg>
    )
  }

  if (name === 'copy') {
    return (
      <svg {...common}>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg {...common}>
        <path d="m5 12 4.2 4.2L19 6.5" />
      </svg>
    )
  }

  if (name === 'mail') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  }

  if (name === 'layers') {
    return (
      <svg {...common}>
        <path d="m12 3 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="m5 3 5.5 15 2.1-6.1L19 9.5 5 3Z" />
      <path d="m13 14 4 4" />
    </svg>
  )
}
