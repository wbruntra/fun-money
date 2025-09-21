import { useState, useEffect } from 'react'
import { getStorageItem } from '../utils'
import { STORAGE_KEYS, DEFAULT_VALUES } from '../constants'

export const useAppState = () => {
  // App state
  const [marbles, setMarbles] = useState(0)
  const [dailyBudget, setDailyBudget] = useState(DEFAULT_VALUES.DAILY_BUDGET)
  const [marbleValue, setMarbleValue] = useState(DEFAULT_VALUES.MARBLE_VALUE)
  const [spendingLog, setSpendingLog] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  // Modal states
  const [showSpendModal, setShowSpendModal] = useState(false)
  const [showFullLog, setShowFullLog] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showSettingsConfig, setShowSettingsConfig] = useState(false)

  // Form states
  const [spendAmount, setSpendAmount] = useState('')
  const [spendNote, setSpendNote] = useState('')
  const [spendDate, setSpendDate] = useState('')
  const [addAmount, setAddAmount] = useState('')
  const [initialAmount, setInitialAmount] = useState('')
  const [setupMarbleValue, setSetupMarbleValue] = useState(DEFAULT_VALUES.SETUP_MARBLE_VALUE)
  const [setupDailyBudget, setSetupDailyBudget] = useState(DEFAULT_VALUES.SETUP_DAILY_BUDGET)
  const [newDailyBudget, setNewDailyBudget] = useState('')
  const [newMarbleValue, setNewMarbleValue] = useState('')

  // Initialize app data
  useEffect(() => {
    const savedMarbles = getStorageItem(STORAGE_KEYS.MARBLES, null)
    const savedStartDate = getStorageItem(STORAGE_KEYS.START_DATE, null)
    const savedSpendingLog = getStorageItem(STORAGE_KEYS.SPENDING_LOG, [])
    const savedMarbleValue = getStorageItem(STORAGE_KEYS.MARBLE_VALUE, DEFAULT_VALUES.MARBLE_VALUE)
    const savedDailyBudget = getStorageItem(STORAGE_KEYS.DAILY_BUDGET_AMOUNT, DEFAULT_VALUES.DAILY_BUDGET)

    setSpendingLog(savedSpendingLog)
    setMarbleValue(savedMarbleValue)
    setDailyBudget(savedDailyBudget)

    // Set setup defaults to saved values
    setSetupMarbleValue(savedMarbleValue.toString())
    setSetupDailyBudget(savedDailyBudget.toString())

    if (savedMarbles === null || savedStartDate === null) {
      // First time setup
      setShowSetup(true)
      return
    }

    setIsInitialized(true)

    // Calculate marbles to add based on days since last visit
    const lastVisit = getStorageItem(STORAGE_KEYS.LAST_VISIT, null)
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]

    let currentMarbles = savedMarbles

    if (lastVisit && lastVisit !== todayString) {
      const lastVisitDate = new Date(lastVisit)
      const daysToAdd = Math.floor((today - lastVisitDate) / (24 * 60 * 60 * 1000))

      if (daysToAdd > 0) {
        // Add marbles per day based on daily budget and marble value
        const marblesPerDay = Math.floor(savedDailyBudget / savedMarbleValue)
        currentMarbles += daysToAdd * marblesPerDay
        localStorage.setItem(STORAGE_KEYS.MARBLES, JSON.stringify(currentMarbles))
      }
    }

    setMarbles(currentMarbles)
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, JSON.stringify(todayString))
  }, [])

  return {
    // App state
    marbles, setMarbles,
    dailyBudget, setDailyBudget,
    marbleValue, setMarbleValue,
    spendingLog, setSpendingLog,
    isInitialized, setIsInitialized,
    showSetup, setShowSetup,

    // Modal states
    showSpendModal, setShowSpendModal,
    showFullLog, setShowFullLog,
    showSettingsModal, setShowSettingsModal,
    showSettingsConfig, setShowSettingsConfig,

    // Form states
    spendAmount, setSpendAmount,
    spendNote, setSpendNote,
    spendDate, setSpendDate,
    addAmount, setAddAmount,
    initialAmount, setInitialAmount,
    setupMarbleValue, setSetupMarbleValue,
    setupDailyBudget, setSetupDailyBudget,
    newDailyBudget, setNewDailyBudget,
    newMarbleValue, setNewMarbleValue
  }
}