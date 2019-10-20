const fetchVendorsPort = chrome.runtime.connect({ name: "fetchVendors" });
const fetchVendorDetailPort = chrome.runtime.connect({ name: "fetchVendorDetail" });
const fetchPlaceDetailPort = chrome.runtime.connect({ name: "fetchPlaceDetail" });
let status = {
    height: document.documentElement.getBoundingClientRect().height,
    index: 0,
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    main()
});

async function main() {
    const location = getLocation()
    fetchVendorsPort.postMessage(location)
    const vendors = await getVendorsData()
    const vendorsDom = [...getVendorsDomOfLane(), ...getVendorsDomOfList()]    
    const currentVendorsDom = vendorsDom.slice(status.index, vendorsDom.length)
    const currentVendors = await Promise.all(getDataFrom(currentVendorsDom).map(async (d) => {
        if (vendors[d.vendorName]) return vendors[d.vendorName]
        return { name: d.vendorName, latitude: '', longitude: ''  }
    }))    
    fetchPlaceDetailPort.postMessage(currentVendors)
    const { response } = await getPlaceDetail()
    handleSideBar(response)
    for(let i = 0; i< response.length; i++) {
        const data = response[i]
        const vendor = currentVendors[i]        
        if(data){
            const arg1 = new RegExp(data.result.composeAddress[0]);
            const arg2 = new RegExp(data.result.composeAddress[1]);            
            if(data.result.name === vendor.name) {
                renderToDom(createReviewElement(data.result).cloneNode(true))(vendorsDom[status.index].querySelector('figure'))
            }
            else if(arg1.test(vendor.address) || arg2.test(vendor.address)) {
                renderToDom(createReviewElement(data.result).cloneNode(true))(vendorsDom[status.index].querySelector('figure'))
            }
            else renderToDom(createReviewElement(Object.assign({ notMatch: true }, data.result)).cloneNode(true))(vendorsDom[status.index].querySelector('figure'))
        }
        status.index++
    }
}
createStyle()
main()

function createStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
        .vp_gog_review{
            position: relative;
            height: 30px;
            text-align: right;
            margin-bottom: -10px;
            display: flex;
            align-items: center;
        }
        .notmatch span{
            color: #a9a9a9;
        }
        .vp_gog_review:hover{
            right: -1px;
            bottom: -1px;
        }
        .vp_gog_review_name{
            flex: 1;
            color: #D70F64;
            font-size: 12px;
            font-weight: normal;
            margin-right: 3px;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            overflow: hidden;
        }
        .vp_gog_review_rating{
            font-weight: bold;
            font-size: 14px;
        }
        .vp_gog_review_type{
            font-size: 11px;
            margin-left: 5px;
            color: #1b1a1a;
            min-width: 67px;
        }
    `;
    document.head.appendChild(style);
}

function handleSideBar(response) {
    const vendorUl = [
        ...Array.prototype.slice.call(document.querySelectorAll('.vendor-lane')),
        ...Array.prototype.slice.call(document.querySelectorAll('.vendor-list'))
    ]
    vendorUl.forEach(element => {
        element.addEventListener('click', function(e) {
            if(e.target.parentElement.className === 'vp_gog_review') {
                e.preventDefault()
                const name = e.target.parentElement.getAttribute('data_name')
                const index = response.findIndex(e => {
                    return e ? e.result.name === name : false
                })
                const gSideBarContainerDom = document.getElementById('g_sideBar_container')
                document.getElementById('g_sideBar').style.display = 'block'
                if (gSideBarContainerDom) gSideBarContainerDom.replaceWith(createSideBarContainer(response[index].result))
                else document.getElementById('g_sideBar').appendChild(createSideBarContainer(response[index].result))
            }
        })
    })
    document.querySelector('.restaurants-container').appendChild(createSideBarElement())
    document.getElementById('g_popup_close').addEventListener('click', function() {
        document.getElementById('g_sideBar').style.display = 'none'
    })
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
