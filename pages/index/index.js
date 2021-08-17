//index.js
const app = getApp()
Page({
  data: {
    myE: '',
    username: '',
    name: '',
    department: '',
    requestResult: '',
    shebieinfo: '',
    scanres: 'Fasle',
  },
  onLoad: function () {
    
    var that = this
    wx.request({
      url: 'https://www.ronie.work/equipment/myEquipment/',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': app.globalData.id
      },
      method: 'POST',
      success(res) {
        console.log(res.data)
        that.setData({
          myE: res.data
        })
      }
    })
    this.setData({
      name: app.globalData.name,
      permission: app.globalData.permission,
      department: app.globalData.department,
      usericon: app.globalData.usericon
    })
  },
  return: function () {
    wx.requestSubscribeMessage({
      tmplIds: ['UqdTRdLXIX6jgj9jiXEaSCMe_mVWYixSAljjuKPnpLQ'],
      success(){
    var that = this
    wx.showToast({
      title: '请扫设备码',
      icon: 'none'
    })
    wx.scanCode({
      onlyFromCamera: true,
      success(detail) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '扫描结果',
          content: '是否归还' + detail.result,
          success(res) {
            if (res.confirm) {
              wx.request({
                url: 'https://www.ronie.work/equipment/returnE/',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': app.globalData.id
                },
                method: 'POST',
                data: {
                  name: String(detail.result)
                },
                success(detail) {
                  wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '归还结果',
                    content: detail.data.res,
                    success() {
                      that.onLoad()
                    }
                  })
                }
              })
            } 
          }
        })
      }
    })}})
  },
  onShow: function () {
    // 在组件实例进入页面节点树时执行
    this.onLoad()
  },
  // 扫描二维码
  doUpload: function () {
    var that = this
    // 扫描二维码
    wx.requestSubscribeMessage({
      tmplIds: ['UqdTRdLXIX6jgj9jiXEaSCMe_mVWYixSAljjuKPnpLQ'],
      success() {
        wx.showToast({
          title: '请扫设备码',
          icon: 'none'
        })
        wx.scanCode({
          onlyFromCamera: true,
          success(res) {
            wx.request({
              url: 'https://www.ronie.work/equipment/queryE/',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': app.globalData.id
              },
              method: 'POST',
              data: {
                query: res.result
              },
              success(detail) {
                if (detail.data[0] != undefined) {
                  //console.log(detail.data)
                  wx.navigateTo({
                    url: '../tooldetail/detail',
                    success: function (res1) {
                      //通过eventChannel向被打开页面传送数据
                      res1.eventChannel.emit('acceptDataFromOpenerPage', {
                        data: detail.data,
                        name: res.result
                      })
                    }
                  })
                  app.globalData.equipment_name = res.result
                } else {
                  wx.showToast({
                    title: '设备未注册',
                    icon: 'error'
                  })
                }
              }
            })
          }
        })

      }
    })
  },
  delay: function (e) {
    wx.requestSubscribeMessage({
      tmplIds: ['UqdTRdLXIX6jgj9jiXEaSCMe_mVWYixSAljjuKPnpLQ'],
      success() {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '确定申请延长',
          content: "确定延长3天归还吗，此操作需要管理员同意",
          success(res) {
            if (res.confirm) {
              console.log(e.detail.value.name)
              wx.request({
                url: 'https://www.ronie.work/equipment/equipmentR/',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': app.globalData.id
                },
                method: 'POST',
                data: {
                  equipmentName: e.detail.value.name,
                  Time: 24 * 3,
                },
                success(detail) {
                  console.log(detail.data)
                  wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '申请结果',
                    content: detail.data
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  bind_wx: function () {
    wx.login({
      success(res) {
        wx.request({
          url: 'https://www.ronie.work/user/get_user_openid/',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': app.globalData.id
          },
          method: 'GET',
          data: {
            code: res.code
          },
          success(data) {
            if (data.data != '') {
              wx.showToast({
                title: '你已绑定微信',
              })
            } else {
              wx.login({
                success(res) {
                  wx.request({
                    url: 'https://www.ronie.work/user/get_user_openid/',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'Cookie': app.globalData.id
                    },
                    method: 'POST',
                    data: {
                      code: res.code
                    },
                    success(data) {
                      wx.showModal({
                        cancelColor: 'cancelColor',
                        title: '绑定结果',
                        content: data.data
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  }
})