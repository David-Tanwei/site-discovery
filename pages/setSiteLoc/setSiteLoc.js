// pages/chooseMapLoc/chooseMapLoc.js
const app = getApp();
const cfg = require('../../private/config.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  key: cfg.qqMapKey
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userLoc: {},
    scale: 19,
    appUser: {}
  },

  /* 生命周期函数--监听页面初次渲染完成*/
  onLoad: function() {
    //处理用户登录
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //初始化地图
    this.mapCtx = wx.createMapContext('myMap'); //生成地图context
    this.initLoc();
  },

  onShow: function() {
    this.getAppUser(); //用户填写信息
  },

  //初始化位置，用户所在位置居中
  initLoc: function() {
    this.mapCtx.moveToLocation();
    //用户位置方法，需授权
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: res => {
    //     this.data.userLoc.lng = res.longitude;
    //     this.data.userLoc.lat = res.latitude;
    //     this.setData({
    //       userLoc: this.data.userLoc
    //     })
    //   },
    //   fail: () => {
    //     this.mapCtx.moveToLocation();
    //   }
    // })
  },

  //回用户所在位置
  resetLoc: function() {
    this.mapCtx.moveToLocation();
    //恢复比例尺效果
    setTimeout(()=>{
      type: 'gcj02',
      this.mapCtx.getCenterLocation({
        success:res=>{
          this.data.userLoc.lng = res.longitude;
          this.data.userLoc.lat = res.latitude;
          this.setData({
            userLoc: this.data.userLoc,
            scale: 19
        })
        }
      })
    },800)
    //用户位置方法，需授权
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: res => {
    //     this.data.userLoc.lng = res.longitude;
    //     this.data.userLoc.lat = res.latitude;
    //     this.setData({
    //       userLoc: this.data.userLoc,
    //       scale: 19
    //     })
    //   }
    // })
  },

  //选定工地位置
  setSiteLoc: function() {
    this.mapCtx.getCenterLocation({
      type: 'gcj02',
      success: (res) => {
        var lng = res.longitude;
        var lat = res.latitude
        app.globalData.siteLoc.lng = lng;
        app.globalData.siteLoc.lat = lat;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lng
          },
          success: (res) => {
            var cr = res.result.address_reference.crossroad;
            var ai = res.result.ad_info;
            if (res.status == 0 && cr.hasOwnProperty('title')) {
              app.globalData.siteLoc.locDesc = cr.title + cr._dir_desc + cr._distance + '米';
            }
            if (res.status == 0 && ai.hasOwnProperty('district')) {
              app.globalData.siteLoc.region = ai.district;
            }
          },
          fail: res => {
            console.log(res);
          },
          complete: (res) => {
            if (res.result.ad_info.province == '上海市') {
              wx.navigateTo({
                url: '/pages/submitSite/submitSite',
              })
            } else {
              wx.showToast({
                title: '所选位置超出上海范围，请重新选择',
                icon: 'none',
                duration: 2000
              });
            }
          }
        })

      }
    })
  },

  //微信用户登录及用户信息
  setUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      //授权后即进入用户信息填写
      this.toUserInfo();
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function() {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        //授权后即进入用户信息填写
        this.gotoUserInfo();
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  toUserInfo: function() {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },

  //用户填写信息
  getAppUser: function() {
    var appUser = wx.getStorageSync('appUser');
    this.setData({
      appUser: appUser
    })
  },
  toHistory:function(){
    wx.navigateTo({
      url: '/pages/history/history',
    })
  }

})