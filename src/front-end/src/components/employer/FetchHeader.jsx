import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'

const FetchHeader = ({ children }) => {

  return <>
    <div className='searchButton'>
      <span className='fa fa-search'></span>
      {children}
    </div>
  </>
}

export default FetchHeader