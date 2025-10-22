# Parser Testing Guide

## How to Test the Parsers

### Test the Insurance Parser:
1. Open browser console (F12)
2. Paste your Access data into the "Cut & Paste" area
3. Click "Parse Data"
4. Check the Preview section for "Insurance" field

### Expected Results:
- **Allstate**: Should show "Allstate Life Insurance Company of New York"
- **Prudential**: Should show "Prudential Insurance Company of America"

### Test the Payment Parser:
1. Check Preview section for:
   - "Payment Type": Should be "LCP"
   - "Payment Amount": Should be the FIRST available LCP amount (where Sold=$0)
   - "Annual Increase %": Should calculate from LCP payment changes

### Common Issues:

**Issue 1: Wrong Insurance Name**
- Check if the insurance name appears multiple times in the data
- The parser takes the FIRST match with "Insurance Company"

**Issue 2: Wrong Payment Amount**
- Verify the payment table has LCP rows
- Check that Sold column = $0.00
- Check that LCP column > $0.00

**Issue 3: No Data Extracted**
- Verify you pasted the complete Access record
- Include: Name section, Phone section, Payment table

### Debug Steps:
1. Paste your data
2. Click "Parse Data"
3. Look at Preview section
4. If wrong data, paste the raw text here for analysis

