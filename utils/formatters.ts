/**
 * Utility functions for formatting and parsing values
 */

/**
 * Format a currency value for display
 */
export function formatCurrency(value: string | number): string {
  if (!value || value === '') return ''

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

/**
 * Parse a formatted currency string back to a number
 */
export function parseCurrency(value: string): string {
  if (!value || value === '') return '0'

  // Remove currency symbols, commas, and extra spaces
  const cleaned = value.replace(/[$,\s]/g, '')
  const numValue = parseFloat(cleaned)

  return isNaN(numValue) ? '0' : numValue.toString()
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: string | number): string {
  if (!value || value === '') return '0%'

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '0%'

  return `${numValue}%`
}
