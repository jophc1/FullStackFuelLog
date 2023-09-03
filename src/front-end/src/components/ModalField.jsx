import React, { useContext, useState } from 'react'
import { FuelLogContext } from '../context.js'
import CompanyButton from './styled/CompanyButton'
import ModalText from './ModalText.jsx'

const ModalFields = ({ fieldLabelOne, fieldLabelTwo, fieldLabelThree, heading, initialName = '', initalEmployeeId = '', setShowForm, style='', styleSpecial = '', method='POST', path='employed', employeeForm = false}) => {
  /* CONTEXTS */ 
  const { showModalField, modalFieldOperation, postUpdateEmployee, errorMessage, modalErrorRender, setModalErrorRender } = useContext(FuelLogContext)
  /* ====================== */
  /* MODAL CLASS */
  const changeModalClass = showModalField ? `modal show ${style}` : "modal hide"
  /* ====================== */
  /* STATES */
  const [name, setName] = useState(initialName)
  const [employeeId, setEmployeeId] = useState(initalEmployeeId)
  const [password, setPassword] = useState('')
  /* ====================== */
  /* EVENT HANDLER FUNCTIONS */
  const handleNewSubmit = async event => {
    event.preventDefault()
    let res
    let updatedEmployeeDetails
    // check if the method is a POST or PUT and pass data to
    // postUpdateEmployee function
    if (employeeForm) {
      updatedEmployeeDetails = {
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
    // set the states for the error or field modals
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
   /* ====================== */
  
  return  <>
      <div className={changeModalClass} >
        <div className={`${styleSpecial} modal-content`}>
            <span className='fa fa-times'  onClick={handleCloseModalClick}></span>
            <h5>{heading}</h5>
          <div>
            <form onSubmit={handleNewSubmit}>
              { employeeForm ? 
              <>
                <div>
                  <label>{fieldLabelOne} <span className='required'>*</span></label>
                  <input type="text" value={name} onChange={event => setName(event.target.value)} />
                </div>
                <div>
                  <label>{fieldLabelTwo} <span className='required'>*</span></label>
                  <input type="text" value={employeeId} onChange={event => setEmployeeId(event.target.value)} />
                </div>
                <div>
                  <label>{fieldLabelThree} <span className='required'>*</span></label>
                  <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
                </div>
              </>
              :
              <div>
                <label>{fieldLabelThree} <span className='required'>*</span></label>
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
              </div>
              }
              <CompanyButton>Submit</CompanyButton>
            </form>
          </div>
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