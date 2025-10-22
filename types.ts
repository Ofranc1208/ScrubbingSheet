/**
 * Type definitions for Pricing Table components
 */

export interface PricingRow {
  id: string
  // Client Information
  crmId: string
  firstName: string
  lastName: string
  ssn: string
  dob: string
  age: string
  gender: string
  phone1: string
  phone2: string
  phone3: string
  email: string
  // Address Information
  streetAddress1: string
  city: string
  state: string
  zipCode: string
  // Insurance Information
  insuranceCompany: string
  // Payment Information
  typeOfPayment: string
  paymentAmount: string
  paymentFrequency: string
  paymentStartDate: string
  paymentEndDate: string
  annualIncrease: string
  paymentCount: string
  // Output Fields
  lowRange: string
  highRange: string
  deathBenefits: string
}

export interface TableColumn {
  key: keyof PricingRow
  label: string
  type: 'text' | 'select' | 'date' | 'currency' | 'number'
  required?: boolean
  placeholder?: string
}

export type ColumnType = TableColumn['type']
