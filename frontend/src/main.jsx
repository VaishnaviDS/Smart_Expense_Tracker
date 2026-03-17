import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import GlobalState from './context/UserContext.jsx'
import DashboardProvider from './context/DashboardContext.jsx'
import TransactionState from './context/TransactionContext.jsx'

export const server='https://smart-expense-tracker-34uz.onrender.com'

createRoot(document.getElementById('root')).render(
  <GlobalState>
       <DashboardProvider>
    <TransactionState>
 <App />

    </TransactionState>
     </DashboardProvider>
  </GlobalState>,
)
