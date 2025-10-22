interface AddressFieldsTabProps {
  currentRecord: any
  onFieldChange: (field: string, value: string) => void
}

export function AddressFieldsTab({ currentRecord, onFieldChange }: AddressFieldsTabProps) {
  const fields = [
    { key: 'fullAddress', label: 'Full Address', placeholder: 'Enter complete address', span: 2 },
    { key: 'streetAddress1', label: 'Street Address 1', placeholder: 'Enter street address', span: 1 },
    { key: 'streetAddress2', label: 'Street Address 2', placeholder: 'Apt, Suite, etc.', span: 1 },
    { key: 'city', label: 'City', placeholder: 'Enter city', span: 1 },
    { key: 'state', label: 'State', placeholder: 'Enter state', span: 1 },
    { key: 'zipCode', label: 'ZIP Code', placeholder: 'Enter ZIP', span: 1 }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field.key} className={field.span === 2 ? 'col-span-2' : ''}>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <input
            type="text"
            value={currentRecord?.[field.key] || ''}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      ))}
    </div>
  )
}
