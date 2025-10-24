import * as XLSX from 'xlsx'
import type { PricingRecord } from '../types'

/**
 * Service for handling data export functionality (Excel)
 */
export class ExportService {
  /**
   * Export completed records to Excel file
   */
  static exportToExcel(completedRecords: PricingRecord[]): void {
    if (completedRecords.length === 0) {
      alert('No records to export')
      return
    }

    try {
      // Excel headers - current structure
      const headers = [
        'CRM ID', 'First Name', 'Last Name', 'SSN', 'DOB', 'Age', 'Gender',
        'Phone 1', 'Phone 2', 'Phone 3', 'Email',
        'Insurance Company', 'Payment Type', 'Payment Frequency',
        'Start Date', 'End Date', 'Amount', 'Annual Increase',
        'Full Address', 'Street Address 1', 'Street Address 2',
        'City', 'State', 'ZIP Code'
      ]

      const wsData = [
        headers,
        ...completedRecords.map(record => [
          record.crmId || '',
          record.firstName || '',
          record.lastName || '',
          record.ssn || '',
          record.dob || '',
          record.age || '',
          record.gender || '',
          record.phone1 || '',
          record.phone2 || '',
          record.phone3 || '',
          record.email || '',
          record.insuranceCompany || '',
          record.typeOfPayment || '',
          record.paymentFrequency || '',
          record.paymentStartDate || '',
          record.paymentEndDate || '',
          record.paymentAmount || '',
          record.annualIncrease || '0',
          record.fullAddress || '',
          record.streetAddress1 || '',
          record.streetAddress2 || '',
          record.city || '',
          record.state || '',
          record.zipCode || ''
        ])
      ]

      const ws = XLSX.utils.aoa_to_sheet(wsData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Scrubbed Data')

      // Create binary data and trigger browser download
      const wbBinary = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' })
      const blob = new Blob([binaryStringToArrayBuffer(wbBinary)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      // Create download link and trigger download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = getExportFileName()
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  /**
   * Convert binary string to ArrayBuffer
   */
  private static binaryStringToArrayBuffer(binary: string): ArrayBuffer {
    const buffer = new ArrayBuffer(binary.length)
    const view = new Uint8Array(buffer)
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i) & 0xFF
    }
    return buffer
  }

  /**
   * Get export file name with timestamp
   */
  static getExportFileName(): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
    return `scrubbed-data-${timestamp}.xlsx`
  }

  /**
   * Validate export data
   */
  static validateExportData(records: PricingRecord[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (records.length === 0) {
      errors.push('No records to export')
    }

    // Check for required fields in records
    records.forEach((record, index) => {
      if (!record.crmId && !record.firstName && !record.lastName) {
        errors.push(`Record ${index + 1}: Missing required client information`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
