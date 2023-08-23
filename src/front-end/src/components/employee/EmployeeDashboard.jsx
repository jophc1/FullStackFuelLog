import React from 'react'

const EmployeeDashboard = () => {
  return authorised ? 
  <>
    <div>EmployeeDashboard</div>
  </>
  :
  <div>No access</div>
}

export default EmployeeDashboard
