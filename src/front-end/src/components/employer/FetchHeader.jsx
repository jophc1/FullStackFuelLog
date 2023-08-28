import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'

const FetchHeader = ({ buttonText, headerTitle, navPath = '', setShowForm }) => {
  const { backButton, modalFieldOperation } = useContext(FuelLogContext)

  const handleAddButton = event => {
    event.preventDefault()
    navPath ? backButton(navPath) : modalFieldOperation(true)
    if (navPath) {
      backButton(navPath)
    } else {
      modalFieldOperation(true)
      setShowForm(true)
    }
  }

  return <>
    <div className='searchButton'>
      <span className='fa fa-search'></span>
      <CompanyButton onClick={handleAddButton} ><span className='fa fa-plus'></span> {buttonText}</CompanyButton>
    </div>
  </>
}

export default FetchHeader