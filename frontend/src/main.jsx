import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import GlobalState from './context/UserContext.jsx'
import DashboardProvider from './context/DashboardContext.jsx'
import TransactionState from './context/TransactionContext.jsx'

export const server='http://localhost:5000'

createRoot(document.getElementById('root')).render(
  <GlobalState>
       <DashboardProvider>
    <TransactionState>
 <App />

    </TransactionState>
     </DashboardProvider>
  </GlobalState>,
)
