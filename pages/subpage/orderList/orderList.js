// pages/subpage//orderList/orderList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sel: 0,

    search: false,

    //列表数据
    listData: [],
    OrderListID: 0,
    sort: 2,

    //会员等级
    member:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      OrderListID: options.id
    })
    let search = options.search
    if (search == 1) {
      this.setData({
        search: true
      })
    } else {
      this.setData({
        search: false
      })
    }
  },



  orderListdata(e) {
    let that = this
    let sort = this.data.sort
    let token = wx.getStorageSync('token')
    let member = wx.getStorageSync('member')
    let url = ''
    if (e == 0) {
      url = 'product?category_id=' + that.data.OrderListID
    } else if (e == 1) {
      url = 'product?category_id=' + that.data.OrderListID + '&volume=1'
    } else {
      url = 'product?category_id=' + that.data.OrderListID + '&sort=' + sort
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + url, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          
          that.setData({
            listData: res.data.data,
            member
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data)
      },
    })
  },



  searchData(e){
    let that = this
    let seaData = e.detail.value
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'product?category_id=' + 0 + '&search_text=' + seaData, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            listData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        console.log(res.data)
      },
    })
  },
  
  sorttap() {
    let sort = this.data.sort
    let sorts = sort == 1 ? 2 : 1
    this.setData({
      sort: sorts
    })
  },

  //高亮标题
  selectNav(e) {
    let that = this
    let token = wx.getStorageSync('token')
    let sel = e.currentTarget.dataset.sel
    that.orderListdata(sel)
    this.setData({
      sel: sel
    })
  },

  // 跳转商品详情
  goComDeta(e) {
    let ComDate = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subpage/comDetails/comDetails?id=' + ComDate
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.orderListdata(0)
  },

})