import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import ModalText from '../ModalText.jsx'
import noRequest from '../../assets/request.png'
import Card from '../styled/ProfileCard.jsx'

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
  const [ reRender, setReRender ] = useState(false)

  const handleReviewClick = event => {
    event.preventDefault()
    const reviewId = event.target.parentNode.attributes.value.value
    selectedReview.current = reviews.find(review => reviewId === review._id)
    modalTextOperation(true)
    setRenderModal(true)
  }

  async function handleDeleteButtonClick (event) {
    event.preventDefault()
    if (selectedReview.current.log_id && event.target.name === 'delete') {
      const deletionLogResponse = await deleteLog(selectedReview.current.log_id._id)

      if (deletionLogResponse === 'OK') {
        console.log('error: didnt delete log, review cannot be deleted') // TODO: error message if log didn't delete
        return {}
      }
    }
    
    const deletionReviewResponse = await deleteReview(selectedReview.current._id) 

    if (deletionReviewResponse === 'OK'){
      console.log('error: Log was deleted but didnt delete Review') // TODO: error message if review didn't delete
      return {} // TODO maybe return an error message object if error occurs
    }
    setReRender(!reRender)
    modalTextOperation(false)
    setRenderModal(false)
  }


  useEffect(() => {
    (async () => {
      const allReviews = await getAllReviews()
      setReviews(allReviews)
    })()
  }, [reRender])

  return <>
      <h3>Log delete requests</h3>
      <p>Current log delete requests from employees that need approval or rejection:</p>
      {
      reviews.length > 0 ?
      <div className='allRequests'>
        <table>
          <tbody>
            {reviews.map( review => (
              <tr key={review._id} onClick={handleReviewClick} value={review._id}>
                <th className='fixedColumn'><span className='fa fa-exclamation-circle' ></span></th>
                <td className='long'>Vehicle ID:</td>
                <td className='long'>{review.log_id && review.log_id.vehicle_id.asset_id}</td>
                <td className='long'>Employee ID:</td>
                <td className='long'>{review.employee_id && review.employee_id.username_id}</td>
                <td className='long'>Date:</td>
                <td className='long'>{review.date = new Date(review.date).toISOString().split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      :
      <Card id="request">
        <p>No delete requests to review</p>
        <img src={noRequest} alt='company logo' />
      </Card>
      }
      {renderModal &&
      <ModalText setRenderModal={setRenderModal}>
            <h5>Log Deletion Request Details</h5>
            <table>
              <tbody>
                <tr>
                  <td>Employee ID:</td>
                  <td>{selectedReview.current.employee_id && selectedReview.current.employee_id.username_id}</td>
                </tr>
                <tr>
                  <td>Date Added:</td>
                  <td>{selectedReview.current.date}</td>
                </tr>
                <tr>
                  <td>Vehicle ID:</td>
                  <td>{selectedReview.current.log_id && selectedReview.current.log_id.vehicle_id.asset_id}</td>
                </tr>
                <tr>
                  <td>Current ODO:</td>
                  <td>{selectedReview.current.log_id && selectedReview.current.log_id.current_odo}</td>
                </tr>
                <tr>
                  <td>Fuel Added:</td>
                  <td>{selectedReview.current.log_id && selectedReview.current.log_id.fuel_added}</td>
                </tr>
              </tbody>
            </table>
            <CompanyButton onClick={handleDeleteButtonClick} name='delete' >Delete Log</CompanyButton>
            <CompanyButton onClick={handleDeleteButtonClick} name='keep' >Keep Log</CompanyButton>
      </ModalText>
      }
    </>
}

export default ReviewsFetchList