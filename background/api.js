const googleApiKey =  "AIzaSyDlLwBUZJ8vzyoU_Rv_hoBKfG_ZabFvWes"

async function fetchAllVendors({lat, lng }) {
  const config = {
    headers: {
      'X-FP-API-KEY': 'volo'
    },
  }
  try {
    return (
      await fetch(`https://tw.fd-api.com/api/v5/vendors?new_sorting=true&latitude=${lat}&longitude=${lng}&include=metadata&language_id=6&vertical=restaurants`, config)
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
      await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${googleApiKey}&input=${name}&inputtype=textquery&type=restaurant&locationbias=point:${location}&radius=1500`)
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
      await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&locationbias=point:${location}&language=zh-TW&fields=name,icon,photo,rating,reviews,url,formatted_phone_number,formatted_address,address_component,adr_address&key=${googleApiKey}`)
      .then(response => response.json())
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
async function fetchVendorDetail(vendorId) {
  const config = {
    headers: {
      'X-FP-API-KEY': 'volo'
    },
  }
  try {
    return (
      await fetch(`https://tw.fd-api.com/api/v5/vendors/${vendorId}?language_id=6&vertical=restaurants`, config)
      .then(response => response.json())
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
}