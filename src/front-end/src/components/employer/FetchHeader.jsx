import React from 'react'

const FetchHeader = ({ children }) => {

  return <>
    <div className='searchButton'>
      {children}
    </div>
  </>
}

export default FetchHeader