import React, { useContext, useEffect, useReducer } from 'react'
import { reducer, initialState } from '../../reducer.js'
import { FuelLogContext, EmployerContext } from '../../context.js'
import NavBar from './NavBar'
import { Navigate } from 'react-router-dom'
import fetchMod from '../../fetch/fetch.js'
import fetchFiles from '../../fetch/fetch_files.js'

const EmployerDashboard = ({ children }) => {
  /* CONTEXTS */
  const { userAccess, authorised, navigate, allVehicles,  errorHandler } = useContext(FuelLogContext)
  /* ====================== */
  /* STATES */
  const [store, dispatch] = useReducer(reducer, initialState)
  const { propsObject, allLogs, paginationInfo } = store
  /* ====================== */
  // EMPLOYEES methods

  async function getAllEmployees () {
    const res = await fetchMod('GET', 'employed', '')
    return res.body
  }

  async function deleteEmployee (employeeID) {
    const res = await fetchMod('DELETE', 'employed/' + employeeID, '')
    if (res.status === 500) {
      errorHandler(<p>Something went wrong trying to delete employee. Try again later!</p>)
    } else {
      return res.body
    }
  }
  /* ====================== */
  // VEHICLES methods
  
  async function postUpdateVehicle ({ make, model, year, asset_id, registration, image, method, urlSuffix }) {
    // add the incoming vehicle data to FormData
    let formData = new FormData()
    formData.append('make', make)
    formData.append('model', model)
    formData.append('year', year)
    formData.append('asset_id', asset_id)
    formData.append('registration', registration) 
    formData.append('image', image)

    const res = await fetchFiles(method, urlSuffix, formData)
    // check response and return user feed back
    if (res.status == 201 || res.status == 200) {
      navigate('/employer/dashboard/all/vehicles/')
    } else {
      // Regex for error responses from the server
      if (new RegExp('(?=.*asset_id)(?=.*dup)', 'i').test(res.body.error)) {
        errorHandler(<p>Asset ID already exists.</p>)
      } else if (new RegExp('(?=.*registration)(?=.*dup)', 'i').test(res.body.error)) {
        errorHandler(<p>Registration already exists.</p>)
      } else {
        errorHandler(<p>Required fields <span className='required'>*</span>  must be filled in.</p>)
      }
    }
  }
  /* ====================== */
  // LOGS
  async function getAllLogs (page, queryCase, dateTo, dateFrom, assetId) {
    let res
    let expression = `.*${assetId}.*`
    const re = new RegExp(expression, 'i')
    let searchedVehicle
    // switch statement to select the correct query string based on user input
    // do a fetch request based on the case
    switch (queryCase) {
      case 'vehicle':
        searchedVehicle = allVehicles.find(vehcile => re.test(vehcile.asset_id))
        res =  await fetchMod('GET', `logs?page=${page}&limit=20&vehicle_id=${searchedVehicle._id}`)
        break
      case 'vehicleDate':
        searchedVehicle = allVehicles.find(vehcile => re.test(vehcile.asset_id))
        res =  await fetchMod('GET', `logs?page=${page}&limit=20&vehicle_id=${searchedVehicle._id}&dateTo=${dateTo}&dateFrom=${dateFrom}`)
        break
      default:
        res = await fetchMod('GET', `logs?page=${page}&limit=20`, '')
    }
    // grab the paginated object. The object contains the array collection of documents in the property 'docs'
    const paginationLogs = res.body
    // remove the time from ISODate
    const LogsDateFormatted = paginationLogs.docs.map(log => log.date = new Date(log.date).toISOString().split('T')[0])
    dispatch({
      type: 'allLogs',
      allLogs: paginationLogs.docs,
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
   let newAllLogs
    const res = await fetchMod('DELETE', `logs/${logID}`, '')
    if (res == 'OK') { 
      if (allLogs.length > 0) {
        // filter out the deleted log from the allLogs array
        newAllLogs = allLogs.filter(log => {return log._id != logID})
        dispatch({
          type: 'allLogs',
          allLogs: newAllLogs,
          paginationInfo: {...paginationInfo}
        })
      }
      return res
    } else {
      errorHandler(<p>Something went wrong trying to delete log. Try again later!</p>)
    }
  }
  /* ====================== */
  // REPORTS
  async function getEmployerTableReports(fromDateArray, toDateArray) {
    const res = await fetchMod('GET', `reports/${fromDateArray[0]}/${fromDateArray[1]}/${fromDateArray[2]}/to/${toDateArray[0]}/${toDateArray[1]}/${toDateArray[2]}`, '')
    if (res.status === 200) {
      return res.body
    }
  }
  /* ====================== */
  // Employer Dashboard Graphs
  async function graphData(path, graphType) {
    const res = await fetchMod('GET', path, '')
    
    if (res.status === 200) {
      return res.body
    }
  }
  /* ====================== */
  // LOG REVIEWS
  async function getAllReviews() {
    const res = await fetchMod('GET', 'logs/reviews', '')
    return res.body
  }

  async function deleteReview(reviewID) {
    const res = await fetchMod('DELETE', `logs/reviews/${reviewID}`, '')

    if (res == 'OK') {
      return res
    }
    else {
      errorHandler(<p>Something went wrong trying to delete log review request. Try again later!</p>)
    }
  }

  return userAccess && authorised ? 
  <>
    <NavBar />
    <EmployerContext.Provider value={{postUpdateVehicle, getEmployerTableReports, propsObject, getAllEmployees, graphData, deleteEmployee, getAllLogs, allLogs, deleteLog, getAllReviews, deleteReview, paginationInfo}}>
    <div className='dashboardContent'>
      {children}
    </div>
    </EmployerContext.Provider>   
  </>
  :
  <Navigate to='/' />
}

export default EmployerDashboard