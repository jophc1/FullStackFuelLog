import React, { useState, useEffect, useContext, useRef } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import FetchHeader from './FetchHeader.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import ModalFields from '../ModalField.jsx'
import ModalText from '../ModalText.jsx'



const EmployeeListFetch = () => {
  
  const [allEmployees, setAllEmployees] = useState([])
  const [modalFieldProps, setModalFieldProps] = useState({})
  const [modalRender, setModalRender] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const { getAllEmployees, deleteEmployee } = useContext(EmployerContext)
  const { modalTextOperation, modalFieldOperation, backButton } = useContext(FuelLogContext)
  const [assetId, setAssetId] = useState('')
  const employeeID = useRef('')
  const employeeName = useRef('')


  const handleEditClick = event => {
    event.preventDefault()
    const targetEmployee = allEmployees.find(employee => event.target.value == employee.username_id)
    employeeID.current = targetEmployee.username_id
    employeeName.current = targetEmployee.name

    setModalFieldProps({
      fieldLabelOne: 'Full name (Capatilized e.g John Smith)',
      fieldLabelTwo: 'Employee ID (Number only, greater than 10000)',
      fieldLabelThree: 'Change Password (min 8 characters, optional)', 
      heading: 'Update Employee', 
      initalEmployeeId: employeeID.current, 
      initialName: employeeName.current, 
      setShowForm: setShowForm,
      method: 'PUT'
    })

    setShowForm(true)
    modalFieldOperation(true)
    
  }

  const handleDeleteIconClick = event => {
    event.preventDefault()
    employeeID.current = event.target.attributes.value.value
    // turn modal on
    setModalRender(true)
    modalTextOperation(true)
  }

  async function handleDeleteButtonClick (event) {
    event.preventDefault()
    const deleteEmployeeResponse = await deleteEmployee(event.target.value)
    console.log(deleteEmployeeResponse)
    setModalRender(false)
    modalTextOperation(false)
  }

  async function handleSearchSubmit (event) {
    event.preventDefault()
  }

  useEffect(() => {
    (async () => {
      setAllEmployees(await getAllEmployees())
    })()
  }, [showForm, modalRender])

  const handleAddButton = event => {
    event.preventDefault()
    
    setModalFieldProps({
      fieldLabelOne: 'Full name (Capatilized e.g John Smith)',
      fieldLabelTwo: 'Employee ID (Number only, greater than 10000)',
      fieldLabelThree: 'Password (min 8 characters)', 
      heading: 'Add Employee', 
      setShowForm: setShowForm,
      styleSpecial: 'special-modal'
    })

    modalFieldOperation(true)
    setShowForm(true)
  }

  return <>
    <h3>All Employees</h3>
    <FetchHeader>
      <CompanyButton onClick={handleAddButton} ><span className='fa fa-plus'></span> Add Employee </CompanyButton>
      <form className='search' onSubmit={handleSearchSubmit}>
          <input type="text" placeholder='Search by Employee ID' value={assetId} onChange={event => setAssetId(event.target.value)} />
          <span className='fa fa-search'></span>
      </form>
    </FetchHeader>
    {allEmployees &&
      <div className='allVehiclesEmployesLogs'>
        <table>
          <tbody>
            {allEmployees.map(employee => (
              <tr key={employee.username_id}>
                <th className='fixedColumn'><CompanyButton value={employee.username_id} onClick={handleEditClick}>Edit</CompanyButton></th>
                <th className='fixedColumnTwo' value={employee.username_id} onClick={handleDeleteIconClick}><span value={employee.username_id} className='fa fa-trash-alt'></span></th>
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
    {modalRender && 
        <ModalText setRenderModal={setModalRender}>
          <p>Are you sure you want to delete this Employee?</p>
          <CompanyButton onClick={handleDeleteButtonClick} value={employeeID.current}>Confirm</CompanyButton>
        </ModalText>
    }
      
    
   
    {showForm && <ModalFields {...modalFieldProps} styleSpecial='special-modal' employeeForm={true} />}
  </>
}


export default EmployeeListFetch