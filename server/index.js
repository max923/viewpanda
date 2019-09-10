const express = require('express');
const utf8 = require('utf8');
const { get, isEmpty } = require('lodash')
const formatte = require('../utils/formatte')
const { 
  fetchPlaceId,
  fetchPlaceDetail,
  fetchAllVendors,
  fetchVendorDetail
} = require('../server/api');

const app = express();
app.get('/api/vendors', async (req, res) => {
  const vendors = await fetchAllVendors(req.query)
  const result = {}
  vendors.data.items.forEach(v => {
    result[v.name] = v
  })
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.status(200).json(result)
})

app.get('/api/vendor/detail', async (req, res) => {
  const { vendorId } = req.query
  if(isEmpty(vendorId)) {
    res.status(400);
    res.send('None vendorId');
  } else {
    const vendorDetail = await fetchVendorDetail(vendorId)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.status(200).json(vendorDetail)
  }
})

app.get('/api/place', async (req, res) => {
  let { name, lat='', lng='' } = req.query
  name = utf8.encode(name);
  if(!name) {
    res.status(400);
    res.send('None name');
  } else { 
    const location = `${lat},${lng}`   
    const placeIdList = await fetchPlaceId({ name, location })
    if (placeIdList.length > 0) {
      const placeId = placeIdList[0].place_id
      const placeDetail = await fetchPlaceDetail({ placeId, location })
      const phoneNumber = get(placeDetail, 'result.formatted_phone_number', '')
      if(isEmpty(phoneNumber)){
        placeDetail.result.formatted_phone_number = ''
      }
      placeDetail.result.formatted_phone_number = formatte.phoneNumber(phoneNumber)
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.status(200).json(placeDetail)
    } else {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.status(404).json(null)
    }

  }
});
const port = process.env.PORT || 9999
app.listen(port, () => {
  console.log(`Listening ${port} port`)
});