import React, { useContext } from 'react'
import FuelLogContext from '../../context.js'
import EmployeeProfile from './EmployeeProfile'

const EmployeeDashboard = () => {
  const { authorised } = useContext(FuelLogContext)
  return authorised ? 
  <>
    <div>EmployeeDashboard</div>
    <EmployeeProfile />
  </>
  :
  <div>No access</div>
}

export default EmployeeDashboard
