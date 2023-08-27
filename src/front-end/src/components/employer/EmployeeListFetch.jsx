import React, { useState, useEffect, useContext, useRef } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import FetchHeader from './FetchHeader.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import ModalFields from '../ModalField.jsx'
import ModalText from '../ModalField.jsx'

const EmployeeListFetch = () => {
  const [allEmployees, setAllEmployees] = useState([])
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const { getAllEmployees, editEmployee } = useContext(EmployerContext)
  const employeeID = useRef('')

  const handleEditClick = event => {
    event.preventDefault()
    editEmployee(event.target.value)
  }

  const handleDeleteIconClick = event => {
    event.preventDefault()
    employeeID.current = event.target.attributes.value.value
    // turn modal on
    modalTextOperation(true)
  }

  const handleCompanyButtonClick = event => {
    event.preventDefault()
    deleteVehicle(event.target.value)
  }

  useEffect(() => {
    (async () => {
      setAllEmployees(await getAllEmployees())
    })()
  }, [])

  return <>
    <FetchHeader buttonText={'Add Employee'} />
    {allEmployees &&
      <div className='allVehiclesEmployesLogs'>
        <table>
          <tbody>
            {allEmployees.map(employee => (
              <tr key={employee.username_id}>
                <td><CompanyButton value={employee.username_id} onClick={handleEditClick}>Edit</CompanyButton></td>
                <td value={employee.username_id} onClick={handleDeleteIconClick}><span value={employee.username_id} className='fa fa-trash-alt'></span></td>
                <td>Employee ID:</td>
                <td>{employee.username_id}</td>
                <td>Employee:</td>
                <td>{employee.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    }
    <ModalText text={'Are you sure you want to delete this Employee?'}>
      <CompanyButton onClick={handleCompanyButtonClick} value={employeeID.current}>Confirm</CompanyButton>
    </ModalText>
    {showUpdateForm && <ModalFields fieldLabelOne={'Full name'} fieldLabelTwo={'Employee ID'} heading={'Update Employee'} />}
    {showNewForm && <ModalFields numberOfInputFields={3} fieldLabelOne={'Full name'} fieldLabelTwo={'Employee ID'} fieldLabelThree={'Password (min 8 characters)'} heading={'New Employee'}  />}
  </>
}

export default EmployeeListFetch