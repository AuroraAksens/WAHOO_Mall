// pages/subpage//sale/sale.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //销售列表数据
    listdata: [],

    //默认日期
    date: '',

    //销售总额
    price: '',

    //折扣
    rebate: 0,

    //利润
    profit: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let time =  Y + '-' + M
    console.log(time)
    this.setData({
      date:time
    })
  },


  //获取销售列表数据
  getListdata() {
    let that = this;
    let token = wx.getStorageSync('token')
    let time = that.data.date
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/my_sale?date='+time, //仅为示例，并非真实的接口地址
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
            listdata: res.data.data.list,
            price: res.data.data.price,
            rebate: res.data.data.rebate,
            profit: res.data.data.profit
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


  //选择日期
  bindDateChange: function (e) {
    let date = e.detail.value
    console.log(date)
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/my_sale?date=' + date, //仅为示例，并非真实的接口地址
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
            listdata: res.data.data.list,
            price: res.data.data.price,
            date: date,
            rebate: res.data.data.rebate,
            profit: res.data.data.profit
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
    this.getListdata()
  },


})