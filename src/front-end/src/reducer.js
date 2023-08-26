
function reducer (currentState, action) {
  switch (action.type) {
    case 'userAccess':
      return {
        userAccess: action.isAdmin,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'retainUserInfo':
      return {
        userAccess: action.userAccess,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'allVehicles':
      return {
        allVehicles: action.allVehicles,
        userAccess: action.userAccess,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'selectVehicle':
      return {
        currentVehicle: action.currentVehicle,
        allVehicles: action.allVehicles,
        userAccess: action.userAccess,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'newLog':
      return {
        newLogCreated: action.newLogCreated,
        logId: action.logId,
        userAccess: action.userAccess,
        authorised: action.authorised,
        userName: action.userName
      }
    case 'popUpText':
      return {
        userAccess: action.userAccess,
        authorised: action.authorised,
        userName: action.userName,
        showModalText: ''
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
