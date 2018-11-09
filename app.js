//app.js
const cfg = require('/private/config.js');

App({
  onLaunch: function() {
    // 登录
    this.login();

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.globalData.appUser = wx.getStorageSync('appUser');
  },
  globalData: {
    userInfo: null, //用户信息
    appUser: {},
    siteLoc: {
      lng: 0,
      lat: 0,
      locDesc: ''
    }, //工地位置
    openID: ''
  },

  //登录
  login: function() {
    var that = this;
    var openID = wx.getStorageSync('openID');
    if (!openID) {
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: cfg.code2SessionUrl,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: res.code
              },
              success: res => {
                if(res.statusCode==200){
                  that.globalData.openID = JSON.parse(res.data).openid;
                  wx.setStorageSync('openID', JSON.parse(res.data).openid);
                }else{
                  console.log('登录失败！' + res.errMsg)
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      that.globalData.openID = openID;
    }
  }
})