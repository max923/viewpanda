
const button = document.getElementById('button')
// const port = chrome.runtime.connect({ name: "fetchVendorDetail" });
const fetchVendorsPort = chrome.runtime.connect({ name: "fetchVendors" });
const getDomVendorsPort = chrome.tabs.connect({ name: "getDomVendors" });

function getVendors() {
  return new Promise((resolve) => {
    fetchVendorsPort.onMessage.addListener(function(response) {
      resolve(response)
    });
  })
}
function getDomVendors() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { content: "你好，此訊息來自彈出視窗腳本" }, function(response) {
    
          // port.postMessage({ msg: "請問羅拉拉在嗎" });
          // chrome.runtime.sendMessage(response, function(response) {
          //   console.log(response);
          // });
      });
    });
  })
}
async function main() {
  fetchVendorsPort.postMessage({ lat: 24.9788558, lng: 121.543248})
  const vendors = await getVendors()
  console.log('vendors', vendors);
}
main()

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { content: "你好，此訊息來自彈出視窗腳本" }, function(response) {

      port.postMessage({ msg: "請問羅拉拉在嗎" });
      chrome.runtime.sendMessage(response, function(response) {
        console.log(response);
      });
  });
});
// button.addEventListener('click', function() {
//   const lat = window.location.pathname.split('/')[3],
//         lng = window.location.pathname.split('/')[5]
//   console.log(lat, lng);
  
//   chrome.runtime.sendMessage({ content: "你好，此訊息來自彈出視窗腳本" }, function(response) {
//     console.log('response', response);
//   });
  // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  //   chrome.tabs.sendMessage(tabs[0].id, { content: "你好，此訊息來自彈出視窗腳本" }, function(response) {
  //       console.log(response);
  //   });
  // });
// })
