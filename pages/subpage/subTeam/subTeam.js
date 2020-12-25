// pages/subpage//subTeam/subTeam.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //下级信息
    id:'',

    //下级商品信息
    listData:[],

    //总金额
    price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options
    })
  },


  //获取下级明细
  getTeamdata() {
    let that = this;
    let id = that.data.id
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/lower_details', //仅为示例，并非真实的接口地址
      method: 'POST',
      data:{
        'user_id':id.id
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          that.setData({
            listData: res.data.data.list,
            price: res.data.data.price,
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
    this.getTeamdata()
  },


})