// pages/subpage//team/team.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sel: 0,

    //团队数据
    teamdata: [],

    //直推下级人数
    p_member:'',

    //平推团队人数
    m_member:''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 跳转下级明细
  goSubTeam(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let image = e.currentTarget.dataset.image
    let member = e.currentTarget.dataset.member
    // let members = JSON.stringify(member)
    console.log(name)
    console.log(image)
    console.log(member)
    wx.navigateTo({
      url: '/pages/subpage/subTeam/subTeam?id='+id + '&name=' + name + '&image=' + image + '&member= '+ member
    })
  },


  //导航切换
  selAct(e) {
    let sel = e.currentTarget.dataset.sel
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/my_team?type=' + sel, //仅为示例，并非真实的接口地址
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
            teamdata: res.data.data.list,
            sel
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


  //获取团队数据
  getTeamdata() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/my_team?type=0', //仅为示例，并非真实的接口地址
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
            teamdata: res.data.data.list,
            m_member:res.data.data.u_member,
            p_member:res.data.data.p_member
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