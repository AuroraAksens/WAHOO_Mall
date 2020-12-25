// pages/subpage//newsList/newsList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //新事列表数据
    newsData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

 
  //跳转新事详情
  gotoDetails(e){
    let actid = e.currentTarget.dataset.newsid
    wx.navigateTo({
      url: '/pages/subpage/newsDetails/newsDetails?actid='+actid
    })
  },


  //获取新事列表数据
  getNotice(){
    let that = this;
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
          console.log(res.data)
          that.setData({
            newsData: res.data.data
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