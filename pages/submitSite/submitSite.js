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

  //请求siteID
  getSiteID: function() {
    //获取服务端分配的siteID
    return new Promise((resolve, reject) => {
      console.log('getSiteID start');
      wx.request({
        url: cfg.getSiteIDUrl,
        method: 'POST',
        success: res => {
          if(res.statusCode==200){
            var siteID = res.data.siteID; //从response中得到siteID
            console.log('getSiteID success', siteID);
            resolve(siteID);
          }else{
            console.log('getSiteID failed:', res.errMsg);
            reject(err);
          }
        },
        fail: err => {
          console.log('getSiteID failed:', err.errMsg);
          reject(err);
        }
      })
    })
  },

  //promise.all上传照片
  uploadImgs: function(fp, siteID) {
    if (fp.length == 0) {
      return Promise.resolve([siteID]);
    } else {
      const p = fp.map((item, index) => {
        return this._uploadImg(item, siteID, index)
      });
      return Promise.all(p);
    }
  },

  //上传单张照片,imgSeq表示当前上传图片index，从0开始
  _uploadImg: function(path, siteID, imgSeq) {
    return new Promise((resolve, reject) => {
      console.log('_uploadImg start', imgSeq);
      wx.uploadFile({
        url: cfg.uploadImgUrl,
        filePath: path,
        name: 'image',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          'siteID': siteID,
          'imgSeq': imgSeq
        },
        success: res => {
          console.log('_uploadImg res', imgSeq, res);
          resolve(siteID);
        },
        fail: err => {
          console.log('_uploadImg failed:', imgSeq, err);
          reject(err);
        }
      })
    })
  },

  //上传数据
  submitSiteInfo: function(site) {
    return new Promise((resolve, reject) => {
      console.log('上传数据：', site);
      wx.request({
        url: cfg.submitSiteInfoUrl,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: site,
        method: 'POST',
        success: res => {
          if(res.statusCode==200){
            console.log('上传数据成功：');
            console.log('request res:', res);
            resolve();
          }else{
            console.log('submitSiteInfo failed:', res.errMsg);
            reject(err);
          }
        },
        fail: err => {
          console.log('submitSiteInfo failed:', err);
          reject(err);
        }
      })
    })
  },

  //submit fail
  submitFail: function(err) {
    wx.hideLoading({
      success: () => {
        wx.showToast({
          title: '发送失败！' + err,
          icon: 'none',
          mask: true,
          duration: 2000
        })
      }
    });
  },

  //submit success
  submitSuccess: function() {
    wx.hideLoading({
      success: () => {
        wx.showToast({
          title: '发送成功！',
          mask: true,
          duration: 50000
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/setSiteLoc/setSiteLoc',
          })
        }, 1500);
      }
    });
  },

  //提交按钮
  submitSite: function(e) {
    //验证输入合法
    if (!e.detail.value.locDesc || !e.detail.value.siteDesc) {
      wx.showToast({
        title: '请输入工地位置和工地情况概述。',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    //准备待提交数据
    var site = {};
    site.lng = this.data.siteLoc.lng;
    site.lat = this.data.siteLoc.lat;
    site.locDesc = e.detail.value.locDesc;
    site.region = this.data.siteLoc.region;
    site.siteDesc = e.detail.value.siteDesc;
    site.openID = app.globalData.openID;
    site.nickName = '';
    site.empID = '';
    site.name = '';
    site.title = '';
    site.phone = '';
    if (this.data.userInfo) {
      site.nickName = this.data.userInfo.nickName;
    }
    var appUser = wx.getStorageSync('appUser');
    if (!!appUser) {
      site.empID = appUser.empID || '';
      site.name = appUser.name || '';
      site.title = appUser.title || '';
      site.phone = appUser.phone || '';
    }

    //上传图片///显示等待toast
    wx.showLoading({
      title: '正在上传...',
      mask: true
    });
    var fp = this.data.imgFilePath;
    this.getSiteID()
      .then(siteID => {
        return this.uploadImgs(fp, siteID)
      })
      .then(res => {
        console.log('uploadImgs done:', res[0]);
        site.siteID = res[0];
        return this.submitSiteInfo(site);
      })
      .then(this.submitSuccess)
      .catch(this.submitFail);
  },

  //转发按钮
  onShareAppMessage: function() {
    return cfg.share;
  }
})