import { getDateString, setStorageItem } from '../utils'
import { STORAGE_KEYS, DEFAULT_VALUES } from '../constants'

export const useAppLogic = (state) => {
  const {
    marbles, setMarbles,
    dailyBudget, setDailyBudget,
    marbleValue, setMarbleValue,
    spendingLog, setSpendingLog,
    setIsInitialized,
    setShowSetup,
    initialAmount,
    setupMarbleValue,
    setupDailyBudget,
    setInitialAmount,
    setSetupMarbleValue,
    setSetupDailyBudget,
    setShowSettingsModal,
    setShowSettingsConfig,
    setShowSpendModal,
    setAddAmount,
    spendAmount,
    setSpendAmount,
    spendNote,
    setSpendNote,
    spendDate,
    setSpendDate,
    addAmount,
    newDailyBudget,
    setNewDailyBudget,
    newMarbleValue,
    setNewMarbleValue
  } = state

  const initializeApp = () => {
    if (!initialAmount || isNaN(parseFloat(initialAmount))) {
      alert('Please enter a valid initial amount')
      return
    }

    if (!setupMarbleValue || isNaN(parseFloat(setupMarbleValue)) || parseFloat(setupMarbleValue) <= 0) {
      alert('Please enter a valid marble value')
      return
    }

    if (!setupDailyBudget || isNaN(parseFloat(setupDailyBudget)) || parseFloat(setupDailyBudget) <= 0) {
      alert('Please enter a valid daily budget')
      return
    }

    const startingMarbles = Math.floor(parseFloat(initialAmount) / parseFloat(setupMarbleValue))
    const today = getDateString()

    // Save all settings from setup
    setStorageItem(STORAGE_KEYS.MARBLES, startingMarbles)
    setStorageItem(STORAGE_KEYS.START_DATE, today)
    setStorageItem(STORAGE_KEYS.LAST_VISIT, today)
    setStorageItem(STORAGE_KEYS.MARBLE_VALUE, parseFloat(setupMarbleValue))
    setStorageItem(STORAGE_KEYS.DAILY_BUDGET_AMOUNT, parseFloat(setupDailyBudget))

    // Update state with setup values
    setMarbles(startingMarbles)
    setMarbleValue(parseFloat(setupMarbleValue))
    setDailyBudget(parseFloat(setupDailyBudget))

    setIsInitialized(true)
    setShowSetup(false)
    setInitialAmount('')
    setSetupMarbleValue(DEFAULT_VALUES.SETUP_MARBLE_VALUE)
    setSetupDailyBudget(DEFAULT_VALUES.SETUP_DAILY_BUDGET)
  }

  const spendMarbles = () => {
    if (!spendAmount || isNaN(parseFloat(spendAmount))) {
      alert('Please enter a valid spending amount')
      return
    }

    if (!spendDate) {
      alert('Please select a date for this spending')
      return
    }

    const amount = parseFloat(spendAmount)
    const marblesToSpend = Math.ceil(amount / marbleValue)

    if (marblesToSpend > marbles) {
      alert(`You don't have enough marbles! You need ${marblesToSpend} but only have ${marbles}.`)
      return
    }

    const newMarbleCount = marbles - marblesToSpend
    const newLogEntry = {
      id: Date.now() + Math.random(), // Unique ID for deletion
      date: spendDate,
      amount: amount,
      marbles: marblesToSpend,
      note: spendNote.trim() || null,
      timestamp: Date.now()
    }

    setMarbles(newMarbleCount)
    const newSpendingLog = [newLogEntry, ...spendingLog].sort((a, b) => new Date(b.date) - new Date(a.date))
    setSpendingLog(newSpendingLog)

    setStorageItem(STORAGE_KEYS.MARBLES, newMarbleCount)
    setStorageItem(STORAGE_KEYS.SPENDING_LOG, newSpendingLog)

    setShowSpendModal(false)
    setSpendAmount('')
    setSpendNote('')
    setSpendDate('')
  }

  const deleteSpendingEntry = (entryId) => {
    const entry = spendingLog.find(e => e.id === entryId)
    if (!entry) return

    if (!confirm(`Delete spending entry: ${entry.amount}€${entry.note ? ` (${entry.note})` : ''}?`)) {
      return
    }

    // Add marbles back
    const newMarbleCount = marbles + entry.marbles
    const newSpendingLog = spendingLog.filter(e => e.id !== entryId)

    setMarbles(newMarbleCount)
    setSpendingLog(newSpendingLog)

    setStorageItem(STORAGE_KEYS.MARBLES, newMarbleCount)
    setStorageItem(STORAGE_KEYS.SPENDING_LOG, newSpendingLog)
  }

  const addMoney = () => {
    if (!addAmount || isNaN(parseFloat(addAmount))) {
      alert('Please enter a valid amount')
      return
    }

    const amount = parseFloat(addAmount)
    const marblesToAdd = Math.floor(amount / marbleValue)

    if (marblesToAdd === 0) {
      alert(`Amount too small! You need at least ${marbleValue}€ to add 1 marble.`)
      return
    }

    const newMarbleCount = marbles + marblesToAdd
    setMarbles(newMarbleCount)
    setStorageItem(STORAGE_KEYS.MARBLES, newMarbleCount)

    setShowSettingsModal(false)
    setAddAmount('')
  }

  const openSpendModal = () => {
    setSpendDate(getDateString()) // Default to today
    setShowSpendModal(true)
  }

  const openSettingsConfig = () => {
    setNewDailyBudget(dailyBudget.toString())
    setNewMarbleValue(marbleValue.toString())
    setShowSettingsConfig(true)
  }

  const saveSettings = () => {
    if (!newDailyBudget || isNaN(parseFloat(newDailyBudget)) || parseFloat(newDailyBudget) <= 0) {
      alert('Please enter a valid daily budget amount')
      return
    }

    if (!newMarbleValue || isNaN(parseFloat(newMarbleValue)) || parseFloat(newMarbleValue) <= 0) {
      alert('Please enter a valid marble value amount')
      return
    }

    const newBudget = parseFloat(newDailyBudget)
    const newValue = parseFloat(newMarbleValue)

    setDailyBudget(newBudget)
    setMarbleValue(newValue)

    setStorageItem(STORAGE_KEYS.DAILY_BUDGET_AMOUNT, newBudget)
    setStorageItem(STORAGE_KEYS.MARBLE_VALUE, newValue)

    setShowSettingsConfig(false)
    setNewDailyBudget('')
    setNewMarbleValue('')
  }

  const reinitializeApp = () => {
    if (!confirm('Are you sure you want to reinitialize the app? This will reset your marble count and spending history, but keep your settings.')) {
      return
    }

    // Clear all app data to trigger fresh initialization
    localStorage.removeItem(STORAGE_KEYS.MARBLES)
    localStorage.removeItem(STORAGE_KEYS.START_DATE)
    localStorage.removeItem(STORAGE_KEYS.LAST_VISIT)
    localStorage.removeItem(STORAGE_KEYS.SPENDING_LOG)

    setMarbles(0)
    setSpendingLog([])
    setIsInitialized(false)
    setShowSetup(true)
    setShowSettingsModal(false)
  }

  return {
    initializeApp,
    spendMarbles,
    deleteSpendingEntry,
    addMoney,
    openSpendModal,
    openSettingsConfig,
    saveSettings,
    reinitializeApp
  }
}