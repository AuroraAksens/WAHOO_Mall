//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    background: ['/image/index2.png', '/image/index2.png', '/image/index2.png'],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,

    //首页数据
    listData: []
  },



  onLoad: function(){
    
  },


  

  //跳转商品列表
  goOrderList() {
    wx.navigateTo({
      url: '/pages/subpage/orderList/orderList?search=1&id=0'
    })
  },

  goOrderLists(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subpage/orderList/orderList?id=' + id + '&search=0'
    })
  },

  goMore() {
    wx.navigateTo({
      url: '/pages/subpage/orderList/orderList?id=0&search=0'
    })
  },

  //跳转商品详情
  gotoDetails(e) {
    let member = wx.getStorageSync('member')
    let id = e.currentTarget.dataset.id
    if (member == '' || member == 4 || member == 0) {
      wx.navigateTo({
        url: '/pages/subpage/comDetails/comDetails?id=' + id
      })
    } else {
      wx.showToast({
        title: '此链接只限WVIP进入',
        icon: 'none',
        duration:2000
      })
    }

  },



  //获取首页数据
  getIndex() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          for(let i = 0 ; i< res.data.data.category.length;i++){
            res.data.data.category[i].imageCate = '/image/imageCate/'+ i +'.jpg'
          }
          that.setData({
            listData: res.data.data
          })
          console.log(res.data.data.category)
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


  //跳转新闻详情
  goNewsDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subpage/newsDetails/newsDetails?actid=' + id
    })
  },

  //跳转所有新事
  goNewsMore() {
    wx.navigateTo({
      url: '/pages/subpage/newsList/newsList'
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getIndex()
  },

})