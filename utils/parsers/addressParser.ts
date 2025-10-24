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
  // Pattern: Mailing Address[tab]City, State, Zip\n2247 East Vanburen St.\nApt. 416\nPhoenix\n\nArizona\nselect\n\n85006
  let addressMatch = rawText.match(/(?:Mailing Address|Home Address)[\s\t]*City, State, Zip\s*\n([^\n\r]+)\s*\n(?:([^\n\r]*)\s*\n)?([A-Za-z\s]+)\s*\n\s*\n([A-Za-z\s]+)\s*\nselect\s*\n\s*\n(\d{5})/)
  if (addressMatch) {
    const street1 = addressMatch[1].trim()
    const street2 = addressMatch[2]?.trim()
    const city = addressMatch[3].trim()
    const state = addressMatch[4].trim()
    const zipCode = addressMatch[5].trim()

    // Skip if it contains navigation text
    if (!/Goto Record|Next Record|Last Record|Remove Record|Save Record/i.test(street1)) {
      result.streetAddress1 = street1
      if (street2 && !/Apt|Suite|Unit/i.test(street2)) {
        // If second line is not an apartment/unit, combine with street1
        result.streetAddress1 = `${street1} ${street2}`
        result.streetAddress2 = ''
      } else {
        result.streetAddress2 = street2 || ''
      }
      result.city = city
      result.state = state
      result.zipCode = zipCode
    }
  }

  // Alternative address pattern - improved to avoid navigation text
  if (!result.streetAddress1) {
    const lines = rawText.split(/\n|\r\n/)
    let navigationTextFound = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Check if this line contains navigation text - if so, skip everything after
      if (/Goto Record|Next Record|Last Record|Remove Record|Save Record|Return to Search|First Record|Previous Record|Delete|Save Record/i.test(line)) {
        navigationTextFound = true
        continue
      }

      // Skip if we've passed navigation text
      if (navigationTextFound) continue

      // Look for street address (contains numbers and street indicators)
      if (!result.streetAddress1 && /^\d+\s+[A-Za-z0-9\s\.,]+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Way|Boulevard|Blvd|Place|Pl)/i.test(line)) {
        result.streetAddress1 = line
      }

      // Look for ZIP code (5 digits)
      if (!result.zipCode && /^\d{5}(-\d{4})?$/.test(line)) {
        result.zipCode = line
        // State is usually a few lines before ZIP
        for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
          const prevLine = lines[j].trim()
          // Skip if this line contains navigation text
          if (/Goto Record|Next Record|Last Record|Remove Record|Save Record|Return to Search|First Record|Previous Record|Delete|Save Record|select|Open|Get|Has not|Last verified/i.test(prevLine)) {
            continue
          }
          // Check if it's a US state (2 letters or full name)
          if (/^(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/i.test(prevLine)) {
            result.state = prevLine
            // City is usually right before state
            if (j > 0 && !result.city) {
              const cityLine = lines[j - 1].trim()
              if (cityLine && cityLine.length > 0 && !/^(select|Open|Get|Has not|Last verified|Return to Search|First Record|Previous Record)/i.test(cityLine)) {
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

