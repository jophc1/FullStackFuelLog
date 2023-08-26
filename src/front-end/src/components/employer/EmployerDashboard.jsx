import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import NavBar from './NavBar'
import DashboardTable from './DashboardTable.jsx'

const EmployerDashboard = () => {
  const { userAccess, authorised } = useContext(FuelLogContext)

  return userAccess && authorised ? 
  <>
    <NavBar />
    <h3>Employer Dashboard Home</h3>
    <DashboardTable />
  </>
  :
  <div>No access</div>
}

export default EmployerDashboard