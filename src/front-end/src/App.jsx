import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import EmployeeHome from './components/employee/EmployeeHome.jsx'
import LogEntry from './components/employee/LogEntry.jsx'
import EmployerDashboard from './components/employer/EmployerDashboard.jsx'
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
import ReviewsFetchList from './components/employer/ReviewsFetchList.jsx'
import loaderGif from './assets/loader.gif'



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
          propsObject,
          logId,
          newLogCreated,
          userId,
          errorMessage } = store
  
  const navigate = useNavigate()
  const [modalErrorRender, setModalErrorRender] = useState(false)
  const [renderLoadingGif, setRenderLoadingGif] = useState(false)

  // USER ACCESS

  async function loginAccess (username, password) {
    const res = await basicAuthFetch(username, password)
    setRenderLoadingGif(false)
    if (res.status === 200) {
    const initialVehicles = await fetchMod('GET', 'vehicles', '')
      dispatch({
        type: 'userAccess',
        isAdmin: res.returnedData.isAdmin,
        authorised: true,
        userName: res.returnedData.name,
        allVehicles: initialVehicles.body,
        userId: res.returnedData.usernameId
      })
      // TODO: set up dummy cookie with same expiration date as accessToken and use to block access, redirect user to login
      res.returnedData.isAdmin ? navigate('/employer/dashboard/home') : navigate('/employee/dashboard/home')
    } else if (res.status === 204) {
      errorHandler(<p>Server not responding. Try again later.</p>)
    }
    else {
      errorHandler(<p>Invalid username or password.</p>)
    }
  }

  async function userLogout () {
    const res = await fetchMod('GET', 'auth/logout', '')
    dispatch({
      type: 'logout',
    })
    res === 'OK' ? navigate('/') : console.log('logout failed')
  }

  // Employee components
   async function postUpdateEmployee (userObject, initialEmployeeId, method, path) {
    
    if (method === 'PUT') {
      path = path + '/' + initialEmployeeId
      if (!userObject.password) { // If no password is provided in object then remove password key (Update route only)
        delete userObject.password
      }
    } 
    
    const res = await fetchMod(method, path, userObject)

    // if response returns error, display back to user based on error msgs
    // regexp used for different cases and messages customised for end user
    if (res.status === 500){
      if (new RegExp('(?=.*username_id)(?=.*dup)', 'i').test(res.body.error)) {
        errorHandler(<p>Employee ID already exists.</p>)
      } else if (new RegExp('(?=.*name)(?=.*validation)', 'i').test(res.body.error)) {
        errorHandler(<p>Employee name needs to be capitalised full name <span>e.g. John Smith</span></p>)
      } else if (new RegExp('(?=.*password)(?=.*characters)', 'i').test(res.body.error)) {
        errorHandler(<p>Password needs to be 8 characters or more.</p>)
      } else {
        errorHandler(<p>Required fields <span className='required'>*</span>  must be filled in.</p>)
      }
    }
    return res
  }

  async function postLogEntry (data) {
    const res = await fetchMod('POST', 'logs', data)
    if (res.status === 200) {
      dispatch({
        type: 'newLog',
        newLogCreated: true,
        logId: res.body._id
      })
      navigate('/employee/dashboard/home')
    } 
    else {
      if (new RegExp('(?=.*fuel_added)(?=.*value)', 'i').test(res.body.error)) {
        errorHandler(<p>Fuel field must be greater than 0</p>)
      }
      else if (new RegExp('(?=.*fuel_added)(?=.*required)', 'i').test(res.body.error)) {
        errorHandler(<p>Fuel field must be a number</p>)
      }
      else {
        errorHandler(<p>{res.body.error}</p>)
      }
    }
  }

  async function newLogRequest(event) {
    let res = {}
    if (event.target.value === 'submit'){
      res = await fetchMod('POST', 'logs/reviews', {log_id: logId})
    }
    if (event.target.value === 'cancel' || res.status === 201) {
      dispatch({
        type: 'newLog',
        newLogCreated: false,
        logId: {}
      })
    } else {
      console.log('new log request post failed', res.status, res.body.error) // TODO: if post of log review is unsuccessful, display error on screen
    }
  }



  // NAV

  function backButton(path) {
    dispatch({ 
      type: 'backButton',
      currentVehicle: {},
      displayVehicleInfo: false,
      displayPlaceholderVehicleInfo: true,
      newLogCreated: false
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
    console.log(currentVehicle)
    dispatch({
      type: 'selectVehicle',
      currentVehicle: currentVehicle[0],
      displayPlaceholderVehicleInfo: false,
      displayVehicleInfo: true
    })
  }

  async function editVehicle (assetID) {
    const selectedVehicle = allVehicles.find(vehicle => {return vehicle.asset_id === assetID})
    // prepare the props object to be passed into VehicleForm
    const propsObj = {
      makeInit: selectedVehicle.make,
      modelInit: selectedVehicle.model,
      yearInit: selectedVehicle.year,
      assetIdInit: selectedVehicle.asset_id,
      regoInit: selectedVehicle.registration,
      previewImageInit: selectedVehicle.vehicleImage_URL,
      method: 'PUT',
      urlSuffix: `vehicles/${assetID}`,
      heading: 'Update Vehicle'
    }

    dispatch({
      type: 'editVehicle',
      props: {...propsObj}
    })

    navigate(`/employer/dashboard/all/vehicles/edit/${assetID}`)
  }

  async function deleteVehicle (assetID) {  
    const res = await fetchMod('DELETE', `vehicles/${assetID}`, '')
    if (res === 'OK') {
      const newAllVehicles = allVehicles.filter(vehicle => {return vehicle.asset_id != assetID})
      dispatch({
        type: 'allVehicles',
        allVehicles: newAllVehicles
      })
    } else {
      errorHandler(<p>Something went wrong trying to delete vehicle. Try again later!</p>)
    }
  }

  // MODALS
  // toggle modals
  function modalTextOperation (toggle) {
    dispatch({
      type: 'popUpText',
      toggleModal: toggle,
    })
  }

  function modalFieldOperation (toggle) {
    dispatch({
      type: 'popUpField',
      toggleModal: toggle,
    })
  }

  // ERRORS 

  function errorHandler (message) {
    dispatch({
      type: 'errMsg',
      errMsg: message,
      showModalText: true
    })
    modalTextOperation(true)
    setModalErrorRender(true)
    // set time to turn off notification after 5 seconds
    setTimeout(() => {
      modalTextOperation(false)
      setModalErrorRender(false)
    }, [5000])
  }

  // WRAPPERS

  function HomeReportWrapper() {
    return(
      <EmployerDashboard>
        <h3>Dashboard Home</h3>
        <DashboardTable />
        <h4 className='dashboardTitle'>Graphs</h4>
        <DonutGraphVehicleUsage />
        <BarGraphTotalVehicleUsage />
        <ScatterGraphVehicleDistanceFuel />
      </EmployerDashboard>
    )
  }

  return <>
    <FuelLogContext.Provider value={{loginAccess, userAccess, authorised, userName, userLogout, loaderGif, renderLoadingGif, setRenderLoadingGif, allVehicles, getAllVehicles, 
      currentVehicleDetails, currentVehicle, displayVehicleInfo, displayPlaceholderVehicleInfo, backButton, showModalText, 
      modalTextOperation, showModalField, modalFieldOperation, navigate, editVehicle, deleteVehicle,
      postLogEntry, newLogCreated, newLogRequest, userId, postUpdateEmployee, errorMessage, modalErrorRender, setModalErrorRender,  errorHandler}}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/employee' >
              <Route path='dashboard/home' element={<EmployeeHome />} />
              <Route path='dashboard/new/log/all' element={<LogEntry />} />
          </Route>
          <Route path='/employer'>
            <Route path='dashboard/home' element={<HomeReportWrapper />} />
            <Route path='dashboard/all/vehicles' element={<EmployerDashboard><VehiclesListFetch /></EmployerDashboard>} />
            <Route path='dashboard/vehicle/new' element={<EmployerDashboard><VehicleForm /></EmployerDashboard>} />
            <Route path='dashboard/all/vehicles/edit/:assetID' element={<EmployerDashboard><VehicleForm {...propsObject} /></EmployerDashboard>} />
            <Route path='dashboard/all/employees' element={<EmployerDashboard><EmployeeListFetch /></EmployerDashboard>} />
            <Route path='dashboard/all/logs' element={<EmployerDashboard><LogsFetchList /></EmployerDashboard>} />
            <Route path='dashboard/all/logs/reviews' element={<EmployerDashboard><ReviewsFetchList /></EmployerDashboard>} />
          </Route>
        </Routes>
    </FuelLogContext.Provider>
  </>
}

export default App
