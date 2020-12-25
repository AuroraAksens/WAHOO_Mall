// pages/order//takeSub/takeSub.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '',
    item: ['全部', '待付款', '已完成', '已取消'],

    //订单数据
    listData: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  
  //切换导航条
  tabSelect(e) {
    let that = this;
    let index = e.currentTarget.dataset.id
    let ind = index == 0 ? '' : index
    let token = wx.getStorageSync('token')
    if(ind!=0){
      ind--
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'order/lower_order?type=' + ind, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data.data)
          that.setData({
            TabCur: index == 0 ? '' : index,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            listData:res.data.data
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



//进入请求数据
  getListData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'order/lower_order?type=', //仅为示例，并非真实的接口地址
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
            listData:res.data.data
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
    this.getListData()
  },
})