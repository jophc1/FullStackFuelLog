import React, { useReducer } from "react"

function reducer (currentState, action) {
  switch (action.type) {
    case 'userAccess':
      return currentState
    default:
        return currentState
  }
}

const initialState = {
  userAccess: ""
}

export {
  reducer,
  initialState
}
