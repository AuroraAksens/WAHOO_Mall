// pages/wallet//listBank/listBank.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //银行卡列表数据
    bankData: [],

    //判断是否选择银行卡
    sta: 0,

    //选中状态
    selindex:-1,

    //选中银行卡数据
    bankdata:'',

    chiose:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sta = options.sta
    let chiose = options.chiose == 1 ? 1 : 0
    this.setData({
      sta,
      chiose
    })
  },

  //添加银行卡
  gotoBank() {
    let chiose = this.data.chiose
    console.log(chiose)
    wx.navigateTo({
      url: '/pages/wallet/addBank/addBank?chiose=' + chiose
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
          that.setData({
            bankData: res.data.data
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


  //解除绑定银行卡
  closerBank(e) {
    let that = this;
    let bankid = e.currentTarget.dataset.bankid
    let token = wx.getStorageSync('token')
    wx.showActionSheet({
      itemList: ['解除绑定银行卡'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.url + 'bank_card/remove', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              'bank_id': bankid
            },
            header: {
              'token': token,
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading()
              if (res.data.code == 200) {
                console.log(res.data)
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  that.getlistbank()
                }, 1000)
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
        }
      },
    })
  },


  //选择银行卡
  setBank(e){
    let index = e.currentTarget.dataset.index
    let bankid = e.currentTarget.dataset.bankid
    this.setData({
      selindex:index,
      bankdata:bankid
    })
  },


  //确认选择
  selBank(){
    let bankid = this.data.bankdata
    app.globalData.bankid = bankid
    wx.navigateBack({
      delta: 1
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlistbank()
  },

})