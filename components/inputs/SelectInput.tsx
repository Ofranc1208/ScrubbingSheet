import type { PricingRow } from '../../types'

interface SelectInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SelectInput({
  row,
  columnKey,
  value,
  options,
  onChange,
  placeholder = "Select",
  className = "pricing-field-input"
}: SelectInputProps) {
  return (
    <select
      id={`${columnKey}-${row.id}`}
      name={`${columnKey}-${row.id}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
