import React, { useContext, useReducer } from 'react'
import { EmployeeContext, FuelLogContext } from '../../context.js'
import { reducer, initialState } from '../../reducer.js'
import fetchMod from '../../fetch/fetch.js'
import { Outlet } from 'react-router-dom'

const EmployeeContextLayout = () => {

  const [store, dispatch] = useReducer(reducer, initialState)
  const { newLogCreated, logId } = store
  const { navigate } = useContext(FuelLogContext)
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

    // LOG REVIEWS

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

  return <>
    <EmployeeContext.Provider value={{postLogEntry, newLogCreated, newLogRequest}} >
      <Outlet />
    </EmployeeContext.Provider>
  </>
}

export default EmployeeContextLayout