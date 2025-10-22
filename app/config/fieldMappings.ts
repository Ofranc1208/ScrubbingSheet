import type { FieldMapping } from '../types'

/**
 * Field mapping configuration for auto-population
 * Maps PricingRecord fields to possible header names in raw data
 */
export const fieldMappings: FieldMapping = {
  crmId: ['crm', 'id', 'client id', 'customer id', 'crm id'],
  firstName: ['first name', 'firstname', 'fname', 'given name', 'first'],
  lastName: ['last name', 'lastname', 'lname', 'surname', 'family name', 'last'],
  ssn: ['ssn', 'social security', 'social security number', 'ss#'],
  dob: ['dob', 'date of birth', 'birth date', 'birthdate', 'birthday'],
  age: ['age', 'current age', 'client age'],
  gender: ['gender', 'sex', 'gen'],
  phone1: ['phone 1', 'phone1', 'main phone', 'primary phone', 'phone'],
  phone2: ['phone 2', 'phone2', 'secondary phone', 'alternate phone'],
  phone3: ['phone 3', 'phone3', 'third phone'],
  email: ['email', 'e-mail', 'email address'],
  insuranceCompany: ['insurance', 'insurance company', 'insurer', 'carrier'],
  typeOfPayment: ['payment type', 'type of payment', 'payment method', 'type'],
  paymentFrequency: ['frequency', 'payment frequency', 'pay frequency'],
  paymentStartDate: ['start date', 'begin date', 'effective date'],
  paymentEndDate: ['end date', 'expiration date', 'maturity date'],
  paymentAmount: ['amount', 'payment amount', 'payment', 'premium'],
  annualIncrease: ['annual increase', 'yearly increase', 'increase'],
  fullAddress: ['address', 'full address', 'complete address', 'home address'],
  streetAddress1: ['street', 'street address', 'address line 1', 'street 1', 'street address 1'],
  streetAddress2: ['street 2', 'address line 2', 'apt', 'suite', 'unit'],
  city: ['city', 'town'],
  state: ['state', 'province'],
  zipCode: ['zip', 'zip code', 'postal code', 'postal', 'zipcode']
}
