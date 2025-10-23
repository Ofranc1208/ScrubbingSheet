// ========================================
// 📊 Pricing Table Component
// ========================================
// Main table structure with headers and rows

import { PricingTableRow } from './PricingTableRow'
import type { PricingRow, TableColumn } from './types'

interface PricingTableProps {
  rows: PricingRow[]
  columns: TableColumn[]
  onUpdateRow: (id: string, field: keyof PricingRow, value: string) => void
}

export function PricingTable({ rows, columns, onUpdateRow }: PricingTableProps) {
  return (
    <div className="pricing-fields-wrapper">
      <div className="pricing-fields-scroll-area">
        <table className="pricing-fields-table">
          <thead>
            <tr>
              {/* Input Columns - Yellow Header */}
              {columns.slice(0, 11).map((column) => (
                <th key={column.key} className="pricing-input-header">
                  <div className="pricing-header-content" title={column.label}>
                    {column.label}
                  </div>
                </th>
              ))}

              {/* Output Columns - Green Header */}
              {columns.slice(11).map((column) => (
                <th key={column.key} className="pricing-output-header">
                  <div className="pricing-header-content" title={column.label}>
                    {column.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <PricingTableRow
                key={row.id}
                row={row}
                index={index}
                columns={columns}
                onUpdateRow={onUpdateRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

