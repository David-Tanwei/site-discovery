//submitSite.js 用户上传工地信息
//获取应用实例
const app = getApp();
const maxImgCnt = 9;
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    siteLoc: app.globalData.siteLoc,
    txtCnt: 0,
    imgFilePath: []
  },
  onLoad: function() {
    this.data.userInfo=app.globalData.userInfo;
  },

  //点击地图重新选择工地位置
  reSetLoc: function(){
    wx.navigateBack({
      
    })
  },

  //文本框计数
  descInput: function(e) {
    this.setData({
      txtCnt: e.detail.cursor
    })
  },

  //添加、删除、预览照片
  chooseImage: function(e) {
    var imgCnt = this.data.imgFilePath.length;
    wx.chooseImage({
      count: maxImgCnt - imgCnt,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.data.imgFilePath.push(...res.tempFilePaths)
        this.setData({
          imgFilePath: this.data.imgFilePath
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  removeImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var imgs=this.data.imgFilePath;
    imgs.splice(index, 1);
    this.setData({
      imgFilePath: imgs
    })
  },
  previewImage: function(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: this.data.imgFilePath,
      current: src
    })
  },

  //提交
  submitSite: function (e) {
    //验证输入合法
    if(!e.detail.value.locDesc||!e.detail.value.siteDesc){
      wx.showToast({
        title: '请输入工地位置和工地情况概述。',
        icon:'none',
        duration:2000
      })
    }
    console.log(this.data.userInfo);
    var site={};
    site.lng=this.data.siteLoc.lng;
    site.lat = this.data.siteLoc.lat;
    site.locDesc = this.data.siteLoc.locDesc;
    site.siteDesc=e.detail.value.siteDesc;
    
    site.nickName=this.data.userInfo.nickName;
    empId
    phone
    name
    title
    imgFilePath
    region

    //提交
    wx.request({
      url: 'http://10.221.153.197:8080/ShanghaiScheduler/ts/createOrder.do',
      data: 'testfromTW',
      method: 'POST',
      success:res=>{
        console.log(res);
      }
    })
  }
})