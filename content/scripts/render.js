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

function getSideBarElement(data) {
  const wrapper = createElement(SideBarElmentTree(data))
  const pictureWrapper = createElement(SideBarPictureElmentTree(data))
  const reviewWrapper = createElement(SideBarReviewsElmentTree(data.reviews))
  return {
    wrapper,
    pictureWrapper,
    reviewWrapper
  }
}

function createSideBarElement() {
  // const {
  //   image = 'https://images.deliveryhero.io/image/fd-tw/LH/y8ao-listing.jpg?width=400&height=292',
  //   reviews
  // }  = data
  const data = {
    image: 'https://images.deliveryhero.io/image/fd-tw/LH/y8ao-listing.jpg?width=400&height=292',
    review
  }
  const {
    wrapper,
    pictureWrapper,
    reviewWrapper
  } = getSideBarElement(data)
  wrapper.appendChild(pictureWrapper)
  wrapper.appendChild(reviewWrapper)
  return wrapper
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