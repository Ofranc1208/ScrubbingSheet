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
      XLSX.writeFile(wb, 'scrubbed-data.xlsx')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
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
