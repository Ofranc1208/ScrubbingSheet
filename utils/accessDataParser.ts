/**
 * Access Data Parser - Orchestrator
 * Coordinates specialized parsers to extract data from Microsoft Access database
 * 
 * Architecture: Orchestrator Pattern
 * - Delegates to specialized parsers in /parsers subfolder
 * - Each parser handles a single responsibility
 * - Easy to maintain, test, and extend
 */

import {
  ExtractedData,
  parseClientInfo,
  parseContact,
  parseAddress,
  parseInsurance,
  parsePayment
} from './parsers'
import { calculateAge, calculatePaymentEndDateFromToday } from './dateCalculations'

// Re-export ExtractedData for external use
export type { ExtractedData } from './parsers'

/**
 * Parse raw Access database text and extract relevant fields
 * 
 * Orchestrates specialized parsers:
 * - clientInfoParser: CRM ID, name, SSN, DOB, gender
 * - contactParser: phone numbers (3), email
 * - addressParser: street, city, state, ZIP
 * - insuranceParser: insurance company name
 * - paymentParser: LCP amount, frequency, annual increase
 */
export function parseAccessData(rawText: string): ExtractedData | null {
  if (!rawText || rawText.trim().length === 0) {
    return null
  }

  // Orchestrate: Delegate to specialized parsers
  const extracted: Partial<ExtractedData> = {
    ...parseClientInfo(rawText),
    ...parseContact(rawText),
    ...parseAddress(rawText),
    ...parseInsurance(rawText),
    ...parsePayment(rawText)
  }

  // Post-processing: Calculate End Date using 30-year rule from TODAY
  // Rule: End Date = TODAY + MIN(30 years, 75 - current age)
  // This is INDEPENDENT of when payments start
  // Always calculate, even if DOB is missing (will default to age 50)
  const age = calculateAge(extracted.dob || '')

  // Use the centralized function that calculates from TODAY
  extracted.paymentEndDate = calculatePaymentEndDateFromToday(age)

  // Also set the age field for display purposes
  extracted.age = age.toString()

  // Validation: Return null if we couldn't extract minimum required fields
  if (!extracted.crmId && !extracted.firstName && !extracted.lastName) {
    return null
  }

  return extracted as ExtractedData
}

/**
 * Validate extracted data and return missing fields
 */
export function validateExtractedData(data: ExtractedData | null): string[] {
  if (!data) return ['No data could be extracted']

  const missing: string[] = []
  const requiredFields = [
    { key: 'crmId', label: 'CRM ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'ssn', label: 'SSN' },
    { key: 'dob', label: 'Date of Birth' }
  ]

  requiredFields.forEach(field => {
    if (!data[field.key as keyof ExtractedData]) {
      missing.push(field.label)
    }
  })

  return missing
}

/**
 * Format extracted data for display in preview
 */
export function formatExtractedDataForPreview(data: ExtractedData | null): string[][] {
  if (!data) return []

  return [
    ['CRM ID', data.crmId || ''],
    ['Name', `${data.firstName || ''} ${data.lastName || ''}`],
    ['SSN', data.ssn || 'Unknown'],
    ['DOB', data.dob || 'Unknown'],
    ['Gender', data.gender || ''],
    ['Phone 1 (Main)', data.phone1 || ''],
    ['Phone 2', data.phone2 || ''],
    ['Phone 3', data.phone3 || ''],
    ['Email', data.email || ''],
    ['Address', data.streetAddress1 || ''],
    ['City', data.city || ''],
    ['State', data.state || ''],
    ['ZIP', data.zipCode || ''],
    ['Insurance', data.insuranceCompany || ''],
    ['Payment Type', data.typeOfPayment || ''],
    ['Payment Amount', data.paymentAmount || ''],
    ['Frequency', data.paymentFrequency || ''],
    ['Start Date', data.paymentStartDate || ''],
    ['End Date', data.paymentEndDate || ''],
    ['Annual Increase %', data.annualIncrease || '0']
  ]
}

