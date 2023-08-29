import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import ModalText from '../ModalText.jsx'

const ReviewsFetchList = () => {
  
  
  const { getAllLogs, allLogs, deleteLog, getAllReviews, getAllEmployees } = useContext(EmployerContext)
  const { modalTextOperation } = useContext(FuelLogContext)
  const [renderModal, setRenderModal] = useState(false)
  const [modalDeleteRender, setModalDeleteRender] = useState(false)
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState([])
  const [employees, setEmployees] = useState([])
  const selectedLog = useRef({})
  const logID = useRef('')

  const handleReviewClick = event => {
    event.preventDefault()
    console.log(event.target.parentNode.attributes.value.value)
    

    modalTextOperation(true)
    setRenderModal(true)
  }

  useEffect(() => {
    (async () => {
      const allReviews = await getAllReviews()
      const allEmployees = await getAllEmployees()
      setReviews(allReviews)
      setEmployees(allEmployees)
    })()
    
  }, [])
  
  
  return (
    reviews &&
    <>
      <h3>Log delete requests</h3>
      <div className='allVehiclesEmployesLogs'>
        <table>
          <tbody>
            {reviews.map( review => (
              <tr key={review._id} onClick={handleReviewClick} value={review._id}>
                <td>Log ID:</td>
                <td>11111</td>
                <td>Employee ID:</td>
                <td>11111</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {renderModal &&
      <ModalText setRenderModal={setRenderModal}>
            <h5>Log Deletion Request Details</h5>
            <table>
              <tbody>
                <tr>
                  <td>Log ID:</td>
                  <td>{logID.current}</td>
                </tr>
                <tr>
                  <td>Date Added:</td>
                  <td>{new Date(selectedLog.current.date).toISOString().split('T')[0]}</td>
                </tr>
                <tr>
                  <td>Current ODO:</td>
                  <td>{selectedLog.current.current_odo}</td>
                </tr>
                <tr>
                  <td>Fuel Added:</td>
                  <td>{selectedLog.current.fuel_added}</td>
                </tr>
              </tbody>
            </table>
      </ModalText>
      } */}
    </>
  )
}

export default ReviewsFetchList