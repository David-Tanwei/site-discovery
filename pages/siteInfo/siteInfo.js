// pages/siteInfo/siteInfo.js
//工地信息查看

Page({
  data: {
    site: {}
  },
  onLoad: function(options) {
    this._getSiteInfo({
      id: options.id,
      success:res=>{
        this.setData({
          site:res
        })
      }
    });
  },

  _getSiteInfo: function(para) {
    //request site info by para.id
    var res={
      lng: 121.2222,
      lat: 31.3333,
      locDesc: '钦州北路贵菁路路口',
      siteDesc: '挖排水管道',
      imgFilePath: ['../images/icon_user.png', '../images/icon_add.png', '../images/icon_history.png'],
      uploadDate:'2018-9-12',
      empID:11817,
      nickName:'Fingonski',
      status:'已采纳',
      credit:50,
      name:'谈',
      title:'先生',
      phone:'13564770195'
    }
    if (!!para.success) { para.success(res); }
    if (!!para.complete) { para.complete(res); }
    if (!!para.fail) { para.fail(res); }
  },

  //预览照片
  previewImage: function(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: this.data.site.imgFilePath,
      current: src
    })
  },

  //放大地图
  openLocation:function(){
    wx.openLocation({
      latitude: this.data.site.lat,
      longitude: this.data.site.lng,
      scale: 28,
      name: this.data.site.locDesc,
      address: this.data.site.siteDesc
    })
  }
})