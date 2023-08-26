import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton'

const SearchButton = ({ buttonText }) => {
  const { backButton } = useContext(FuelLogContext)

  const handleAddNewVehicle = event => {
    event.preventDefault()
    backButton('/employer/dashboard/vehicle/new')
  }

  return <>
    <div className='searchButton'>
      <span className='fa fa-search'></span>
      <CompanyButton onClick={handleAddNewVehicle} ><span className='fa fa-plus'></span> {buttonText}</CompanyButton>
    </div>
  </>
}

export default SearchButton