import { createContext, useContext, useState } from 'react'
import { MOCK_DEVIATIONS } from '@/data/mock-deviations'

const DeviationContext = createContext()

export function DeviationProvider({ children }) {
  const [deviations, setDeviations] = useState(MOCK_DEVIATIONS)

  const addDeviation = (deviation) => setDeviations((prev) => [deviation, ...prev])

  const updateDeviation = (id, updates) =>
    setDeviations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)))

  return (
    <DeviationContext.Provider value={{ deviations, addDeviation, updateDeviation }}>
      {children}
    </DeviationContext.Provider>
  )
}

export function useDeviations() {
  return useContext(DeviationContext)
}
