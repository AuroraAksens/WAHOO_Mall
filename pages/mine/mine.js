var app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  data: {

    cardCur: 0,

    //登录状态
    loginSta: 0,

    //问题反馈
    problem: 0,

    //用户数据
    userData: '',


    //订单管理
    orderList: [{
      name: '提货订单',
      pages: '/pages/order/take/take',
      image: '/image/member/take.png'
    }, {
      name: '进货订单',
      pages: '/pages/order/purchase/purchase',
      image: '/image/member/purchase.png'
    }, {
      name: '下级订单',
      pages: '/pages/order/takeSub/takeSub',
      image: '/image/member/takeSub.png'
    }, ],


    //常用功能 -- 有会员
    List: [{
      name: '我的云仓',
      pages: '/pages/warehouse/house/house',
      image: '/image/member/house.png'
    }, {
      name: '我的钱包',
      pages: '/pages/wallet/mine/mine',
      image: '/image/member/mine.png'
    }, {
      name: '我的销售',
      pages: '/pages/subpage/sale/sale',
      image: '/image/member/sale.png'
    }, {
      name: '我的团队',
      pages: '/pages/subpage/team/team',
      image: '/image/member/team.png'
    }, {
      name: '我的授权',
      pages: '/pages/subpage/authorization/authorization',
      image: '/image/member/authorization.png'
    }, {
      name: '平台公告',
      pages: '/pages/subpage/Notice/Notice',
      image: '/image/member/notice.png'
    }, {
      name: '问题反馈',
      pages: 1,
      image: '/image/member/Problem.png'
    }, {
      name: '我要升级',
      pages: 2,
      image: '/image/member/member.png'
    }, ],

    //常用功能 -- 无会员
    ListOrd: [ {
      name: '平台公告',
      pages: '/pages/subpage/Notice/Notice',
      image: '/image/member/notice.png'
    }, {
      name: '问题反馈',
      pages: 1,
      image: '/image/member/Problem.png'
    }, {
      name: '我要升级',
      pages: 2,
      image: '/image/member/member.png'
    }, ]
  },
  methods: {
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },


    checkLogin() {
      let that = this
      let token = wx.getStorageSync('token')
      if (token) {
        that.setData({
          loginSta: 2
        })
      } else {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  that.setData({
                    loginSta: 1
                  })
                  wx.setStorageSync('userinfo', res.userInfo)
                }
              })
            } else {
              // 未授权
              that.setData({
                loginSta: 0
              })
            }
          }
        })
      }
    },



    //获取用户授权信息
    bindGetUserInfo(e) {
      let that = this
      console.log(e.detail.userInfo)
      if (e.detail.errMsg == "getUserInfo:ok") {
        that.setData({
          loginSta: 1
        })
        wx.setStorageSync('userinfo', e.detail.userInfo)
      } else {
        that.setData({
          loginSta: 0
        })
      }
    },


    // 获取手机号
    getPhoneNumber(e) {
      let that = this
      let userinfo = wx.getStorageSync('userinfo')
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wx.showLoading({
          title: '加载中',
        })
        wx.login({
          success(res) {
            if (res.code) {
              wx.request({
                url: app.globalData.url + 'login',
                method: 'POST',
                data: {
                  'code': res.code,
                  'iv': e.detail.iv,
                  'encryptedData': e.detail.encryptedData,
                  'nickname': userinfo.nickName,
                  'avatar_image': userinfo.avatarUrl,
                },
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                  wx.hideLoading();
                  if (res.data.code == 200) {
                    var token = res.data.data.token
                    wx.setStorageSync('token', token)
                    wx.showToast({
                      title: '登录成功',
                      icon: 'none',
                      duration: 1000
                    })
                    that.getMine()
                    that.gohuiyuan(token)
                    that.triggerEvent('getscenes')
                    that.setData({
                      loginSta: 2
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                    that.setData({
                      loginSta: 1
                    })
                  }
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      } else {
        that.setData({
          loginSta: 1
        })
      }
    },


    //获取我的页面数据
    getMine() {
      let that = this;
      let token = wx.getStorageSync('token')
      // let scene = wx.getStorageSync('scene')
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
          // wx.setStorageSync('scene','')
          let member = res.data.data.member
            if (member == null) {
              wx.setStorageSync('member', 0)
            } else {
              wx.setStorageSync('member', member.grade)
            }
            wx.setStorageSync('balance', res.data.data.balance) //可用余额
            wx.setStorageSync('payment', res.data.data.payment) //提货余额
            that.setData({
              userData: res.data.data,
              loginSta: 2
            })
            that.gohuiyuan(token)
            app.globalData.userInfotui = res.data.data
            console.log(app.globalData.userInfotui)
            console.log(app.globalData.extension)
          } else if (res.data.code == 10003) {
            wx.setStorageSync('token', '')
            that.checkLogin()
            wx.showToast({
              title: '登录状态过期，请重新登录',
              icon: 'none',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              success(){
                // wx.setStorageSync('scene','')
              },
            })
          }
        },
      })
    },


     //推广
  gohuiyuan(e) {
    let token = e
    wx.request({
      url: app.globalData.url + 'user/share', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          app.globalData.extension = res.data.data
        }  else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },


    //跳转提货
    gotoOrder(e) {
      let pages = e.currentTarget.dataset.pageurl
      wx.navigateTo({
        url: pages
      })
    },

    //跳转对应选项页面
    gotofun(e) {
      let pages = e.currentTarget.dataset.pageurl
      let memid = e.currentTarget.dataset.memid
      if (pages == 1) {
        console.log('问题反馈')
        this.triggerEvent('showTipss')
      } else if (pages == 2) {
        console.log(memid)
        wx.navigateTo({
          url: '/pages/subpage/member/member?memid=' + memid
        })
      } else {
        wx.navigateTo({
          url: pages
        })
      }
    },


    //跳转我的钱包
    goMineWallet() {
      wx.navigateTo({
        url: '/pages/wallet/mine/mine',
      })
    },

    //验证是否登录
    // checkLogins() {
    //   wx.showToast({
    //     title: '请先登录',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // },
    onCreateOtherPoster() {
      this.triggerEvent('showTipss2')
    }


  }
})