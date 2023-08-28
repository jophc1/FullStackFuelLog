import React, { useState, useEffect, useContext, useRef } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import FetchHeader from './FetchHeader.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import ModalFields from '../ModalField.jsx'
import ModalText from '../ModalText.jsx'

const EmployeeListFetch = () => {
  const [allEmployees, setAllEmployees] = useState([])

  const [showForm, setShowForm] = useState(false)
  const { getAllEmployees, deleteEmployee } = useContext(EmployerContext)
  const { modalTextOperation, editEmployee, modalFieldOperation } = useContext(FuelLogContext)
  const employeeID = useRef('')
  const employeeName = useRef('')


  const handleEditClick = event => {
    event.preventDefault()
    const targetEmployee = allEmployees.find(employee => event.target.value == employee.username_id)
    employeeID.current = targetEmployee.username_id
    employeeName.current = targetEmployee.name
    setShowForm(true)
    modalFieldOperation(true)
    
  }

  const handleDeleteIconClick = event => {
    event.preventDefault()
    employeeID.current = event.target.attributes.value.value
    // turn modal on
    console.log(event)
    modalTextOperation(true)
  }

  const handleCompanyButtonClick = event => {
    event.preventDefault()
    deleteEmployee(event.target.value)
  }

  useEffect(() => {
    (async () => {
      setAllEmployees(await getAllEmployees())
    })()
  }, [])

  const modelFieldProps = {
    fieldLabelOne: 'Full name',
    fieldLabelTwo: 'Employee ID',
    fieldLabelThree: 'Password (min 8 characters)', 
    heading: 'Update Employee', 
    initalEmployeeId: employeeID.current, 
    initialName: employeeName.current, 
    setShowForm: setShowForm
  } 

  return <>
    <FetchHeader buttonText={'Add Employee'} setShowForm={setShowForm} />
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
    {showForm && <ModalFields {...modelFieldProps} />}
  </>
}


export default EmployeeListFetch