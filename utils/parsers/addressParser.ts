/**
 * Parser for address information (street, city, state, ZIP)
 */

export function parseAddress(rawText: string): {
  streetAddress1?: string
  city?: string
  state?: string
  zipCode?: string
} {
  const result: any = {}

  // Extract Address from "Mailing Address" or "Home Address" section
  // Pattern: Mailing Address\tCity, State, Zip\n3555 Bivona ST 18 C\nBronx\n\nNew York\nselect\n \n10475
  let addressMatch = rawText.match(/(?:Mailing Address|Home Address)[^\n]*\n([^\n]+)\n([^\n]+)\n\n([A-Za-z\s]+)\n[^\n]*\n[^\n]*\n(\d{5})/)
  if (addressMatch) {
    const street = addressMatch[1].trim()
    // Skip if it contains navigation text
    if (!/Goto Record|Next Record|Last Record|Remove Record|Save Record/i.test(street)) {
      result.streetAddress1 = street
      result.city = addressMatch[2].trim()
      result.state = addressMatch[3].trim()
      result.zipCode = addressMatch[4].trim()
    }
  }

  // Alternative address pattern (more flexible)
  if (!result.streetAddress1) {
    const lines = rawText.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Look for street address (contains numbers and "Road", "Street", "Avenue", etc.)
      if (!result.streetAddress1 && /\d+\s+[A-Za-z\s]+(Road|Street|Avenue|Ave|Rd|St|Drive|Dr|Lane|Ln|Court|Ct|County|Way|Boulevard|Blvd)/i.test(line)) {
        result.streetAddress1 = line
      }
      
      // Look for ZIP code (5 digits)
      if (!result.zipCode && /^\d{5}(-\d{4})?$/.test(line)) {
        result.zipCode = line
        // State is usually a few lines before ZIP
        for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
          const prevLine = lines[j].trim()
          // Check if it's a US state (2 letters or full name)
          if (/^(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/i.test(prevLine)) {
            result.state = prevLine
            // City is usually right before state
            if (j > 0 && !result.city) {
              const cityLine = lines[j - 1].trim()
              if (cityLine && cityLine.length > 0 && !/^(select|Open|Get|Has not|Last verified)/i.test(cityLine)) {
                result.city = cityLine
              }
            }
            break
          }
        }
      }
    }
  }

  return result
}

