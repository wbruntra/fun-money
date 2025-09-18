import { useState, useEffect } from 'react'
import './App.css'

// LocalStorage keys
const STORAGE_KEYS = {
  MARBLES: 'funMoney_marbles',
  DAILY_BUDGET: 'funMoney_dailyBudget',
  LAST_VISIT: 'funMoney_lastVisit',
  SPENDING_LOG: 'funMoney_spendingLog',
  START_DATE: 'funMoney_startDate'
}

// Utility functions
const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0]
}

const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.floor((date2 - date1) / oneDay)
}

function App() {
  const [marbles, setMarbles] = useState(0)
  const [dailyBudget] = useState(8) // 8€ per day (2 marbles × 4€ each)
  const [marbleValue] = useState(4) // 4€ per marble
  const [spendingLog, setSpendingLog] = useState([])
  const [showSpendModal, setShowSpendModal] = useState(false)
  const [showFullLog, setShowFullLog] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [spendAmount, setSpendAmount] = useState('')
  const [spendNote, setSpendNote] = useState('')
  const [spendDate, setSpendDate] = useState('')
  const [addAmount, setAddAmount] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [initialAmount, setInitialAmount] = useState('')

  // Initialize app data
  useEffect(() => {
    const savedMarbles = getStorageItem(STORAGE_KEYS.MARBLES, null)
    const savedStartDate = getStorageItem(STORAGE_KEYS.START_DATE, null)
    const savedSpendingLog = getStorageItem(STORAGE_KEYS.SPENDING_LOG, [])
    const lastVisit = getStorageItem(STORAGE_KEYS.LAST_VISIT, null)
    
    setSpendingLog(savedSpendingLog)

    if (savedMarbles === null || savedStartDate === null) {
      // First time setup
      setShowSetup(true)
      return
    }

    setIsInitialized(true)
    
    // Calculate marbles to add based on days since last visit
    const today = new Date()
    const todayString = getDateString(today)
    
    let currentMarbles = savedMarbles
    
    if (lastVisit && lastVisit !== todayString) {
      const lastVisitDate = new Date(lastVisit)
      const daysToAdd = daysBetween(lastVisitDate, today)
      
      if (daysToAdd > 0) {
        // Add 2 marbles per day (8€ daily budget ÷ 4€ per marble)
        currentMarbles += daysToAdd * 2
        setStorageItem(STORAGE_KEYS.MARBLES, currentMarbles)
      }
    }
    
    setMarbles(currentMarbles)
    setStorageItem(STORAGE_KEYS.LAST_VISIT, todayString)
  }, [])

  const initializeApp = () => {
    if (!initialAmount || isNaN(parseFloat(initialAmount))) {
      alert('Please enter a valid initial amount')
      return
    }

    const startingMarbles = Math.floor(parseFloat(initialAmount) / marbleValue)
    const today = getDateString()
    
    setStorageItem(STORAGE_KEYS.MARBLES, startingMarbles)
    setStorageItem(STORAGE_KEYS.START_DATE, today)
    setStorageItem(STORAGE_KEYS.LAST_VISIT, today)
    setStorageItem(STORAGE_KEYS.DAILY_BUDGET, dailyBudget)
    
    setMarbles(startingMarbles)
    setIsInitialized(true)
    setShowSetup(false)
    setInitialAmount('')
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

  const addMarble = () => {
    const newCount = marbles + 1
    setMarbles(newCount)
    setStorageItem(STORAGE_KEYS.MARBLES, newCount)
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
    
    setShowAddModal(false)
    setAddAmount('')
  }

  const openSpendModal = () => {
    setSpendDate(getDateString()) // Default to today
    setShowSpendModal(true)
  }

  if (showSetup) {
    return (
      <div className="setup-container">
        <h1>🫙 Fun Money Setup</h1>
        <p>Welcome to your marble spending tracker!</p>
        <div className="setup-form">
          <label>
            How much money do you want to start with?
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="e.g., 240"
              min="0"
              step="0.01"
            />
            <span className="currency">€</span>
          </label>
          <p className="budget-info">
            Daily budget: {dailyBudget}€ per day ({dailyBudget / marbleValue} marbles × {marbleValue}€ each)
            {initialAmount && !isNaN(parseFloat(initialAmount)) && (
              <span className="marble-preview">
                <br />This will give you <strong>{Math.floor(parseFloat(initialAmount) / marbleValue)} marbles</strong> to start
              </span>
            )}
          </p>
          <button onClick={initializeApp} className="setup-button">
            Start Tracking! 🎯
          </button>
        </div>
      </div>
    )
  }

  if (!isInitialized) {
    return <div className="loading">Loading your marbles...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🫙 Fun Money</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{marbles}</span>
            <span className="stat-label">marbles available</span>
          </div>
          <div className="stat">
            <span className="stat-value">{marbles * marbleValue}€</span>
            <span className="stat-label">total fun budget</span>
          </div>
        </div>
      </header>

      <main className="marble-container">
        <div className="jar">
          <div className="marbles-grid">
            {Array.from({ length: Math.min(marbles, 100) }, (_, i) => (
              <div key={i} className="marble"></div>
            ))}
            {marbles > 100 && (
              <div className="marble-overflow">+{marbles - 100} more</div>
            )}
          </div>
        </div>

        <div className="controls">
          <button 
            className="spend-button"
            onClick={openSpendModal}
            disabled={marbles === 0}
          >
            💸 Spend Money
          </button>
          <button 
            className="add-button"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Add Money
          </button>
        </div>
      </main>

      {spendingLog.length > 0 && (
        <section className="spending-history">
          <h3>Recent Spending</h3>
          <div className="spending-list">
            {spendingLog.slice(0, 5).map((entry) => (
              <div key={entry.id} className="spending-item">
                <div className="spending-amount">{entry.amount}€</div>
                <div className="spending-details">
                  <div className="spending-marbles">{entry.marbles} marble{entry.marbles !== 1 ? 's' : ''}</div>
                  {entry.note && <div className="spending-note">"{entry.note}"</div>}
                  <div className="spending-date">{entry.date}</div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => deleteSpendingEntry(entry.id)}
                  title="Delete this entry"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          {spendingLog.length > 0 && (
            <div className="log-button-container">
              <button 
                className="log-button"
                onClick={() => setShowFullLog(true)}
              >
                📋 View Full Log
              </button>
            </div>
          )}
        </section>
      )}

      {showSpendModal && (
        <div className="modal-overlay" onClick={() => setShowSpendModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>💸 Record Spending</h3>
            <div className="modal-form">
              <label>
                When did you spend this?
                <input
                  type="date"
                  value={spendDate}
                  onChange={(e) => setSpendDate(e.target.value)}
                  max={getDateString()}
                />
              </label>

              <label>
                How much did you spend?
                <input
                  type="number"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  autoFocus
                />
                <span className="currency">€</span>
              </label>
              
              {spendAmount && !isNaN(parseFloat(spendAmount)) && (
                <div className="marble-cost">
                  This will use <strong>{Math.ceil(parseFloat(spendAmount) / marbleValue)} marble{Math.ceil(parseFloat(spendAmount) / marbleValue) !== 1 ? 's' : ''}</strong>
                </div>
              )}

              <label>
                What did you spend it on? (optional)
                <input
                  type="text"
                  value={spendNote}
                  onChange={(e) => setSpendNote(e.target.value)}
                  placeholder="Coffee, lunch, book..."
                />
              </label>

              <div className="modal-buttons">
                <button onClick={() => setShowSpendModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={spendMarbles} className="confirm-button">
                  Spend Marbles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>💰 Add Money</h3>
            <div className="modal-form">
              <label>
                How much money do you want to add?
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  autoFocus
                />
                <span className="currency">€</span>
              </label>
              
              {addAmount && !isNaN(parseFloat(addAmount)) && (
                <div className="marble-cost">
                  This will add <strong>{Math.floor(parseFloat(addAmount) / marbleValue)} marble{Math.floor(parseFloat(addAmount) / marbleValue) !== 1 ? 's' : ''}</strong>
                  {parseFloat(addAmount) % marbleValue !== 0 && (
                    <div className="remainder-note">
                      (Remainder of {(parseFloat(addAmount) % marbleValue).toFixed(2)}€ will be ignored)
                    </div>
                  )}
                </div>
              )}

              <div className="modal-buttons">
                <button onClick={() => setShowAddModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={addMoney} className="confirm-button">
                  Add Marbles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFullLog && (
        <div className="modal-overlay" onClick={() => setShowFullLog(false)}>
          <div className="full-log-modal" onClick={(e) => e.stopPropagation()}>
            <div className="full-log-header">
              <h3>📋 Complete Spending Log</h3>
              <button 
                className="close-button"
                onClick={() => setShowFullLog(false)}
              >
                ✕
              </button>
            </div>
            <div className="full-log-content">
              {spendingLog.length === 0 ? (
                <div className="no-entries">No spending entries yet!</div>
              ) : (
                <div className="spending-list full-log">
                  {spendingLog.map((entry) => (
                    <div key={entry.id} className="spending-item">
                      <div className="spending-amount">{entry.amount}€</div>
                      <div className="spending-details">
                        <div className="spending-marbles">{entry.marbles} marble{entry.marbles !== 1 ? 's' : ''}</div>
                        {entry.note && <div className="spending-note">"{entry.note}"</div>}
                        <div className="spending-date">{entry.date}</div>
                      </div>
                      <button 
                        className="delete-button"
                        onClick={() => deleteSpendingEntry(entry.id)}
                        title="Delete this entry"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
