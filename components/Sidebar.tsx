import { useState, useEffect } from 'react'

interface SidebarProps {
  uploadedFile: File | null
  completedRecords: any[]
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onExport: () => void
  onCompleteAndNext: () => void
  hasCurrentRecord: boolean
  onHardReset: () => void
  hasStoredData: boolean
}

export function Sidebar({
  uploadedFile,
  completedRecords,
  onFileUpload,
  onExport,
  onCompleteAndNext,
  hasCurrentRecord,
  onHardReset,
  hasStoredData
}: SidebarProps) {
  // Use client-side only state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="w-80 bg-white shadow-lg p-6 flex flex-col h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Scrubber</h1>
            <p className="text-gray-600 text-sm">High-volume data cleaning</p>
          </div>
          {/* Storage Status Indicator - Only show after mount to avoid hydration mismatch */}
          {mounted && hasStoredData && (
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              <span className="text-xs font-medium">Auto-saved</span>
            </div>
          )}
        </div>
      </div>

      {/* File Actions Section */}
      <div className="space-y-3 flex-1">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Actions</h3>

        {/* Complete & Next Button - Most Important */}
        {hasCurrentRecord && (
          <button
            onClick={onCompleteAndNext}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete & Next
          </button>
        )}

        {/* Export to Excel Button */}
        {completedRecords.length > 0 && (
          <button
            onClick={onExport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export ({completedRecords.length})
          </button>
        )}

        {/* Hard Reset Button - Always visible */}
        <button
          onClick={onHardReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Hard Reset
        </button>

        {/* Upload File Button */}
        <div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={onFileUpload}
            className="hidden"
            id="file-upload-sidebar"
          />
          <label htmlFor="file-upload-sidebar" className="cursor-pointer">
            <div className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Upload File
            </div>
          </label>
        </div>

        {/* Progress Statistics */}
        <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="text-xs font-semibold text-blue-900 mb-2">📊 Progress</h4>
          <div className="space-y-1 text-xs text-blue-700">
            <p>Completed: <span className="font-bold text-lg">{completedRecords.length}</span></p>
            <p className="text-gray-600">Target: 500-600 records</p>
            {completedRecords.length > 0 && (
              <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all"
                  style={{ width: `${Math.min((completedRecords.length / 500) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">🚀 Workflow</h4>
          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
            <li>Paste raw data below</li>
            <li>Click "Parse Data"</li>
            <li>Click "Process & Organize"</li>
            <li>Review/edit fields above</li>
            <li>Click "Complete & Next"</li>
            <li>Repeat for all records</li>
            <li>Export when done</li>
          </ol>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-green-600 font-medium">💾 Auto-saved to browser</p>
            <p className="text-xs text-gray-500">Use "Hard Reset" to clear all data</p>
          </div>
        </div>
      </div>
    </div>
  )
}
