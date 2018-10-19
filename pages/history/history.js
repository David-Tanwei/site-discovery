// pages/history/history.js
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
    lastId: 0,
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
    this._setUploadStatics();
    this.onReachBottom(); //initial load
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.setData({
      lastId: 0,
      sites: []
    });
    this._setUploadStatics();
    this.onReachBottom();
  },

  //获取工号上传统计，封装异步回调 para={empID,sucess,fail,complete}
  _getUploadStatics: function(para) {
    //ajax get res with empID....
    var res = {
      total: 40,
      accepted: 30,
      pending: 5,
      rejected: 5,
      credit: 1505
    };
    if (!!para.success) { para.success(res); }
    if (!!para.complete) { para.complete(res); }
    if (!!para.fail) { para.fail(res); }
  },

  _setUploadStatics: function(){
    this._getUploadStatics({
      empID: this.data.appUser.empID,
      success: res => {
        this.setData({
          uploadStatics: res
        })
      }
    });
  },

  //获取工地信息列表，封装异步回调 para={lastId, pageSize, empID,sucess,fail,complete}
  _getSiteList(para) {
    //ajax get res with lastId, pageSize,empID....
    var res = [];
    for (var i = 1; i <= para.pageSize; i++) {
      if (para.lastId + 5 > 30) {
        break;
      }
      res.push({
        seq: para.lastId + i,
        id: para.lastId + i,
        coverImg: '../images/icon_user.png',
        locDesc: '上海市长宁区北渔路52号-' + (para.pageSize + i - 1),
        upLoadDate: '18-12-1' + (10 - i),
        by: 'Fingonski',
        status: '已采纳',
        credit: 50
      })
    };
    setTimeout(() => {
      if (!!para.success){para.success(res);}
      if (!!para.complete) { para.complete(res); }
      if (!!para.fail) { para.fail(res); }
    }, 1000)
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
      lastId: this.data.lastId,
      pageSize: this.data.pageSize,
      empID: this.data.appUser.empID,
      success: res => {
        if (!res || res.length == 0) {
          this.setData({
            noMore: true,
            loading: false
          })
        } else {
          this.data.sites.push(...res);
          var noMore = false;
          if (res.length < this.data.pageSize) {
            noMore = true
          }
          this.setData({
            sites: this.data.sites,
            lastId: res[res.length - 1].id,
            noMore: noMore,
            loading: false
          })
        }
      }
    })
  },

  toSiteInfo:function(e){
    wx.navigateTo({
      url: '/pages/siteInfo/siteInfo?id='+e.currentTarget.dataset.id,
    })
  }
})