
function isSameAdress() {

}

async function handleFetchPlaceDetail(vendor) {
  if(!vendor) return null
  let { name, latitude='', longitude='' } = vendor  
  if(!name) return null
  else { 
    const location = `${latitude},${longitude}`   
    const placeIdList = await fetchPlaceId({ name, location })
    if (placeIdList.length === 0) return null
    const placeId = placeIdList[0].place_id
    return await fetchPlaceDetail({ placeId, location })
  }
}

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(data) {
    switch (port.name) {
      case 'fetchVendors':
        port.postMessage({ msg: await fetchAllVendors(data) });
        break;
      case 'fetchVendorDetail':
        port.postMessage({ msg: await fetchVendorDetail(data) });
        break;
      case 'fetchPlaceDetail':
        const placeDetailList = await Promise.all(data.map( vendor => handleFetchPlaceDetail(vendor)))
        
        console.log('placeDetailList', placeDetailList);
        
        port.postMessage({ response: await Promise.all(data.map( vendor => handleFetchPlaceDetail(vendor))) });
        break;
      default:
        break;
    }
  })
})