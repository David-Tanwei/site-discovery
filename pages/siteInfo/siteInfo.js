// pages/siteInfo/siteInfo.js
//工地信息查看
const cfg = require('../../private/config.js');
const util = require('../../utils/util.js');

Page({
  data: {
    site: {},
    imgs: []
  },
  onLoad: function(options) {
    this._getSiteInfo(options.siteID);
  },

  _getSiteInfo: function(siteID) {
    // request site info by siteID
    wx.request({
      url: cfg.getSiteInfoUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {siteID:siteID},
      method: 'POST',
      success:res=>{
        this.setData({
          site: res.data
        })
        //预加载图片，加载不出来的不显示
        var imgSeq = [...Array(9).keys()];
        imgSeq.map((item) => {
          util.loadImg(res.data.siteID, item)
            .then(res => {
              this.data.imgs.push(res);
              this.data.imgs.sort((a, b) => { return a.imgSeq - b.imgSeq });
              this.setData({
                imgs: this.data.imgs
              })
            })
            .catch(() => { });
        })
      },
      fail:err=>{
        wx.showToast({
          title: '加载错误 '+err.errMsg,
          icon: 'none',
          duration:3000
        })
      }
    })
    // //测试
    // var data = {
    //   lng: 121.2222,
    //   lat: 31.3333,
    //   locDesc: '钦州北路贵菁路路口',
    //   siteDesc: '挖排水管道',
    //   uploadDate: '2018-9-12',
    //   empID: 11817,
    //   nickName: 'Fingonski',
    //   status: '已采纳',
    //   credit: 50,
    //   name: '谈',
    //   title: '先生',
    //   phone: '13564770195',
    //   siteID: 12321
    // };
    // this.setData({
    //   site: data
    // });
    //加载照片
    var imgSeq = [...Array(9).keys()];
    imgSeq.map((item) => {
      util.loadImg(data.siteID, item)
        .then(res => {
          this.data.imgs.push(res);
          this.data.imgs.sort((a, b) => {
            return a.imgSeq - b.imgSeq
          });
          this.setData({
            imgs: this.data.imgs
          })
        })
        .catch(() => {});
    })
  },


  //预览照片
  previewImage: function(e) {
    var src = e.currentTarget.dataset.src;
    var urls = this.data.imgs.map((item) => {
      return cfg.getImgUrl + '?siteID=' + this.data.site.siteID + '&imgSeq=' + item.imgSeq
    });
    wx.previewImage({
      urls: urls,
      current: src
    })
  },

  //查看放大地图
  openLocation: function() {
    wx.openLocation({
      latitude: this.data.site.lat,
      longitude: this.data.site.lng,
      scale: 28,
      name: this.data.site.locDesc,
      address: this.data.site.siteDesc
    })
  },

  //转发按钮
  onShareAppMessage: function() {
    return cfg.share;
  }
})