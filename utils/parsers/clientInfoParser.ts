/**
 * Parser for client information (CRM ID, Name, SSN, DOB, Gender)
 */

export function parseClientInfo(rawText: string): {
  crmId?: string
  firstName?: string
  lastName?: string
  ssn?: string
  dob?: string
  gender?: string
} {
  const result: any = {}

  // Extract CRM ID from patterns like "ID=781618" or "(ID=781618)"
  const idMatch = rawText.match(/\(ID=(\d+)\)/) || rawText.match(/ID[:\s=]+(\d+)/)
  if (idMatch) {
    result.crmId = idMatch[1]
  }

  // Extract full name from "Name:" pattern using string manipulation
  // Find the position of "Name:" and extract the next 2 alphabetic words
  const nameIndex = rawText.indexOf('Name:')
  if (nameIndex !== -1) {
    const afterName = rawText.substring(nameIndex + 5) // Skip "Name:"
    const words = afterName.split(/\s+/).filter(word => /^[A-Za-z]+$/.test(word))

    if (words.length >= 2) {
      result.firstName = words[0]
      result.lastName = words[1]
    }
  }

  // Fallback: Try to match "FirstName LastName" on single line or combined format
  if (!result.lastName && result.firstName) {
    const singleLineMatch = rawText.match(/Name:\s*([A-Za-z]+)\s+([A-Za-z]+)/)
    if (singleLineMatch) {
      result.firstName = singleLineMatch[1]
      result.lastName = singleLineMatch[2]
    }
  }

  // Extract Gender from "Gen:" or "Gender:" pattern
  // Default to "Unknown" if not Male or Female
  const genderMatch = rawText.match(/Gen(?:der)?:\s*\n?\s*([A-Za-z]+)/i)
  if (genderMatch) {
    const gender = genderMatch[1].toLowerCase()
    if (gender.startsWith('m')) {
      result.gender = 'Male'
    } else if (gender.startsWith('f')) {
      result.gender = 'Female'
    } else {
      result.gender = 'Unknown'
    }
  } else {
    // If no gender field found at all, default to Unknown
    result.gender = 'Unknown'
  }

  // Extract SSN from pattern "SSN: 454-65-1908" or "SSN:      \t454-65-1908"
  const ssnMatch = rawText.match(/SSN:?\s*\n?\s*(\d{3}[-\s]?\d{2}[-\s]?\d{4})/)
  if (ssnMatch) {
    // Normalize SSN format to XXX-XX-XXXX
    const ssn = ssnMatch[1].replace(/\s/g, '').replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
    result.ssn = ssn
  } else {
    // If no SSN found, set to Unknown
    result.ssn = 'Unknown'
  }

  // Extract DOB from pattern "DOB: 2/16/1968"
  const dobMatch = rawText.match(/DOB:?\s*\n?\s*(\d{1,2}\/\d{1,2}\/\d{4})/)
  if (dobMatch) {
    result.dob = dobMatch[1]
  } else {
    // If no DOB found, set to Unknown
    result.dob = 'Unknown'
  }

  return result
}

