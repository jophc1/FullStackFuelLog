import React, { useContext } from 'react'
import Card from '../styled/ProfileCard'
import CompanyButton from '../styled/CompanyButton'
import { EmployeeContext } from '../../context'

const RequestDelete = () => {
  const { handleLogReqestCancel, handleNewLogRequest } = useContext(EmployeeContext)

  return <>
    <Card>
      <h4>Log entry added successfully!</h4>
      <p>If you made an error in the entry, you can request a delete:</p>
      <CompanyButton onClick={handleNewLogRequest}>Request delete</CompanyButton>
      <CompanyButton onClick={handleLogReqestCancel}>Cancel</CompanyButton>
    </Card>
  </>
}

export default RequestDelete