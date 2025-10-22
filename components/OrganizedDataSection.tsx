'use client'

import { useState } from 'react'
import { ContactFieldsTab, PricingFieldsTab } from './organized-data'

interface OrganizedDataSectionProps {
  currentRecord: any
  onFieldChange: (field: string, value: string) => void
}

type TabType = 'contact' | 'pricing'

interface TabItem {
  id: TabType
  label: string
  icon: string
}

export function OrganizedDataSection({
  currentRecord,
  onFieldChange
}: OrganizedDataSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('contact')

  const tabs: TabItem[] = [
    { id: 'contact', label: 'Contact Info', icon: '👥' },
    { id: 'pricing', label: 'Pricing Info', icon: '💰' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-gray-900">Organized Data</h2>
      </div>

      {/* Always show tabs - Compact */}
      <div className="flex space-x-1 mb-3 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-1.5 text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content - Editable fields */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'contact' && (
          <ContactFieldsTab currentRecord={currentRecord} onFieldChange={onFieldChange} />
        )}

        {activeTab === 'pricing' && (
          <PricingFieldsTab currentRecord={currentRecord} onFieldChange={onFieldChange} />
        )}
      </div>
    </div>
  )
}
