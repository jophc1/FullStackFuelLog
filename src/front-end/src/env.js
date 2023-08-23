// --- SET ENV VARIABLES --- //
const ENV = import.meta.env.MODE
let API_URL
ENV === 'production' ? API_URL = '' : API_URL = import.meta.env.VITE_API_URL_LOCAL
// ------------------------ //

export default API_URL
