/**
 * Shared types for Access database parsers
 */

export interface ExtractedData {
  crmId: string
  firstName: string
  lastName: string
  ssn: string
  dob: string
  gender: string
  phone1: string
  phone2: string
  phone3: string
  email: string
  streetAddress1: string
  city: string
  state: string
  zipCode: string
  insuranceCompany: string
  typeOfPayment: string
  paymentAmount: string
  paymentFrequency: string
  annualIncrease: string
  paymentStartDate?: string
  paymentEndDate?: string
  fullAddress?: string
  age?: string
  streetAddress2?: string
}

export interface PhoneEntry {
  number: string
  modifiedDate: Date
  isActive: boolean
}

