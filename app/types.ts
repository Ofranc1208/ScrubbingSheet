/**
 * Type definitions for Data Scrubber application
 */

export interface ParsedData {
  headers: string[]
  rows: string[][]
}

export interface PricingRecord {
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
  // Pricing Fields
  insuranceCompany: string
  typeOfPayment: string
  paymentFrequency: string
  paymentStartDate: string
  paymentEndDate: string
  paymentAmount: string
  annualIncrease: string
  // Address Fields
  fullAddress: string
  streetAddress1: string
  streetAddress2: string
  city: string
  state: string
  zipCode: string
}

export interface DataScrubbingState {
  uploadedFile: File | null
  rawData: string
  parsedData: ParsedData
  currentRecord: PricingRecord
  completedRecords: PricingRecord[]
  isDataLoaded: boolean
}

export interface FieldMapping {
  [key: string]: string[]
}

export interface DataProcessingResult {
  success: boolean
  data?: ParsedData
  error?: string
}
