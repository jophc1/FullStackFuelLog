import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import NavBar from './NavBar'

const EmployerDashboard = ({ children }) => {
  const { userAccess, authorised } = useContext(FuelLogContext)

  return userAccess && authorised ? 
  <>
    <NavBar />
    <h3>Employer Dashboard Home</h3>
    {children}
  </>
  :
  <div>No access</div>
}

export default EmployerDashboard