const SideBarElmentTree = () => ({
  tagName: 'div',
  attribute: {
    style: `
      position: fixed;
      width: 75%;
      height: 60vh;
      background: #fff;
      z-index: 9999;
      padding: 10px 15px;
      box-shadow: 10px 10px 30px #656363;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
      margin: auto;
      border-radius: 5px;
      display: none;
    `,
    id: 'g_sideBar',
  },
  children: [
    createElementWith('div', {
      attribute: {
        id: 'g_popup_close',
        style: `
          width: 25px;
          height: 25px;
          position: absolute;
          border-radius: 50%;
          right: -6px;
          top: -8px;
          background: #d80f64;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
        `,
      },
      html: 'X',
      children: []
    }),
  ]
})
const SideBarContainerElmentTree = (data) => ({
  tagName: 'div',
  attribute: {
    id: 'g_sideBar_container',
    style: `
      display: flex;
      flex-direction: column;
      overflow: scroll;
      height: 100%;
      background: rgb(255, 255, 255);
    `,
  },
  children: [
    createElementWith('a', {
      attribute: {
        style: `
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 0;
          margin-top: 8px;
        `,
        href: `${data.url}`,
        target: '_blank'
      },
      html: `${data.name}`
    }),
    createElementWith('p', {
      attribute: {
        style: `
          font-size: 13px;
          margin: 0;
        `,
      },
      html: `${data.formatted_address}`,
      children: []
    }),
    createElementWith('ul', {
      attribute: {
        style: `
          margin-top: 15px;
          list-style: none;
          padding: 0;
        `,
      },
      children: [ ...createReviewsElement(data.reviews) ]
    }),
  ]
})
const ReviewElementTree = ({ name, rating, notMatch=false }) => ({
  tagName: 'div',
  attribute: {
    class: notMatch ? 'vp_gog_review notmatch' : 'vp_gog_review',
    data_name: `${name}`,
  },
  children: [
    createElementWith('span', {
      attribute: {
        class: 'vp_gog_review_name',
      },
      html: `${name}`
    }),
    createElementWith('span', {
      attribute: {
        class: 'vp_gog_review_rating',
      },
      html: `${rating.toFixed(1)}`
    }),
    createElementWith('span', {
      attribute: {
        class: 'vp_gog_review_type',
      },
      html: 'Google評論'
    })
  ],
})

function renderToDom(element) {
  return function(target) {
      target.insertBefore(element, target.childNodes[2])
  }
}

function createReviewElement(data) {
  const wrapper = render(ReviewElementTree(data))
  return wrapper
}
function createReviewsElement(data=[]) {
  return data.map(d => (
    createElementWith('li', {
      attribute: {
        style: `
          margin: 0;
          font-size: 12px;
          font-weight: bold;
          padding-bottom: 5px;
          margin-bottom: 10px;
        `,
      },
      children: [
        createElementWith('div', {
          attribute: {
            style: `
              display: flex;
              align-items: center;
            `,
          },
          children: [
            createElementWith('img', {
              attribute: {
                style: `
                  width: 25px;
                  height: 25px;
                  margin-right: 8px;
                `,
                src: `${d.profile_photo_url}`
              },
              children: []
            }),
            createElementWith('span', {
              attribute: {},
              html: `${d.author_name}`,
              children: []
            })
          ]
        }),
        createElementWith('div', {
          attribute: {
            style: `
              margin: 5px 0;
              display: flex;
              align-items: center;
            `
          },
          children: [
            createElementWith('img', {
              attribute: {
                style: `margin-right: 2px;`,
                src: `https://assets.foodora.com/da44049/img/icons/ic-star-sm.svg?da44049`
              },
              children: []
            }),
            createElementWith('span', {
              attribute: {},
              html: `${d.rating}/5`,
              children: []
            })
          ]
        }),
        createElementWith('p', {
          attribute: {
            style: `
              margin: 0;
              border-bottom: solid 1px #e4e4e47d;
              padding-bottom: 5px;
            `
          },
          html: `${d.text}`,
          children: []
        })
      ]
    })
  ))
}
function createSideBarElement() {
  const wrapper = render(SideBarElmentTree())
  return wrapper
}
function createSideBarContainer(data) {
  const wrapper = render(SideBarContainerElmentTree(data))
  return wrapper
}

function createElementWith(tagName, { attribute={}, children=[], html='' }) {
  const vElement = Object.create(null);
  Object.assign(vElement, {
    tagName,
    attribute,
    children,
    html
  });
  return vElement;
}
function renderElem({ tagName, attribute, children, html }) {
  const elem = document.createElement(tagName);
  if(html) elem.innerHTML = html
  for (const [k, v] of Object.entries(attribute)) {
    elem.setAttribute(k, v);
  }
  for (const child of children) {
    elem.appendChild(render(child));
  }
  return elem;
}

function render (vNode){
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }
  return renderElem(vNode);
};
