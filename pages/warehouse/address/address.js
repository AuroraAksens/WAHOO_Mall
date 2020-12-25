// pages/warehouse//address/address.js
const app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //收货人姓名
    name:'',

    //收货人电话
    phone:'',

    //收货人地址
    address:'',

    //地区
    region: ['广东省', '广州市', '海珠区'],
  },


 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  //选择地区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //保存地址
  saveDZ(){
    wx.navigateBack({
      delta: 1
    })
  },


  //获取收货人
  getname(e){
    let name = e.detail.value
    this.setData({
      name
    })
  },


  //获取收货电话
  getphone(e){
    let phone = e.detail.value
    this.setData({
      phone
    })
  },


  //获取收货地址
  getaddress(e){
    let address = e.detail.value
    this.setData({
      address
    })
  },


  //提交地址数据
  postaddress(){
    let that = this;
    let name = this.data.name
    let phone = this.data.phone
    let address = this.data.address
    let region = this.data.region
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'cloud_warehouse/add_address', //仅为示例，并非真实的接口地址
      method: 'POST',
      data:{
        'name':name,
        'phone':phone,
        'province':region[0],
        'city':region[1],
        'area':region[2],
        'detailed_address':address
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000)
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

  },
})