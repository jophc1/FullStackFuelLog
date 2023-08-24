import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import EmployeeHome from './components/employee/EmployeeHome.jsx'
import EmployerDashboard from './components/employer/EmployerDashboard'
import basicAuthFetch from './fetch/auth/basic_fetch.js'

import './App.css'
import FuelLogContext from './context.js'

// // --- SET ENV VARIABLES --- //
// const ENV = import.meta.env.VITE_ENV
// let API_URL
// ENV === 'prod' ? API_URL = '' : API_URL = import.meta.env.VITE_API_URL_LOCAL
// // ------------------------ //

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
    // set up dummy cookie with same expiration date as accessToken and use to block access, redirect user to login 
    console.log(res)
    res.isAdmin ? navigate('/employer/dashboard/home') : navigate('/employee/dashboard/home')
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName}}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/employee'>
          <Route path='dashboard/home' element={<EmployeeHome />} />
        </Route>
        <Route path='/employer'>
          <Route path='dashboard/home' element={<EmployerDashboard />} />
        </Route>
      </Routes>
    </FuelLogContext.Provider>
  </>
}

export default App
