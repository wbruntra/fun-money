import './App.css'
import { FaCog } from 'react-icons/fa'
import { useAppState } from './hooks/useAppState'
import { useAppLogic } from './hooks/useAppLogic'
import { getDateString } from './utils'

function App() {
  // Use custom hooks for state and logic management
  const state = useAppState()
  const logic = useAppLogic(state)

  // Destructure state for easier access in JSX
  const {
    marbles,
    dailyBudget,
    marbleValue,
    spendingLog,
    isInitialized,
    showSetup,
    showSpendModal,
    showFullLog,
    showSettingsModal,
    showSettingsConfig,
    spendAmount,
    spendNote,
    spendDate,
    addAmount,
    initialAmount,
    setupMarbleValue,
    setupDailyBudget,
    newDailyBudget,
    newMarbleValue,
    setShowFullLog,
    setShowSettingsModal,
    setShowSpendModal,
    setShowSettingsConfig,
    setSpendDate,
    setSpendAmount,
    setSpendNote,
    setAddAmount,
    setInitialAmount,
    setSetupMarbleValue,
    setSetupDailyBudget,
    setNewDailyBudget,
    setNewMarbleValue
  } = state

  // Destructure logic functions
  const {
    initializeApp,
    spendMarbles,
    deleteSpendingEntry,
    addMoney,
    openSpendModal,
    openSettingsConfig,
    saveSettings,
    reinitializeApp
  } = logic

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

          <label>
            What should be the value of each marble?
            <input
              type="number"
              value={setupMarbleValue}
              onChange={(e) => setSetupMarbleValue(e.target.value)}
              placeholder="4.00"
              min="0.01"
              step="0.01"
            />
            <span className="currency">€</span>
          </label>

          <label>
            How much money should be added daily?
            <input
              type="number"
              value={setupDailyBudget}
              onChange={(e) => setSetupDailyBudget(e.target.value)}
              placeholder="8.00"
              min="0.01"
              step="0.01"
            />
            <span className="currency">€</span>
          </label>

          <p className="budget-info">
            Daily budget: {setupDailyBudget}€ per day ({Math.floor(parseFloat(setupDailyBudget || 0) / parseFloat(setupMarbleValue || 1))} marbles × {setupMarbleValue}€ each)
            {initialAmount && !isNaN(parseFloat(initialAmount)) && setupMarbleValue && !isNaN(parseFloat(setupMarbleValue)) && (
              <span className="marble-preview">
                <br />This will give you <strong>{Math.floor(parseFloat(initialAmount) / parseFloat(setupMarbleValue))} marbles</strong> to start
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
          <div className="stat combined-stat">
            <div className="stat-main">
              <span className="stat-value">{marbles}</span>
              <span className="stat-label">marbles</span>
            </div>
            <div className="stat-sub">
              <span className="budget-amount">{marbles * marbleValue}€</span>
              <span className="budget-label">available</span>
            </div>
          </div>
        </div>
      </header>

      <main className="marble-container">
        <div className="jar">
          <div className="marbles-grid">
            {Array.from({ length: Math.min(marbles, 100) }, (_, i) => (
              <div key={i} className="marble"></div>
            ))}
            {marbles > 100 && <div className="marble-overflow">+{marbles - 100} more</div>}
          </div>
        </div>

        <div className="controls">
          <button className="spend-button" onClick={openSpendModal} disabled={marbles === 0}>
            💸 Spend Money
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
                  <div className="spending-marbles">
                    {entry.marbles} marble{entry.marbles !== 1 ? 's' : ''}
                  </div>
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
              <button className="log-button" onClick={() => setShowFullLog(true)}>
                📋 View Full Log
              </button>
            </div>
          )}
        </section>
      )}

      <div className="settings-icon-container">
        <button
          className="settings-icon-button"
          onClick={() => setShowSettingsModal(true)}
          title="Settings"
        >
          <FaCog size={24} />
        </button>
      </div>
      
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
                  This will use{' '}
                  <strong>
                    {Math.ceil(parseFloat(spendAmount) / marbleValue)} marble
                    {Math.ceil(parseFloat(spendAmount) / marbleValue) !== 1 ? 's' : ''}
                  </strong>
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

      {showFullLog && (
        <div className="modal-overlay" onClick={() => setShowFullLog(false)}>
          <div className="full-log-modal" onClick={(e) => e.stopPropagation()}>
            <div className="full-log-header">
              <h3>📋 Complete Spending Log</h3>
              <button className="close-button" onClick={() => setShowFullLog(false)}>
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
                        <div className="spending-marbles">
                          {entry.marbles} marble{entry.marbles !== 1 ? 's' : ''}
                        </div>
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

      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚙️ Settings</h3>
            <div className="modal-form">
              <div className="settings-section">
                <h4>💰 Add Money</h4>
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
                    This will add{' '}
                    <strong>
                      {Math.floor(parseFloat(addAmount) / marbleValue)} marble
                      {Math.floor(parseFloat(addAmount) / marbleValue) !== 1 ? 's' : ''}
                    </strong>
                    {parseFloat(addAmount) % marbleValue !== 0 && (
                      <div className="remainder-note">
                        (Remainder of {(parseFloat(addAmount) % marbleValue).toFixed(2)}€ will be
                        ignored)
                      </div>
                    )}
                  </div>
                )}

                <div className="settings-buttons">
                  <button
                    onClick={addMoney}
                    className="confirm-button"
                    disabled={!addAmount || isNaN(parseFloat(addAmount))}
                  >
                    Add Marbles
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h4>⚙️ Configure App</h4>
                <div className="settings-info">
                  <p><strong>Current Settings:</strong></p>
                  <p>Daily Budget: {dailyBudget}€ ({Math.floor(dailyBudget / marbleValue)} marbles × {marbleValue}€ each)</p>
                  <p>Marble Value: {marbleValue}€ each</p>
                </div>

                <div className="settings-buttons">
                  <button onClick={openSettingsConfig} className="secondary-button">
                    Change Settings
                  </button>
                  <button onClick={reinitializeApp} className="danger-button">
                    Reinitialize App
                  </button>
                </div>
              </div>

              <div className="modal-buttons">
                <button onClick={() => setShowSettingsModal(false)} className="cancel-button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettingsConfig && (
        <div className="modal-overlay" onClick={() => setShowSettingsConfig(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚙️ Configure Settings</h3>
            <div className="modal-form">
              <div className="settings-section">
                <label>
                  Daily Budget (€)
                  <input
                    type="number"
                    value={newDailyBudget}
                    onChange={(e) => setNewDailyBudget(e.target.value)}
                    placeholder="8.00"
                    min="0.01"
                    step="0.01"
                  />
                  <span className="currency">€</span>
                </label>

                <label>
                  Marble Value (€)
                  <input
                    type="number"
                    value={newMarbleValue}
                    onChange={(e) => setNewMarbleValue(e.target.value)}
                    placeholder="4.00"
                    min="0.01"
                    step="0.01"
                  />
                  <span className="currency">€</span>
                </label>

                {newDailyBudget && newMarbleValue && !isNaN(parseFloat(newDailyBudget)) && !isNaN(parseFloat(newMarbleValue)) && (
                  <div className="settings-preview">
                    <p><strong>Preview:</strong></p>
                    <p>Daily Budget: {parseFloat(newDailyBudget)}€ ({Math.floor(parseFloat(newDailyBudget) / parseFloat(newMarbleValue))} marbles × {parseFloat(newMarbleValue)}€ each)</p>
                    <p>Current Money: {marbles * marbleValue}€ ({marbles} marbles) - <em>Will be preserved</em></p>
                  </div>
                )}
              </div>

              <div className="modal-buttons">
                <button onClick={() => setShowSettingsConfig(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={saveSettings} className="confirm-button">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default App
