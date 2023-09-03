import React, { useEffect, useContext, useRef, useState } from 'react'
import { EmployerContext, FuelLogContext } from '../../context.js'
import CompanyButton from '../styled/CompanyButton.jsx'
import ModalText from '../ModalText.jsx'
import noRequest from '../../assets/request.png'
import Card from '../styled/ProfileCard.jsx'

const ReviewsFetchList = () => {
  /* CONTEXTS */
  const { deleteLog, getAllReviews, deleteReview } = useContext(EmployerContext)
  const { modalTextOperation, modalErrorRender, setModalErrorRender, errorMessage } = useContext(FuelLogContext)
  /* ====================== */
  /* STATES */
  const [renderModal, setRenderModal] = useState(false)
  const [reviews, setReviews] = useState([])
  const selectedReview = useRef({})
  const [ reRender, setReRender ] = useState(false)
  /* ====================== */
  /* EVENT HANDLER FUNCTIONS */ 
  const handleReviewClick = event => {
    event.preventDefault()
    const reviewId = event.target.parentNode.attributes.value.value
    // filter selected review based on reviewId
    selectedReview.current = reviews.find(review => reviewId === review._id)
    // turn modal on
    modalTextOperation(true)
    setRenderModal(true)
  }

  async function handleDeleteButtonClick (event) {
    event.preventDefault()
    // keep or delete log
    if (selectedReview.current.log_id && event.target.name === 'delete') {
      const deletionLogResponse = await deleteLog(selectedReview.current.log_id._id)
    }
    if (selectedReview.current.log_id && event.target.name === 'keep') {
      const deletionReviewResponse = await deleteReview(selectedReview.current._id)
    }
    // turn modals off
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
                <td className='long'>{review.log_id && review.log_id.vehicle_id ? review.log_id.vehicle_id.asset_id : <></>}</td>
                <td className='long'>Employee ID:</td>
                <td className='long'>{review.employee_id ? review.employee_id.username_id : <></>}</td>
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
      <ModalText setRenderModal={setRenderModal} styleSpecial='modalReview'>
            <h5>Log Deletion Request Details</h5>
            <div id='reviewModalDetails'>
              <table>
                <tbody>
                  <tr>
                    <td>Employee ID:</td>
                    <td>{selectedReview.current.employee_id ? selectedReview.current.employee_id.username_id : <></>}</td>
                  </tr>
                  <tr>
                    <td>Date Added:</td>
                    <td>{selectedReview.current.date}</td>
                  </tr>
                  <tr>
                    <td>Vehicle ID:</td>
                    <td>{selectedReview.current.log_id.vehicle_id ? selectedReview.current.log_id.vehicle_id.asset_id : <></>}</td>
                  </tr>
                  <tr>
                    <td>Current ODO (km):</td>
                    <td>{selectedReview.current.log_id ? selectedReview.current.log_id.current_odo : <></>}</td>
                  </tr>
                  <tr>
                    <td>Fuel Added (L):</td>
                    <td>{selectedReview.current.log_id ? selectedReview.current.log_id.fuel_added : <></>}</td>
                  </tr>
                </tbody>
              </table>
              <div id='reviewModalButtons'>
                <CompanyButton onClick={handleDeleteButtonClick} name='delete' >Delete Log</CompanyButton>
                <CompanyButton onClick={handleDeleteButtonClick} name='keep' >Keep Log</CompanyButton> 
              </div> 
            </div>
            
      </ModalText>
      }
      { modalErrorRender &&
        <ModalText setRenderModal={setModalErrorRender} style={'error'}>
            <div>
              { errorMessage }
            </div>
        </ModalText>
      }
    </>
}

export default ReviewsFetchList