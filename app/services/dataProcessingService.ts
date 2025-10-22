import { parseAccessData, formatExtractedDataForPreview } from '../../utils/accessDataParser'
import { fieldMappings } from '../config/fieldMappings'
import type { ParsedData, PricingRecord, DataProcessingResult } from '../types'

/**
 * Service for handling data parsing and processing logic
 */
export class DataProcessingService {
  /**
   * Parse raw data and return formatted preview data
   */
  static parseRawData(rawData: string): ParsedData | null {
    if (!rawData.trim()) return null

    // Try intelligent Access database parsing first
    const extractedData = parseAccessData(rawData)

    if (extractedData) {
      // Format extracted data for preview
      const previewData = formatExtractedDataForPreview(extractedData)
      return {
        headers: ['Field', 'Value'],
        rows: previewData
      }
    }

    // Fallback to traditional tab/comma-delimited parsing
    return this.parseDelimitedData(rawData)
  }

  /**
   * Get the structured data from raw text (used for processing)
   */
  static getStructuredData(rawData: string) {
    if (!rawData.trim()) return null

    // Try intelligent Access database parsing first
    return parseAccessData(rawData)
  }

  /**
   * Parse tab/comma delimited data as fallback
   */
  private static parseDelimitedData(rawData: string): ParsedData {
    const lines = rawData.trim().split('\n')
    if (lines.length === 0) {
      return { headers: [], rows: [] }
    }

    // Parse first line as headers
    const firstLine = lines[0]
    let columns = firstLine.split('\t')
    if (columns.length === 1) {
      columns = firstLine.split(',')
    }
    const headers = columns.map(col => col.trim())

    // Parse data rows
    const rows: string[][] = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      let rowColumns = line.split('\t')
      if (rowColumns.length === 1 && !line.includes('\t')) {
        rowColumns = line.split(',')
      }
      if (rowColumns.length > 0) {
        rows.push(rowColumns.map(col => col.trim()))
      }
    }

    return { headers, rows }
  }

  /**
   * Process parsed data into a PricingRecord
   */
  static processData(parsedData: ParsedData): PricingRecord {
    if (parsedData.rows.length === 0) {
      return {} as PricingRecord
    }

    // Check if this is Access database format (Field/Value pairs)
    if (parsedData.headers[0] === 'Field' && parsedData.headers[1] === 'Value') {
      return this.processAccessFormatData(parsedData)
    }

    // Traditional tab/comma-delimited format
    return this.processDelimitedFormatData(parsedData)
  }

  /**
   * Process Access database format data (Field/Value pairs)
   */
  private static processAccessFormatData(parsedData: ParsedData): PricingRecord {
    const newRecord: any = {}

    parsedData.rows.forEach(([field, value]) => {
      const fieldLower = field.toLowerCase()

      if (fieldLower.includes('crm')) newRecord.crmId = value
      else if (fieldLower.includes('ssn')) newRecord.ssn = value
      else if (fieldLower.includes('dob')) newRecord.dob = value
      else if (fieldLower.includes('age')) newRecord.age = value
      else if (fieldLower.includes('gender')) newRecord.gender = value
      else if (fieldLower.includes('phone 1') || fieldLower.includes('phone1') || (fieldLower === 'phone' && !newRecord.phone1)) newRecord.phone1 = value
      else if (fieldLower.includes('phone 2') || fieldLower.includes('phone2')) newRecord.phone2 = value
      else if (fieldLower.includes('phone 3') || fieldLower.includes('phone3')) newRecord.phone3 = value
      else if (fieldLower.includes('email')) newRecord.email = value
      else if (fieldLower.includes('address') && !fieldLower.includes('city') && !fieldLower.includes('state')) {
        newRecord.streetAddress1 = value
        newRecord.fullAddress = value
      }
      else if (fieldLower.includes('city')) newRecord.city = value
      else if (fieldLower.includes('state')) newRecord.state = value
      else if (fieldLower.includes('zip')) newRecord.zipCode = value
      else if (fieldLower.includes('insurance')) newRecord.insuranceCompany = value
      else if (fieldLower.includes('payment type')) newRecord.typeOfPayment = value
      else if (fieldLower.includes('payment amount') || fieldLower === 'amount') newRecord.paymentAmount = value
      else if (fieldLower.includes('frequency')) newRecord.paymentFrequency = value
      else if (fieldLower.includes('annual increase')) newRecord.annualIncrease = value
    })

    return newRecord as PricingRecord
  }

  /**
   * Process delimited format data using field mappings
   */
  private static processDelimitedFormatData(parsedData: ParsedData): PricingRecord {
    const firstRow = parsedData.rows[0]
    const newRecord: any = {}

    // Map each field based on header matching
    Object.keys(fieldMappings).forEach((fieldKey) => {
      const possibleHeaders = fieldMappings[fieldKey]
      const columnIndex = parsedData.headers.findIndex(header =>
        possibleHeaders.some(ph => header.toLowerCase().includes(ph.toLowerCase()))
      )

      if (columnIndex !== -1 && firstRow[columnIndex]) {
        newRecord[fieldKey] = firstRow[columnIndex].trim()
      }
    })

    // Ensure age has a default value if not provided
    if (!newRecord.age) {
      newRecord.age = '50' // Default to 50 for calculations
    }

    // Ensure SSN and DOB have appropriate defaults
    if (!newRecord.ssn) {
      newRecord.ssn = '___-__-____' // Masked format for UI
    }
    if (!newRecord.dob) {
      newRecord.dob = '' // Empty for UI (will show as missing)
    }

    return newRecord as PricingRecord
  }

  /**
   * Validate if data processing was successful
   */
  static validateProcessingResult(record: PricingRecord): boolean {
    return !!(record.crmId || record.firstName || record.lastName)
  }
}
