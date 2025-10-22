interface PricingFormFieldsProps {
  currentRecord: any
  onFieldChange: (field: string, value: string) => void
  onCalculatorToggle: () => void
}

interface FieldConfig {
  key: string
  label: string
  placeholder: string
  type: string
  readOnly: boolean
}

export function PricingFormFields({
  currentRecord,
  onFieldChange,
  onCalculatorToggle
}: PricingFormFieldsProps) {
  const fields: FieldConfig[] = [
    { key: 'insuranceCompany', label: 'Insurance Company', placeholder: 'Enter insurance company', type: 'text', readOnly: false },
    { key: 'typeOfPayment', label: 'Payment Type', placeholder: 'LCP/Guaranteed', type: 'text', readOnly: false },
    { key: 'paymentFrequency', label: 'Frequency', placeholder: 'Monthly/Annual', type: 'text', readOnly: false },
    { key: 'paymentStartDate', label: 'Start Date', placeholder: 'Auto-calculated', type: 'text', readOnly: true },
    { key: 'paymentEndDate', label: 'End Date', placeholder: 'Auto-calculated', type: 'text', readOnly: true },
    { key: 'paymentAmount', label: 'Amount', placeholder: 'Enter amount', type: 'number', readOnly: false },
    { key: 'annualIncrease', label: 'Annual Increase %', placeholder: '0', type: 'number', readOnly: false }
  ]

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">Pricing Information</h3>
      <div className="grid grid-cols-3 gap-2">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
              {field.label}
            </label>
            {field.key === 'annualIncrease' ? (
              <div className="relative">
                <input
                  type={field.type}
                  value={currentRecord?.[field.key] || ''}
                  onChange={(e) => onFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={onCalculatorToggle}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 font-bold"
                  title="Calculate percentage"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            ) : (
              <input
                type={field.type}
                value={currentRecord?.[field.key] || ''}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                readOnly={field.readOnly}
                className={`w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                  field.readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
