let temp = {
    height: document.documentElement.getBoundingClientRect().height,
    index: 0,
}
async function main() {
    const lat = window.location.pathname.split('/')[3],
        lng = window.location.pathname.split('/')[5]
    const vendors = await fetchVendors({ lat, lng })
    const vendorsDom = [...getVendorsDomWithLane(), ...getVendorsDomWithList()]
    const currentVendorsDom = vendorsDom.slice(temp.index, vendorsDom.length)
    const currentVendors = await Promise.all(getDataFrom(currentVendorsDom).map(async (d) => {
        if (vendors[d.vendorName]) return vendors[d.vendorName]
        console.log(d.vendorName)
        if (d.vendorId) return await fetchVendorDetail(d.vendorId) 
    }))
    const responsive = await Promise.all(currentVendors.map(fetchPlaceDetail))    
    while(temp.index < responsive.length) {
        const data = responsive[temp.index]
        if(data) {
            const { result } = data
            const isSamePhonNumber = result.formatted_phone_number === formatte.phoneNumber(currentVendors[temp.index].customer_phone)
            if(isSamePhonNumber){
                renderToDom(createReviewElement(result))(vendorsDom[temp.index].children[0])
            }
        }
        temp.index++
    }
}
main()

function getVendorsDomWithLane() {
    return Array.prototype.slice.call(document.querySelectorAll('.vendor-lane li a'))
}
function getVendorsDomWithList() {
    return Array.prototype.slice.call(document.querySelectorAll('.vendor-list li a'))
}
function getDataFrom(origin) {
    const result = []
    const handleVendorData = (v, index) => {
        const vendorId = v.getElementsByClassName('vendor-picture')[0].getAttribute('data-vendor-id')
        const vendorName = v.getElementsByClassName('name')[0].innerHTML
        result.push({ vendorName, vendorId, index })
    }
    origin.forEach(handleVendorData)
    return result
}

// window.addEventListener('scroll', (event) => {
//     const currentDocHeight =  ocument.documentElement.getBoundingClientRect().height
//     if(temp.height !== currentDocHeight){
//         main()
//         temp.height  = currentDocHeight
//     }
// })