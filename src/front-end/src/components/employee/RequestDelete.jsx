import React from 'react'
import Card from '../styled/ProfileCard'
import CompanyButton from '../styled/CompanyButton'

const RequestDelete = () => {
  return <>
    <Card>
      <h4>Log entry added successfully!</h4>
      <p>If you made an error in the entry, you can request a delete:</p>
      <CompanyButton>Request delete</CompanyButton>
    </Card>
  </>
}

export default RequestDelete