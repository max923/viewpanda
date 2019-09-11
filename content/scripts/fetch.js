async function fetchVendors({ lat, lng }) {
  try {
      return await fetch(`http://localhost:9999/api/vendors?lat=${lat}&lng=${lng}`)
      .then(response => response.json())
  } catch (error) {
      console.error(`error: ${error}`)
  }
}
async function fetchVendorDetail(vendorId) {
  try {
      return await fetch(`http://localhost:9999/api/vendor/detail?vendorId=${vendorId}`)
      .then(response => response.json())
      .then(response => response.data)
  } catch (error) {
      console.error(`error: ${error}`)
  }
}
async function fetchPlaceDetail(args) {
  if(!args) {
      return new Promise((resolve) => resolve(null))
  }
  const { name, latitude, longitude } = args
  try {
      return await fetch(`http://localhost:9999/api/place?name=${name}&lat=${latitude}&lng=${longitude}`)
      .then(response => response.json())
  } catch (error) {
      console.error(`error: ${error}`)
  }
}