// pages/warehouse//takeCard/takeCard.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staId: 0,

    //购物车数据
    listData: [],
    listDatas: [],

    //购物车id
    cartid: [],

    //弹框显示
    paytips: false,
    paytips2: 0,
    payclose: 0,

    //总价
    totalPrice: 0,

    //会员等级
    member: 0,

    //可用余额
    balance: '',

    //提货余额
    payment: '',

    //限制金额
    satisfy: 0,

    //地址
    addList: '',

    //判断地址
    chaddList:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id == 1) {
      let listData = options.listcart
      let satisfy = options.satisfy
      let listdatas = JSON.parse(listData)
      let member = wx.getStorageSync('member')
      let balance = wx.getStorageSync('balance')
      let payment = wx.getStorageSync('payment')
      let a = []
      let b
      for (var i = 0; listdatas.length > i; i++) {
        b = {
          'shopping_cart_id': listdatas[i].id
        }
        a.push(b)
      }
      this.setData({
        staId: options.id,
        listData: listdatas,
        cartid: a,
        totalPrice: options.totalprice,
        member,
        payment,
        balance,
        satisfy
      })
    } else {
      let takedata = options.takedata
      let takedatas = JSON.parse(takedata)
      console.log(takedatas)
      this.setData({
        staId: options.id,
        listDatas: takedatas
      })
    }
  },


  // 跳转添加收货地址
  goAddGoods() {
    wx.navigateTo({
      url: '/pages/warehouse/address/address'
    })
  },



  //提货购物车结算
  takeHW() {
    let that = this;
    let listDatas = this.data.listDatas
    let listData = []
    for (let i = 0; i < listDatas.length; i++) {
      let arr = {
        "product_id": listDatas[i].product_id,
        "specs_id": listDatas[i].specs.specs_id,
        "product_name": listDatas[i].specs.name,
        "product_image": listDatas[i].product_image,
        "number": listDatas[i].number
      }
      listData.push(arr)
    }
    let addList = this.data.addList.address_id
    let chaddList = this.data.chaddList
    let token = wx.getStorageSync('token')
    console.log(addList)
    if (chaddList == false) {
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认要进行提货',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: app.globalData.url + 'cloud_warehouse/task_delivery', //仅为示例，并非真实的接口地址
              method: 'POST',
              data: {
                'address_id': addList,
                'item': listData
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
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 2,
                      success() {
                        wx.navigateTo({
                          url: '/pages/order/take/take'
                        })
                      }
                    })
                  }, 1000)
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
    }
  },



  //获取地址数据
  getAddress() {
    let that = this;
    let token = wx.getStorageSync('token')
    let index = app.globalData.index
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'cloud_warehouse/address_list', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data.data)
          if(res.data.data.length == 0){
            that.setData({
              chaddList: false
            })
          }else{
            that.setData({
              addList: res.data.data[index],
              chaddList: true
            })
          }
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



  //选择地址
  goListress() {
    wx.navigateTo({
      url: '/pages/warehouse/listRess/listRess'
    })
  },


  //结算购物车
  takeHWs() {
    let member = this.data.member
    let totalPrice = this.data.totalPrice
    let satisfy = this.data.satisfy
    if (member == 0 && totalPrice <= satisfy) {
      wx.showToast({
        title: '购买商品需要买满' + satisfy + '元',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        paytips: true
      })
    }
  },

  //关闭弹窗
  close() {
    this.setData({
      paytips: false
    })
  },


  //选择支付方式
  choice() {
    let tps = this.data.paytips2
    if (tps == 1) {
      this.setData({
        paytips2: 0
      })
    } else {
      this.setData({
        paytips2: 1
      })
    }
  },

  closeBox(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      payclose: id
    })
  },


  //支付
  payMoney() {
    let that = this;
    let token = wx.getStorageSync('token')
    let cartid = that.data.cartid
    let status = that.data.payclose
    let statusnum = Number(status)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'product/purchase', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        'status': statusnum,
        'data': cartid
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          wx.hideLoading()
          if (statusnum == 2) {
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: 'MD5',
              paySign: res.data.data.paySign,
              success(res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2,
                    success() {
                      wx.navigateTo({
                        url: '/pages/order/purchase/purchase',
                      })
                    }
                  })
                }, 1000)
              },
              fail: function () {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2,
                    success() {
                      wx.navigateTo({
                        url: '/pages/order/purchase/purchase',
                      })
                    }
                  })
                }, 1000)
              }
            })
          } else {
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 2,
                success() {
                  wx.navigateTo({
                    url: '/pages/order/purchase/purchase',
                  })
                }
              })
            }, 1000)
            that.setData({
              paytips: false
            })
          }

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
    if (this.data.staId == 0) {
      this.getAddress()
    }
  },

})