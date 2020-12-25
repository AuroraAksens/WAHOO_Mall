// pages/order//take/take.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    item: ['待发货', '已收货', '已完成', '已取消'],

    //提货订单数据
    listData: [],

    //快递单号
    contents:''
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
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'order/delivery_order?type=' + index, //仅为示例，并非真实的接口地址
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
            TabCur: index,
            listData: res.data.data
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


  //获取提货数据
  getlistdata(i) {
    let that = this;
    let token = wx.getStorageSync('token')
    let index = i
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'order/delivery_order?type=' + index, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            TabCur: index,
            listData: res.data.data
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


  //确认收货
  confirm(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '收货提示',
      content: '是否确认收货',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.url + 'cloud_warehouse/confirm_receipt', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              pick_order_id: id
            },
            header: {
              'token': token,
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading()
              if (res.data.code == 200) {
                console.log(res.data.data)
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
                that.getlistdata(2)
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },



  //立即评论
  comment(e) {
    let orderid = e.currentTarget.dataset.productid
    let prid = e.currentTarget.dataset.prid
    wx.navigateTo({
      url: '/pages/subpage/comment/comment?orderid=' + orderid + '&prid=' + prid
    })
  },


  //复制快递单号
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '已复制快递单号'
            })
          }
        })
      }
    })
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlistdata(0)
  },

})