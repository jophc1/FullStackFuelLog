
function reducer (currentState, action) {
  switch (action.type) {
    case 'logout':
      return {
        ...initialState
      }
    case 'userAccess':
      return {
        ...currentState,
        userAccess: action.isAdmin,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'retainUserInfo':
      return {
        ...currentState
      }
    case 'allVehicles':
      return {
        ...currentState,
        allVehicles: action.allVehicles,
      }
    case 'selectVehicle':
      return {
        ...currentState,
        currentVehicle: action.currentVehicle,
        allVehicles: action.allVehicles,
      }
    case 'newLog':
      return {
        ...currentState,
        newLogCreated: action.newLogCreated,
        logId: action.logId,
      }
    case 'popUpText':
      return {
        ...currentState,
        showModalText: action.toggleModal
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
  currentVehicle: {},
  newLogCreated: false,
  logId: {},
  showModalText: false
}

export {
  reducer,
  initialState
}
