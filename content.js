let temp = {
    height: document.documentElement.getBoundingClientRect().height,
    index: 0,
}
const formatte = {
    phoneNumber: (str) => {
        try {
        if(typeof str !== 'string') throw('phone number not a string')
        return str.replace(/[\s]+/g, "").replace(/-/g,'')
        } catch (error) {
        console.error(error)
        return null
        }
    }
}
function renderToDom(data) {
    const wrapper = document.createElement("a")
    const html = `<span style="flex: 1;color: #D70F64;font-size: 12px;font-weight: normal;margin-right: 3px;text-overflow: ellipsis;white-space: nowrap;word-wrap: normal;overflow: hidden;">${data.name}</span><span style="font-weight: bold;font-size: 14px;">${data.rating}</span><span style="font-size: 11px;margin-left: 5px;color: #1b1a1a;min-width: 67px;">Google評論</span>`
    wrapper.setAttribute('style', 'height: 25px;text-align: right; margin-bottom: -10px; display: flex; align-items: center;')
    wrapper.setAttribute('href', data.url)
    wrapper.setAttribute('target', '_blank')
    return function(target) {
        target.insertBefore(createReview(wrapper, html).cloneNode(true), target.childNodes[2])
    }
}

async function main() {
    const lat = window.location.pathname.split('/')[3],
        lng = window.location.pathname.split('/')[5]
    const vendors = await fetchVendors({ lat, lng })
    const vendorsDom = [...getVendorsDomWithLane(), ...getVendorsDomWithList()]
    const currentVendors = await Promise.all(getDataFrom(vendorsDom).map(async (d) => {
        if(vendors[d.vendorName]){
            return vendors[d.vendorName]
        } else if(d.vendorId) {
            console.log(d.vendorName)
            return await fetchVendorDetail(d.vendorId)
        }
    }))
    const responsive = await Promise.all(currentVendors.map(fetchPlaceDetail))    
    while(temp.index < responsive.length) {
        const data = responsive[temp.index]
        if(data) {
            const { result } = data
            const isSamePhonNumber = result.formatted_phone_number === formatte.phoneNumber(currentVendors[temp.index].customer_phone)
            if(isSamePhonNumber){
                renderToDom(result)(vendorsDom[temp.index].children[0])
            }
        }
        temp.index++
    }
    // console.log('temp', temp)
    // responsive.forEach((data, index) => {
    //     if(data) {
    //         const { result } = data
    //         const isSamePhonNumber = result.formatted_phone_number === formatte.phoneNumber(currentVendors[index].customer_phone)
    //         if(!isSamePhonNumber) return
    //         renderToDom(result)(vendorsDom[index].children[0])
    //     }
    // })
    // temp.index = responsive.length - 1
}
main()

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
function createReview(wrapper, html) {
    wrapper.innerHTML = html
    return wrapper
}
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