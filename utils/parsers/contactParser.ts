/**
 * Parser for contact information (phones and email)
 */

import { PhoneEntry } from './types'

export function parseContact(rawText: string): {
  phone1?: string
  phone2?: string
  phone3?: string
  email?: string
} {
  const result: any = {}

  // Extract Phone Numbers (up to 3)
  // Strategy: Find all phone numbers with their "Modified" dates, filter active ones, sort by date
  const phoneEntries: PhoneEntry[] = []
  
  // Pattern to match phone entries with their metadata
  // Looking for: Phone #\n281-732-1631\n...Active...Modified: 12/2/2024
  const phoneBlocks = rawText.split('Phone #')
  
  for (const block of phoneBlocks) {
    if (!block.trim()) continue
    
    // Extract phone number (first line after "Phone #")
    const phoneMatch = block.match(/^\s*\n?\s*(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/)
    if (!phoneMatch) continue
    
    const phoneNumber = phoneMatch[1]
    
    // Check if Active
    const isActive = block.includes('Active') && !block.includes('Inactive')
    if (!isActive) continue // Skip inactive phones
    
    // Extract Modified date: "Modified: 12/2/2024" or "Modified: 9/19/2024"
    const modifiedMatch = block.match(/Modified:\s*(\d{1,2}\/\d{1,2}\/\d{4})/)
    
    let modifiedDate: Date
    if (modifiedMatch) {
      const [month, day, year] = modifiedMatch[1].split('/').map(Number)
      modifiedDate = new Date(year, month - 1, day)
    } else {
      // If no modified date, use a very old date so it's deprioritized
      modifiedDate = new Date(1900, 0, 1)
    }
    
    phoneEntries.push({
      number: phoneNumber,
      modifiedDate: modifiedDate,
      isActive: isActive
    })
  }
  
  // Sort by modified date (most recent first)
  const sortedPhones = phoneEntries
    .sort((a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime())
  
  // Extract top 3 phone numbers
  if (sortedPhones.length > 0) result.phone1 = sortedPhones[0].number
  if (sortedPhones.length > 1) result.phone2 = sortedPhones[1].number
  if (sortedPhones.length > 2) result.phone3 = sortedPhones[2].number
  
  // Fallback: If no phones found with the detailed pattern, try simple pattern
  if (!result.phone1) {
    const simplePhoneMatch = rawText.match(/Phone:?\s*\n?\s*(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/)
    if (simplePhoneMatch) {
      result.phone1 = simplePhoneMatch[1]
    }
  }

  // Extract Email from "Email: jgnoble@outlook.com"
  const emailMatch = rawText.match(/Email:?\s*\n?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  if (emailMatch) {
    result.email = emailMatch[1]
  }

  return result
}

