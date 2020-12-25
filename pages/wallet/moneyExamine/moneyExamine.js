// pages/wallet//moneyExamine/moneyExamine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta: 1,
    title: [{
      index: 1,
      name: '审核中'
    }, {
      index: 2,
      name: '审核成功'
    }, {
      index: 3,
      name: '审核失败'
    }],
    taskData: [],
  },


  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //高亮标题
  selectTitle: function (e) {
    let that = this;
    let data = e.currentTarget.dataset.index
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/audit_list?type=' +data, //仅为示例，并非真实的接口地址
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
            taskData: res.data.data,
            sta: data
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


  //获取审核数据
  getmon(){
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/audit_list?type=1', //仅为示例，并非真实的接口地址
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
            taskData: res.data.data,
            sta: 1
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
  


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getmon()
  },
})