import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import EmployeeDashboard from './components/employee/EmployeeDashboard'
import EmployerDashboard from './components/employer/EmployerDashboard'

import './App.css'
import FuelLogContext from './context.js'

// --- SET ENV VARIABLES --- //
const ENV = 'dev'
let API_URL
ENV === 'prod' ? API_URL = '' : API_URL = 'http://localhost:4001'
// ------------------------ //


const basicAuthFetch = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    })
    const returnedData = await res.json()
    return returnedData.isAdmin
  } catch (err) {
    console.error(err)
  }
}


function App() {
  const [store, dispatch] = useReducer(reducer, initialState)
  const { userAccess, authorised } = store
  const navigate = useNavigate()

  async function loginAccess (username, password) {
    const res = await basicAuthFetch(username, password)
    dispatch({
      type: 'userAccess',
      isAdmin: res,
      authorised: true
    })
    // set up dummy cookie with same expiration date as accessToken and use to block access, redirect user to login 
    console.log(res)
    res ? navigate('/employer/dashboard/home') : navigate('/employee/dashboard/home')
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised}}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/employee'>
          <Route path='dashboard/home' element={<EmployeeDashboard />} />
        </Route>
        <Route path='/employer'>
          <Route path='dashboard/home' element={<EmployerDashboard />} />
        </Route>
      </Routes>
    </FuelLogContext.Provider>
  </>
}

export default App
