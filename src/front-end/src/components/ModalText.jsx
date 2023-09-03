import React, { useContext } from 'react'
import { FuelLogContext } from '../context.js'

const ModalText = ({setRenderModal, style = '', children, styleSpecial = '' }) => {
   /* CONTEXTS */
  const { showModalText, modalTextOperation } = useContext(FuelLogContext)
  /* ====================== */
  /* MODAL CLASS */
  const changeModalClass = showModalText ? `modal show ${style}` : "modal hide"
  /* ====================== */
  /* EVENT HANDLER FUNCTIONS */
  const handleCloseModalClick = event => {
    event.preventDefault()
    // set the modal states
    setRenderModal(false)
    modalTextOperation(false)
  }
  /* ====================== */

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