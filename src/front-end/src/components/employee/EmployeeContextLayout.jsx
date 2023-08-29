import React, { useContext, useReducer } from 'react'
import { EmployeeContext, FuelLogContext } from '../../context.js'
import { reducer, initialState } from '../../reducer.js'
import fetchMod from '../../fetch/fetch.js'
import { Outlet } from 'react-router-dom'

const EmployeeContextLayout = () => {

  const [store, dispatch] = useReducer(reducer, initialState)
  const { newLogCreated } = store
  const { logId } = useContext(FuelLogContext)
    // LOGS

    

    // LOG REVIEWS

    

  return <>
    <EmployeeContext.Provider value={{ newLogCreated }} >
      <Outlet />
    </EmployeeContext.Provider>
  </>
}

export default EmployeeContextLayout