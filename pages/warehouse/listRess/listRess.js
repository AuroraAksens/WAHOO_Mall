// pages/warehouse//listRess/listRess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地址列表
    addList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //跳转添加地址
  goAddress(){
    wx.navigateTo({
      url: '/pages/warehouse/address/address'
    })
  },


  //获取地址数据
  getAddress(){
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'cloud_warehouse/address_list', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          that.setData({
            addList: res.data.data
          })
        } else if (res.data.code == 10003) {
          wx.setStorageSync('token', '')
          wx.showToast({
            title: '登录状态过期，请重新登录',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },

  //选择地址
  cholseRess(e){
    let index = e.currentTarget.dataset.index
    app.globalData.index = index
      wx.navigateBack({
        delta: 1
      })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddress()
  },

})