// pages/wallet//addBank/addBank.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //姓名
    name:'',

    //银行名称
    idname:'',

    //银行卡号
    idnumber:'',

    chiose:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chiose:options.chiose
    })
  },

  //获取姓名
  getname(e){
    let name = e.detail.value
    this.setData({
      name
    })
  },

  //获取银行名称
  getidname(e){
    let idname = e.detail.value
    this.setData({
      idname
    })
  },

  //获取银行卡号
  getidnumber(e){
    let idnumber = e.detail.value
    this.setData({
      idnumber
    })
  },

  //提交银行卡数据
  postBank(){
    let that = this;
    let name = this.data.name
    let idname = this.data.idname
    let idnumber = this.data.idnumber
    let chiose = this.data.chiose
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'bank_card/add_bank', //仅为示例，并非真实的接口地址
      method: 'POST',
      data:{
        'name':name,
        'bank_name':idname,
        'card_number':idnumber
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
          if(chiose == 1){
            console.log('没有添加过银行卡')
            setTimeout(function(){
              wx.navigateBack({
                delta: 2,
                success(){
                  wx.navigateTo({
                    url: '/pages/wallet/listBank/listBank?sta=1',
                  })
                }
              })
            },1000)
          }else{
            console.log('添加过银行卡再添加')
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
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