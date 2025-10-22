import { useState } from 'react'

/**
 * Hook for managing calculator state and operations
 */
export function useCalculator() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [oldPayment, setOldPayment] = useState('')
  const [newPayment, setNewPayment] = useState('')

  const resetCalculator = () => {
    setOldPayment('')
    setNewPayment('')
  }

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator)
    if (showCalculator) {
      resetCalculator()
    }
  }

  return {
    showCalculator,
    oldPayment,
    newPayment,
    setOldPayment,
    setNewPayment,
    resetCalculator,
    toggleCalculator
  }
}
