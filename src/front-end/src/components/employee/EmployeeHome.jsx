import React, { useContext } from 'react'
import FuelLogContext from '../../context.js'
import EmployeeProfile from './EmployeeProfile.jsx'

const EmployeeHome = () => {
  const { authorised, userLogout, userAccess } = useContext(FuelLogContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }

  return authorised && !userAccess ? 
  <>
    <div>EmployeeHome</div>
    <EmployeeProfile />
    <button>New Fuel Log</button>
    <button>Change Password</button>
    <button onClick={handleLogoutClick}>Logout</button>
  </>
  :
  <div>No access</div>
}

export default EmployeeHome
