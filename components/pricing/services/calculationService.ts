/**
 * Service for payment and calculation logic
 */
export class CalculationService {
  /**
   * Calculate annual increase percentage from old and new payment amounts
   */
  static calculateAnnualIncreasePercentage(oldPayment: string, newPayment: string): number {
    const oldAmount = parseFloat(oldPayment)
    const newAmount = parseFloat(newPayment)

    if (isNaN(oldAmount) || isNaN(newAmount) || oldAmount <= 0) {
      return 0
    }

    const percentage = ((newAmount - oldAmount) / oldAmount) * 100
    return Math.round(percentage * 100) / 100 // Round to 2 decimal places
  }

  /**
   * Validate calculation inputs
   */
  static validateCalculationInputs(oldPayment: string, newPayment: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!oldPayment || isNaN(parseFloat(oldPayment))) {
      errors.push('Old payment amount is required and must be a valid number')
    }

    if (!newPayment || isNaN(parseFloat(newPayment))) {
      errors.push('New payment amount is required and must be a valid number')
    }

    const oldAmount = parseFloat(oldPayment)
    const newAmount = parseFloat(newPayment)

    if (oldAmount <= 0) {
      errors.push('Old payment amount must be greater than zero')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
