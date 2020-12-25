// pages/Brand/Brand.js
  const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomlight : 0,
    ViewData:[]
  },

  getBrandData(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'brand?type=0' , //仅为示例，并非真实的接口地址
      method:'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading()
        that.setData({
          ViewData:res.data.data
        })
        console.log(res.data)
      }
    })
  },

  //顶部按钮切换
  navBut(e) {
    let that = this
    let shujv = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'brand?type=' + shujv, //仅为示例，并非真实的接口地址
      method:'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading()
        that.setData({
          ViewData:res.data.data,
          bottomlight:shujv
        })
        console.log(res.data)
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBrandData()
  },
})