export type AtmospherePhase = 'night' | 'morning' | 'day' | 'evening'

export type EnvironmentState = {
  phase: AtmospherePhase
  label: string
  time: string
  date: string
  accent: string
  secondary: string
  skyTop: string
  skyBottom: string
  horizon: string
  starVisibility: number
  sunElevation: number
  sunIntensity: number
  ambientIntensity: number
  artificialLight: number
}

const phaseForHour = (hour: number): AtmospherePhase => {
  if (hour >= 21 || hour < 5) return 'night'
  if (hour < 9) return 'morning'
  if (hour < 17) return 'day'
  return 'evening'
}

const phaseLabel: Record<AtmospherePhase, string> = {
  night: 'Night watch',
  morning: 'First light',
  day: 'Open sky',
  evening: 'Long light',
}

const phasePalette: Record<AtmospherePhase, Omit<EnvironmentState, 'phase' | 'label' | 'time' | 'date'>> = {
  night: {
    accent: '#b8e5ff',
    secondary: '#9b8cff',
    skyTop: '#050a12',
    skyBottom: '#0d1c26',
    horizon: '#122c39',
    starVisibility: 0.9,
    sunElevation: -0.25,
    sunIntensity: 0.2,
    ambientIntensity: 0.42,
    artificialLight: 1.25,
  },
  morning: {
    accent: '#f0d68c',
    secondary: '#a8e0c4',
    skyTop: '#182b35',
    skyBottom: '#d3a984',
    horizon: '#f0c994',
    starVisibility: 0.12,
    sunElevation: 0.25,
    sunIntensity: 1.15,
    ambientIntensity: 0.72,
    artificialLight: 0.35,
  },
  day: {
    accent: '#d7f36b',
    secondary: '#87d9e9',
    skyTop: '#17323a',
    skyBottom: '#9bc3b5',
    horizon: '#d4dfbd',
    starVisibility: 0,
    sunElevation: 0.9,
    sunIntensity: 1.55,
    ambientIntensity: 0.9,
    artificialLight: 0.1,
  },
  evening: {
    accent: '#ffad78',
    secondary: '#b9a2ff',
    skyTop: '#171b2b',
    skyBottom: '#a65b59',
    horizon: '#f29a70',
    starVisibility: 0.22,
    sunElevation: 0.12,
    sunIntensity: 0.95,
    ambientIntensity: 0.58,
    artificialLight: 0.55,
  },
}

export const getEnvironmentState = (date = new Date()): EnvironmentState => {
  const phase = phaseForHour(date.getHours())
  const palette = phasePalette[phase]
  const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
  const dateLabel = new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit' }).format(date)

  return {
    ...palette,
    phase,
    label: phaseLabel[phase],
    time,
    date: dateLabel,
  }
}
