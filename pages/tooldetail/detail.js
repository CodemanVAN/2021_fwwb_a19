// pages/tooldetail/detail.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inqres: '', //设备信息
    name: '', //是否登录
    note:'无法正常使用',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function ({
      data,
      name
    }) {
      that.setData({
        inqres: data,
        name: name
      })
    })
  },
  onReady: function () {

  },
  //借出按钮点击
  jiechu: function () {
    var that = this
    wx.showToast({
      title: '进行人脸识别',
      duration: 2000
    })
    wx.navigateTo({
      url: '../faceshot/face',
      success: function (res1) {
        //通过eventChannel向被打开页面传送数据
        res1.eventChannel.emit('acceptDataFromOpenerPage', {
          data: that.data.inqres
        })
      }
    })
  },
  repair_send: function () {
    var that = this
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '确认报修',
      content: '是否对设备' + this.data.name + '进行报修提交',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.ronie.work/equipment/equipmentRepair',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': app.globalData.id
            },
            method: 'POST',
            data:{
              equipmentName:that.data.name,
              note:that.data.note
            },
            success(res) {
              wx.showToast({
                title: res.data.res,
              })
            }
          })
        }
      }
    })

  },
})