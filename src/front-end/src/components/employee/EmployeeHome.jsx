import React, { useContext } from 'react'
import {FuelLogContext} from '../../context.js'
import CompanyButton from '../styled/CompanyButton'
import { Link } from 'react-router-dom'

const EmployeeHome = ({ children }) => {
  const { authorised, userLogout, userAccess } = useContext(FuelLogContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }

  return authorised && !userAccess ? 
  <>
    <div>EmployeeHome</div>
    {children}
    <Link to="/employee/dashboard/new/log"><button>New Fuel Log</button></Link>
    <button>Change Password</button>
    <button onClick={handleLogoutClick}>Logout</button>
  </>
  :
  <div>No access</div>
}

export default EmployeeHome
