// pages/warehouse//house/house.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    takeGoods: 0,

    //云仓数据
    houseData: [],

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  //我要提货
  takeGoods() {
    let houseData = this.data.houseData
    for (var i = 0; houseData.length > i; i++) {
      for (var p = 0; houseData[i].cloud_specs.length > p; p++) {
        houseData[i].cloud_specs[p].number = 1
      }
    }
    this.setData({
      takeGoods: 1,
    })
  },




  //获取云仓数据
  getHouseData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.url + 'cloud_warehouse/my_cloud', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data)
          for (var i = 0; res.data.data.length > i; i++) {
            res.data.data[i].isSelect = false
          }
          that.setData({
            houseData: res.data.data,
            takeGoods:0
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


  //选择商品
  selectsp(e) {
    let houseData = this.data.houseData
    let index = e.currentTarget.dataset.index
    if (houseData[index].isSelect == true) {
      houseData[index].isSelect = false
    } else {
      houseData[index].isSelect = true
      for (var i = 0; houseData[index].cloud_specs.length > i; i++) {
        houseData[index].cloud_specs[i].isSel = false
      }
    }
    this.setData({
      houseData
    })
  },


  //选择规格
  selsp(e) {
    let index = e.currentTarget.dataset.index
    let indexs = e.currentTarget.dataset.indexs
    let houseData = this.data.houseData

    // houseData[index].cloud_specs[indexs].img = houseData[index].image
    // console.log(houseData[index].cloud_specs[indexs])

    if (houseData[index].cloud_specs[indexs].isSel == true) {
      houseData[index].cloud_specs[indexs].isSel = false
    } else {
      houseData[index].cloud_specs[indexs].isSel = true
    }
    this.setData({
      houseData
    })
  },


  //规格数量加
  addNum(e) {
    let index = e.currentTarget.dataset.index
    let indexs = e.currentTarget.dataset.indexs
    let sur = e.currentTarget.dataset.sur
    let houseData = this.data.houseData
    if (sur > houseData[index].cloud_specs[indexs].number) {
      houseData[index].cloud_specs[indexs].number++
    } else {
      wx.showToast({
        title: '已达到最多可提数量',
        icon: 'none',
        duration: 1000
      })
    }
    this.setData({
      houseData
    })
  },


  //规格数量减
  reduceNum(e) {
    let index = e.currentTarget.dataset.index
    let indexs = e.currentTarget.dataset.indexs
    let houseData = this.data.houseData
    if (houseData[index].cloud_specs[indexs].number > 1) {
      houseData[index].cloud_specs[indexs].number--
    } else {
      wx.showToast({
        title: '最低数量',
        icon: 'none',
        duration: 1000
      })
    }
    this.setData({
      houseData
    })
  },


  //立即提货
  gotakeCard() {
    let houseData = this.data.houseData
    let takeData = [] //提取到的所有数据
    for (var i = 0; houseData.length > i; i++) {
      for (var p = 0; houseData[i].cloud_specs.length > p; p++) {
        if (houseData[i].cloud_specs[p].isSel == true) {
          takeData.push(houseData[i].cloud_specs[p])
        }
      }
    }

    if (takeData.length != 0) {
      let takeDatas = JSON.stringify(takeData)
      wx.navigateTo({
        url: '/pages/warehouse/takeCard/takeCard?id=0&takedata=' + takeDatas
      })
    }else{
      wx.showToast({
        title: '请选择要提货的商品',
        icon: 'none',
        duration:2000
      })
    }

  },


  //我要进货
  getGoods() {
    wx.reLaunch({
      url: '/pages/navbar/navbar?current=0',
      success() {
        wx.navigateTo({
          url: '/pages/subpage/orderList/orderList?id=0&search=0'
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.getHouseData()
  },

})