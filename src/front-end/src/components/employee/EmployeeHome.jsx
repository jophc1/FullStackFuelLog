import React, { useContext } from 'react'
import FuelLogContext from '../../context.js'
import Header from './Header.jsx'

const EmployeeHome = ({ children }) => {
  const { authorised, userLogout, userAccess } = useContext(FuelLogContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }

  return authorised && !userAccess ? 
  <>
    <Header />
    <div>EmployeeHome</div>
    {children}
    <button>New Fuel Log</button>
    <button>Change Password</button>
    <button onClick={handleLogoutClick}>Logout</button>
  </>
  :
  <div>No access</div>
}

export default EmployeeHome
