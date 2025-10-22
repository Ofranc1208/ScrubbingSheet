/**
 * LocalStorage Utilities
 * Handles saving/loading data from browser localStorage
 * Provides type-safe storage operations
 */

export interface StoredData {
  uploadedFile: File | null
  rawData: string
  parsedData: {
    headers: string[]
    rows: string[][]
  }
  currentRecord: any
  completedRecords: any[]
  lastSaved: string
}

const STORAGE_KEY = 'dataScrubber_data'
const STORAGE_VERSION = '1.0'

/**
 * Save current application state to localStorage
 */
export function saveToLocalStorage(data: Partial<{
  uploadedFile: File | null
  rawData: string
  parsedData: { headers: string[]; rows: string[][] }
  currentRecord: any
  completedRecords: any[]
}>): void {
  if (typeof window === 'undefined') return
  try {
    const dataToSave: StoredData = {
      uploadedFile: data.uploadedFile || null,
      rawData: data.rawData || '',
      parsedData: data.parsedData || { headers: [], rows: [] },
      currentRecord: data.currentRecord || {},
      completedRecords: data.completedRecords || [],
      lastSaved: new Date().toISOString()
    }

    // Convert File object to a storable format if needed
    const storableData = {
      ...dataToSave,
      uploadedFile: dataToSave.uploadedFile ? {
        name: dataToSave.uploadedFile.name,
        size: dataToSave.uploadedFile.size,
        type: dataToSave.uploadedFile.type,
        lastModified: dataToSave.uploadedFile.lastModified
      } : null,
      version: STORAGE_VERSION
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storableData))
    console.log('✅ Data saved to localStorage:', new Date().toLocaleTimeString())
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error)
  }
}

/**
 * Load application state from localStorage
 */
export function loadFromLocalStorage(): Partial<{
  uploadedFile: File | null
  rawData: string
  parsedData: { headers: string[]; rows: string[][] }
  currentRecord: any
  completedRecords: any[]
}> | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    const parsedData = JSON.parse(saved)

    // Check version compatibility
    if (parsedData.version !== STORAGE_VERSION) {
      console.warn('⚠️ Storage version mismatch, clearing old data')
      clearLocalStorage()
      return null
    }

    console.log('✅ Data loaded from localStorage:', new Date().toLocaleTimeString())
    return {
      uploadedFile: parsedData.uploadedFile,
      rawData: parsedData.rawData || '',
      parsedData: parsedData.parsedData || { headers: [], rows: [] },
      currentRecord: parsedData.currentRecord || {},
      completedRecords: parsedData.completedRecords || []
    }
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error)
    return null
  }
}

/**
 * Clear all data from localStorage
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ localStorage cleared:', new Date().toLocaleTimeString())
  } catch (error) {
    console.error('❌ Failed to clear localStorage:', error)
  }
}

/**
 * Check if there's saved data in localStorage
 */
export function hasStoredData(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

/**
 * Get storage info (for debugging)
 */
export function getStorageInfo(): { hasData: boolean; lastSaved?: string; version?: string } {
  if (typeof window === 'undefined') return { hasData: false }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { hasData: false }

    const parsed = JSON.parse(saved)
    return {
      hasData: true,
      lastSaved: parsed.lastSaved,
      version: parsed.version
    }
  } catch {
    return { hasData: false }
  }
}
