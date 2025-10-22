# Payment Logic Documentation

## Overview
This document explains the complete logic for calculating payment start dates, end dates, and amounts when processing structured settlement data from Microsoft Access.

---

## Core Business Rules

### 1. Payment Start Date Calculation

**Rule**: `Start Date = MAX(6 months from today, First Available LCP Payment Date)`

#### Logic:
- The system needs **6 months minimum** to process and quote payments
- If payments are already available (starting soon), use 6 months from today
- If payments don't start until later (e.g., 2035), use the actual start date from the payment table

#### Examples:

**Example 1: Payments Starting Soon**
- Today: October 21, 2025
- First LCP Payment: November 1, 2025
- 6 months from today: April 21, 2026
- **Result: Start Date = April 21, 2026** (use the later date)

**Example 2: Payments Starting in Future**
- Today: October 21, 2025
- First LCP Payment: December 17, 2035
- 6 months from today: April 21, 2026
- **Result: Start Date = December 17, 2035** (use the later date)

**Example 3: Payments Starting Just After 6 Months**
- Today: October 21, 2025
- First LCP Payment: May 15, 2026
- 6 months from today: April 21, 2026
- **Result: Start Date = May 15, 2026** (use the later date)

---

### 2. Payment End Date Calculation

**Rule**: `End Date = TODAY + MIN(30 years, 75 - Current Age)`

#### Key Points:
- **30-year maximum term** - Cannot quote payments beyond 30 years from today
- **Age 75 cutoff** - Cannot quote payments beyond when the client turns 75
- **Independent of payment start date** - The 30-year window is calculated from TODAY, not from when payments start

#### Logic:
1. Calculate client's current age from Date of Birth
2. Calculate years until age 75: `75 - Current Age`
3. Take the minimum of 30 years or years until 75
4. Add that term to TODAY's date

#### Examples:

**Example 1: Young Client (Age 37)**
- DOB: December 17, 1987
- Current Age: 37 years
- Years until 75: 75 - 37 = 38 years
- Term: MIN(30, 38) = **30 years** (30-year limit applies)
- Today: October 21, 2025
- **End Date: October 21, 2055** (today + 30 years)

**Example 2: Middle-Aged Client (Age 50)**
- DOB: October 21, 1975
- Current Age: 50 years
- Years until 75: 75 - 50 = 25 years
- Term: MIN(30, 25) = **25 years** (age 75 limit applies)
- Today: October 21, 2025
- **End Date: October 21, 2050** (today + 25 years)

**Example 3: Older Client (Age 57)**
- DOB: February 16, 1968
- Current Age: 57 years
- Years until 75: 75 - 57 = 18 years
- Term: MIN(30, 18) = **18 years** (age 75 limit applies)
- Today: October 21, 2025
- **End Date: October 21, 2043** (today + 18 years)

**Example 4: Very Young Client (Age 20)**
- DOB: October 21, 2005
- Current Age: 20 years
- Years until 75: 75 - 20 = 55 years
- Term: MIN(30, 55) = **30 years** (30-year limit applies)
- Today: October 21, 2025
- **End Date: October 21, 2055** (today + 30 years)

#### Important Note:
Even if payments start in 2035 and continue until 2065 in the payment table, the **End Date is still calculated from TODAY**, not from the payment start date. This is a critical business rule.

---

### 3. LCP Payment Amount Extraction

**Rule**: Use the **LCP column value** (last column) as the available payment amount

#### Payment Table Structure:
```
Payment Date | Payment  | Type | Sold      | Guaranteed | LCP
11/1/2025   | $11,610.60 | LCP  | $6,501.94 | $0.00      | $5,108.66
```

#### Column Definitions:
- **Payment Date**: When the payment is scheduled
- **Payment**: Total payment amount
- **Type**: Payment type (LCP = Live Contingent Payment, GP = Guaranteed Payment)
- **Sold**: Portion already sold (not available)
- **Guaranteed**: Guaranteed portion
- **LCP**: Available Live Contingent Payment amount (what we can quote)

#### Filtering Logic:
1. **Ignore GP (Guaranteed Payment) rows** - Only process LCP rows
2. **Use LCP column value** - This is the available amount to quote
3. **First available LCP** - Use the amount from the first LCP row with LCP > $0

#### Example:
```
11/1/2025 | $11,610.60 | LCP | $6,501.94 | $0.00 | $5,108.66
12/1/2025 | $11,610.60 | LCP | $6,501.94 | $0.00 | $5,108.66
```

- **Payment Amount: $5,108.66** (from LCP column, first row)
- The Sold amount ($6,501.94) is ignored - it represents what's already been sold
- The LCP column ($5,108.66) represents what's available to quote

---

### 4. Annual Increase Calculation

**Rule**: Calculate percentage increase between consecutive LCP amounts

#### Logic:
1. Extract all available LCP amounts from the LCP column
2. Find the first significant change (where amount differs by more than $0.01)
3. Calculate percentage: `((New Amount - Old Amount) / Old Amount) × 100`

#### Example:
```
11/1/2025 | LCP | $5,108.66
12/1/2025 | LCP | $5,108.66
1/1/2026  | LCP | $5,108.66
2/1/2026  | LCP | $5,261.92  ← First increase
```

Calculation:
- Old Amount: $5,108.66
- New Amount: $5,261.92
- Increase: $5,261.92 - $5,108.66 = $153.26
- Percentage: ($153.26 / $5,108.66) × 100 = **3.00%**

---

## Complete Workflow Example

### Client: Jeffrey Gordon Noble

**Input Data:**
- CRM ID: 781618
- DOB: February 16, 1968
- First LCP Payment: 11/1/2025
- LCP Amount: $5,108.66
- Next LCP Amount (after increase): $5,261.92 (starting 2/1/2026)

**Calculations:**

1. **Current Age**: 
   - DOB: 2/16/1968
   - Today: 10/21/2025
   - Age: 57 years

2. **Payment Start Date**:
   - 6 months from today: 4/21/2026
   - First LCP date: 11/1/2025
   - MAX(4/21/2026, 11/1/2025) = **4/21/2026**

3. **Payment End Date**:
   - Years until 75: 75 - 57 = 18 years
   - Term: MIN(30, 18) = 18 years
   - End Date: 10/21/2025 + 18 years = **10/21/2043**

4. **Payment Amount**:
   - First available LCP: **$5,108.66**

5. **Annual Increase**:
   - First amount: $5,108.66
   - Next amount: $5,261.92
   - Percentage: **3.00%**

**Final Output:**
- Start Date: 4/21/2026
- End Date: 10/21/2043
- Payment Amount: $5,108.66
- Frequency: Monthly
- Annual Increase: 3.00%

---

## Technical Implementation

### File Structure:
```
utils/
├── accessDataParser.ts          # Orchestrator - coordinates all parsers
├── dateCalculations.ts          # Date and age calculation utilities
└── parsers/
    ├── types.ts                 # Shared TypeScript interfaces
    ├── clientInfoParser.ts      # Extracts CRM ID, name, SSN, DOB, gender
    ├── contactParser.ts         # Extracts phone numbers and email
    ├── addressParser.ts         # Extracts street, city, state, ZIP
    ├── insuranceParser.ts       # Extracts and cleans insurance company name
    └── paymentParser.ts         # Extracts LCP amounts, dates, annual increase
```

### Key Functions:

#### `paymentParser.ts`
- Parses payment table using regex
- Filters for LCP rows with available amounts
- Calculates start date using MAX(6 months, first LCP date)
- Extracts payment amount from LCP column
- Calculates annual increase percentage

#### `accessDataParser.ts`
- Orchestrates all specialized parsers
- Post-processes end date using age rule
- Validates extracted data
- Formats data for preview display

#### `dateCalculations.ts`
- `calculateAge(dob)` - Calculates current age from DOB
- `calculatePaymentStartDate()` - Returns date 6 months from today
- `calculatePaymentEndDate(age, startDate)` - Calculates end date using 30-year rule

---

## Important Notes

### Why 30 Years from TODAY?
The 30-year constraint is a **business/underwriting rule**, not tied to the payment schedule. It represents:
- Maximum term the company will quote
- Risk management constraint
- Industry standard practice

Even if the annuity payments extend to 2065, we can only quote up to 30 years from today's date.

### Why MAX for Start Date?
The 6-month minimum represents:
- Processing time needed
- Legal/compliance requirements
- Settlement finalization period

If payments start before 6 months, we push the quote start date to 6 months out.

### Why MIN for End Date?
We take the more conservative (shorter) term:
- 30 years protects against long-term risk
- Age 75 aligns with life expectancy considerations
- Whichever comes first is the limiting factor

---

## Testing Scenarios

### Scenario 1: Current Payments, Young Client
- Age: 30
- First LCP: 1 month from today
- Expected Start: 6 months from today
- Expected End: Today + 30 years

### Scenario 2: Future Payments, Middle-Aged Client
- Age: 55
- First LCP: 10 years from today
- Expected Start: 10 years from today (first LCP date)
- Expected End: Today + 20 years (75 - 55 = 20)

### Scenario 3: Current Payments, Older Client
- Age: 65
- First LCP: 2 months from today
- Expected Start: 6 months from today
- Expected End: Today + 10 years (75 - 65 = 10)

---

## Version History

**Version 1.0** - October 21, 2025
- Initial documentation
- Implemented MAX logic for start date
- Implemented MIN logic for end date (30-year rule from TODAY)
- Fixed LCP column extraction logic
- Removed incorrect Sold=$0 filter

---

---

## Data Persistence & Storage

### Browser LocalStorage
The application automatically saves all data to browser localStorage:

- **Auto-save**: Data is saved automatically 1 second after any changes
- **Visual indicator**: Green "Auto-saved" indicator appears in the sidebar
- **Complete state preservation**: Saves current record, completed records, parsed data, and uploaded files
- **Cross-session persistence**: Data persists between browser sessions and page reloads

### Hard Reset Functionality
- **Reset button**: Red "Hard Reset" button in the sidebar
- **Complete data clearing**: Removes all data from both memory and localStorage
- **Confirmation dialog**: User must confirm before reset
- **Page reload**: Automatically reloads the page after reset

### Storage Management
- **Version control**: Storage includes version checking to handle future updates
- **Error handling**: Graceful handling of storage errors and corrupted data
- **File handling**: Properly serializes File objects for storage

---

## Contact

For questions or clarifications about this logic, please refer to the codebase implementation or contact the development team.

