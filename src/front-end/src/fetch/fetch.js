import API_URL from '../env.js'

const fetchMod = async (method, route, data) => {
  try {
    const config = {
      method: method,
      body: JSON.stringify(data)
    }
    // use the config object if there is data to be passed in the body
    const res = data 
    ? await fetch(`${API_URL}/${route}`, config)
    : await fetch(`${API_URL}/${route}`, { method })
    // check for content type in response headers
    // if json, parse the data, if plain text assign to returnedData
    let returnedData
    res.headers.get("content-type") === 'application/json' ? returnedData = await res.json() : returnedData = res
    return returnedData
  } catch (err) {
    console.error(err)
  }
}

export default fetchMod