const SideBarElmentTree = () => ({
  tagName: 'div',
  attribute: {
    style: `
      position: fixed;
      width: 75%;
      height: 55vh;
      background: #fff;
      z-index: 9999;
      padding: 0 15px;
      box-shadow: 10px 10px 30px #656363;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
      margin: auto;
      border-radius: 5px;
      overflow: scroll;
      display: none;
    `,
    id: 'g_sideBar',
  },
  children: []
})
const SideBarContainerElmentTree = (data) => ({
  tagName: 'div',
  attribute: {
    id: 'g_sideBar_container',
    style: `
      display: flex;
      flex-direction: row;
    `,
  },
  children: [
    createElementWith('picture', {
      attribute: {
        style: `
          flex: 1;
          max-width: 200px;
          margin-top: 15px;
        `,
      }
    }),
    createElementWith('ul', {
      attribute: {
        style: `
          margin-left: 20px;
          margin-top: 15px;
          list-style: none;
          padding: 0;
        `,
      },
      children: [ ...createReviewsElement(data.reviews) ]
    })
  ]
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
  children: [
    createElementWith('span', {
      attribute: {
        style: `
          flex: 1;
          color: #D70F64;
          font-size: 12px;
          font-weight: normal;
          margin-right: 3px;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
          overflow: hidden;
        `,
      },
      html: `${name}`
    }),
    createElementWith('span', {
      attribute: {
        style: `
          font-weight: bold;
          font-size: 14px;
        `,
      },
      html: `${rating}`
    }),
    createElementWith('span', {
      attribute: {
        style: `
          font-size: 11px;
          margin-left: 5px;
          color: #1b1a1a;
          min-width: 67px;
        `,
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
  console.log('ReviewElementTree', ReviewElementTree(data));
  
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
          border-bottom: solid 1px #ddd;
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
          attribute: {},
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