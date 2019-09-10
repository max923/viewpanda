const formatte = {
  phoneNumber: (str) => {
    try {
      if(typeof str !== 'string') throw('phone number not a string')
      return str.replace(/[\s]+/g, "").replace(/-/g,'')
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
module.exports = formatte
