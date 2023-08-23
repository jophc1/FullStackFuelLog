
function reducer (currentState, action) {
  switch (action.type) {
    case 'userAccess':
      return {
        userAccess: action.isAdmin,
        authorised: action.authorised
      }
    default:
        return currentState
  }
}

const initialState = {
  userAccess: "",
  authorised: false
}

export {
  reducer,
  initialState
}
