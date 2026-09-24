import { useEffect, useState } from 'react'
import { getEnvironmentState, type EnvironmentState } from '../lib/environment'

export const useLocalTime = (): EnvironmentState => {
  const [environment, setEnvironment] = useState<EnvironmentState>(() => getEnvironmentState())

  useEffect(() => {
    const update = () => setEnvironment(getEnvironmentState())
    update()
    const interval = window.setInterval(update, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return environment
}
