import type { PricingRow } from '../types'

/**
 * Utility functions for validation
 */

/**
 * Check if a pricing row represents "no offer"
 */
export function isNoOffer(row: PricingRow): boolean {
  return !row.paymentAmount || row.paymentAmount === '0' || row.paymentAmount === ''
}

/**
 * Validate if a field value is required and present
 */
export function isFieldValid(value: string, required: boolean = false): boolean {
  if (!required) return true
  return value && value.trim() !== ''
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/
  return phoneRegex.test(phone)
}

/**
 * Validate SSN format
 */
export function isValidSSN(ssn: string): boolean {
  const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/
  return ssnRegex.test(ssn)
}
