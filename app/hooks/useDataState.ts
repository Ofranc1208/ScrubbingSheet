import { useState, useEffect } from 'react'
import type { DataScrubbingState, PricingRecord, ParsedData } from '../types'
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '../../utils/localStorage'

/**
 * Custom hook for managing data scrubbing state with localStorage persistence
 */
export function useDataState() {
  const [state, setState] = useState<DataScrubbingState>({
    uploadedFile: null,
    rawData: '',
    parsedData: { headers: [], rows: [] },
    currentRecord: {} as PricingRecord,
    completedRecords: [],
    isDataLoaded: false
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage()
    if (savedData) {
      setState(prev => ({
        ...prev,
        uploadedFile: savedData.uploadedFile || null,
        rawData: savedData.rawData || '',
        parsedData: savedData.parsedData || { headers: [], rows: [] },
        currentRecord: (savedData.currentRecord || {}) as PricingRecord,
        completedRecords: (savedData.completedRecords || []) as PricingRecord[],
        isDataLoaded: true
      }))
    } else {
      setState(prev => ({ ...prev, isDataLoaded: true }))
    }
  }, [])

  // Save data to localStorage whenever state changes (debounced)
  useEffect(() => {
    if (state.isDataLoaded) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage({
          uploadedFile: state.uploadedFile,
          rawData: state.rawData,
          parsedData: state.parsedData,
          currentRecord: state.currentRecord,
          completedRecords: state.completedRecords
        })
      }, 1000) // Save after 1 second of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [state.uploadedFile, state.rawData, state.parsedData, state.currentRecord, state.completedRecords, state.isDataLoaded])

  // Actions
  const setUploadedFile = (file: File | null) => {
    setState(prev => ({ ...prev, uploadedFile: file }))
  }

  const setRawData = (data: string) => {
    setState(prev => ({ ...prev, rawData: data }))
  }

  const setParsedData = (data: ParsedData) => {
    setState(prev => ({ ...prev, parsedData: data }))
  }

  const setCurrentRecord = (record: PricingRecord) => {
    setState(prev => ({ ...prev, currentRecord: record }))
  }

  const setCompletedRecords = (records: PricingRecord[]) => {
    setState(prev => ({ ...prev, completedRecords: records }))
  }

  const updateCurrentRecord = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      currentRecord: { ...prev.currentRecord, [field]: value }
    }))
  }

  const addCompletedRecord = (record: PricingRecord) => {
    setState(prev => ({
      ...prev,
      completedRecords: [...prev.completedRecords, record]
    }))
  }

  const clearCurrentRecord = () => {
    setState(prev => ({
      ...prev,
      currentRecord: {} as PricingRecord,
      rawData: '',
      parsedData: { headers: [], rows: [] }
    }))
  }

  const hardReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setState({
        uploadedFile: null,
        rawData: '',
        parsedData: { headers: [], rows: [] },
        currentRecord: {} as PricingRecord,
        completedRecords: [],
        isDataLoaded: true
      })
      clearLocalStorage()
      alert('All data has been reset. Page will reload.')
      window.location.reload()
    }
  }

  return {
    state,
    actions: {
      setUploadedFile,
      setRawData,
      setParsedData,
      setCurrentRecord,
      setCompletedRecords,
      updateCurrentRecord,
      addCompletedRecord,
      clearCurrentRecord,
      hardReset
    }
  }
}
