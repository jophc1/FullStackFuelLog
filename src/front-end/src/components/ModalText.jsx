import React, { useContext } from 'react'
import { FuelLogContext } from '../../context.js'

const PopUpModalText = ({ text, children }) => {

  // SEE: children of this component is a button Component

  const { showModalText } = useContext(FuelLogContext)
  const changeModalClass = showModalText ? "modal display-block" : "modal display-none"

  const handleCloseModalClick = event => {
    event.preventDefault()

  }

  return <>
    <div className={changeModalClass} onClick={handleCloseModalClick}>
      <div className='modal-content'>
        <span className='fa fa-times'  onClick={handleCloseModalClick}></span>
        <p>{text}</p>
        {children}
      </div>
    </div>
  </>
}

export default PopUpModalText