
function reducer (currentState, action) {
  switch (action.type) {
    case 'userAccess':
      return {
        userAccess: action.isAdmin,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'allVehicles':
      return {
        allVehicles: action.allVehicles
      }
    case 'selectVehicle':
      return {
        currentVehicle: action.currentVehicle
      }
    default:
        return currentState
  }
}

const initialState = {
  userAccess: "",
  authorised: false,
  userName: "",
  allVehicles: [],
  currentVehicle: {}
}

export {
  reducer,
  initialState
}
