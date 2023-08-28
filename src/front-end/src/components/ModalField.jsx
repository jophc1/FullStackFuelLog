import React, { useContext, useState } from 'react'
import { FuelLogContext } from '../context.js'
import CompanyButton from './styled/CompanyButton'

const ModalFields = ({ numberOfInputFields = 2, fieldLabelOne, fieldLabelTwo, fieldLabelThree, heading, style }) => {
  
  const { showModalField, modalFieldOperation } = useContext(FuelLogContext)
  const changeModalClass = showModalField ? `modal show ${style}` : "modal hide"
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')

  const handleCloseModalClick = event => {
    event.preventDefault()
    modalFieldOperation(false)
  }

  const handleUpdateSubmit = event => {
    event.preventDefault()
  }

  const handleNewSubmit = event => {
    event.preventDefault()

  }
  
  return numberOfInputFields == 2 ? <>
      <div className={changeModalClass} onClick={handleCloseModalClick}>
        <div className='modal-content'>
          <span className='fa fa-times'  onClick={handleCloseModalClick}></span>
          {heading}
          <form onSubmit={handleUpdateSubmit}>
            <label>{fieldLabelOne}</label>
            <input type="text" value={name} onChange={event => setName(event.target.value)} />
            <label>{fieldLabelTwo}</label>
            <input type="text" value={employeeId} onChange={event => setEmployeeId(event.target.value)} />
            <CompanyButton>Update</CompanyButton>
          </form>
        </div>
      </div>
    </>
    :
    <>
      <div className={changeModalClass} onClick={handleCloseModalClick}>
        <div className='modal-content'>
          <span className='fa fa-times'  onClick={handleCloseModalClick}></span>
          {heading}
          <form onSubmit={handleNewSubmit}>
            <label>{fieldLabelOne}</label>
            <input type="text" value={name} onChange={event => setName(event.target.value)} />
            <label>{fieldLabelTwo}</label>
            <input type="text" value={employeeId} onChange={event => setEmployeeId(event.target.value)} />
            <label>{fieldLabelThree}</label>
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
            <CompanyButton>Submit</CompanyButton>
          </form>
        </div>
      </div>
    </>
}

export default ModalFields