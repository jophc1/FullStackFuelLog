// --- SET ENV VARIABLES --- //
const ENV = 'dev'
let API_URL
ENV === 'prod' ? API_URL = '' : API_URL = 'http://localhost:4001'
// ------------------------ //

export default API_URL
