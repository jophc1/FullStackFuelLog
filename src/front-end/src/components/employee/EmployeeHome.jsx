import React, { useContext } from 'react'
import Header from './Header.jsx'
import { EmployeeContext, FuelLogContext } from '../../context.js'
import SquareButton from '../styled/EmployeeButton.jsx'
import Row from '../styled/Row.jsx'
import logoutIcon from '../../assets/logout.png'
import passwordIcon from '../../assets/password-lock.png'
import logIcon from '../../assets/log-entry.png'
import EmployeeProfile from './EmployeeProfile.jsx'
import RequestDelete from './RequestDelete.jsx'
import { Navigate } from 'react-router-dom'

const EmployeeHome = ({ children }) => {

const { authorised, userLogout, userAccess, navigate } = useContext(FuelLogContext)
const { newLogCreated } = useContext(EmployeeContext)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }
  
  // IMAGES 
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
      {newLogCreated ? <RequestDelete /> : <EmployeeProfile />}
      {isLogImgReady && isPasswordImgReady && isLogoutImgReady ? <></> :  
      <Row>
        <SquareButton onClick={() => navigate('/employee/dashboard/new/log')}>
          <img src={logIcon} alt="logout icon" className='employeeButton' />
          <p>New Log Entry</p>
        </SquareButton>
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
  <Navigate to='/' />
}

export default EmployeeHome
