import React, { useContext } from 'react'
import { FuelLogContext } from '../context.js'

const ModalText = ({setRenderModal, style = '', children, styleSpecial = '' }) => {

  const { showModalText, modalTextOperation } = useContext(FuelLogContext)
  const changeModalClass = showModalText ? `modal show ${style}` : "modal hide"

  const handleCloseModalClick = event => {
    event.preventDefault()
    setRenderModal(false)
    modalTextOperation(false)
  }
// commented out onClick={handleCloseModalClick} on top div
  return <>
    <div className={changeModalClass}> 
      <div className={`${styleSpecial} modal-content`}>
        <span className='fa fa-times'  onClick={handleCloseModalClick}></span>
        {children}
      </div>
    </div>
  </>
}

export default ModalText