import type { PricingRow } from '../../types'

interface TextInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'number'
  placeholder?: string
  className?: string
  readOnly?: boolean
  title?: string
}

export function TextInput({
  row,
  columnKey,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = "pricing-field-input",
  readOnly = false,
  title
}: TextInputProps) {
  return (
    <input
      id={`${columnKey}-${row.id}`}
      name={`${columnKey}-${row.id}`}
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      placeholder={placeholder}
      readOnly={readOnly}
      title={title}
    />
  )
}
