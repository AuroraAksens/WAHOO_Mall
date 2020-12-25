// pages/wallet//balance/balance.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staBal: '',
    select: 2,

    //充值弹框
    modalName: '',

    //拉起弹框
    inpsta: false,

    //金额
    price: '',

    //货款明细
    balanList: [],

    //提货额度
    pay:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let staBal = options.sta
    let pay = options.pay
    this.setData({
      staBal: staBal,
      pay
    })
  },


  // 高亮导航
  sleAct(e) {
    let that = this;
    let select = e.currentTarget.dataset.select
    if(select == 2){
      select = ''
    }
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/payment_details?type=' + select, //仅为示例，并非真实的接口地址
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
            balanList: res.data.data,
            select: select == '' ? 2 : select
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

  //充值跳转银行卡
  gotoBank() {
    wx.navigateTo({
      url: '/pages/wallet/listBank/listBank'
    })
  },


  //充值弹框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      inpsta: true
    })
  },

  //隐藏弹框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },


  //获取输入金额
  getPrice(e) {
    let price = e.detail.value
    this.setData({
      price
    })
  },


  //提交金钱数据
  postPrice() {
    let that = this;
    let price = this.data.price
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/recharge', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        'price': price,
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          paySign: res.data.data.paySign,
          signType: 'MD5',
          success(res) {
            that.hideModal()
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 1500
            })
          },
          fail: function () {
            that.hideModal()
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1500
            })
          }
        })
      },
    })
  },


  //获取贷款明细
  getpayment() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/payment_details?type=', //仅为示例，并非真实的接口地址
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
            balanList: res.data.data
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
    this.getpayment()
  },

})