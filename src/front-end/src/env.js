// --- SET ENV VARIABLES --- //
const ENV = import.meta.env.MODE
let API_URL
ENV === 'production' ? API_URL = import.meta.env.VITE_API_URL : API_URL = import.meta.env.VITE_API_URL // TODO: changed VITE env from local to remote
// ------------------------ //

export default API_URL
