// pages/history/history.js
const app = getApp();
const cfg = require('../../private/config.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    appUser: {},
    uploadStatics: {
      total: 0,
      accepted: 0,
      pending: 0,
      rejected: 0,
      credit: 0
    },
    lastSeq: 0,
    pageSize: 9,
    sites: [],
    loading: false,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    };
    this.setData({
      appUser: app.globalData.appUser
    });
    this._getUploadStatics();
    this.onReachBottom(); //initial load
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.setData({
      lastSeq: 0,
      sites: [],
      loading: false,
      noMore: false
    });
    this._getUploadStatics();
    this.onReachBottom();
  },

  //获取用户上传统计,openID
  _getUploadStatics: function() {
    //ajax get res with openID....
    var openID = app.globalData.openID;
    wx.request({
      url: cfg.getUploadStaticsUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openID: openID,
        empID: this.data.appUser.empID
      },
      method: 'POST',
      success: res => {
        if (res.statusCode == 200) {
          console.log('stats:', res);
          this.setData({
            uploadStatics: res.data
          })
        } else {
          this._showFail('上传统计获取失败' + res.errMsg);
        }
      },
      fail: err => {
        this._showFail('上传统计获取失败' + err.errMsg);
      },
      complete: () => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  //获取工地信息列表 para={lastSeq, pageSize, openID}
  _getSiteList(para) {
    //ajax get res with lastSeq, pageSize,openID....
    return new Promise((resolve, reject) => {
      wx.request({
        url: cfg.getSiteListUrl,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: para,
        method: 'POST',
        success: res => {
          if (res.statusCode == 200) {
            console.log('siteList:',res.data);
            resolve(res.data);
          } else {
            reject(res.errMsg);
          }
        },
        fail: err => {
          reject(err);
        }
      })
    })
  },

  _renderSiteList: function(siteList) {
    if (!siteList || siteList.length == 0) {
      this.setData({
        noMore: true,
        loading: false
      })
    } else {
      siteList = siteList.map(item => {
        if(item.maxImgSeq>-1){
          item.coverImg = cfg.getImgUrl + '?siteID=' + item.siteID + '&imgSeq=0';
        }else{
          item.coverImg = '../images/icon_site.jpg';
        }
        return item;
      });
      this.data.sites.push(...siteList);
      var noMore = false;
      if (siteList.length < this.data.pageSize) {
        noMore = true
      }
      this.setData({
        sites: this.data.sites,
        lastSeq: siteList[siteList.length - 1].seq,
        noMore: noMore,
        loading: false
      })
      // //加载coverImg，失败则使用默认图片，base64过大不可行
      // siteList.map(item => {
      //   util.loadImg(item.siteID, 0)
      //     .then(img => {
      //       var ss = this.data.sites;
      //       ss[ss.findIndex(e => {
      //         return e.siteID == item.siteID
      //       })].coverImg = img.src;
      //       this.setData({
      //         sites: ss
      //       })
      //     })
      //     .catch(err => {
      //       'no coverImg:',
      //       console.log(err)
      //     })
      // });
    }
  },

  _showFail: function(err) {
    wx.showToast({
      title: '加载错误 ' + err.errMsg,
      icon: 'none',
      duration: 3000
    })
  },

  //触底回调
  onReachBottom: function(e) {
    if (this.data.noMore || this.data.loading) {
      return;
    }
    this.setData({
      loading: true
    })
    this._getSiteList({
        lastSeq: this.data.lastSeq,
        pageSize: this.data.pageSize,
        openID: app.globalData.openID,
        empID: this.data.appUser.empID
      })
      .then(this._renderSiteList)
      .catch(this._showFail);
  },

  toSiteInfo: function(e) {
    wx.navigateTo({
      url: '/pages/siteInfo/siteInfo?siteID=' + e.currentTarget.dataset.siteid,
    })
  },

  //转发按钮
  onShareAppMessage: function() {
    return cfg.share;
  }
})