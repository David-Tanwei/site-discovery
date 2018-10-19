//submitSite.js 用户上传工地信息
//获取应用实例
const app = getApp();
const maxImgCnt = 9;
const cfg = require('../../private/config.js');

Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    siteLoc: app.globalData.siteLoc,
    txtCnt: 0,
    imgFilePath: []
  },
  onLoad: function() {
    this.data.userInfo = app.globalData.userInfo;

  },

  //点击地图重新选择工地位置
  reSetLoc: function() {
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
    var imgs = this.data.imgFilePath;
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

  genSiteID: function() {
    ////////////////////////////////////////////////////通过终端和时间生成唯一id
    return 'twtest';
  },

  //递归上传照片
  uploadImgs: function(fp, siteID, imgSeq) {
    if (fp.length == 0) {
      //照片上传完成或没照片，进行下一步提交信息
      this.submitSiteInfo();
      return;
    }
    wx.uploadFile({
      url: cfg.uploadImgUrl,
      filePath: fp[0],
      name: 'image',
      formData: {
        'siteID': siteID,
        'imgSeq': imgSeq
      },
      success: res => {
        imgIndex += 1;
        fp.splice(0, 1);
        this.uploadImgs(fp, siteID, imgSeq)
      },
      fail: res => {
        console.log('uploadfail res:',res);
        /////////////////////////提示错误
      }
    })
  },

  //上传数据
  submitSiteInfo: function() {
    //接口提交
    wx.request({
      url: cfg.submitSiteInfoUrl,
      data: {name:'tanwei'},
      // data: this.site,
      method: 'POST',
      success: res => {
        console.log('request res:',res);
        /////////关闭等待toast
      }
    })
  },

  //提交
  submitSite: function(e) {
    //验证输入合法
    if (!e.detail.value.locDesc || !e.detail.value.siteDesc) {
      wx.showToast({
        title: '请输入工地位置和工地情况概述。',
        icon: 'none',
        duration: 2000
      })
    }

    //准备待提交数据
    this.site={};
    this.site.lng = this.data.siteLoc.lng;
    this.site.lat = this.data.siteLoc.lat;
    this.site.locDesc = this.data.siteLoc.locDesc;
    this.site.region = this.data.siteLoc.region;
    this.site.siteDesc = e.detail.value.siteDesc;
    this.site.siteDesc = e.detail.value.siteDesc;
    this.site.imgFilePath = [];
    this.site.nickName = '';
    this.site.empID = '';
    this.site.name = '';
    this.site.title = '';
    this.site.phone = '';
    if (this.data.userInfo) {
      this.site.nickName = this.data.userInfo.nickName;
    }
    var appUser = wx.getStorageSync('appUser');
    if (!!appUser) {
      this.site.empID = appUser.empID;
      this.site.name = appUser.name;
      this.site.title = appUser.title;
      this.site.phone = appUser.phone;
    }

    //上传图片////////////////////////////显示等待toast
    var fp = this.data.imgFilePath;
    this.uploadImgs(fp, this.genSiteID, 1);
  }
})