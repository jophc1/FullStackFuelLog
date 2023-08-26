import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import NavBar from './NavBar'
import VehicleForm from './VehicleForm.jsx'

const EmployerDashboard = () => {
  const { userAccess, authorised } = useContext(FuelLogContext)

  return userAccess && authorised ? 
  <>
    <NavBar />
    <div>EmployerDashboard</div>
  </>
  :
  <div>No access</div>
}

export default EmployerDashboard