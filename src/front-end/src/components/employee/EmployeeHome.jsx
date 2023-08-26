import React, { useContext } from 'react'
import Header from './Header.jsx'
import { EmployeeContext, FuelLogContext } from '../../context.js'
import { Link } from 'react-router-dom'
import SquareButton from '../styled/EmployeeButton.jsx'
import Row from '../styled/Row.jsx'
import logoutIcon from '../../assets/logout.png'
import passwordIcon from '../../assets/password-lock.png'
import logIcon from '../../assets/log-entry.png'
import EmployeeProfile from './EmployeeProfile.jsx'
import RequestDelete from './RequestDelete.jsx'

const EmployeeHome = ({ children }) => {
  const { authorised, userLogout, userAccess } = useContext(FuelLogContext)
  const  { newLogCreated } = useContext(EmployeeContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }
  
  const logoutImg = new Image()
  const passIcon = new Image()
  const logImg = new Image()
  logoutImg.src = logoutIcon
  passIcon.src = passwordIcon
  logImg.src = logIcon

  let isLogoutImgReady, isPasswordImgReady, isLogImgReady = false
  logoutImg.onload = () => isLogoutImgReady = true
  passIcon.onload = () => isPasswordImgReady = true
  logImg.onload = () => isLogImgReady = true

  return authorised && !userAccess ? 
  <>
    <Header />
    {/* {children} */}
    {newLogCreated ? <RequestDelete /> : <EmployeeProfile />}
    
    {isLogImgReady && isPasswordImgReady && isLogoutImgReady ? <></> :  
    <Row>
       <Link to="/employee/dashboard/new/log">
          <SquareButton>
            <img src={logIcon} alt="logout icon" className='employeeButton' />
            <p>New Log Entry</p>
          </SquareButton>
       </Link>
       <SquareButton>
          <img src={passwordIcon} alt="logout icon" className='employeeButton' />
          <p>Reset Password</p>
       </SquareButton>
       <SquareButton onClick={handleLogoutClick}>
          <img src={logoutIcon} alt="logout icon" className='employeeButton' />
          <p>Logout</p>
       </SquareButton>
    </Row>
   }
  </>
  :
  <div>No access</div>
}

export default EmployeeHome
