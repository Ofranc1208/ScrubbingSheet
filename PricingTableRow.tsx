// ========================================
// 📊 Pricing Table Row Component
// ========================================
// Renders a single row with all input/output fields

import type { PricingRow, TableColumn } from './types'
import { isNoOffer } from './utils/validators'
import { parseCurrency } from './utils/formatters'
import { SelectInput, TextInput, CurrencyInput, DateInput } from './components/inputs'

interface PricingTableRowProps {
  row: PricingRow
  index: number
  columns: TableColumn[]
  onUpdateRow: (id: string, field: keyof PricingRow, value: string) => void
}

export function PricingTableRow({ row, index, columns, onUpdateRow }: PricingTableRowProps) {
  const renderInput = (column: TableColumn) => {
    const value = (row[column.key as keyof PricingRow] as string) || ''

    // Gender Select
    if (column.type === 'select' && column.key === 'gender') {
      return (
        <SelectInput
          row={row}
          columnKey={column.key}
          value={value}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ]}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
        />
      )
    }

    // Payment Type Select
    if (column.type === 'select' && column.key === 'typeOfPayment') {
      return (
        <SelectInput
          row={row}
          columnKey={column.key}
          value={value}
          options={[
            { value: 'LCP', label: 'LCP' },
            { value: 'GP', label: 'GP' }
          ]}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
        />
      )
    }

    // Payment Frequency Select
    if (column.type === 'select' && column.key === 'paymentFrequency') {
      return (
        <SelectInput
          row={row}
          columnKey={column.key}
          value={value}
          options={[
            { value: 'Monthly', label: 'Monthly' },
            { value: 'Quarterly', label: 'Quarterly' },
            { value: 'Semiannually', label: 'Semi-Annually' },
            { value: 'Annually', label: 'Annually' },
            { value: 'Lump Sum', label: 'Lump Sum' }
          ]}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
        />
      )
    }

    // Date Input
    if (column.type === 'date') {
      return (
        <DateInput
          row={row}
          columnKey={column.key}
          value={value}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
        />
      )
    }

    // Payment Count (Read-only)
    if (column.key === 'paymentCount') {
      return (
        <TextInput
          row={row}
          columnKey={column.key}
          value={value}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
          placeholder="Auto"
          readOnly={true}
          className="pricing-field-input pricing-currency-input"
          title="Number of Payments - Automatically calculated based on frequency and dates"
        />
      )
    }

    // Currency Output Fields (Low Range, High Range, Death Benefits)
    if (['lowRange', 'highRange', 'deathBenefits'].includes(column.key)) {
      return (
        <CurrencyInput
          row={row}
          columnKey={column.key}
          value={value}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
          placeholder="Output value"
          className="pricing-field-input pricing-currency-input"
          title={`Calculated ${column.label} - This field will be populated by the calculator`}
        />
      )
    }

    // Payment Amount (Currency Input)
    if (column.key === 'paymentAmount') {
      return (
        <CurrencyInput
          row={row}
          columnKey={column.key}
          value={value}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
          placeholder="$0.00"
          className="pricing-field-input"
          title="Payment Amount - Enter the payment amount"
        />
      )
    }

    // Annual Increase (Always 0%)
    if (column.key === 'annualIncrease') {
      const numericValue = parseFloat(value || '0') || 0
      return (
        <TextInput
          row={row}
          columnKey={column.key}
          value={numericValue.toString()}
          onChange={(newValue) => {
            const parsedValue = parseFloat(newValue) || 0
            onUpdateRow(row.id, column.key, parsedValue.toString())
          }}
          type="number"
          placeholder="0"
          className="pricing-field-input"
          title={`${column.label} - Always 0% (percentage)`}
        />
      )
    }

    // Default Input
    return (
      <TextInput
        row={row}
        columnKey={column.key}
        value={value}
          onChange={(newValue: string) => onUpdateRow(row.id, column.key, newValue)}
        placeholder={`Enter ${column.label.toLowerCase()}`}
      />
    )
  }

  return (
    <tr
      className={`pricing-table-row ${index % 2 === 0 ? 'pricing-row-even' : 'pricing-row-odd'} ${isNoOffer(row) ? 'pricing-row-no-offer' : ''}`}
    >
      {columns.map((column) => (
        <td key={column.key} className="pricing-table-cell">
          <div className="pricing-cell-content">
            {renderInput(column)}
          </div>
        </td>
      ))}
    </tr>
  )
}

