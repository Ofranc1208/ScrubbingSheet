import { CalculationService } from './services/calculationService'

interface AnnualIncreaseCalculatorProps {
  showCalculator: boolean
  oldPayment: string
  newPayment: string
  onOldPaymentChange: (value: string) => void
  onNewPaymentChange: (value: string) => void
  onCalculate: (percentage: number) => void
  onClose: () => void
}

export function AnnualIncreaseCalculator({
  showCalculator,
  oldPayment,
  newPayment,
  onOldPaymentChange,
  onNewPaymentChange,
  onCalculate,
  onClose
}: AnnualIncreaseCalculatorProps) {
  if (!showCalculator) return null

  const handleCalculate = () => {
    const validation = CalculationService.validateCalculationInputs(oldPayment, newPayment)

    if (!validation.isValid) {
      alert(validation.errors.join('\n'))
      return
    }

    const percentage = CalculationService.calculateAnnualIncreasePercentage(oldPayment, newPayment)
    onCalculate(percentage)
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-2">
      <h4 className="text-[10px] font-semibold text-blue-900 mb-2">Calculate Annual Increase %</h4>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-[9px] font-medium text-gray-700 mb-0.5">
            Old Payment Amount
          </label>
          <input
            type="number"
            value={oldPayment}
            onChange={(e) => onOldPaymentChange(e.target.value)}
            placeholder="e.g., 11610.60"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-[9px] font-medium text-gray-700 mb-0.5">
            New Payment Amount
          </label>
          <input
            type="number"
            value={newPayment}
            onChange={(e) => onNewPaymentChange(e.target.value)}
            placeholder="e.g., 11958.92"
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleCalculate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded text-[10px]"
        >
          Calculate
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-1 px-2 rounded text-[10px]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
