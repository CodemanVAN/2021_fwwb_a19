//index.js
const app = getApp()

Page({
  data: {
    scr: '', //照片临时地址
    wh: 300, //设备默认屏幕高
    ww: 300, //设备默认屏幕宽
    need_req: '',
    permission: ''

  },
  onLoad() {
    //获取设备屏幕信息
    const info = wx.getSystemInfoSync()
    this.setData({
      wh: info.screenHeight,
      ww: info.screenWidth
    })
    this.ctx = wx.createCameraContext()
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function ({
      data
    }) {
      console.log(data)
      that.setData({
        need_req: data[0].JobNumber,
        permission: data[0].permission
      })
    })
  },
  //拍照函数
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          scr: res.tempImagePath
        })
      }
    })
  },
  //重照函数
  retake() {
    this.setData({
      scr: ''
    })
  },
  //提交函数
  upload() {
    wx.showLoading({
      title: '正在核验',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    var that = this
    wx.uploadFile({
      filePath: that.data.scr,
      name: 'picture',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': app.globalData.id
      },
      url: 'https://www.ronie.work/user/faceRecognition/',
      success(res) {
        console.log(res)
        res.data = JSON.parse(res.data)
        console.log(String(res.data.res) == '人脸识别成功', res.data)
        if (String(res.data.res) == '人脸识别成功') {
          if (that.data.need_req == null)
            if (that.data.permission <= app.globalData.permission) {
              wx.request({
                url: 'https://www.ronie.work/equipment/borrowE/',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': app.globalData.id
                },
                method: 'POST',
                data: {
                  name: app.globalData.equipment_name
                },
                success(res) {
                  wx.showModal({
                    cancelColor: 'cancelColor',
                    title: '借出结果',
                    content: res.data.res,
                    success(select_res) {
                      if (select_res.confirm && res.data.res == '借出成功') {
                        wx.navigateBack({
                          delta: 2,
                        })
                      }
                    }
                  })
                }
              })
            }
            else {
            wx.showModal({
              cancelColor: 'cancelColor',
              title: '权限不足提示',
              content: '根据重要设备使用条例，由于您权限不足使用此设备，需要申请，确认请点击确认',
              success(res) {
                if (res.confirm) {
                  wx.request({
                    url: 'https://www.ronie.work/equipment/equipmentA/',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'Cookie': app.globalData.id
                    },
                    method: 'POST',
                    data: {
                      equipmentName: app.globalData.equipment_name
                    },
                    success(res) {
                      wx.showModal({
                        cancelColor: 'cancelColor',
                        title: '申请结果',
                        content: res.data.res,
                        success(res) {
                          wx.navigateBack({
                            delta: 2,
                          })
                        }
                      })
                    }
                  })
                } else {
                  wx.navigateBack({
                    delta: 2,
                  })
                }
              }
            })
          } else {
            wx.request({
              url: 'https://www.ronie.work/equipment/need/',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': app.globalData.id
              },
              method: 'POST',
              data: {
                equipment: app.globalData.equipment_name
              },
              success(res) {
                wx.showModal({
                  cancelColor: 'cancelColor',
                  title: '转让申请结果',
                  content: res.data.res,
                  success(){
                    wx.navigateBack({
                      delta: 2,
                    })
                  }
                })
              }
            })
          }
        }
      },
    })
  },
  error(e) {
    console.log(e.detail)
  },
  cancel: function () {
    wx.navigateBack({
      delta: 1,
    })
  }
})