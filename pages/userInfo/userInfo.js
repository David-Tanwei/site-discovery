// pages/userInfo/userInfo.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    appUser:{},
    sir:true,
    miss:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    };
    var appUser = wx.getStorageSync('appUser');
    if(appUser&&appUser.title=='女士'){
      this.data.sir=false;
      this.data.miss=true;
    }
    if (appUser) {
      this.setData({
        appUser: appUser,
        sir: this.data.sir,
        miss: this.data.miss
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //保存修改
  saveChange:function(e){
    wx.setStorageSync('appUser', e.detail.value);
    app.globalData.appUser = e.detail.value;
    wx.showToast({
      title: '已保存',
      duration:1000,
    });
    setTimeout(()=>{
      wx.navigateBack({

      })
    },1000)
  },

  //转发按钮
  onShareAppMessage: function () {
    return cfg.share;
  }
})