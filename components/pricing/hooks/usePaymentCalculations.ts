import { useEffect } from 'react'
import { calculatePaymentStartDate, calculatePaymentEndDateFromToday } from '../../../utils/dateCalculations'

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

  // Auto-calculate payment end date when age changes (FROM TODAY, not start date)
  useEffect(() => {
    const age = Number(currentRecord?.age)

    if (age > 0) {
      const endDate = calculatePaymentEndDateFromToday(age)
      if (endDate && endDate !== currentRecord?.paymentEndDate) {
        onFieldChange('paymentEndDate', endDate)
      }
    }
  }, [currentRecord?.age]) // Removed paymentStartDate dependency since end date is independent of start date

  return {
    // Could return calculated values or calculation status if needed
  }
}
