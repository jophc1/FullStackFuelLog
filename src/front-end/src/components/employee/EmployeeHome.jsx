import React, { useContext, useState } from 'react'
import Header from './Header.jsx'
import { FuelLogContext } from '../../context.js'
import SquareButton from '../styled/EmployeeButton.jsx'
import Row from '../styled/Row.jsx'
import logoutIcon from '../../assets/logout.png'
import passwordIcon from '../../assets/password-lock.png'
import logIcon from '../../assets/log-entry.png'
import EmployeeProfile from './EmployeeProfile.jsx'
import RequestDelete from './RequestDelete.jsx'
import { Navigate } from 'react-router-dom'
import ModalFields from '../ModalField.jsx'

const EmployeeHome = ({ children }) => {

const { authorised, userLogout, userAccess, navigate, newLogCreated, userId, modalFieldOperation, userName } = useContext(FuelLogContext)
const [modalFieldProps, setModalFieldProps] = useState({})
const [showForm, setShowForm] = useState(false)

  const handleLogoutClick = event => {
    event.preventDefault()
    userLogout()
  }

  const handlePasswordReset = event => {
    event.preventDefault()
    setModalFieldProps({
      fieldLabelThree: 'Change Password (min 8 characters, optional)', 
      heading: <><span>Reset Password </span><span className='required'>*</span></>, 
      setShowForm: setShowForm,
      initalEmployeeId: userId,
      initialName: userName,
      method: 'PUT'
    })
    setShowForm(true)
    modalFieldOperation(true)
  }

  const handleLogButtonClick = event => {
    event.preventDefault()
    navigate('/employee/dashboard/new/log/all')
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
      <Row className='employeeDashButtons'>
        <SquareButton onClick={handleLogButtonClick}>
          <img src={logIcon} alt="logout icon" className='employeeButton' />
          <p>New Log Entry</p>
        </SquareButton>
        <SquareButton onClick={handlePasswordReset}>
            <img src={passwordIcon} alt="logout icon" className='employeeButton' />
            <p>Reset Password</p>
        </SquareButton>
        <SquareButton onClick={handleLogoutClick}>
          <img src={logoutIcon} alt="logout icon" className='employeeButton' />
          <p>Logout</p>
        </SquareButton>
      </Row>
      }
      {showForm && <ModalFields {...modalFieldProps} />}
  </>
  :
  <Navigate to='/' />
}

export default EmployeeHome
