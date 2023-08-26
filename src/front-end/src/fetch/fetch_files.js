import API_URL from '../env.js'

const fetchFiles = async (method, route, data) => {
  try {
    const config = {
      method: method,
      credentials: 'include',
      body: data,
    }
    // use the config object if there is data to be passed in the body
    const res = data 
    ? await fetch(`${API_URL}/${route}`, config)
    : await fetch(`${API_URL}/${route}`, { method, credentials: 'include' })
    // check for content type in response headers
    // if json, parse the data, if plain text assign to returnedData
    let returnedData
    if (res.headers.get("content-type") === 'application/json; charset=utf-8') {
      const bodyData = await res.json()
      returnedData = {
        status: res.status,
        body: bodyData
      }
    } else {
      const plainTextResponse = await res
      returnedData = plainTextResponse.statusText
    }
    return returnedData
  } catch (err) {
    console.error(err)
  }
}

export default fetchFiles
