// const fetchPlaceDetailPort = chrome.runtime.connect({ name: "fetchPlaceDetail" });
const fetchVendorsPort = chrome.runtime.connect({ name: "fetchVendors" });
const fetchVendorDetailPort = chrome.runtime.connect({ name: "fetchVendorDetail" });
const fetchPlaceDetailPort = chrome.runtime.connect({ name: "fetchPlaceDetail" });

let temp = {
    height: document.documentElement.getBoundingClientRect().height,
    index: 0,
}

chrome.runtime.onMessage.addListener( async function(message, sender, sendResponse) {
    const location = getLocation()
    fetchVendorsPort.postMessage(location)
    const vendors = await getVendorsData()
    const vendorsDom = [...getVendorsDomOfLane(), ...getVendorsDomOfList()]
    const currentVendorsDom = vendorsDom.slice(temp.index, vendorsDom.length)
    const currentVendors = await Promise.all(getDataFrom(currentVendorsDom).map(async (d) => {
        if (vendors[d.vendorName]) return vendors[d.vendorName]
        // else if (d.vendorId) {
        //     fetchVendorDetailPort.postMessage(d.vendorId)
        //     return await getVendorDetail()
        // }
        // else return null
    }))
    fetchPlaceDetailPort.postMessage(currentVendors.filter(e => e))
    const { response } = await getPlaceDetail()
    handleSideBar(response)
    while(temp.index < response.length) {
        const data = response[temp.index]
        if(data) renderToDom(createReviewElement(data.result).cloneNode(true))(vendorsDom[temp.index].children[0])
        temp.index++
    }
});

function handleSideBar(response) {
    document.querySelector('.vendor-list').addEventListener('click', function(e) {
        if(e.target.parentElement.className === 'vp_gog_review') {
            e.preventDefault()
            // const name = e.target.parentElement.getAttribute('data_name')
            // const index = response.findIndex(e => {
            //     return e ? e.result.name === name : false
            // })
            // var span = document.createElement("span");
            // document.getElementById('g_sideBar').replaceWith(span)
            // console.log('index', response[index])
        }
    })
    // document.querySelector('.restaurants-container').appendChild(createSideBarElement())
}

function getLocation() {
    const pathname = window.location.pathname.split('/')
    const latIndex = pathname.findIndex(p => p === 'lat'),
            lngIndex = pathname.findIndex(p => p === 'lng')
    const lat = pathname[latIndex + 1],
            lng = pathname[lngIndex + 1]
    return { lat, lng }
}

function getPlaceDetail() {
    return new Promise((resolve) => {
        fetchPlaceDetailPort.onMessage.addListener(function(response) {
            resolve(response)
        }); 
    })
}
function getVendorsData() {
    return new Promise((resolve) => {
      fetchVendorsPort.onMessage.addListener(function(response) {
        resolve(response.msg)
      });
    })
}
function getVendorDetail() {
    return new Promise((resolve) => {
        fetchVendorDetailPort.onMessage.addListener(function(response) {
        resolve(response.msg)
      });
    })
}

function getRestaurantsContainer() {
    return document.querySelector('.restaurants-container')
}

function getVendorsDomOfLane() {
    return Array.prototype.slice.call(document.querySelectorAll('.vendor-lane li a'))
}

function getVendorsDomOfList() {
    return Array.prototype.slice.call(document.querySelectorAll('.vendor-list li a'))
}

function getDataFrom(origin) {
    const result = []
    const handleVendorData = (v, index) => {
        const vendorId = v.getElementsByClassName('vendor-picture')[0].getAttribute('data-vendor-id')
        const vendorSrc = v.getElementsByClassName('vendor-picture')[0].getAttribute('data-src')
        const vendorName = v.getElementsByClassName('name')[0].innerHTML
        const vendorPicture = vendorSrc ? vendorSrc.split('|')[0] : ''        
        result.push({ vendorName, vendorId, vendorPicture, index })
    }
    origin.forEach(handleVendorData)
    return result
}
