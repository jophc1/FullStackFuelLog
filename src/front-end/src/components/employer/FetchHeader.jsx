import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'

const FetchHeader = ({ buttonText, headerTitle }) => {
  const { backButton } = useContext(FuelLogContext)

  const handleAddButton = event => {
    event.preventDefault()
    backButton('/employer/dashboard/vehicle/new')
  }

  return <>
    <div className='searchButton'>
      <span className='fa fa-search'></span>
      <CompanyButton onClick={handleAddButton} ><span className='fa fa-plus'></span> {buttonText}</CompanyButton>
    </div>
  </>
}

export default FetchHeader