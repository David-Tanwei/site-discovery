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


// //预加载图片，成功则返回{imgSeq:base64}，setData数据量过大，该方法不可行
// const cfg = require('../private/config.js');
// const loadImg = (siteID, imgSeq) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: cfg.getImgUrl,
//       method: 'GET',
//       header: {
//         'content-type': 'application/x-www-form-urlencoded'
//       },
//       data: {
//         siteID: siteID,
//         imgSeq: imgSeq
//       },
//       success: res => {
//         if (res.statusCode == 200) {
//           // resolve({ imgSeq: imgSeq, src: 'data:image/png;base64,' + res.data.image })//base64超过页面控件大小限制
//           resolve({
//             imgSeq: imgSeq,
//             src: cfg.getImgUrl + '?siteID=' + siteID + '&imgSeq=' + imgSeq
//           })
//         } else {
//           reject(res.errMsg)
//         }
//       },
//       fail: err => {
//         reject(err)
//       }
//     })
//   })
// }


module.exports = {
  formatTime: formatTime
  // loadImg: loadImg
}