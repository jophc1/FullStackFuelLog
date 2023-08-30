import React, { useContext, useReducer } from 'react'
import { reducer, initialState } from '../../reducer.js'
import { FuelLogContext, EmployerContext } from '../../context.js'
import NavBar from './NavBar'
import { Navigate } from 'react-router-dom'
import fetchMod from '../../fetch/fetch.js'
import fetchFiles from '../../fetch/fetch_files.js'

const EmployerDashboard = ({ children }) => {

  

  const [store, dispatch] = useReducer(reducer, initialState)
  const { propsObject, allLogs, paginationInfo } = store

  const { userAccess, authorised, navigate, allVehicles } = useContext(FuelLogContext)
  

  // EMPLOYEES

  async function getAllEmployees () {
    const res = await fetchMod('GET', 'employed', '')
    return res.body
  }

  async function deleteEmployee (employeeID) {
    const res = await fetchMod('DELETE', 'employed/' + employeeID, '')
    if (res.status === 500) {
      console.log("Error occured with delete employee - deleteEmployee function") // TODO: display error message is error occurs
    } else {
      return res.body
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
    if (res.status == 201 || res.status == 200) {
      navigate('/employer/dashboard/all/vehicles/') // TODO: show new vehicle details
    }
  }

    

  // LOGS

  async function getAllLogs (page, queryCase, dateTo, dateFrom, assetId) {
    let res
    let searchedVehicle
    switch (queryCase) {
      case 'vehicle':
        searchedVehicle = allVehicles.find(vehcile => vehcile.asset_id == assetId)
        res =  await fetchMod('GET', `logs?page=${page}&limit=20&vehicle_id=${searchedVehicle._id}`)
        break
      case 'vehicleDate':
        searchedVehicle = allVehicles.find(vehcile => vehcile.asset_id == assetId)
        res =  await fetchMod('GET', `logs?page=${page}&limit=20&vehicle_id=${searchedVehicle._id}&dateTo=${dateTo}&dateFrom=${dateFrom}`)
        break
      case 'date':
        res =  await fetchMod('GET', `logs?page=${page}&dateTo=${dateTo}&dateFrom=${dateFrom}`)
        break
      default:
        res = await fetchMod('GET', `logs?page=${page}&limit=20`, '')
    }

    const paginationLogs = res.body
    const LogsDateFormatted = paginationLogs.docs.map(log => log.date = new Date(log.date).toISOString().split('T')[0])
    dispatch({
      type: 'allLogs',
      allLogs: paginationLogs,
      paginationInfo : {
        currentPage: paginationLogs.page,
        totalPages: paginationLogs.totalPages,
        hasPrevPage: paginationLogs.hasPrevPage,
        hasNextPage: paginationLogs.hasNextPage,
        nextPage: paginationLogs.nextPage,
        prevPage: paginationLogs.prevPage
      }
    })
  }

  async function deleteLog (logID) {
    console.log(logID)
    const res = await fetchMod('DELETE', `logs/${logID}`, '')
    const newAllLogs = allLogs.docs.filter(log => {return log._id != logID})
    // const sortedLogRecordsByDate = newAllLogs.sort((logOne, logTwo) => new Date(logTwo.date).getTime() - new Date(logOne.date).getTime() )
    dispatch({
      type: 'allLogs',
      allLogs: {...allLogs, docs: newAllLogs},
      paginationInfo: {...paginationInfo}
    })
    // TODO: return response and render
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

  // Log reviews
  async function getAllReviews() {
    const res = await fetchMod('GET', 'logs/reviews', '')
    return res.body
  }

  async function deleteReview(reviewID) {
    const res = await fetchMod('DELETE', `logs/reviews/${reviewID}`, '')
    return res
  }


  return userAccess && authorised ? 
  <>
    <NavBar />
    <EmployerContext.Provider value={{postUpdateVehicle, getEmployerTableReports, propsObject, getAllEmployees, graphData, deleteEmployee, getAllLogs, allLogs, deleteLog, getAllReviews, deleteReview, paginationInfo}}>
    {children}
    </EmployerContext.Provider>   
  </>
  :
  <Navigate to='/' />
}

export default EmployerDashboard