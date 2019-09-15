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
    id: 'G_sideBar',
  },
  html: ''
})
const SideBarPictureElmentTree = ({ image }) => ({
  tagName: 'picture',
  attribute: {
    style: `
      color: 'red';
      fontSize: '20px;
    `,
  },
  html: `<img src=${image} style="height: 200px;padding: 0;margin: 0;">`
})
const SideBarReviewsElmentTree = ({ user, rating, text }) => ({
  tagName: 'ul',
  html: `
    <p style="
      margin: 0;
      font-size: 12px;
      font-weight: bold;
    ">${user}</p>
    <p style="
      margin: 0;
      font-size: 15px;
      font-weight: bold;
    " >${rating}</p>
    <p style="
      font-size: 13px;
      margin: 0;
    ">${text}
    </p>`,
})
const ReviewElementTree = ({ name, rating }) => ({
  tagName: 'div',
  attribute: {
    style: `
      height: 25px;
      text-align: right;
      margin-bottom: -10px;
      display: flex;
      align-items: center;
    `,
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