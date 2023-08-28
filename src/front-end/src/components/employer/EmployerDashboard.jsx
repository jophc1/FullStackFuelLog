import React, { useContext, useReducer } from 'react'
import { reducer, initialState } from '../../reducer.js'
import { FuelLogContext, EmployerContext } from '../../context.js'
import NavBar from './NavBar'
import { Navigate } from 'react-router-dom'
import fetchMod from '../../fetch/fetch.js'
import fetchFiles from '../../fetch/fetch_files.js'

const EmployerDashboard = ({ children }) => {

  const [store, dispatch] = useReducer(reducer, initialState)
  const { newLogCreated,
          logId,
          propsObject } = store


  const { userAccess,
          authorised,
          allVehicles,
          navigate,
          } = useContext(FuelLogContext)

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

  async function editVehicle (assetID) {
    const selectedVehicle = allVehicles.find(vehicle => {return vehicle.asset_id === assetID})
    // prepare the props object to be passed into VehicleForm
    const propsObj = {
      makeInit: selectedVehicle.make,
      modelInit: selectedVehicle.model,
      yearInit: selectedVehicle.year,
      assetIdInit: selectedVehicle.asset_id,
      regoInit: selectedVehicle.registration,
      method: 'PUT',
      urlSuffix: `vehicles/${assetID}`
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
  
  function HomeReportWrapper () {
    return <>
        <h3>Employer Dashboard Home</h3>
        <DashboardTable />
        <DonutGraphVehicleUsage />
        <BarGraphTotalVehicleUsage />
        <ScatterGraphVehicleDistanceFuel />
      </>
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
    <EmployerContext.Provider value={{postUpdateVehicle, deleteVehicle, editVehicle, getEmployerTableReports, propsObject, getAllEmployees, graphData, deleteEmployee, postUpdateEmployee}}>
    {children}
    </EmployerContext.Provider>   
  </>
  :
  <Navigate to='/' />
}

export default EmployerDashboard