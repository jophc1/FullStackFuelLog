import React, { useState, useEffect, useContext, useRef } from 'react'
import CompanyButton from '../styled/CompanyButton.jsx'
import FetchHeader from './FetchHeader.jsx'
import { EmployerContext, FuelLogContext } from '../../context.js'
import ModalFields from '../ModalField.jsx'
import ModalText from '../ModalText.jsx'
import noRequest from '../../assets/request.png'
import Card from '../styled/ProfileCard.jsx'



const EmployeeListFetch = () => {
   /* CONTEXTS */
   const { getAllEmployees, deleteEmployee } = useContext(EmployerContext)
   const { modalTextOperation, modalFieldOperation } = useContext(FuelLogContext)
  /* ====================== */
  /* STATES */
  const [allEmployees, setAllEmployees] = useState([])
  const [modalFieldProps, setModalFieldProps] = useState({})
  const [modalRender, setModalRender] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [assetId, setAssetId] = useState('')
  const employeeID = useRef('')
  const employeeName = useRef('')
  /* ====================== */
  /* EVENT HANDLER FUNCTIONS */
  const handleEditClick = event => {
    event.preventDefault()
    const targetEmployee = allEmployees.find(employee => event.target.value == employee.username_id)
    // set the form values with the targetted employee details
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
    // turn modal on
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
    // turn modal off
    setModalRender(false)
    modalTextOperation(false)
  }

  async function handleSearchSubmit (event) {
    event.preventDefault()
  }

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
    // turn modal on
    modalFieldOperation(true)
    setShowForm(true)
  }
   /* ====================== */
  useEffect(() => {
    (async () => {
      setAllEmployees(await getAllEmployees())
    })()
  }, [showForm, modalRender])

  return <>
    <h3>All Employees</h3>
    <FetchHeader>
      <CompanyButton onClick={handleAddButton} ><span className='fa fa-plus'></span> Add Employee </CompanyButton>
      <form className='search' onSubmit={handleSearchSubmit}>
          <input type="text" placeholder='Search by Employee ID' value={assetId} onChange={event => setAssetId(event.target.value)} />
          <span className='fa fa-search'></span>
      </form>
    </FetchHeader>
    {allEmployees ?
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
      :
      <Card id="request">
        <p>No employees. Add a new employee to see in this list</p>
        <img src={noRequest} alt='company logo' />
      </Card>
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