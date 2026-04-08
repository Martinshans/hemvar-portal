import { createContext, useContext, useState } from 'react'
import { MOCK_CONDITIONS } from '@/data/mock-conditions'

const ConditionContext = createContext()

export function ConditionProvider({ children }) {
  const [conditions, setConditions] = useState(MOCK_CONDITIONS)
  const [completedConditions, setCompletedConditions] = useState([])

  const addCondition = (condition) => setConditions((prev) => [condition, ...prev])

  const completeCondition = (conditionId, completedData) => {
    const condition = conditions.find((c) => c.id === conditionId)
    if (!condition) return

    setCompletedConditions((prev) => [
      {
        id: `completed-${Date.now()}`,
        originalId: condition.id,
        buildingPartLabel: condition.buildingPartLabel,
        buildingPart: condition.buildingPart,
        previousTg: condition.tg,
        previousKg: condition.kg,
        previousDescription: condition.description,
        previousAction: condition.recommendedAction,
        previousAssessedBy: condition.assessedBy,
        previousAssessedDate: condition.assessedDate,
        completedDate: completedData.completedDate,
        completedCost: completedData.cost,
        nextPlannedYear: completedData.year,
        history: condition.history || [],
      },
      ...prev,
    ])

    setConditions((prev) => prev.filter((c) => c.id !== conditionId))
  }

  return (
    <ConditionContext.Provider value={{ conditions, setConditions, addCondition, completedConditions, completeCondition }}>
      {children}
    </ConditionContext.Provider>
  )
}

export function useConditions() {
  return useContext(ConditionContext)
}
