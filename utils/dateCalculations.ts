// ========================================
// 📅 Date & Age Calculation Utilities
// ========================================

/**
 * Calculate age from date of birth
 * @param dob - Date of birth in MM/DD/YYYY format
 * @returns Age in years (defaults to 50 if DOB is missing/empty/unknown)
 */
export function calculateAge(dob: string): number {
  if (!dob || dob.trim() === '' || dob.toLowerCase() === 'unknown') return 50 // Default to 50 years old for calculations

  try {
    const dobDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - dobDate.getFullYear()
    const monthDiff = today.getMonth() - dobDate.getMonth()

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--
    }

    return age
  } catch (error) {
    return 50 // Default to 50 years old if DOB parsing fails
  }
}

/**
 * Calculate payment start date (6 months from today)
 * @returns Date string in MM/DD/YYYY format
 */
export function calculatePaymentStartDate(): string {
  const today = new Date()
  const startDate = new Date(today)
  
  // Add 6 months
  startDate.setMonth(startDate.getMonth() + 6)
  
  return formatDate(startDate)
}

/**
 * Calculate maximum term length based on age
 * Maximum term is 30 years, but cannot exceed age 75
 * @param age - Current age in years
 * @returns Maximum term length in years
 */
export function calculateMaxTerm(age: number): number {
  if (age <= 0) return 0
  if (age >= 75) return 0
  
  const maxTerm = 30
  const yearsUntil75 = 75 - age
  
  return Math.min(maxTerm, yearsUntil75)
}

/**
 * Calculate payment end date based on age and start date
 * @param age - Current age in years
 * @param startDate - Payment start date in MM/DD/YYYY format
 * @returns Payment end date in MM/DD/YYYY format
 */
export function calculatePaymentEndDate(age: number, startDate: string): string {
  if (!startDate || startDate.trim() === '' || age <= 0) return ''
  
  try {
    const maxTerm = calculateMaxTerm(age)
    if (maxTerm === 0) return ''
    
    const start = new Date(startDate)
    const endDate = new Date(start)
    
    // Add the term length in years
    endDate.setFullYear(endDate.getFullYear() + maxTerm)
    
    return formatDate(endDate)
  } catch (error) {
    return ''
  }
}

/**
 * Format date to MM/DD/YYYY string
 * @param date - Date object
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${month}/${day}/${year}`
}

/**
 * Calculate annual increase percentage between two payment amounts
 * @param oldAmount - Original payment amount (e.g., $11,610.60)
 * @param newAmount - New payment amount after increase (e.g., $11,958.92)
 * @returns Annual increase percentage (e.g., 3.00)
 */
export function calculateAnnualIncreasePercentage(oldAmount: string | number, newAmount: string | number): number {
  try {
    // Convert to numbers and remove any currency symbols, commas
    const oldNum = typeof oldAmount === 'string' 
      ? parseFloat(oldAmount.replace(/[$,]/g, ''))
      : oldAmount
    
    const newNum = typeof newAmount === 'string'
      ? parseFloat(newAmount.replace(/[$,]/g, ''))
      : newAmount
    
    if (isNaN(oldNum) || isNaN(newNum) || oldNum <= 0) {
      return 0
    }
    
    // Calculate percentage increase: ((new - old) / old) * 100
    const percentageIncrease = ((newNum - oldNum) / oldNum) * 100
    
    // Round to 2 decimal places
    return Math.round(percentageIncrease * 100) / 100
  } catch (error) {
    return 0
  }
}

/**
 * Calculate all payment-related dates and info
 * @param dob - Date of birth in MM/DD/YYYY format
 * @returns Object with age, start date, end date, and term length
 */
export function calculatePaymentInfo(dob: string) {
  const age = calculateAge(dob)
  const startDate = calculatePaymentStartDate()
  const maxTerm = calculateMaxTerm(age)
  const endDate = calculatePaymentEndDate(age, startDate)
  
  return {
    age,
    startDate,
    endDate,
    maxTerm,
    endAge: age + maxTerm
  }
}

