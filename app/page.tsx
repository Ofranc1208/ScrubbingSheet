'use client'

import { Sidebar, OrganizedDataSection, CutPasteSection } from '../components'
import { useDataState } from './hooks/useDataState'
import { DataProcessingService } from './services/dataProcessingService'
import { ExportService } from './services/exportService'
import { hasStoredData } from '../utils/localStorage'
import type { PricingRecord } from './types'

export default function DataScrubber() {
  // Use orchestrator hook for state management
  const { state, actions } = useDataState()

  // Event handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      actions.setUploadedFile(file)
      // TODO: Parse uploaded file
    }
  }

  const handleParseData = () => {
    const parsedData = DataProcessingService.parseRawData(state.rawData)
    if (parsedData) {
      actions.setParsedData(parsedData)
    }
  }

  const handleProcessData = () => {
    // Use structured data instead of preview data for processing
    const structuredData = DataProcessingService.getStructuredData(state.rawData)
    if (structuredData) {
      // Convert structured data to PricingRecord format
      const record: any = {
        crmId: structuredData.crmId || '',
        firstName: structuredData.firstName || '',
        lastName: structuredData.lastName || '',
        ssn: (structuredData.ssn && structuredData.ssn !== 'Unknown') ? structuredData.ssn : '___-__-____',
        dob: (structuredData.dob && structuredData.dob !== 'Unknown') ? structuredData.dob : '',
        age: structuredData.age || '50', // Default to 50 if not provided
        gender: structuredData.gender || '',
        phone1: structuredData.phone1 || '',
        phone2: structuredData.phone2 || '',
        phone3: structuredData.phone3 || '',
        email: structuredData.email || '',
        streetAddress1: structuredData.streetAddress1 || '',
        streetAddress2: structuredData.streetAddress2 || '',
        city: structuredData.city || '',
        state: structuredData.state || '',
        zipCode: structuredData.zipCode || '',
        fullAddress: structuredData.fullAddress || structuredData.streetAddress1 || '',
        insuranceCompany: structuredData.insuranceCompany || '',
        typeOfPayment: structuredData.typeOfPayment || '',
        paymentAmount: structuredData.paymentAmount || '',
        paymentFrequency: structuredData.paymentFrequency || '',
        annualIncrease: structuredData.annualIncrease || '',
        paymentStartDate: structuredData.paymentStartDate || '',
        paymentEndDate: structuredData.paymentEndDate || ''
      }

      if (record.crmId || record.firstName || record.lastName) {
        actions.setCurrentRecord(record as any)
      }
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    actions.updateCurrentRecord(field, value)
  }

  const handleCompleteAndNext = () => {
    actions.addCompletedRecord(state.currentRecord)
    actions.clearCurrentRecord()
  }

  const handleResetCurrentData = () => {
    actions.setRawData('')
    actions.setParsedData({ headers: [], rows: [] })
  }

  const handleExport = () => {
    ExportService.exportToExcel(state.completedRecords)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        uploadedFile={state.uploadedFile}
        completedRecords={state.completedRecords}
        onFileUpload={handleFileUpload}
        onExport={handleExport}
        onCompleteAndNext={handleCompleteAndNext}
        hasCurrentRecord={Object.keys(state.currentRecord).length > 0}
        onHardReset={actions.hardReset}
        hasStoredData={hasStoredData()}
      />

      <div className="flex-1 p-4 flex flex-col">
        {/* Organized Data Section - Takes up less space (40% height) */}
        <div className="flex-[2] mb-3">
          <OrganizedDataSection
            currentRecord={state.currentRecord}
            onFieldChange={handleFieldChange}
          />
        </div>

        {/* Cut & Paste Section - More space at bottom (60% height) */}
        <div className="flex-[3]">
          <CutPasteSection
            rawData={state.rawData}
            parsedData={state.parsedData}
            onRawDataChange={actions.setRawData}
            onParseData={handleParseData}
            onProcessData={handleProcessData}
            onResetCurrentData={handleResetCurrentData}
          />
        </div>
      </div>
    </div>
  )
}
