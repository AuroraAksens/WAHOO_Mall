// pages/wallet//mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //钱包数据
    wallet:'',

    //银行卡id
    bankid:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  //跳转提现页
  goTake(e) {
    let bond = e.currentTarget.dataset.bond
    let bankid = this.data.bankid
    let wallet = this.data.wallet.h_price
    let bankids = JSON.stringify(bankid)
    wx.navigateTo({
      url: '/pages/wallet/takeMoney/takeMoney?bond=' +bond + '&bankid=' +bankids + '&wallet=' + wallet
    })
  },

  //跳转余额
  goBalance(e) {
    let sta = e.currentTarget.dataset.stabal
    let pay = e.currentTarget.dataset.pay
    wx.navigateTo({
      url: '/pages/wallet/balance/balance?sta=' + sta + '&pay=' +pay
    })
  },

  //跳转银行卡
  goBank() {
    wx.navigateTo({
      url: '/pages/wallet/listBank/listBank?sta=0'
    })
  },


  //获取钱包数据
  getWallet() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            wallet: res.data.data,
          })
        } else if (res.data.code == 10003) {
          wx.setStorageSync('token', '')
          that.checkLogin()
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



  //获取银行卡数据
  getlistbank() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'bank_card/bank_list', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          if(res.data.data.length != 0){
            that.setData({
              bankid: res.data.data[0]
            })
          }else{
            that.setData({
              bankid: 0
            })
          }
          
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
    this.getWallet()
    this.getlistbank()
  },

})