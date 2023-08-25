import React, { useContext } from 'react'
import Header from './Header.jsx'
import { FuelLogContext } from '../../context.js'
import { Link } from 'react-router-dom'
import SquareButton from '../styled/EmployeeButton.jsx'
import logoutIcon from '../../assets/logout.png'

const EmployeeHome = ({ children }) => {
  const { authorised, userLogout, userAccess } = useContext(FuelLogContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }

  const logoutImg = new Image()
  logoutImg.src = logoutIcon

  let isLogoutImgReady = false
  logoutImg.onload = () => isLogoutImgReady = true

  return authorised && !userAccess ? 
  <>
    <Header />
    <div>EmployeeHome</div>
    {children}
    <Link to="/employee/dashboard/new/log"><button>New Fuel Log</button></Link>
    <button>Change Password</button>
    <button onClick={handleLogoutClick}>Logout</button>
    {isLogoutImgReady ? <></> : <SquareButton><img src={logoutIcon} alt="logout icon" className='employeeButton' /></SquareButton>}
  </>
  :
  <div>No access</div>
}

export default EmployeeHome
