import { useEffect } from 'react'
import { calculatePaymentStartDate, calculatePaymentEndDate } from '../../../utils/dateCalculations'

/**
 * Hook for managing payment calculations and auto-updates
 */
export function usePaymentCalculations(
  currentRecord: any,
  onFieldChange: (field: string, value: string) => void
) {
  // Auto-calculate payment start date on mount
  useEffect(() => {
    if (!currentRecord?.paymentStartDate) {
      const startDate = calculatePaymentStartDate()
      onFieldChange('paymentStartDate', startDate)
    }
  }, [])

  // Auto-calculate payment end date when age or start date changes
  // Only calculate if end date is not already set (to preserve parser-calculated dates)
  useEffect(() => {
    const age = Number(currentRecord?.age)
    const startDate = currentRecord?.paymentStartDate
    const existingEndDate = currentRecord?.paymentEndDate

    // Only calculate if we don't already have an end date from the parser
    if (age > 0 && startDate && !existingEndDate) {
      const endDate = calculatePaymentEndDate(age, startDate)
      if (endDate) {
        onFieldChange('paymentEndDate', endDate)
      }
    }
  }, [currentRecord?.age, currentRecord?.paymentStartDate])

  return {
    // Could return calculated values or calculation status if needed
  }
}
