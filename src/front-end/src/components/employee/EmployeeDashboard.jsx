import React, { useContext } from 'react'
import FuelLogContext from '../../context.js'

const EmployeeDashboard = () => {
  const { authorised } = useContext(FuelLogContext)
  return authorised ? 
  <>
    <div>EmployeeDashboard</div>
  </>
  :
  <div>No access</div>
}

export default EmployeeDashboard
