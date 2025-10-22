/**
 * Parser for payment information (LCP amount, frequency, annual increase)
 */

export function parsePayment(rawText: string): {
  typeOfPayment?: string
  paymentAmount?: string
  paymentFrequency?: string
  annualIncrease?: string
  paymentStartDate?: string
  paymentEndDate?: string
} {
  const result: any = {}

  // Extract Payment Type and LCP Amount
  // Logic:
  // 1. Ignore GP (Guaranteed Payments) - only focus on LCP rows
  // 2. Use the LCP column value (last column) as the available amount
  // 3. Find first LCP payment where LCP column > $0 (available payments)
  // Pattern: Date\tPayment\tType\tSold\tGuaranteed\tLCP
  // Example: 11/1/2025\t$11,610.60\tLCP\t$6,501.94\t$0.00\t$5,108.66
  //          (LCP column = $5,108.66 is the available amount to quote)
  
  const paymentRowRegex = /(\d{1,2}\/\d{1,2}\/\d{4})\s+\$?[\d,]+\.?\d*\s+(LCP|GP|Guaranteed|COLA)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)/g
  
  let match: RegExpExecArray | null
  const lcpRows: Array<{ date: Date; dateStr: string; sold: number; lcp: number }> = []

  while ((match = paymentRowRegex.exec(rawText)) !== null) {
    const dateStr = match[1]
    const type = match[2]
    const soldAmount = parseFloat(match[3].replace(/,/g, ''))
    const lcpAmount = parseFloat(match[5].replace(/,/g, ''))

    // Only process LCP type rows
    if (type !== 'LCP') continue
    
    // Only include rows where LCP column has available amount > 0
    if (!(lcpAmount > 0)) continue

    const [m, d, y] = dateStr.split('/').map(Number)
    const date = new Date(y, m - 1, d)
    lcpRows.push({ date, dateStr, sold: soldAmount, lcp: lcpAmount })
  }

  if (lcpRows.length > 0) {
    // Sort by ascending date
    lcpRows.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Start Date Logic: MAX(6 months from today, first available LCP date)
    const today = new Date()
    // Calculate 6 months from today properly
    let sixMonthsLater = new Date(today)
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)
    
    const firstLcpDate = lcpRows[0].date
    
    // Use whichever is later
    const startDate = firstLcpDate > sixMonthsLater ? firstLcpDate : sixMonthsLater
    
    // Format date as M/D/YYYY
    const startMonth = startDate.getMonth() + 1
    const startDay = startDate.getDate()
    const startYear = startDate.getFullYear()
    result.paymentStartDate = `${startMonth}/${startDay}/${startYear}`

    // Note: End date will be calculated in accessDataParser.ts using age rule
    // (TODAY + MIN(30 years, 75 - age)), not from payment table
    result.paymentEndDate = lcpRows[lcpRows.length - 1].dateStr

    // Payment amount should be the first available LCP amount
    result.typeOfPayment = 'LCP'
    result.paymentAmount = lcpRows[0].lcp.toFixed(2)
  }
  
  // Fallback: If no LCP found with new logic, try old pattern (kept for safety)
  if (!result.paymentAmount) {
    const fallbackMatch = rawText.match(/\d{1,2}\/\d{1,2}\/\d{4}\s+\$?[\d,]+\.?\d*\s+LCP\s+\$?[\d,]+\.?\d*\s+\$?[\d,]+\.?\d*\s+\$?([\d,]+\.?\d*)/)
    if (fallbackMatch) {
      const amount = fallbackMatch[1].replace(/,/g, '')
      if (parseFloat(amount) > 0) {
        result.paymentAmount = amount
        result.typeOfPayment = 'LCP'
      }
    }
  }

  // Determine payment frequency (Monthly if we see consecutive months)
  const monthlyPaymentPattern = /\d{1,2}\/\d{1,2}\/\d{4}\s+\$[\d,]+\.?\d*.*\n.*\d{1,2}\/\d{1,2}\/\d{4}\s+\$[\d,]+\.?\d*/
  if (monthlyPaymentPattern.test(rawText)) {
    result.paymentFrequency = 'Monthly'
  }

  // Calculate Annual Increase % from payment changes
  // Logic: Only use available LCP payments (Sold=$0, LCP>$0)
  if (lcpRows.length >= 2) {
    const firstAmount = lcpRows[0].lcp
    let secondAmount = firstAmount
    for (let i = 1; i < lcpRows.length; i++) {
      if (Math.abs(lcpRows[i].lcp - firstAmount) > 0.01) {
        secondAmount = lcpRows[i].lcp
        break
      }
    }
    if (secondAmount !== firstAmount && firstAmount > 0) {
      const percentageIncrease = ((secondAmount - firstAmount) / firstAmount) * 100
      result.annualIncrease = percentageIncrease.toFixed(2)
    }
  }

  return result
}

