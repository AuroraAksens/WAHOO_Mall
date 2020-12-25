// pages/subpage//Notice/Notice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //活动数据
    noticedata:[]
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //跳转公告详情
  gotoDetails(e){
    let actid = e.currentTarget.dataset.actid
    wx.navigateTo({
      url: '/pages/subpage/NoticeDetails/NoticeDetails?actid='+actid
    })
  },


  //获取活动数据
  getNotice(){
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/activity', //仅为示例，并非真实的接口地址
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
            noticedata: res.data.data
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
    this.getNotice()
  },

})