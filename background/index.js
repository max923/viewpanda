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
        const result = placeDetailList.map(vendor => {
          if(vendor) {
            vendor.result.composeAddress = refolowAdressList(vendor.result.address_components)
            return vendor
          }
          return null
        })
        port.postMessage({ response: result });
        break;
      default:
        break;
    }
  })
})

function refolowAdressList(addressComponents) {
  const chnNumChar = { 零:0, 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 七:7, 八:8, 九:9 } 
  let result = [],
      addr1 = '',
      addr2 = ''
  for(var i = addressComponents.length-1; i >= 0; i--){
      if(addressComponents[i].types[0] === 'administrative_area_level_1') {
          addr1 += addressComponents[i].long_name
          addr2 += addressComponents[i].long_name
      } else if(addressComponents[i].types[0] === 'administrative_area_level_3') {
          addr1 += addressComponents[i].long_name
          addr2 += addressComponents[i].long_name
      } else if(addressComponents[i].types[0] ==='route') {
          addr1 += addressComponents[i].long_name
          for(let j = 0; j < addressComponents[i].long_name.length; j++) {
            if(addressComponents[i].long_name[j+1] === '段'){
                addr2 += chnNumChar[addressComponents[i].long_name[j]]
            } else {
                addr2 += addressComponents[i].long_name[j]
            }
          }
      }
  }
  result.push(addr1)
  result.push(addr2)
  return result
}
