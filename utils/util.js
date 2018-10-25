const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//预加载图片，成功则返回{imgSeq:base64}
const cfg = require('../private/config.js');
const loadImg = (siteID, imgSeq) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: cfg.getImgUrl,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { siteID: siteID, imgSeq: imgSeq },
      success: res => {
        resolve({ imgSeq: imgSeq, src: 'data:image/png;base64,' + res.data.image})
      },
      fail: err=>{
        reject()      
      }
    })
    //测试
    // var testImgs = [{
    //   imgSeq: 2,
    //   src: '../images/icon_user.png'
    // }, {
    //   imgSeq: 3,
    //   src: '../images/icon_user.png'
    // }, {
    //   imgSeq: 4,
    //   src: '../images/icon_user.png'
    // }, {
    //   imgSeq: 1,
    //   src: '../images/icon_history.png'
    // }, {
    //   imgSeq: 5,
    //   src: '../images/icon_user.png'
    // }, {
    //   imgSeq: 7,
    //   src: '../images/icon_user.png'
    // }];
    // if (testImgs[imgSeq]) {
    //   var t = setTimeout(() => {
    //     resolve(testImgs[imgSeq])
    //   }, 1500)
    // } else {
    //   var t = setTimeout(() => {
    //     reject()
    //   }, 1500)
    // }
  })
}


module.exports = {
  formatTime: formatTime,
  loadImg: loadImg
}