import React, { useContext, useReducer } from 'react'
import { reducer, initialState } from '../../reducer.js'
import { FuelLogContext, EmployerContext } from '../../context.js'
import NavBar from './NavBar'
import { Navigate } from 'react-router-dom'
import fetchMod from '../../fetch/fetch.js'
import fetchFiles from '../../fetch/fetch_files.js'

const EmployerDashboard = ({ children }) => {

  const [store, dispatch] = useReducer(reducer, initialState)
  const { propsObject, allLogs } = store


  const { userAccess, authorised, allVehicles, navigate, editVehicle } = useContext(FuelLogContext)

  // EMPLOYEES

  async function getAllEmployees () {
    const res = await fetchMod('GET', 'employed', '')
    return res.body
  }

  async function deleteEmployee () {

  }

  async function postUpdateEmployee (userObject, method, path) {
    
    if (method === 'PUT') {
      path = path + '/' + userObject.username_id
    } 
    else if (method === 'DELETE' || method === 'PATCH')
    {
      console.log('CANNOT PATCH OR DELETE on postUpdateEmployee')
      return {}
    }
    const res = await fetchMod(method, path, userObject)
   
    if (res.status === 500){
      console.log("error with post or put on postUpdateEmployee") // TODO: error message popup when error occurs
    } 
  }

  
  async function postUpdateVehicle ({ make, model, year, asset_id, registration, image, method, urlSuffix }) {
    let formData = new FormData()
    formData.append('make', make)
    formData.append('model', model)
    formData.append('year', year)
    formData.append('asset_id', asset_id)
    formData.append('registration', registration) 
    formData.append('image', image)
    const res = await fetchFiles(method, urlSuffix, formData)
    console.log(formData) // TODO: gather response data and render a succeful component display
    if (res.status == 201) {
      navigate('/employer/dashboard/all/vehicles/') // TODO: show new vehicle details
    }
  }

  async function deleteVehicle (assetID) {
    const res = fetchMod('DELETE', `vehicles/${assetID}`, '')
    const newAllVehicles = allVehicles.filter(vehicle => {return vehicle.asset_id != assetID})
    dispatch({
      type: 'allVehicles',
      allVehicles: newAllVehicles,
    })
  }

  // LOGS

  async function getAllLogs () {
    const res = await fetchMod('GET', 'logs', '')
    const sortedLogRecordsByDate = res.body.sort((logOne, logTwo) => new Date(logTwo.date).getTime() - new Date(logOne.date).getTime() )
    dispatch({
      type: 'allLogs',
      allLogs: sortedLogRecordsByDate
    })
  }

  async function deleteLog (logID) {

  }

  // REPORTS

  async function getEmployerTableReports(fromDateArray, toDateArray) {
    const res = await fetchMod('GET', `reports/${fromDateArray[0]}/${fromDateArray[1]}/${fromDateArray[2]}/to/${toDateArray[0]}/${toDateArray[1]}/${toDateArray[2]}`, '')
    if (res.status === 200) {
      return res.body
    }
    // TODO: if fetch fails, return an error message
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


  return userAccess && authorised ? 
  <>
    <NavBar />
    <EmployerContext.Provider value={{postUpdateVehicle, deleteVehicle, editVehicle, getEmployerTableReports, propsObject, getAllEmployees, graphData, deleteEmployee, postUpdateEmployee, getAllLogs, allLogs, deleteLog}}>
    {children}
    </EmployerContext.Provider>   
  </>
  :
  <Navigate to='/' />
}

export default EmployerDashboard