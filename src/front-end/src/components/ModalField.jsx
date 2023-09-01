import React, { useContext, useEffect, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../context.js'
import CompanyButton from './styled/CompanyButton'
import ModalText from './ModalText.jsx'

const ModalFields = ({ fieldLabelOne, fieldLabelTwo, fieldLabelThree, heading, initialName = '', initalEmployeeId = '', setShowForm, style='', method='POST', path='employed', employeeForm = false}) => {
  
  const { showModalField, modalFieldOperation, postUpdateEmployee, errorMessage, modalErrorRender, setModalErrorRender } = useContext(FuelLogContext)
  // const { postUpdateEmployee } = useContext(EmployerContext)
  const changeModalClass = showModalField ? `modal show ${style}` : "modal hide"

  const [name, setName] = useState(initialName)
  const [employeeId, setEmployeeId] = useState(initalEmployeeId)
  const [password, setPassword] = useState('')

  const handleNewSubmit = async event => {
    event.preventDefault()
    let res
    let updatedEmployeeDetails
    if (employeeForm) {
      updatedEmployeeDetails = {
        name,
        username_id: employeeId,
        password: password.toString(),
        name: name
      }
      res = await postUpdateEmployee(updatedEmployeeDetails, initalEmployeeId, method, path)
    } else {
        updatedEmployeeDetails = {
          password: password.toString(),
          username_id: initalEmployeeId,
          name: initialName
        }
      res = await postUpdateEmployee(updatedEmployeeDetails, initalEmployeeId, method, path)
    }
    if (res.status != 500) {
      setShowForm(false)
      modalFieldOperation(false)
    } else {
      setModalErrorRender(true)
    }
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
          <h5>{heading}</h5>
          <form onSubmit={handleNewSubmit}>
            { employeeForm && 
            <>
              <label>{fieldLabelOne} <span className='required'>*</span></label>
              <input type="text" value={name} onChange={event => setName(event.target.value)} />
              <label>{fieldLabelTwo} <span className='required'>*</span></label>
              <input type="text" value={employeeId} onChange={event => setEmployeeId(event.target.value)} />
              <label>{fieldLabelThree} <span className='required'>*</span></label>
            </>
            }
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
            <CompanyButton>Submit</CompanyButton>
          </form>
        </div>
      </div>
      { modalErrorRender &&
      <ModalText setRenderModal={setModalErrorRender} style={'error'}>
          <div>
            { errorMessage }
          </div>
      </ModalText>
      }
    </>
}

export default ModalFields