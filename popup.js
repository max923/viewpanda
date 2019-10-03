
const button = document.getElementById('button')


button.addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { content: null }, function(response) {
      console.log('response', response)
    });
  });
})
