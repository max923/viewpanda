const SideBarElmentTree = () => ({
  tagName: 'div',
  attribute: {
    style: `
      position: fixed;
      top: 128px;
      right: 0;
      ;height: 100%;
      width: 300px;
      background: #fff
      ;z-index: 999;
      padding: 0 15px;
      box-shadow: 10px 10px 30px #656363;
    `,
    id: 'g_sideBar',
  },
  html: ''
})
const SideBarPictureElmentTree = ({ img }) => ({
  tagName: 'picture',
  attribute: {
    style: `
      color: 'red';
      fontSize: '20px;
    `,
  },
  html: `<img src=${img} style="height: 200px;padding: 0;margin: 0;">`
})
const SideBarReviewsElmentTree = () => ({
  tagName: 'ul',
  html: `
    <p style="
      margin: 0;
      font-size: 12px;
      font-weight: bold;
    "></p>
    <p style="
      margin: 0;
      font-size: 15px;
      font-weight: bold;
    " ></p>
    <p style="
      font-size: 13px;
      margin: 0;
    ">
    </p>`,
})
const ReviewElementTree = ({ name, rating }) => ({
  tagName: 'div',
  attribute: {
    style: `
      height: 28px;
      text-align: right;
      margin-bottom: -10px;
      display: flex;
      align-items: center;
    `,
    class: 'vp_gog_review',
    data_name: `${name}`,
  },
  html: `
    <span style="
      flex: 1;
      color: #D70F64;
      font-size: 12px;
      font-weight: normal;
      margin-right: 3px;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;
    ">${name}</span>
    <span style="
      font-weight: bold;
      font-size: 14px;
      ">${rating}</span>
    <span style="
      font-size: 11px;
      margin-left: 5px;
      color: #1b1a1a;
      min-width: 67px;
    ">Google評論</span>
  `
})

function renderToDom(element) {
  return function(target) {
      target.insertBefore(element, target.childNodes[2])
  }
}

function createReviewElement(data) {
  const wrapper = createElement(ReviewElementTree(data))
  return wrapper
}

function createElement(element) {
  const el = document.createElement(element.tagName)
  for( key in element.attribute) {
    el.setAttribute(key, element.attribute[key])
  }
  el.innerHTML = element.html
  return el
}

function getSideBarElement() {
  const wrapper = createElement(SideBarElmentTree())
  const pictureWrapper = createElement(SideBarPictureElmentTree())
  const reviewWrapper = createElement(SideBarReviewsElmentTree())
  return {
    wrapper,
    pictureWrapper,
    reviewWrapper
  }
}

function createSideBarElement() {
  const {
    wrapper,
    pictureWrapper,
    reviewWrapper
  } = getSideBarElement()
  wrapper.appendChild(pictureWrapper)
  wrapper.appendChild(reviewWrapper)
  return wrapper
}
function replaceSideBarContainer(data) {
  const pictureWrapper = createElement(SideBarPictureElmentTree(data))
  const reviewWrapper = createElement(SideBarReviewsElmentTree(data))
}

// function createSideBarReview(list) {
//   try {
//     if(!Array.isArray(list)) throw('params is not an array')
//     return list.map(review => `
//       <p style="
//         margin: 0;
//         font-size: 12px;
//         font-weight: bold;
//       ">${review.user}</p>
//       <p style="
//         margin: 0;
//         font-size: 15px;
//         font-weight: bold;
//       " >${review.rating}</p>
//       <p style="
//         font-size: 13px;
//         margin: 0;
//       ">${review.text}
//       </p>
//     `)
//   } catch (error) {
//     console.error(error);
//   }
// }
// function updateSideBar() {
//   const element = document.getElementById('G_sideBar')
// }