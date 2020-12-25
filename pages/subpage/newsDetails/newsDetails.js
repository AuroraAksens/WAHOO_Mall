// pages/subpage//newsDetails/newsDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //新事id
    actid:'',

    //详情数据
    newtext:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actid = options.actid
    this.setData({
      actid
    })
  },


  //获取新事数据
  getNotice() {
    let that = this;
    let actid = that.data.actid
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/new_list', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          for (var i = 0; res.data.data.length > i; i++) {
            if (res.data.data[i].news_id == actid) {
              that.setData({
                newtext: res.data.data[i].content
              })
            }
          }
          console.log(that.data.newtext)
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
    this.getNotice()
  },


})