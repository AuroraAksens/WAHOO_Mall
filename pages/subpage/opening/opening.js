// pages/subpage/opening/opening.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //临时上传的图片
    resImage: [],
    resImage2: [],

    //提交图片路径
    postImg1: '',
    postImg2: '',

    array: ['女', '男'],

    //姓名
    name: '',

    //手机号
    phone: '',

    //身份证
    ID: '',

     //开通等级
     memberid:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let memberid = options.memberid
    this.setData({
      memberid
    })
    console.log(memberid)
  },



  // 跳转开通页
  goOppay() {
    let memberid = this.data.memberid
    wx.navigateTo({
      url: '/pages/subpage/openingPay/openingPay?memberid='+memberid,
    })
  },



  // 上传图片
  choImage() {
    let that = this
    wx.chooseImage({
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: app.globalData.url + 'upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          success(res) {
            wx.hideLoading()
            let image = JSON.parse(res.data)
            that.setData({
              postImg1: image.data.url,
              resImage: tempFilePaths
            })
          }
        })
      }
    })
  },

  choImage2() {
    let that = this
    wx.chooseImage({
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url + 'upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          success(res) {
            wx.hideLoading()
            let image = JSON.parse(res.data)
            that.setData({
              postImg2: image.data.url,
              resImage2: tempFilePaths
            })
          }
        })
      }
    })
  },

  //预览图片
  perImage(e) {
    let that = this
    let perImage = e.currentTarget.dataset.perimage
    let dataImage = that.data.resImage
    wx.previewImage({
      current: perImage,
      urls: dataImage
    })
  },

  perImage2(e) {
    let that = this
    let perImage = e.currentTarget.dataset.perimage2
    let dataImage = that.data.resImage2
    wx.previewImage({
      current: perImage,
      urls: dataImage
    })
  },


  //获取数据提交
  postData() {
    let that = this;
    let token = wx.getStorageSync('token')
    let name = that.data.name
    let phone = that.data.phone
    let postImg1 = that.data.postImg1
    let postImg2 = that.data.postImg2
    let ID = that.data.ID
    if (name && phone && postImg1 && postImg2 && ID) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'member/apply', //仅为示例，并非真实的接口地址
        method: 'POST',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        data: {
          'name': name,
          'phone': phone,
          'id_card_number': ID,
          'id_front_image': postImg1,
          'id_side_image': postImg2,
        },
        success(res) {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            that.goOppay()
          }, 1500)
        },
      })
    } else {
      that.goOppay()
      return
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500
      })
    }

  },


  //获取姓名
  getName(e) {
    let name = e.detail.value
    this.setData({
      name
    })
  },


  //获取手机号
  getPhone(e) {
    let phone = e.detail.value
    this.setData({
      phone
    })
  },


  //获取身份证号
  getID(e) {
    let ID = e.detail.value
    this.setData({
      ID
    })
  },





  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})