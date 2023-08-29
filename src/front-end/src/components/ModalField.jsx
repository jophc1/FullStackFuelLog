import React, { useContext, useEffect, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../context.js'
import CompanyButton from './styled/CompanyButton'

const ModalFields = ({ fieldLabelOne, fieldLabelTwo, fieldLabelThree, heading, initialName = '', initalEmployeeId = '', setShowForm, style='', method='POST', path='employed', employeeForm = false}) => {
  
  const { showModalField, modalFieldOperation, navigate } = useContext(FuelLogContext)
  const { postUpdateEmployee } = useContext(EmployerContext)
  const changeModalClass = showModalField ? `modal show ${style}` : "modal hide"

  const [name, setName] = useState(initialName)
  const [employeeId, setEmployeeId] = useState(initalEmployeeId)
  const [password, setPassword] = useState('')

  const handleNewSubmit = async event => {
    event.preventDefault()

    let updatedEmployeeDetails
    if (employeeForm) {
      updatedEmployeeDetails = {
        password: password.toString()
      }
      await postUpdateEmployee(updatedEmployeeDetails, initalEmployeeId, method, path)
    } else {
        updatedEmployeeDetails = {
          name,
          username_id: employeeId,
          password: password.toString()
        }
        await postUpdateEmployee(updatedEmployeeDetails, initalEmployeeId, method, path)
    }
    setShowForm(false)
    modalFieldOperation(false)
  }

  const handleCloseModalClick = event => {
    event.preventDefault()
    setShowForm(false)
    modalFieldOperation(false)
  }
  
  return  <>
      <div className={changeModalClass} >
        <div className='modal-content'>
          <span className='fa fa-times'  onClick={handleCloseModalClick}></span>
          {heading}
          <form onSubmit={handleNewSubmit}>
            { employeeForm && 
            <>
              <label>{fieldLabelOne}</label>
              <input type="text" value={name} onChange={event => setName(event.target.value)} />
              <label>{fieldLabelTwo}</label>
              <input type="text" value={employeeId} onChange={event => setEmployeeId(event.target.value)} />
              <label>{fieldLabelThree}</label>
            </>
            }
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
            <CompanyButton>Submit</CompanyButton>
          </form>
        </div>
      </div>
    </>
}

export default ModalFields