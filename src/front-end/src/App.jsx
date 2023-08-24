import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import EmployeeHome from './components/employee/EmployeeHome'
import RequestDelete from './components/employee/RequestDelete'
import EmployerDashboard from './components/employer/EmployerDashboard'
import basicAuthFetch from './fetch/auth/basic_fetch.js'
import fetchMod from './fetch/fetch.js'

import './App.css'
import FuelLogContext from './context.js'
import EmployeeProfile from './components/employee/EmployeeProfile'

function App() {
  const [store, dispatch] = useReducer(reducer, initialState)
  const { userAccess, authorised, userName } = store
  const navigate = useNavigate()

  async function loginAccess (username, password) {
    const res = await basicAuthFetch(username, password)
    dispatch({
      type: 'userAccess',
      isAdmin: res.isAdmin,
      authorised: true,
      userName: res.name
    })
    // TODO: set up dummy cookie with same expiration date as accessToken and use to block access, redirect user to login 
    res.isAdmin ? navigate('/employer/dashboard/home') : navigate('/employee/dashboard/home')
  }

  async function userLogout () {
    const res = await fetchMod('GET', 'auth/logout', '')
    res === 'OK' ? navigate('/') : console.log('logout failed')
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName, userLogout}}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/employee'>
          <Route path='dashboard/home' element={<EmployeeHome><EmployeeProfile /></EmployeeHome>} />
          <Route path='dashboard/new/log' />
          <Route path='dashboard/log/successful' element={<EmployeeHome><RequestDelete /></EmployeeHome>} />
        </Route>
        <Route path='/employer'>
          <Route path='dashboard/home' element={<EmployerDashboard />} />
        </Route>
      </Routes>
    </FuelLogContext.Provider>
  </>
}

export default App
