//app.js
App({
  onLaunch: function () {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    });

     // 更新提示
     var e = wx.getUpdateManager();
     e.onCheckForUpdate(function (e) {}), e.onUpdateReady(function () {
       wx.showModal({
         title: "更新提示",
         content: "新版本已经准备好，是否马上重启小程序？",
         success: function (t) {
           t.confirm && e.applyUpdate();
         }
       });
     }), e.onUpdateFailed(function () {
       wx.showModal({
         title: "更新提示",
         content: "新版本下载失败",
         showCancel: !1
       });
     });
     
  },

  
  globalData: {
    //本地接口
    // url:'http://www.wahoo.com/api/',

    //线上接口
    url:'https://wahoo.01snt.com/api/',

    userInfo: null,
    src: '',

    //地址下标
    index:0,

    //银行卡信息
    bankid:'',

    //推广页面数据
    userInfotui:'',
    extension:''
  }
})