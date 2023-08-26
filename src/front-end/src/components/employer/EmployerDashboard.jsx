import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import NavBar from './NavBar'
import { Navigate } from 'react-router-dom'

const EmployerDashboard = ({ children }) => {
  const { userAccess, authorised } = useContext(FuelLogContext)

  return userAccess && authorised ? 
  <>
    <NavBar />   
    {children}
  </>
  :
  <Navigate to='/' />
}

export default EmployerDashboard