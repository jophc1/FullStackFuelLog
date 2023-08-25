import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'

const EmployerDashboard = () => {
  const { userAccess, authorised } = useContext(FuelLogContext)
  
  return userAccess && authorised ? 
  <>
    <div>EmployerDashboard</div>
  </>
  :
  <div>No access</div>
}

export default EmployerDashboard