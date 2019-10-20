
const getAPIKey = () => {
  return config.tw.apiKeys[Math.floor(Math.random() * config.tw.apiKeys.length)]
}
async function fetchAllVendors({lat, lng, country }) {
  try {
    return (
      await fetch(config[country].host({ lat, lng }), {
        headers: {
          'X-FP-API-KEY': 'volo'
        },
      })
      .then(response => response.json())
      .then(response => {
        const result = {}
        response.data.items.forEach(v => {
          result[v.name] = v
        })
        return result
      })
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
async function fetchPlaceId({ name, location }) {
  try {
    return (
      await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${getAPIKey()}&input=${name}&inputtype=textquery&type=restaurant&locationbias=point:${location}&radius=1500`)
      .then(response => response.json())
      .then(response => response.candidates)
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
async function fetchPlaceDetail({ placeId, location }) {
  try {
    return (
      await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&locationbias=point:${location}&language=zh-TW&fields=name,photo,rating,reviews,url,formatted_address,address_component&key=${getAPIKey()}`)
      .then(response => response.json())
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
async function fetchVendorDetail(vendorId) {
  try {
    return (
      await fetch(`https://tw.fd-api.com/api/v5/vendors/${vendorId}?language_id=6&vertical=restaurants`, {
        headers: {
          'X-FP-API-KEY': 'volo'
        },
      })
      .then(response => response.json())
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
}