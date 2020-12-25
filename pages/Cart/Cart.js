// pages/Cart/Cart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //全选状态
    staCart: 0,

    //总价
    totalPrice: 0,

    //编辑
    edit: 0,

    //购物车列表
    listData: '',

    //选中数量
    count: 0,

    //打折
    rebate: null,

    //限制金额
    satisfy:0

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 购物车结算
  goMinCart() {
    let listdata = this.data.listData
    let totalPrice = this.data.totalPrice
    let rebate = this.data.rebate
    let satisfy = this.data.satisfy
    let dataTr = []
    let z
    if (rebate == null) {
      z = totalPrice * 10 / 10
    } else {
      z = totalPrice * rebate / 10
    }
    for (var i = 0; listdata.length > i; i++) {
      if (listdata[i].select == true) {
        dataTr.push(listdata[i])
      }
    }
    if (dataTr.length != 0) {
      let strdata = JSON.stringify(dataTr)
      wx.navigateTo({
        url: '/pages/warehouse/takeCard/takeCard?id=1&totalprice=' + z.toFixed(2) + '&listcart=' + strdata + '&satisfy=' + satisfy,
      })
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
    }

  },


  //加多选状态
  getlistData(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'shopping_cart', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          if (res.data.data.list.length != 0) {
            for (var i = 0; res.data.data.list.length > i; i++) {
              res.data.data.list[i].select = false
            }
          }
          that.setData({
            listData: res.data.data.list,
            rebate: res.data.data.rebate,
            staCart: 0,
            satisfy:Number(res.data.data.satisfy)
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


  //多选
  selectedBox(e) {
    let index = e.currentTarget.dataset.id
    let listData = this.data.listData
    let lists = []
    if (listData[index].select == false) {
      listData[index].select = true
    } else {
      listData[index].select = false
    }

    for (var i = 0; listData.length > i; i++) {
      if (listData[i].select == true) {
        lists.push('1')
      }
    }

    this.setData({
      count: lists.length
    })

    if (listData.length == lists.length) {
      this.setData({
        listData,
        staCart: 1
      })
      this.getTotalPrice()
    } else {
      this.setData({
        listData,
        staCart: 0
      })
      this.getTotalPrice()
    }


  },


  //全选和全不选
  getAllChoi() {
    let listData = this.data.listData
    let staCart = this.data.staCart
    let lists = []

    if (staCart == 0) {
      for (var i = 0; listData.length > i; i++) {
        listData[i].select = true
        lists.push('1')
      }
      this.setData({
        listData,
        staCart: 1,
        count: lists.length
      })
    } else {
      for (var i = 0; listData.length > i; i++) {
        listData[i].select = false
        lists = []
      }
      this.setData({
        listData,
        staCart: 0,
        count: lists.length
      })
    }
    this.getTotalPrice()

  },


  //单个商品数量增加
  addNum(e) {

    let that = this;
    let token = wx.getStorageSync('token')
    let index = e.currentTarget.dataset.id

    wx.request({
      url: app.globalData.url + 'shopping_cart/add_number', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        'shopping_cart_id': index
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data)
          that.getlistData()
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
    this.getTotalPrice()

  },



  //单个商品数量减少
  outNum(e) {

    let that = this;
    let token = wx.getStorageSync('token')
    let index = e.currentTarget.dataset.id

    wx.request({
      url: app.globalData.url + 'shopping_cart/sub_number', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        'shopping_cart_id': index
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data)
          that.getlistData()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })

    this.getTotalPrice()
  },


  //计算总价
  getTotalPrice() {
    let listData = this.data.listData
    let tota = 0
    let pea
    let num
    for (var i = 0; listData.length > i; i++) {
      pea = Number(listData[i].price)
      num = Number(listData[i].num)
      if (listData[i].select == 1) {
        tota += pea * num
      }
    }
    this.setData({
      totalPrice: tota.toFixed(2)
    })
  },


  //编辑
  changEdit() {
    this.setData({
      edit: 1
    })
  },



  //删除
  changDelete() {
    let that = this;
    let token = wx.getStorageSync('token')
    let listDatas = this.data.listData
    let ToDeleted = []
    for (let i = 0; listDatas.length > i; i++) {
      if (listDatas[i].select == true) {
        ToDeleted.push(listDatas[i].id)
        wx.request({
          url: app.globalData.url + 'shopping_cart/del_cart', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            'shopping_cart_id': listDatas[i].id
          },
          header: {
            'token': token,
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              that.getlistData()
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
        })
      }
    }

    that.setData({
      edit: 0,
      totalPrice: 0,
      count: 0
    })
  },





  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlistData()
  },
})