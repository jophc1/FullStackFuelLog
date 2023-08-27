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
import VehiclesListFetch from './components/employer/VehiclesListFetch.jsx'
import VehicleForm from './components/employer/VehicleForm.jsx'
import DonutGraphVehicleUsage from './components/employer/DonutGraphVehicleUsage.jsx'
import BarGraphTotalVehicleUsage from './components/employer/BarGraphTotalVehicleUsage.jsx'
import ScatterGraphVehicleDistanceFuel from './components/employer/ScatterGraphVehicleDistanceFuel.jsx'
import EmployeeListFetch from './components/employer/EmployeeListFetch.jsx'



function App() {
  const [store, dispatch] = useReducer(reducer, initialState)
  const { userAccess,
          authorised,
          userName,
          allVehicles,
          currentVehicle,
          newLogCreated,
          logId,
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

  async function getAllEmployees () {
    const res = await fetchMod('GET', 'employed', '')
    return res.body
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

  // LOGS

  async function postLogEntry (data) {
    const res = await fetchMod('POST', 'logs', data)
    if (res.status === 200) {
      dispatch({
        type: 'newLog',
        newLogCreated: true,
        logId: res._id
      })
      navigate('/employee/dashboard/home')
    }
    // TODO: if post failed, return a error popup condition
  }

  async function newLogRequest(event) {
    let res
    if (event.target.value === 'submit'){
      res = await fetchMod('POST', 'logs/reviews', {log_id: logId}) 
    }
    if (res.status === 201 || event.target.value === 'cancel') {
      dispatch({
        type: 'newLog',
        newLogCreated: false,
        logID: {}
      })
    } else {
      console.log('new log request post failed', res.status, res.body.error) // TODO: if post of log review is unsuccessful, display error on screen
    }
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

  async function editVehicle (assetID) {
    const selectedVehicle = allVehicles.find(vehicle => {return vehicle.asset_id === assetID})
    // prepare the props object to be passed into VehicleForm
    const propsObj = {
      makeInit: selectedVehicle.make,
      modelInit: selectedVehicle.model,
      yearInit: selectedVehicle.year,
      assetIdInit: selectedVehicle.asset_id,
      regoInit: selectedVehicle.registration
    }

    dispatch({
      type: 'editVehicle',
      props: {...propsObj}
    })

    navigate(`/employer/dashboard/all/vehicles/edit/${assetID}`)
  }

  async function deleteVehicle (assetID) {
    const res = fetchMod('DELETE', `vehicles/${assetID}`, '')
    const newAllVehicles = allVehicles.filter(vehicle => {return vehicle.asset_id != assetID})
    dispatch({
      type: 'allVehicles',
      allVehicles: newAllVehicles,
    })
  }

  async function getEmployerTableReports(fromDateArray, toDateArray) {
    const res = await fetchMod('GET', `reports/${fromDateArray[0]}/${fromDateArray[1]}/${fromDateArray[2]}/to/${toDateArray[0]}/${toDateArray[1]}/${toDateArray[2]}`, '')
    if (res.status === 200) {
      return res.body
    }
    // TODO: if fetch fails, return an error message
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

  // Employer Dashboard Graphs
  async function graphData(path, graphType) {
    const res = await fetchMod('GET', path, '')
    if (res.status === 200) {
      return res.body
    }
    else {
      console.log(`error: ${graphType} graph not retrieved`) // TODO: show error if pie graph data isn't retrieved
    }
  }


  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName, userLogout, allVehicles, getAllVehicles, currentVehicleDetails, currentVehicle, displayVehicleInfo, displayPlaceholderVehicleInfo, backButton, showModalText, modalTextOperation}}>
      <EmployeeContext.Provider value={{postLogEntry, newLogCreated, newLogRequest}}>
      <EmployerContext.Provider value={{postVehicle, deleteVehicle, editVehicle, getEmployerTableReports, propsObject, getAllEmployees, showModalField, modalFieldOperation, graphData}}>
        <Routes>
          <Route path='/' element={<Login />} />
            <Route path='/employee'>
              {/* <Route path='dashboard/home' element={<EmployeeHome><EmployeeProfile /></EmployeeHome>} /> */}
              <Route path='dashboard/home' element={<EmployeeHome />} />
              <Route path='dashboard/new/log' element={<LogEntry />} />
              {/* <Route path='dashboard/log/successful' element={<EmployeeHome><RequestDelete /></EmployeeHome>} /> */}
            </Route>
          <Route path='/employer'>
            <Route path='dashboard/home' element={<HomeReportWrapper />} />
            <Route path='dashboard/all/vehicles' element={<EmployerDashboard><VehiclesListFetch /></EmployerDashboard>} />
            <Route path='dashboard/vehicle/new' element={<EmployerDashboard><VehicleForm /></EmployerDashboard>} />
            <Route path='dashboard/all/vehicles/edit/:assetID' element={<EmployerDashboard><VehicleForm {...propsObject} /></EmployerDashboard>} />
            <Route path='dashboard/all/employees' element={<EmployerDashboard><EmployeeListFetch /></EmployerDashboard>} />
          </Route>
        </Routes>
      </EmployerContext.Provider>
      </EmployeeContext.Provider>
    </FuelLogContext.Provider>
  </>
}

export default App
