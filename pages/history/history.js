// pages/history/history.js
const cfg = require('../../private/config.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    var appUser = wx.getStorageSync('appUser');
    if (appUser) {
      this.setData({
        appUser: appUser
      })
    };
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

  //获取工号上传统计，empID
  _getUploadStatics: function(empID) {
    //ajax get res with empID....
    wx.request({
      url: cfg.getUploadStaticsUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        empID: empID
      },
      method: 'POST',
      success: res => {
        this.setData({
          uploadStatics: res.data
        })
      },
      fail: err=>{
        this._showFail(err);
      },
      complete:()=>{
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  //获取工地信息列表 para={lastSeq, pageSize, empID}
  _getSiteList(para) {
    //ajax get res with lastSeq, pageSize,empID....
    return new Promise((resolve, reject) => {
      wx.request({
        url: cfg.getSiteListUrl,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: para,
        method: 'POST',
        success: res => {
          resolve(res.data);
        },
        fail: err => {
          reject(err);
        }
      })
      //测试
      // var res = [];
      // for (var i = 1; i <= para.pageSize; i++) {
      //   if (para.lastSeq + i > 14) {
      //     break;
      //   }
      //   res.push({
      //     seq: para.lastSeq + i,
      //     siteID: para.lastSeq + i,
      //     locDesc: '上海市长宁区北渔路52号-' + (para.pageSize + i - 1),
      //     upLoadDate: '18-12-1' + (10 - i),
      //     by: 'Fingonski',
      //     status: '已采纳',
      //     credit: 50
      //   })
      // };
      // setTimeout(() => {
      //   resolve(res)
      // }, 1000);
    })
  },

  _renderSiteList: function(siteList) {
    if (!siteList || siteList.length == 0) {
      this.setData({
        noMore: true,
        loading: false
      })
    } else {
      siteList = siteList.map(item => { item.coverImg = '../images/icon_site.jpg' ; return item;});
      this.data.sites.push(...siteList);
      var noMore = false;
      if (siteList.length < this.data.pageSize) {
        noMore = true
      }
      this.setData({
        sites: this.data.sites,
        lastSeq: siteList[siteList.length-1].seq,
        noMore: noMore,
        loading: false
      })
      //加载coverImg，失败则使用默认图片
      siteList.map(item=>{
        util.loadImg(item.siteID,0)
        .then(img=>{
          var ss = this.data.sites;
          ss[ss.findIndex(e=>{return e.siteID==item.siteID})].coverImg=img.src;
          this.setData({
            sites:ss
          })
        })
        .catch(()=>{})
      });
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
        empID: this.data.appUser.empID
      })
      .then(this._renderSiteList)
      .catch(this._showFail);
  },

  toSiteInfo: function(e) {
    wx.navigateTo({
      url: '/pages/siteInfo/siteInfo?siteID=' + e.currentTarget.dataset.siteID,
    })
  },

  //转发按钮
  onShareAppMessage: function () {
    return cfg.share;
  }
})