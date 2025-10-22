# Pricing Table Components

Modular, reusable components for displaying and managing pricing table data with proper separation of concerns.

## 🏗️ Architecture Overview

This pricing table system follows the **Orchestrator Pattern** with clean separation of concerns:

```
PricingTable.tsx (Orchestrator)
└── PricingTableRow.tsx (Row Renderer)
    ├── components/inputs/ (Input Components)
    │   ├── SelectInput.tsx
    │   ├── TextInput.tsx
    │   ├── CurrencyInput.tsx
    │   └── DateInput.tsx
    ├── utils/formatters.ts (Formatting Utilities)
    ├── utils/validators.ts (Validation Utilities)
    └── types.ts (Type Definitions)
```

## 📋 Component Responsibilities

### **Main Components**

#### **`PricingTable.tsx`** - Table Orchestrator
**Responsibilities:**
- Render table structure with headers and rows
- Coordinate data flow between parent and child components
- Handle table layout and styling

**Key Props:**
```typescript
interface PricingTableProps {
  rows: PricingRow[]
  columns: TableColumn[]
  onUpdateRow: (id: string, field: keyof PricingRow, value: string) => void
}
```

#### **`PricingTableRow.tsx`** - Row Renderer
**Responsibilities:**
- Render a single table row with multiple input fields
- Delegate input rendering to specialized components
- Handle row-level styling and conditional classes

**Key Props:**
```typescript
interface PricingTableRowProps {
  row: PricingRow
  index: number
  columns: TableColumn[]
  onUpdateRow: (id: string, field: keyof PricingRow, value: string) => void
}
```

### **Input Components**

#### **`components/inputs/SelectInput.tsx`** - Dropdown Input
**Responsibilities:**
- Render select dropdown with configurable options
- Handle value changes and validation

**Props:**
```typescript
interface SelectInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}
```

**Usage:**
```tsx
<SelectInput
  row={row}
  columnKey="gender"
  value={value}
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]}
  onChange={(newValue) => onUpdateRow(row.id, 'gender', newValue)}
/>
```

#### **`components/inputs/TextInput.tsx`** - Text Input
**Responsibilities:**
- Render text, email, tel, or number inputs
- Handle various input types and validation

**Props:**
```typescript
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
```

#### **`components/inputs/CurrencyInput.tsx`** - Currency Input
**Responsibilities:**
- Render currency-formatted inputs
- Handle currency parsing and formatting
- Display formatted currency values

**Props:**
```typescript
interface CurrencyInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  title?: string
}
```

#### **`components/inputs/DateInput.tsx`** - Date Input
**Responsibilities:**
- Render date picker inputs
- Handle date value formatting

**Props:**
```typescript
interface DateInputProps {
  row: PricingRow
  columnKey: keyof PricingRow
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}
```

### **Utility Modules**

#### **`utils/formatters.ts`** - Formatting Utilities
**Responsibilities:**
- Format currency values for display
- Parse formatted currency back to numbers
- Handle percentage formatting

**Key Functions:**
```typescript
formatCurrency(value: string | number): string
parseCurrency(value: string): string
formatPercentage(value: string | number): string
```

#### **`utils/validators.ts`** - Validation Utilities
**Responsibilities:**
- Validate field values and business rules
- Check data integrity and constraints

**Key Functions:**
```typescript
isNoOffer(row: PricingRow): boolean
isFieldValid(value: string, required?: boolean): boolean
isValidEmail(email: string): boolean
isValidPhone(phone: string): boolean
isValidSSN(ssn: string): boolean
```

#### **`types.ts`** - Type Definitions
**Responsibilities:**
- Define TypeScript interfaces for type safety
- Ensure consistent data structures across components

**Key Types:**
```typescript
interface PricingRow {
  // Complete pricing record structure
}

interface TableColumn {
  key: keyof PricingRow
  label: string
  type: 'text' | 'select' | 'date' | 'currency' | 'number'
  required?: boolean
  placeholder?: string
}
```

## 🔄 Data Flow

```
Parent Component → PricingTable → PricingTableRow → Input Components
     ↑                    ↓                    ↓              ↓
     └─── onUpdateRow ←─── Row Updates ←────── Input Changes ←── User Input
```

## 🎯 Input Type Handling

### **Select Inputs**
- **Gender**: Male/Female options
- **Payment Type**: LCP/GP options
- **Payment Frequency**: Monthly/Quarterly/Semi-Annually/Annually/Lump Sum

### **Currency Inputs**
- **Payment Amount**: Formatted currency input with $ symbol
- **Output Fields**: Low Range, High Range, Death Benefits (calculated values)

### **Date Inputs**
- **Payment Dates**: Start and end dates with date picker

### **Number Inputs**
- **Annual Increase**: Always 0% with number input type

### **Text Inputs**
- **All other fields**: Standard text inputs with appropriate placeholders

## 🎨 Styling Architecture

**CSS Class Hierarchy:**
```
pricing-table-row (base row styling)
├── pricing-row-even (even rows)
├── pricing-row-odd (odd rows)
└── pricing-row-no-offer (disabled styling)

pricing-field-input (base input styling)
├── pricing-currency-input (currency formatting)
└── pricing-date-input (date picker styling)
```

## 🚀 Usage Example

```tsx
import { PricingTable } from './PricingTable'
import type { PricingRow, TableColumn } from './types'

const columns: TableColumn[] = [
  { key: 'firstName', label: 'First Name', type: 'text' },
  { key: 'paymentAmount', label: 'Amount', type: 'currency' },
  { key: 'paymentStartDate', label: 'Start Date', type: 'date' }
]

const rows: PricingRow[] = [
  {
    id: '1',
    firstName: 'John',
    paymentAmount: '1000',
    paymentStartDate: '2024-01-01'
  }
]

function App() {
  const handleUpdateRow = (id: string, field: keyof PricingRow, value: string) => {
    // Update row logic
  }

  return (
    <PricingTable
      rows={rows}
      columns={columns}
      onUpdateRow={handleUpdateRow}
    />
  )
}
```

## 🔧 Development Guidelines

### **Adding New Input Types**
1. Create new component in `components/inputs/`
2. Export from `components/inputs/index.ts`
3. Add to `TableColumn['type']` union type
4. Update `PricingTableRow.tsx` to handle the new type

### **Extending Validation**
1. Add validation function to `utils/validators.ts`
2. Use in appropriate input components or row logic

### **Custom Formatting**
1. Add formatting function to `utils/formatters.ts`
2. Use in input components that need special formatting

## 📊 Performance Considerations

- **Component Memoization**: Input components are pure and can be memoized
- **Efficient Re-renders**: Only re-render changed rows
- **Lazy Loading**: Components load only when needed
- **Minimal DOM Updates**: Optimized change handling

## 🛡️ Error Handling

- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Input Validation**: Real-time validation with user feedback
- **Graceful Degradation**: Fallback behavior for invalid data
- **Error Boundaries**: Proper error containment

---

*Built with React, TypeScript, and modular architecture for maximum maintainability and reusability.*
