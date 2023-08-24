
function reducer (currentState, action) {
  switch (action.type) {
    case 'userAccess':
      return {
        userAccess: action.isAdmin,
        authorised: action.authorised,
        userName: action.userName
      }
    default:
        return currentState
  }
}

const initialState = {
  userAccess: "",
  authorised: false,
  userName: ""
}

export {
  reducer,
  initialState
}
