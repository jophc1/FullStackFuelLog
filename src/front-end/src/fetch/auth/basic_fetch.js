import API_URL from "../../env"

const basicAuthFetch = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    })
    const returnedData = await res.json()
    return returnedData.isAdmin
  } catch (err) {
    console.error(err)
  }
}

export default basicAuthFetch