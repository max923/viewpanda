function renderToDom(element) {
  return function(target) {
      target.insertBefore(element.cloneNode(true), target.childNodes[2])
  }
}
function createReviewElement(data) {
  const wrapper = document.createElement("a")
  const html = `<span style="flex: 1;color: #D70F64;font-size: 12px;font-weight: normal;margin-right: 3px;text-overflow: ellipsis;white-space: nowrap;word-wrap: normal;overflow: hidden;">${data.name}</span><span style="font-weight: bold;font-size: 14px;">${data.rating}</span><span style="font-size: 11px;margin-left: 5px;color: #1b1a1a;min-width: 67px;">Google評論</span>`
  wrapper.setAttribute('style', 'height: 25px;text-align: right; margin-bottom: -10px; display: flex; align-items: center;')
  wrapper.setAttribute('href', data.url)
  wrapper.setAttribute('target', '_blank')
  wrapper.innerHTML = html
  return wrapper
}
function createSideBarElement() {
  const wrapper = document.createElement("div")
  wrapper.setAttribute('style', 'position: fixed;right: 0;height: 100%;width: 300px;background: #fff;z-index: 999;box-shadow: 10px 10px 30px #656363;')
}
