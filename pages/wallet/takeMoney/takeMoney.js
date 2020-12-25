// pages/wallet//takeMoney/takeMoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //可提金额
    bond: '',

    //提现
    bonds: '',

    //银行卡信息
    bankid: '',

    //检查是否有银行卡
    check: 0,

    //提现说明
    takeMoney:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let bond = options.bond
    let bankid = options.bankid
    let wallet = options.wallet
    let bankids = JSON.parse(bankid)
    if (bankids == 0) {
      this.setData({
        bond,
        bankid: bankids,
        check: 0,
        takeMoney:wallet
      })
      wx.showModal({
        title: '绑定银行卡提示',
        content: '您还没有绑定银行卡，是否前往绑定。',
        success(res) {
          if (res.confirm) {
            that.addBank()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else {
      this.setData({
        bond,
        bankid: bankids,
        check: 1,
        takeMoney:wallet
      })
    }
  },

  //全部提现
  getAll() {
    let bond = this.data.bond
    this.setData({
      bonds: bond
    })
  },


  //输入金额
  getTM(e) {
    this.setData({
      bonds: e.detail.value
    })
  },


  //选择银行
  goBank() {
    wx.navigateTo({
      url: '/pages/wallet/listBank/listBank?sta=1'
    })
  },


  //提现
  takeNoy() {
    let that = this;
    let bonds = that.data.bonds
    let bankid = that.data.bankid.bank_id
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/toBalance', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        'price': bonds,
        'banId': bankid
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
          // that.setData({
          //   wallet: res.data.data,
          // })
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


  //提现明细
  gomoneyde() {
    wx.navigateTo({
      url: '/pages/wallet/moneyExamine/moneyExamine'
    })
  },


  //添加银行卡
  addBank() {
    wx.navigateTo({
      url: '/pages/wallet/listBank/listBank?sta=0&chiose=1'
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let bankidAll = app.globalData.bankid
    console.log(bankidAll)
    if (bankidAll != '') {
      this.setData({
        bankid: bankidAll
      })
    }
  },
})