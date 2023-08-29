import React, { useEffect, useState, useRef } from 'react'
import PaginationButtons from './styled/PaginationButtons'

const Pagination = ({ currentPage = 1, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, setPage }) => {

  const [pages, setPages] = useState([])
  const [pagesToDisplay, setPagesToDisplay] = useState([])
  const [hidePrevPage, setHidePrevPage] = useState(false)
  const [hideNextPage, setHideNextPage] = useState(true)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(2)

  const handlePageClick = event => {
    event.preventDefault()
    setPage(event.target.value)
  }

  const handleDisplayNextPages = event => {
    event.preventDefault()
    if (endIndex + 1 == totalPages) {
      setHideNextPage(false)
      setHidePrevPage(true)
      setStartIndex(startIndex - 1)
      setEndIndex(endIndex - 1)
    }
    setStartIndex(startIndex + 1)
    setEndIndex(endIndex + 1)
  }

  const handleDisplayPreviousPages = event => {
    event.preventDefault()
    if (startIndex - 1 < 1) {
      setHidePrevPage(false)
      setHideNextPage(true)
      setStartIndex(startIndex - 1)
      setEndIndex(endIndex - 1)
    }
    setStartIndex(startIndex - 1)
    setEndIndex(endIndex - 1)
  }


  useEffect(() => {
    let pushArr = []
    for (let i = 1; i <= totalPages; i++) {
      pushArr.push(i)
    }
    setPagesToDisplay(pushArr)
  }, [])

  
  return totalPages && <>
   <PaginationButtons>
      {hidePrevPage && <li key={prevPage} onClick={handleDisplayPreviousPages}>&hellip;</li>}
    {pagesToDisplay.slice(startIndex, endIndex).map(page => (
        <li key={page} value={page} onClick={handlePageClick}>{page}</li>
    ))}
      {hideNextPage &&  <li key={nextPage} onClick={handleDisplayNextPages}>&hellip;</li>}
    </PaginationButtons>
  </>
}

export default Pagination