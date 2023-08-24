import API_URL from "../../env.js"

const basicAuthFetch = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
      },
      credentials: 'include'
    })
    const returnedData = await res.json()
    return returnedData.isAdmin
  } catch (err) {
    console.error(err)
  }
}

export default basicAuthFetch