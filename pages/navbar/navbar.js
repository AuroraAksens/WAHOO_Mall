var app = getApp()

import Poster from '../../miniprogram_dist/poster/poster';

const posterConfig = {
  jdConfig: {
    width: 750,
    height: 1300,
    backgroundColor: '#f1f1f1',
    debug: false,
    pixelRatio: 1,
    texts: [{
      x: 370,
      y: 360,
      zIndex: 10,
      text: [{
        text: '',
        fontSize: 32,
        textAlign: 'center',
        color: '#46291F',
        opacity: 1,
        width: 400,
        lineHeight: 40,
        lineNum: 1,
      }, ],
      baseLine: 'middle',
    }, {
      x: 210,
      y: 970,
      zIndex: 10,
      text: [{
        text: '',
        fontSize: 30,
        color: 'white',
        opacity: 1,
        marginLeft: 0,
        marginRight: 10,
        width: 400,
        lineHeight: 40,
        lineNum: 2,
      }, ],
      baseLine: 'middle',
    }, {
      x: 210,
      y: 1010,
      zIndex: 10,
      text: [{
        text: '',
        fontSize: 26,
        color: 'white',
        opacity: 1,
        marginLeft: 0,
        marginRight: 10,
        width: 400,
        lineHeight: 40,
        lineNum: 2,
      }, ],
      baseLine: 'middle',
    }],
    images: [{
      width: 750,
      height: 1300,
      x: 0,
      y: 0,
      url: '/image/poster.png',
      borderRadius: 20
    }, {
      width: 100,
      height: 100,
      x: 80,
      y: 905,
      url: '',
      borderRadius: 100
    }, {
      width: 300,
      height: 300,
      x: 220,
      y: 500,
      url: '',
      borderRadius: 20
    }, {
      width: 130,
      height: 50,
      x: 200,
      y: 880,
      url: '',
      borderRadius: 20
    }]
  }
}

Page({
  data: {

    //海报
    posterConfig: posterConfig.jdConfig,

    current: 0,
    height: "calc(100vh - 120rpx)",

    //弹框 false关闭  true开启
    showTips: false,
    showTips2: false,

  },
  onLoad(options) {
    let token = wx.getStorageSync('token')
    if (options.scene) {
      wx.setStorageSync('scene', options.scene)
    } else {
      wx.setStorageSync('scene', '')
    }
    this.setData({
      current: options.current
    })
    // this.onShow()
  },

  onShow() {
    this.selectComponent('#index').onShow()
    this.selectComponent('#mine').checkLogin()
    this.selectComponent('#cart').getlistData()
    this.selectComponent('#cart').getTotalPrice()
    this.selectComponent('#mine').getMine()
    this.getscene()
  },
  mineJump(e) {

    // 获取子组件的实例，这个方法可以操作直接设置子组件的data里面的关键字
    // const child = this.selectComponent('#order')
    // child.setData({
    //   TabCur: e.detail
    // })

    //自定义的页面切换事件，用来做特殊的自定义页面跳转的。
    // this.setData({
    //   current: 0
    // })
  },

  NavChange(e) {
    let cur = Number(e.currentTarget.dataset.cur)
    this.setData({
      current: cur
    })
  },

  cardSwiper(e) {
    let cur = Number(e.detail.current)
    if (cur == 0) {
      this.selectComponent('#index').onShow()
      this.setData({
        current: cur
      })
    } else if (cur == 1) {
      this.selectComponent('#brand').getBrandData()
      this.setData({
        current: cur
      })
    } else if (cur == 2) {
      this.selectComponent('#cart').getlistData()
      this.selectComponent('#cart').getTotalPrice()
      this.setData({
        current: cur
      })
    } else if (cur == 3) {
      let member = wx.getStorageSync('member')
      let token = wx.getStorageSync('token')
      if (member == 0 && token != '') {
        wx.navigateTo({
          url: '/pages/subpage/member/member'
        })
      } else {
        this.selectComponent('#mine').checkLogin()
        this.selectComponent('#mine').getMine()
      }
      // 调用子组件的方法，自定义的onshow方法

      this.setData({
        current: cur
      })
    } else {
      this.setData({
        height: "calc(100vh - 100rpx)",
        current: cur
      })
    }
  },


  //问题反馈弹框
  showTips() {
    this.setData({
      showTips: true
    })
  },

  //关闭问题反馈弹框
  closeTips() {
    this.setData({
      showTips: false
    })
  },

  //保存图片
  saveCode() {
    wx.saveImageToPhotosAlbum({
      filePath: '/image/qrcode.png',
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1000
        })
      },
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },


  //推广弹框
  // showTips2() {
  //   let tips = this.data.showTips2
  //   if (tips) {
  //     this.setData({
  //       showTips2: false
  //     })
  //   } else {
  //     this.setData({
  //       showTips2: true
  //     })
  //   }
  // },



  /**
   * 异步生成海报
   */
  onCreateOtherPoster() {
    let extension = app.globalData.extension
    let userInfotui = app.globalData.userInfotui
    let vip = ''
    let vipimg = ''
    if (userInfotui.member.grade == 1) {
      vipimg = '/image/vip/vip1.png'
      vip = '会员'
    } else if (userInfotui.member.grade == 2) {
      vipimg = '/image/vip/vip2.png'
      vip = 'VIP'
    } else if (userInfotui.member.grade == 3) {
      vipimg = '/image/vip/vip3.png'
      vip = 'VVIP'
    } else if (userInfotui.member.grade == 4) {
      vipimg = '/image/vip/vip4.png'
      vip = 'WVIP'
    }
    posterConfig.jdConfig.texts[0].text[0].text = vip + '“' + userInfotui.nickname + '” 邀请您' //海报标题
    posterConfig.jdConfig.texts[1].text[0].text = userInfotui.nickname //分享人名字
    posterConfig.jdConfig.texts[2].text[0].text = '电话：' + userInfotui.phone //分享人电话
    posterConfig.jdConfig.images[2].url = extension.wx_url //分享二维码
    posterConfig.jdConfig.images[1].url = userInfotui.avatar_image //分享人头像
    posterConfig.jdConfig.images[3].url = vipimg //分享人会员等级
    this.setData({
      posterConfig: posterConfig.jdConfig
    }, () => {
      Poster.create(true); // 入参：true为抹掉重新生成 
    });
  },



  //海报
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },


  onPosterFail(err) {
    console.error(err);
  },



  //邀请
  getscene() {
    let scene = wx.getStorageSync('scene')
    let token = wx.getStorageSync('token')
    console.log(scene)
    console.log(token)
    if (scene != '' && token != '') {
      wx.request({
        url: app.globalData.url + 'user/becomeJunior?p_id=' + scene, //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值 
        },
        success(res) {
          if (res.data.code == 200) {
            console.log(res.data)
            wx.setStorageSync('scene','')
            wx.showModal({
              title: '邀请提示',
              content: res.data.msg,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else {
            wx.setStorageSync('scene','')
            wx.showModal({
              title: '邀请提示',
              content: res.data.msg,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
      })
    }

  },


})