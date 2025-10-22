import type { PricingRow } from '../../types'

interface DateInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function DateInput({
  row,
  columnKey,
  value,
  onChange,
  className = "pricing-field-input pricing-date-input",
  placeholder = ""
}: DateInputProps) {
  return (
    <input
      id={`${columnKey}-${row.id}`}
      name={`${columnKey}-${row.id}`}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      placeholder={placeholder}
    />
  )
}
