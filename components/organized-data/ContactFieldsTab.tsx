'use client'

import { useState, useEffect } from 'react'
import { calculateAge } from '../../utils/dateCalculations'

interface ContactFieldsTabProps {
  currentRecord: any
  onFieldChange: (field: string, value: string) => void
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  )
}

export function ContactFieldsTab({ currentRecord, onFieldChange }: ContactFieldsTabProps) {
  const [showSSN, setShowSSN] = useState(false)

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (currentRecord?.dob) {
      const calculatedAge = calculateAge(currentRecord.dob)
      if (calculatedAge > 0 && calculatedAge !== Number(currentRecord?.age)) {
        onFieldChange('age', String(calculatedAge))
      }
    }
  }, [currentRecord?.dob])

  const clientFields = [
    { key: 'crmId', label: 'CRM ID', placeholder: 'Enter CRM ID', type: 'text' },
    { key: 'firstName', label: 'First Name', placeholder: 'Enter first name', type: 'text' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Enter last name', type: 'text' },
    { key: 'ssn', label: 'SSN', placeholder: '###-##-####', type: 'text' },
    { key: 'dob', label: 'Date of Birth', placeholder: 'MM/DD/YYYY', type: 'text' },
    { key: 'age', label: 'Age', placeholder: 'Auto-calculated', type: 'text' },
    { key: 'gender', label: 'Gender', placeholder: 'Male/Female', type: 'text' },
    { key: 'phone1', label: 'Phone 1 (Main)', placeholder: 'Enter main phone', type: 'text' },
    { key: 'phone2', label: 'Phone 2', placeholder: 'Enter secondary phone', type: 'text' },
    { key: 'phone3', label: 'Phone 3', placeholder: 'Enter third phone', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'Enter email address', type: 'text' }
  ]

  const addressFields = [
    { key: 'fullAddress', label: 'Full Address', placeholder: 'Enter complete address', span: 3 },
    { key: 'streetAddress1', label: 'Street Address 1', placeholder: 'Enter street address', span: 1 },
    { key: 'streetAddress2', label: 'Street Address 2', placeholder: 'Apt, Suite, etc.', span: 1 },
    { key: 'city', label: 'City', placeholder: 'Enter city', span: 1 },
    { key: 'state', label: 'State', placeholder: 'Enter state', span: 1 },
    { key: 'zipCode', label: 'ZIP Code', placeholder: 'Enter ZIP', span: 1 }
  ]

  return (
    <div className="space-y-3">
      {/* Client Information Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Client Information</h3>
        <div className="grid grid-cols-3 gap-2">
          {clientFields.map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                {field.label}
              </label>
              {field.key === 'ssn' ? (
                <div className="relative">
                  <input
                    type={showSSN ? "text" : "password"}
                    value={currentRecord?.[field.key] || ''}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSSN(!showSSN)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSSN ? (
                      <EyeOffIcon className="w-3 h-3" />
                    ) : (
                      <EyeIcon className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={currentRecord?.[field.key] || ''}
                  onChange={(e) => onFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  readOnly={field.key === 'age'}
                  className={`w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                    field.key === 'age' ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address Information Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Address Information</h3>
        <div className="grid grid-cols-3 gap-2">
          {addressFields.map((field) => (
            <div key={field.key} className={field.span === 3 ? 'col-span-3' : ''}>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                {field.label}
              </label>
              <input
                type="text"
                value={currentRecord?.[field.key] || ''}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
