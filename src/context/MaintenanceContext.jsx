import { createContext, useContext, useState } from 'react'
import { MOCK_MAINTENANCE } from '@/data/mock-maintenance'

const MaintenanceContext = createContext()

export function MaintenanceProvider({ children }) {
  const [items, setItems] = useState(MOCK_MAINTENANCE)

  const addItem = (item) => setItems((prev) => [item, ...prev])

  const updateItem = (id, updates) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)))

  const getByConditionId = (conditionId) =>
    items.find((i) => i.linkedConditionId === conditionId)

  return (
    <MaintenanceContext.Provider value={{ items, addItem, updateItem, getByConditionId }}>
      {children}
    </MaintenanceContext.Provider>
  )
}

export function useMaintenance() {
  return useContext(MaintenanceContext)
}
