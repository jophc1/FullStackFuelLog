
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
        userName: action.userName,
        allVehicles: action.allVehicles,
        userId: action.userId
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
    case 'allLogs':
      return {
        ...currentState,
        paginationInfo: action.paginationInfo,
        allLogs: action.allLogs
      }
    case 'selectVehicle':
      return {
        ...currentState,
        currentVehicle: action.currentVehicle,
        displayVehicleInfo: action.displayVehicleInfo,
        displayPlaceholderVehicleInfo: action.displayPlaceholderVehicleInfo
      }
    case 'newLog':
      return {
        ...currentState,
        newLogCreated: action.newLogCreated,
        logId: action.logId
      }
    case 'popUpText':
      return {
        ...currentState,
        showModalText: action.toggleModal
      }
    case 'backButton':
      return {
        ...currentState,
        currentVehicle: action.currentVehicle,
        displayVehicleInfo: action.displayVehicleInfo,
        displayPlaceholderVehicleInfo: action.displayPlaceholderVehicleInfo,
        newLogCreated: action.newLogCreated
      }
    case 'popUpField':
      return {
        ...currentState,
        showModalField: action.toggleModal
      }
    case 'editVehicle':
      return {
        ...currentState,
        propsObject: action.props
      }
    case 'errMsg':
      return {
        ...currentState,
        errorMessage: action.errMsg,
        showModalText: action.showModalText
      }
    default:
        return currentState
  }
}

const initialState = {
  userAccess: "",
  authorised: false,
  userName: "",
  userId: null,
  allVehicles: [],
  currentVehicle: {},
  newLogCreated: false,
  logId: {},
  showModalText: false,
  displayVehicleInfo: false,
  displayPlaceholderVehicleInfo: true,
  propsObject: {},
  showModalField: false,
  paginationInfo: {},
  allLogs: [],
  errorMessage: ''
}

export {
  reducer,
  initialState
}
