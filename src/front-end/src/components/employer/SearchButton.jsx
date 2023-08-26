import React from 'react'
import CompanyButton from '../styled/CompanyButton'

const SearchButton = ({ buttonText }) => {
  return <>
    <div className='searchButton'>
      <span className='fa fa-search'></span>
      <CompanyButton><span className='fa fa-plus'></span> {buttonText}</CompanyButton>
    </div>
  </>
}

export default SearchButton