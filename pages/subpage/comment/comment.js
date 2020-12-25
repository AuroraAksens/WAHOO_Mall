// pages/subpage//comment/comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单id
    orderid: '',
    prid: '',

    arrImg: [],
    postImg: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      prid: options.prid
    })
  },



  //上传图片
  chooseImg: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.chooseImage({
      count: 9,
      success(res) {
        let tempFilePaths = res.tempFilePaths
        let imageArray = that.data.arrImg.concat(tempFilePaths)
        // that.data.arrImg.push(tempFilePaths[0])
        that.setData({
          arrImg: imageArray
        })
        wx.showLoading({
          title: '上传中',
        })
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.url + 'upload',
            filePath: tempFilePaths[i],
            name: 'image',
            header: {
              "Content-Type": "multipart/form-data",
              'token': token
            },
            success(res) {
              console.log(res.data)
              var dataItem = JSON.parse(res.data)
              console.log(dataItem)
              that.data.postImg.push(dataItem.data.url)
            }
          })
        }
        wx.hideLoading()
      }
    })
  },



    //预览图片
    showImg: function (e) {
      let imgSrc = e.currentTarget.dataset.imgsrc
      wx.previewImage({
        current: imgSrc,
        urls: this.data.arrImg
      })
    },
  
    //限制登录
    checkLogin() {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    },



    //提交评论数据
  postText: function (e) {
    var token = wx.getStorageSync('token')
    var text = e.detail.value.text
    var img = this.data.postImg
    var proid = this.data.orderid
    var prid = this.data.prid
    wx.showLoading({
      title: '加载中',
    })

    if (img.length != this.data.arrImg.length) {
      wx.showToast({
        title: '图片上传中',
        icon: 'loading',
        duration:2000
      })
    } else {
      wx.request({
        url: app.globalData.url + 'order/comment',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        data: {
          'content': text,
          'product_id': proid,
          'images': img,
          'pick_order_id':prid
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 1
              })
            },2000)
          } else {
            wx.showToast({
              title: '发布失败',
              none:'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
    


    //删除图片
    deleteImage: function (e) {
      var that = this;
      var arrImg = that.data.arrImg;
      var postImg = that.data.postImg
      var index = e.currentTarget.dataset.index
      wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success: function (res) {
          if (res.confirm) {
            arrImg.splice(index, 1);
            postImg.splice(index, 1)
            that.setData({
              arrImg: arrImg,
              postImg: postImg
            });
          } else if (res.cancel) {
            return false;
          }
        }
      })
    },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})