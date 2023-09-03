import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import Card from '../styled/ProfileCard'
import EmployeeReport from './EmployeeReport'

const EmployeeProfile = () => {
  /* CONTEXTS */
  const { userName } = useContext(FuelLogContext)
  /* ====================== */
  // Setting the user profile initials
  const firstUserInitial = userName.substring(0,1)
  const secondUserInital = userName.substring(userName.indexOf(' ') + 1, userName.indexOf(' ') + 2)
  return (
    <Card className='employeeProfile'>
      <div>
        <div className='profileIcon'>{firstUserInitial + secondUserInital}</div>
        <h2>{userName}</h2>
      </div>
        <EmployeeReport />
    </Card>
  )
}

export default EmployeeProfile