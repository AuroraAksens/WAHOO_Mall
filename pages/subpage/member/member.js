// pages/subpage/member/member.js
const app = getApp()
Page({

  data: {

    cardCur: 0,
    //弹框 false关闭  true开启
    showTips: false,

    // swiperList: [{
    //   id: 0,
    //   type: 'image',
    //   url: '/image/member/top3.png',
    //   title: '联合创始人'
    // }, {
    //   id: 1,
    //   type: 'image',
    //   url: '/image/member/top2.png',
    //   title: '董事'
    // }, {
    //   id: 2,
    //   type: 'image',
    //   url: '/image/member/top1.png',
    //   title: '合伙人'
    // }, {
    //   id: 3,
    //   type: 'image',
    //   url: '/image/member/top4.png',
    //   title: '会员'
    // }],


    //会员数据
    memData: [],

    //会员等级
    memid: '',

    //开通等级
    memberid: '',

    //判断是否填写过表单
    state:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let memid = options.memid
    this.setData({
      memid
    })
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },


  //  免责声明
  showTips(e) {
    let showTips = this.data.showTips
    let memberid = e.currentTarget.dataset.memberid
    if (showTips == true) {
      this.setData({
        showTips: false,
      })
    } else {
      this.setData({
        showTips: true,
        memberid
      })
    }
  },

  //已开通
  showTips2() {
    wx.showToast({
      title: '您已开通此会员',
      icon: 'none',
      duration: 2000
    })
  },


  //跳转开通会员
  goOpen() {
    let memberid = this.data.memberid
    let state = this.data.state
    if (state == true) {
      wx.navigateTo({
        url: '/pages/subpage/opening/opening?memberid=' + memberid
      })
    } else {
      wx.navigateTo({
        url: '/pages/subpage/openingPay/openingPay?memberid=' + memberid,
      })
    }
    this.setData({
      showTips: false
    })
  },

  //获取会员列表数据
  getMenData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'member', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            memData: res.data.data.list,
            state:res.data.data.state
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
    this.getMenData()
  },


})