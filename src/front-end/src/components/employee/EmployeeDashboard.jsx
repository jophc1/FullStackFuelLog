import React, { useContext } from 'react'
import FuelLogContext from '../../context.js'
import EmployeeProfile from './EmployeeProfile'
import fetchMod from '../../fetch/fetch.js'
import { useNavigate } from 'react-router-dom'

const EmployeeDashboard = () => {
  const { authorised } = useContext(FuelLogContext)
  const navigate = useNavigate()

  // TODO: move navigate to App.jsx
  const handleClick = event => {
    event.preventDefault()
    fetchMod('GET', 'auth/logout', '')
      .then(res => {
        res === 'OK' ? navigate('/') : console.log('logout failed')
      })
  }

  return authorised ? 
  <>
    <div>EmployeeDashboard</div>
    <EmployeeProfile />
    <button onClick={handleClick}>Logout</button>
  </>
  :
  <div>No access</div>
}

export default EmployeeDashboard
