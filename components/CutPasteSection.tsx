interface CutPasteSectionProps {
  rawData: string
  parsedData: any
  onRawDataChange: (value: string) => void
  onParseData: () => void
  onProcessData: () => void
  onResetCurrentData: () => void
}

export function CutPasteSection({
  rawData,
  parsedData,
  onRawDataChange,
  onParseData,
  onProcessData,
  onResetCurrentData
}: CutPasteSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
      <h2 className="text-sm font-bold text-gray-900 mb-1">Cut & Paste Data</h2>

      <div className="flex-1 flex gap-2 min-h-0">
        {/* Left: Textarea */}
        <div className="flex-1 min-h-0">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
            Paste Your Raw Data Here:
          </label>
          <textarea
            value={rawData}
            onChange={(e) => onRawDataChange(e.target.value)}
            placeholder="Paste your tab-delimited or comma-separated data here..."
            className="w-full h-full p-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Right: Preview */}
        {parsedData.rows && parsedData.rows.length > 0 && (
          <div className="flex-1 min-h-0">
            <h3 className="text-[10px] font-semibold text-gray-700 mb-0.5">Preview</h3>
            <div className="bg-gray-50 p-1.5 rounded overflow-auto h-full border">
              <table className="min-w-full text-[10px]">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    {parsedData.headers && parsedData.headers.map((header: string, i: number) => (
                      <th key={i} className="px-1 py-0.5 text-left font-medium">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.rows.map((row: string[], i: number) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell: string, j: number) => (
                        <td key={j} className="px-1 py-0.5 border-t">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 mt-1">
        <button
          onClick={onParseData}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded transition-colors text-xs"
        >
          Parse Data
        </button>

        {parsedData.rows && parsedData.rows.length > 0 && (
          <button
            onClick={onProcessData}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded transition-colors text-xs"
          >
            Process & Organize
          </button>
        )}

        {(rawData.trim() || (parsedData.rows && parsedData.rows.length > 0)) && (
          <button
            onClick={onResetCurrentData}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1 px-2 rounded transition-colors text-xs"
            title="Reset current data entry"
          >
            ↺ Reset
          </button>
        )}
      </div>
    </div>
  )
}
