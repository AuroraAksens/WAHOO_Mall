// pages/subpage//comDetails/comDetails.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['/image/tihuo.png', '/image/tihuo.png', '/image/tihuo.png'],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    indicatorColor: 'rgb(245, 245, 245)',
    active: '#FFFFFF',

    choice: 0,
    selGui: '',
    ViewData: [],
    specification: [],
    comDetailsID: '',
    num:1,
    plAll:0
  },


  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      comDetailsID: options.id
    })
  },


  getBrandData() {
    let that = this
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'product/details?product_id=' + that.data.comDetailsID, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            ViewData: res.data.data,
            specification: res.data.data.specs[0],
            selGui: res.data.data.specs[0].specs_id
          })
          console.log(res.data)
        }
      }
    })
  },
  //显示弹框
  showChoice() {
    let choice = this.data.choice
    if (choice == 0) {
      this.setData({
        choice: 1
      })
    } else {
      this.setData({
        choice: 0
      })
    }
  },

  //返回首页
  goHome() {
    wx.navigateBack({
      delta: 4
    })
  },


  //返回购物车页
  goCart(){
    wx.reLaunch({
      url: '/pages/navbar/navbar?current=2'
    })
  },


  //选择规格
  selGui(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.id
    let specifications = this.data.ViewData
    let a = {}
    for (let i = 0; i < specifications.specs.length; i++) {
      if (index == specifications.specs[i].specs_id) {
        a = specifications.specs[i]
      }
    }
    this.setData({
      selGui: index,
      specification: a
    })

  },


  // 数量减
  spcNum(){
    let num = this.data.num
    if(num == 1){
      wx.showToast({
        title: '已达到库存最小值',
        icon: 'none',
        duration:2000
      })
    }else{
      num--
    }
    this.setData({
      num
    })
  },

  // 数量加
  addNum(e){
    let number = e.currentTarget.dataset.number
    let num = this.data.num
    if(num < number){
      num++
      this.setData({
        num
      })
    }else{
      wx.showToast({
        title: '已达到库存最大值',
        icon: 'none',
        duration:2000
      })
    }
    
  },


  //添加购物车
  addCart(e){
    let that = this
    let token = wx.getStorageSync('token')
    let productid = e.currentTarget.dataset.productid
    let num = that.data.num
    let selGui = that.data.selGui
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'shopping_cart', //仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'token':token,
        'content-type': 'application/json' // 默认值
      },
      data:{
        product_id: productid,
        specs_id: selGui,
        number: num
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            choice: 0
          })
        } else {
          wx.showModal({
            title: '登录提示',
            content: '您还未登录，是否跳转登录页',
            success (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/navbar/navbar?current=3'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
    })
  },


  //预览图片
  showImage(e){
    let image = e.currentTarget.dataset.image
    let images = e.currentTarget.dataset.images
    wx.previewImage({
      current: image,
      urls: images
    })
  },


  //查看全部评论
  seeAll(){
    wx.showToast({
      title: '已展开所有评论',
      icon: 'none',
      duration:1000
    })
    this.setData({
      plAll:1
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBrandData()
  },

})