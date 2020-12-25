// pages/subpage/openingPay/openingPay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    showTips2: false,

    //会员类型ID
    memberid: '',

    //会员列表数据
    memData: '',

    //总价
    total: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let memberid = options.memberid
    this.setData({
      memberid
    })
    console.log(memberid)
  },

  //显示弹框
  showTips2() {
    let showTips2 = this.data.showTips2
    if (showTips2 == true) {
      this.setData({
        showTips2: false
      })
    } else {
      this.setData({
        showTips2: true
      })
    }
  },


  //回到我的页面
  goMine() {
    wx.reLaunch({
      url: '/pages/navbar/navbar?current=3',
    })
  },


  //获取会员列表数据
  getMenData() {
    let that = this;
    let token = wx.getStorageSync('token')
    let memberid = this.data.memberid
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'member', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          memberid--
          let total = Number(res.data.data.list[memberid].price) + Number(res.data.data.list[memberid].bond)
          that.setData({
            memData: res.data.data.list[memberid],
            total
          })
        }else if (res.data.code == 10003) {
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



  //开通会员
  openMem() {
    let that = this;
    let token = wx.getStorageSync('token')
    let memberid = that.data.memberid
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'member/open_vip', //仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      data: {
        'member_id': memberid,
      },
      success(res) {
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success(res) {
            wx.showToast({
              title: '开通成功',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              showTips2: false
            })
            setTimeout(function(){
              wx.reLaunch({
                url: '/pages/navbar/navbar?current=3'
              })
            },1000)
          },
          fail: function() {
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



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMenData()
  },
})