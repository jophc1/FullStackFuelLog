import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import ModalText from '../ModalText.jsx'

const ReviewsFetchList = () => {
  
  
  const { deleteLog, getAllReviews, deleteReview } = useContext(EmployerContext)
  const { modalTextOperation } = useContext(FuelLogContext)
  const [renderModal, setRenderModal] = useState(false)
  const [modalDeleteRender, setModalDeleteRender] = useState(false)
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState([])
  const selectedLog = useRef({})
  const selectedReview = useRef({})

  const handleReviewClick = event => {
    event.preventDefault()
    const reviewId = event.target.parentNode.attributes.value.value
    selectedReview.current = reviews.find(review => reviewId === review._id)
    console.log(selectedReview.current)

    modalTextOperation(true)
    setRenderModal(true)
  }

  async function handleDeleteButtonClick (event) {
    event.preventDefault()
    const deletionLogResponse = await deleteLog(selectedReview.current.log_id._id)

    if (deletionLogResponse.status === 500) {
      console.log('error: didnt delete log, review cannot be deleted') // TODO: error message if log didn't delete
      return {}
    }

    const deletionReviewResponse = await deleteReview(selectedReview.current._id) 

    if (deletionReviewResponse.status === 500){
      console.log('error: Log was deleted but didnt delete Review') // TODO: error message if review didn't delete
      return {} // TODO maybe return an error message object if error occurs
    }
    


  }

  useEffect(() => {
    (async () => {
      const allReviews = await getAllReviews()
      console.log(allReviews)
      setReviews(allReviews)
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
                <td>Vehicle ID:</td>
                <td>{review.log_id.vehicle_id.asset_id}</td>
                <td>Employee ID:</td>
                <td>{review.employee_id.username_id}</td>
                <td>Date:</td>
                <td>{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderModal &&
      <ModalText setRenderModal={setRenderModal}>
            <h5>Log Deletion Request Details</h5>
            <table>
              <tbody>
                <tr>
                  <td>Employee ID:</td>
                  <td>{selectedReview.current.employee_id.username_id}</td>
                </tr>
                <tr>
                  <td>Date Added:</td>
                  <td>{selectedReview.current.date}</td>
                </tr>
                <tr>
                  <td>Vehicle ID:</td>
                  <td>{selectedReview.current.log_id.vehicle_id.asset_id}</td>
                </tr>
                <tr>
                  <td>Current ODO:</td>
                  <td>{selectedReview.current.log_id.current_odo}</td>
                </tr>
                <tr>
                  <td>Fuel Added:</td>
                  <td>{selectedReview.current.log_id.fuel_added}</td>
                </tr>
              </tbody>
            </table>
            <CompanyButton onClick={handleDeleteButtonClick} >Delete Log</CompanyButton>
      </ModalText>
      }
    </>
  )
}

export default ReviewsFetchList