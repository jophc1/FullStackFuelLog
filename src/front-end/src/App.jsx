import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import EmployeeHome from './components/employee/EmployeeHome'
import RequestDelete from './components/employee/RequestDelete'
import LogEntry from './components/employee/LogEntry'
import EmployerDashboard from './components/employer/EmployerDashboard'
import basicAuthFetch from './fetch/auth/basic_fetch.js'
import fetchMod from './fetch/fetch.js'

import './App.css'
import { FuelLogContext, EmployeeContext, EmployerContext } from './context.js'
import EmployeeProfile from './components/employee/EmployeeProfile'


function App() {
  const [store, dispatch] = useReducer(reducer, initialState)
  const { userAccess, authorised, userName, allVehicles, currentVehicle, newLogCreated } = store
  const navigate = useNavigate()

  async function loginAccess (username, password) {
    const res = await basicAuthFetch(username, password)
    if (res.status === 200) {
      dispatch({
        type: 'userAccess',
        isAdmin: res.returnedData.isAdmin,
        authorised: true,
        userName: res.returnedData.name
      })
      // TODO: set up dummy cookie with same expiration date as accessToken and use to block access, redirect user to login
      res.returnedData.isAdmin ? navigate('/employer/dashboard/home') : navigate('/employee/dashboard/home') // TODO chnage route back to /employee/dashboard/home
    } else {
      navigate('/')
    }
  }

  async function userLogout () {
    const res = await fetchMod('GET', 'auth/logout', '')
    dispatch({
      type: 'userAccess',
      authorised: false
    })
    res === 'OK' ? navigate('/') : console.log('logout failed')
  }

  async function getAllVehicles () {
    const res = await fetchMod('GET', 'vehicles', '')
    dispatch({
      type: 'allVehicles',
      allVehicles: res.body,
      userAccess: userAccess,
      authorised: authorised,
      userName: userName
    })
  }

  async function currentVehicleDetails (vehicleID) {
    const res = await fetchMod('GET', 'vehicles/' + vehicleID, '')
    
    dispatch({
      type: 'selectVehicle',
      allVehicles: [...allVehicles],
      currentVehicle: res.body,
      userAccess: userAccess,
      authorised: authorised,
      userName: userName
    })
  }

  async function postLogEntry (data) {
    const res = await fetchMod('POST', 'logs', data)
    if (res.status === 201) {
      navigate('/dashboard/log/successful')
    }
    // TODO: if post failed, return a error popup condition

  }

  async function postVehicle (data) {
    
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName, userLogout, allVehicles, getAllVehicles, currentVehicleDetails, currentVehicle}}>
      <EmployeeContext.Provider value={{postLogEntry, newLogCreated}}>
      <EmployerContext.Provider value={postVehicle}>
        <Routes>
          <Route path='/' element={<Login />} />
            <Route path='/employee'>
              {/* <Route path='dashboard/home' element={<EmployeeHome><EmployeeProfile /></EmployeeHome>} /> */}
              <Route path='dashboard/home' element={<EmployeeHome />} />
              <Route path='dashboard/new/log' element={<LogEntry />} />
              <Route path='dashboard/log/successful' element={<EmployeeHome><RequestDelete /></EmployeeHome>} />
            </Route>
          <Route path='/employer'>
            <Route path='dashboard/home' element={<EmployerDashboard />} />
            <Route path='dashboard/all/vehicles' element={<EmployerDashboard />} />
          </Route>
        </Routes>
      </EmployerContext.Provider>
      </EmployeeContext.Provider>
    </FuelLogContext.Provider>
  </>
}

export default App
