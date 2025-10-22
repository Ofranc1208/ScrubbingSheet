import { formatCurrency, parseCurrency } from '../../utils/formatters'
import type { PricingRow } from '../../types'

interface CurrencyInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  title?: string
}

export function CurrencyInput({
  row,
  columnKey,
  value,
  onChange,
  placeholder = "$0.00",
  className = "pricing-field-input",
  title
}: CurrencyInputProps) {
  const displayValue = formatCurrency(value || '')

  return (
    <input
      id={`${columnKey}-${row.id}`}
      name={`${columnKey}-${row.id}`}
      type="text"
      value={displayValue || ''}
      onChange={(e) => {
        const rawValue = parseCurrency(e.target.value)
        onChange(rawValue)
      }}
      className={`${className} pricing-currency-input`}
      placeholder={placeholder}
      title={title}
    />
  )
}
