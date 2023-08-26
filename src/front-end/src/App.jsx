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
import fetchFiles from './fetch/fetch_files.js'
import DashboardTable from './components/employer/DashboardTable.jsx'

import './App.css'
import { FuelLogContext, EmployeeContext, EmployerContext } from './context.js'
import EmployeeProfile from './components/employee/EmployeeProfile'


function App() {
  const [store, dispatch] = useReducer(reducer, initialState)
  const { userAccess, authorised, userName, allVehicles, currentVehicle, newLogCreated, logId } = store
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

  function handleLogEntryBackButton() {
    dispatch({
      type: 'userAccess',
      userAccess: userAccess,
      authorised: authorised,
      userName: userName
    })
    navigate('/employee/dashboard/home')
  }

  async function postLogEntry (data) {
    const res = await fetchMod('POST', 'logs', data)
    if (res.status === 200) {
      dispatch({
        type: 'newLog',
        newLogCreated: true,
        logId: res._id,
        userAccess: userAccess,
        authorised: authorised,
        userName: userName
      })
      navigate('/employee/dashboard/home')
    }
    // TODO: if post failed, return a error popup condition
  }

 
  async function handleNewLogRequest(event) {
      let res
    if (event.target.value === 'submit'){
      res = await fetchMod('POST', 'logs/reviews', {log_id: logId}) 
    }
    if (res.status === 201 || event.target.value === 'cancel') {
      dispatch({
      type: 'newLog',
      newLogCreated: false,
      userAccess: userAccess,
      authorised: authorised,
      userName: userName
    })
    } else {
      console.log('new log request post failed', res.status, res.body.error) // TODO: if post of log review is unsuccessful, display error on screen
    }
    
  }

  async function postVehicle ({ make, model, year, asset_id, registration, image }) {
    let formData = new FormData()
    formData.append('make', make)
    formData.append('model', model)
    formData.append('year', year)
    formData.append('asset_id', asset_id)
    formData.append('registration', registration)
    formData.append('image', image)
    const res = await fetchFiles('POST', 'vehicles', formData)
    console.log(formData) // TODO: gather response data and render a succeful component display
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName, userLogout, allVehicles, getAllVehicles, currentVehicleDetails, currentVehicle}}>
      <EmployeeContext.Provider value={{postLogEntry, newLogCreated, handleNewLogRequest, handleLogEntryBackButton}}>
      <EmployerContext.Provider value={{postVehicle}}>
        <Routes>
          <Route path='/' element={<Login />} />
            <Route path='/employee'>
              {/* <Route path='dashboard/home' element={<EmployeeHome><EmployeeProfile /></EmployeeHome>} /> */}
              <Route path='dashboard/home' element={<EmployeeHome />} />
              <Route path='dashboard/new/log' element={<LogEntry />} />
              {/* <Route path='dashboard/log/successful' element={<EmployeeHome><RequestDelete /></EmployeeHome>} /> */}
            </Route>
          <Route path='/employer'>
            <Route path='dashboard/home' element={<EmployerDashboard><DashboardTable /></EmployerDashboard>} />
            <Route path='dashboard/all/vehicles' element={<EmployerDashboard />} />
          </Route>
        </Routes>
      </EmployerContext.Provider>
      </EmployeeContext.Provider>
    </FuelLogContext.Provider>
  </>
}

export default App
