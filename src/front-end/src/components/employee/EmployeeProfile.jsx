import React from 'react'
import Card from '../styled/ProfileCard'
import EmployeeReport from './EmployeeReport'

const EmployeeProfile = () => {
  return (
    <Card>
      <div className='profileIcon'>JS</div>
      <h2>John Smith</h2>
      <EmployeeReport />
    </Card>
  )
}

export default EmployeeProfile