//index.js
const app = getApp()

Page({
  data: {
    username: '',
    password: '',
  },
  onLoad:function () {
    wx.getSystemInfo({
      success(res){
        app.globalData.sc_h=res.windowWidth
      }
    })
  }
  ,
  //用户名输入
  usernameinput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //密码输入
  passwordinput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  //登录函数
  dologin: function () {
    wx.requestSubscribeMessage({
      tmplIds: ['UqdTRdLXIX6jgj9jiXEaSCMe_mVWYixSAljjuKPnpLQ'],
      success(res) {
        wx.getSetting({
          withSubscriptions: true,
          success(res) {
            if (res.subscriptionsSetting.itemSettings == undefined)
              wx.showModal({
                cancelColor: 'cancelColor',
                title: '建议',
                content: '建议勾选总是同意以达到最好的体验效果'
              })
          }
        })
      }
    })
    if (this.data.username == '' || this.data.password == '') {
      wx.showToast({
        icon: 'error',
        title: '输入有误',
        duration: 2000
      })
    } else {
      var that = this
      wx.request({
        url: 'https://www.ronie.work/user/login/',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          JobNumber: this.data.username,
          password: this.data.password,
        },
        method: 'POST',
        success(res) {
          console.log(res.data)
          wx.showModal({
            title: '登录结果',
            content: res.data.res,
            cancelColor: 'cancelColor',
            success(slt) {
              if (res.data.res == '登录成功' && slt.confirm) {
                app.globalData.id = res.cookies[0]
                app.globalData.username = that.data.username
                app.globalData.logged = true
                app.globalData.name = res.data.username
                app.globalData.permission = res.data.permission
                app.globalData.department = res.data.position
                app.globalData.usericon = res.data.usericon
                wx.redirectTo({
                  url: '../index/index',
                })
              }
            }
          })
        },
        fail(res) {
          wx.showModal({
            title: '登录结果',
            cancelColor: 'cancelColor',
            content: '服务器错误'
          })
        }
      })
    }
  },
  wx_login: function () {
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['UqdTRdLXIX6jgj9jiXEaSCMe_mVWYixSAljjuKPnpLQ'],
      success(res) {
        wx.getSetting({
          withSubscriptions: true,
          success(res) {
            if (res.subscriptionsSetting.itemSettings == undefined)
              wx.showModal({
                cancelColor: 'cancelColor',
                title: '建议',
                content: '建议勾选总是同意以达到最好的体验效果',
                success(){
                  that.do_wx_login()
                }
              })
            else that.do_wx_login()
          }
        })
      }
    })

  },
  do_wx_login: function () {
    var that=this
    wx.login({
      success(res) {
        wx.request({
          url: 'https://www.ronie.work/user/login/',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
          },
          method: 'POST',
          success(res) {
            console.log(res.data)
            wx.showModal({
              title: '登录结果',
              content: res.data.res,
              cancelColor: 'cancelColor',
              success(slt) {
                if (res.data.res == '登录成功' && slt.confirm) {
                  app.globalData.id = res.cookies[0]
                  app.globalData.username = that.data.username
                  app.globalData.logged = true
                  app.globalData.name = res.data.username
                  app.globalData.permission = res.data.permission
                  app.globalData.department = res.data.position
                  app.globalData.usericon = res.data.usericon
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              }
            })
          }
        })
      }
    })
  }

})