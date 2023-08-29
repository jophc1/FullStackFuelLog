import React, { useContext } from 'react'
import Card from '../styled/ProfileCard'
import CompanyButton from '../styled/CompanyButton'
import { EmployeeContext, FuelLogContext } from '../../context'

const RequestDelete = () => {
  const { newLogRequest } = useContext(FuelLogContext)

  function handleNewLogRequest (event) {
    event.preventDefault()
    newLogRequest(event)
  }

  return <>
    <Card>
      <h4>Log entry added successfully!</h4>
      <p>If you made an error in the entry, you can request a delete:</p>
      <CompanyButton onClick={handleNewLogRequest} value='submit'>Request delete</CompanyButton>
      <CompanyButton onClick={handleNewLogRequest} value='cancel'>Cancel</CompanyButton>
    </Card>
  </>
}

export default RequestDelete