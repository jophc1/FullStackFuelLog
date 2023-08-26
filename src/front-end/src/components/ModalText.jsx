import React, { useContext } from 'react'
import { FuelLogContext } from '../context.js'

const ModalText = ({ text, children }) => {

  const { showModalText, modalTextOperation } = useContext(FuelLogContext)
  const changeModalClass = showModalText ? "modal show" : "modal hide"

  const handleCloseModalClick = event => {
    event.preventDefault()
    modalTextOperation(false)
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

export default ModalText