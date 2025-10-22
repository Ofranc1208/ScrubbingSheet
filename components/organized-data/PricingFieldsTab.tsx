'use client'

import {
  PricingFormFields,
  AnnualIncreaseCalculator,
  useCalculator,
  usePaymentCalculations
} from '../pricing'

interface PricingFieldsTabProps {
  currentRecord: any
  onFieldChange: (field: string, value: string) => void
}

export function PricingFieldsTab({ currentRecord, onFieldChange }: PricingFieldsTabProps) {
  // Use orchestrator hooks for state management
  const calculator = useCalculator()
  const paymentCalculations = usePaymentCalculations(currentRecord, onFieldChange)

  // Handle annual increase calculation
  const handleCalculateIncrease = (percentage: number) => {
    onFieldChange('annualIncrease', String(percentage))
    calculator.resetCalculator()
  }
  return (
    <div className="space-y-3">
      <PricingFormFields
        currentRecord={currentRecord}
        onFieldChange={onFieldChange}
        onCalculatorToggle={calculator.toggleCalculator}
      />

      <AnnualIncreaseCalculator
        showCalculator={calculator.showCalculator}
        oldPayment={calculator.oldPayment}
        newPayment={calculator.newPayment}
        onOldPaymentChange={calculator.setOldPayment}
        onNewPaymentChange={calculator.setNewPayment}
        onCalculate={handleCalculateIncrease}
        onClose={() => calculator.toggleCalculator()}
      />
    </div>
  )
}
