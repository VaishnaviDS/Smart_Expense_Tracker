import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login'
import ProtectionRoute from './components/ProtectionRoute'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import AddTransaction from './pages/Transactions/AddTransaction'
import './App.css'
import Profile from './pages/Profile/Profile'
import Footer from './components/Footer/Footer'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} />
    <div className="app-layout">
          <Header />
       <main className="app-content">
    <Routes>
<Route path='/' element={<Home />} />
<Route path='/login' element={<Login />} />

<Route path='/dashboard' element={<ProtectionRoute><Dashboard /></ProtectionRoute>} />

  <Route path='/register' element={<Register/>} />
  <Route path='/transaction' element={<ProtectionRoute><AddTransaction /></ProtectionRoute>} />
  <Route path='/profile' element={<ProtectionRoute><Profile /></ProtectionRoute>}/>

    </Routes>
    </main>
    </div>
    <Footer />
    </BrowserRouter>
  )
}

export default App