import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import EmployeeHome from './components/employee/EmployeeHome'
import LogEntry from './components/employee/LogEntry'
import EmployerDashboard from './components/employer/EmployerDashboard'
import basicAuthFetch from './fetch/auth/basic_fetch.js'
import fetchMod from './fetch/fetch.js'
import DashboardTable from './components/employer/DashboardTable.jsx'

import './App.css'
import { FuelLogContext } from './context.js'
import VehiclesListFetch from './components/employer/VehiclesListFetch.jsx'
import VehicleForm from './components/employer/VehicleForm.jsx'
import DonutGraphVehicleUsage from './components/employer/DonutGraphVehicleUsage.jsx'
import BarGraphTotalVehicleUsage from './components/employer/BarGraphTotalVehicleUsage.jsx'
import ScatterGraphVehicleDistanceFuel from './components/employer/ScatterGraphVehicleDistanceFuel.jsx'
import EmployeeListFetch from './components/employer/EmployeeListFetch.jsx'
import EmployeeContextLayout from './components/employee/EmployeeContextLayout.jsx'
import LogsFetchList from './components/employer/LogsFetchList.jsx'



function App() {
  const [store, dispatch] = useReducer(reducer, initialState)
  const { userAccess,
          authorised,
          userName,
          allVehicles,
          currentVehicle,
          showModalText,
          showModalField,
          displayVehicleInfo,
          displayPlaceholderVehicleInfo,
          propsObject } = store
  
  const navigate = useNavigate()

  // USER ACCESS

  async function loginAccess (username, password) {
    const res = await basicAuthFetch(username, password)
    if (res.status === 200) {
    const initialVehicles = await fetchMod('GET', 'vehicles', '')
      dispatch({
        type: 'userAccess',
        isAdmin: res.returnedData.isAdmin,
        authorised: true,
        userName: res.returnedData.name,
        allVehicles: initialVehicles.body
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
      type: 'logout',
    })
    res === 'OK' ? navigate('/') : console.log('logout failed')
  }

  // NAV

  function backButton(path) {
    dispatch({ 
      type: 'backButton',
      displayVehicleInfo: false,
      displayPlaceholderVehicleInfo: true
    })
    navigate(path)
  }

  // VEHICLES

  async function getAllVehicles () {
    const res = await fetchMod('GET', 'vehicles', '')
    dispatch({
      type: 'allVehicles',
      allVehicles: res.body,
    })
  }

  async function currentVehicleDetails (vehicleID) {
    const currentVehicle = allVehicles.filter(vehicle => {return vehicle.asset_id === vehicleID})

    dispatch({
      type: 'selectVehicle',
      currentVehicle: currentVehicle[0],
      displayPlaceholderVehicleInfo: false,
      displayVehicleInfo: true
    })
  }

  // MODALS
  // toggle modals
  function modalTextOperation (toggle) {
    dispatch({
      type: 'popUpText',
      toggleModal: toggle,
      allVehicles: [...allVehicles]
    })
  }

  function modalFieldOperation (toggle) {
    dispatch({
      type: 'popUpField',
      toggleModal: toggle,
    })
  }

  // WRAPPERS

  function HomeReportWrapper() {
    return(
      <EmployerDashboard>
        <h3>Employer Dashboard Home</h3>
        <DashboardTable />
        <DonutGraphVehicleUsage />
        <BarGraphTotalVehicleUsage />
        <ScatterGraphVehicleDistanceFuel />
      </EmployerDashboard>
    )
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName, userLogout, allVehicles, getAllVehicles, currentVehicleDetails, currentVehicle, displayVehicleInfo, displayPlaceholderVehicleInfo, backButton, showModalText, modalTextOperation, showModalField, modalFieldOperation, navigate}}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/employer'></Route>
          <Route path='/employee' element={<EmployeeContextLayout />} >
              <Route path='dashboard/home' element={<EmployeeHome />} />
              <Route path='dashboard/new/log' element={<LogEntry />} />
          </Route>
          <Route path='/employer'>
            <Route path='dashboard/home' element={<HomeReportWrapper />} />
            <Route path='dashboard/all/vehicles' element={<EmployerDashboard><VehiclesListFetch /></EmployerDashboard>} />
            <Route path='dashboard/vehicle/new' element={<EmployerDashboard><VehicleForm /></EmployerDashboard>} />
            <Route path='dashboard/all/vehicles/edit/:assetID' element={<EmployerDashboard><VehicleForm {...propsObject} /></EmployerDashboard>} />
            <Route path='dashboard/all/employees' element={<EmployerDashboard><EmployeeListFetch /></EmployerDashboard>} />
            <Route path='dashboard/all/logs' element={<EmployerDashboard><LogsFetchList /></EmployerDashboard>} />
            <Route path='dashboard/all/logs/reviews' element={<EmployerDashboard><EmployeeListFetch /></EmployerDashboard>} />
          </Route>
        </Routes>
    </FuelLogContext.Provider>
  </>
}

export default App
