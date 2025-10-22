# Data Scrubber Application

A comprehensive data parsing and scrubbing application built with Next.js and TypeScript, designed to extract and organize client information from raw CRM data.

## 🏗️ Architecture Overview

This application follows the **Orchestrator Pattern** to maintain clean separation of concerns and improve maintainability.

```
app/
├── types.ts              # Type definitions
├── config/
│   └── fieldMappings.ts  # Field mapping configurations
├── hooks/
│   └── useDataState.ts   # State management hook
├── services/
│   ├── dataProcessingService.ts  # Data parsing logic
│   └── exportService.ts          # Excel export functionality
└── page.tsx              # Main orchestrator component

utils/
├── parsers/              # Specialized data parsers
├── accessDataParser.ts   # Main data parser orchestrator
└── localStorage.ts       # Storage utilities
```

## 📋 Module Responsibilities

### **Core Modules (app/)**

#### **`types.ts`** - Type Definitions
**Responsibilities:**
- Define TypeScript interfaces for all data structures
- Ensure type safety across the application
- Centralize type definitions for consistency

**Key Types:**
```typescript
interface PricingRecord {
  // Client information, pricing data, and address fields
}

interface ParsedData {
  headers: string[]
  rows: string[][]
}

interface DataScrubbingState {
  // Complete application state structure
}
```

#### **`config/fieldMappings.ts`** - Configuration Management
**Responsibilities:**
- Define field mapping rules for auto-population
- Map raw data headers to standardized field names
- Provide flexible header matching for various data formats

**Key Features:**
- Supports multiple header variations for each field
- Case-insensitive matching
- Configurable field mappings

#### **`hooks/useDataState.ts`** - State Management
**Responsibilities:**
- Manage all application state using React hooks
- Handle localStorage persistence and synchronization
- Provide state actions and mutations

**Key Functions:**
- `useDataState()` - Main state management hook
- State persistence with debounced saving
- CRUD operations for records and data

#### **`services/dataProcessingService.ts`** - Data Processing Logic
**Responsibilities:**
- Parse raw data into structured formats
- Handle both Access database and delimited data formats
- Validate and transform extracted data

**Key Functions:**
- `parseRawData()` - Main parsing entry point
- `processData()` - Transform parsed data into PricingRecord
- `validateProcessingResult()` - Ensure data integrity

#### **`services/exportService.ts`** - Export Functionality
**Responsibilities:**
- Handle Excel file generation and export
- Validate export data integrity
- Provide export utilities and error handling

**Key Functions:**
- `exportToExcel()` - Generate and download Excel file
- `validateExportData()` - Pre-export validation

#### **`page.tsx`** - Main Orchestrator Component
**Responsibilities:**
- Coordinate between all modules
- Handle UI rendering and event orchestration
- Manage component lifecycle and data flow

**Key Features:**
- Uses orchestrator pattern for clean separation
- Delegates specific tasks to appropriate services
- Maintains minimal business logic in component

### **Utility Modules (utils/)**

#### **`parsers/`** - Specialized Data Parsers
**Responsibilities:**
- Extract specific data types from raw input
- Handle various data formats and edge cases

**Parser Types:**
- `clientInfoParser.ts` - Client personal information
- `contactParser.ts` - Phone numbers and email
- `addressParser.ts` - Address information
- `insuranceParser.ts` - Insurance company data
- `paymentParser.ts` - Payment and financial data

#### **`accessDataParser.ts`** - Main Parser Orchestrator
**Responsibilities:**
- Coordinate all specialized parsers
- Provide unified data extraction interface
- Handle post-processing and validation

#### **`localStorage.ts`** - Storage Management
**Responsibilities:**
- Handle browser localStorage operations
- Provide data persistence utilities
- Manage storage lifecycle

## 🔄 Data Flow

```
Raw CRM Data → page.tsx → DataProcessingService → Specialized Parsers → Structured Data → UI Components
     ↑                                                                      ↓
     └─── LocalStorage ←─── useDataState ←─── ExportService ←─── Excel Export
```

## 🎯 Key Features

### **Data Parsing**
- **Intelligent Parsing**: Automatically detects data format (Access DB vs delimited)
- **Flexible Field Matching**: Handles various header naming conventions
- **Age Defaulting**: Defaults to 50 years old when DOB/age is missing for calculations
- **Error Handling**: Graceful fallback for malformed data

### **State Management**
- **Persistent Storage**: Automatic localStorage synchronization
- **Debounced Saving**: Prevents excessive storage operations
- **State Isolation**: Clean separation between UI and business logic

### **Export Functionality**
- **Excel Generation**: Creates properly formatted spreadsheets
- **Data Validation**: Ensures export data integrity
- **Error Handling**: User-friendly error messages

### **Type Safety**
- **Full TypeScript Coverage**: Comprehensive type definitions
- **Interface Segregation**: Well-defined module boundaries
- **Type Guards**: Runtime type validation

## 🚀 Usage

1. **Paste Raw Data**: Input CRM data in the text area
2. **Parse Data**: Click "Parse Data" to extract structured information
3. **Review & Edit**: Use organized tabs to review and modify extracted data
4. **Process Record**: Click "Process & Organize" to create a complete record
5. **Export Results**: Click "Export to Excel" to download processed data

## 🔧 Development

### **Adding New Parsers**
1. Create parser in `utils/parsers/`
2. Export from `utils/parsers/index.ts`
3. Import in `utils/accessDataParser.ts`

### **Extending Field Mappings**
1. Add mappings to `app/config/fieldMappings.ts`
2. Update corresponding types in `app/types.ts`

### **Adding Export Formats**
1. Extend `ExportService` class
2. Add new export methods

## 📊 Performance Considerations

- **Debounced State Saving**: Reduces storage operations
- **Lazy Loading**: Components load only when needed
- **Efficient Parsing**: Optimized regex patterns and data structures
- **Age Calculation**: Defaults to 50 years when DOB is missing for consistent calculations
- **Memory Management**: Proper cleanup of large datasets

## 🛡️ Error Handling

- **Graceful Degradation**: Fallback parsing strategies
- **User Feedback**: Clear error messages and validation
- **Data Integrity**: Comprehensive validation before processing
- **Recovery Mechanisms**: Ability to retry failed operations

---

*Built with Next.js, TypeScript, and modern React patterns for maximum maintainability and scalability.*
