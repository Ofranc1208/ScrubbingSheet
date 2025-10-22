/**
 * Parser for insurance company information
 */

export function parseInsurance(rawText: string): {
  insuranceCompany?: string
} {
  const result: any = {}

  // Extract Insurance Company from pattern before payment table
  // Strategy: Look for "Insurance Company" phrase and extract the company name around it
  // Pattern examples:
  // - "Prudential Insurance Company of America"
  // - "MetLife Insurance Company"
  // - "New York Life Insurance Company"
  // - "Allstate Life Insurance Company of New York"
  
  // First, try to find the pattern with "Insurance Company" in it
  const insurancePattern = /([A-Z][A-Za-z\s&]+Insurance\s+Company(?:\s+of\s+[A-Za-z]+)?)/g
  const insuranceMatches = rawText.match(insurancePattern)
  
  if (insuranceMatches && insuranceMatches.length > 0) {
    // Take the first clean match (usually the most complete one)
    let companyName = insuranceMatches[0].trim()
    
    // Clean up common prefixes and suffixes that might be attached
    companyName = companyName
      .replace(/^(View\s+Annuity\s+|COM\s+|click\s+button\s+to\s+verify|Get\s+County\s+|Has\s+not\s+been\s+verified)/gi, '')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    // Only accept if it starts with a capital letter and contains "Insurance Company"
    if (/^[A-Z]/.test(companyName) && companyName.includes('Insurance Company')) {
      result.insuranceCompany = companyName
    }
  }

  return result
}

