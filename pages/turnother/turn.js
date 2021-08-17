// pages/turnother/turn.js
const app=getApp()
Page({
  data: {
    detaillist:{},
    agree:'true'
  },
  onReady:function(){
    var that=this
    wx.request({
      url: 'https://www.ronie.work/equipment/receive/',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie':app.globalData.id
      },
      success(res){
        that.setData({
          detaillist:res.data
        })
      }
    })
  },
  agree:function(){
    this.setData({
      agree:'true'
    })
  },
  refuse:function(){
    this.setData({
      agree:'false'
    })
  },
  submit:function(e){
    var ag=this.data.agree
    var name=e.detail.value.name
    var that=this
    wx.request({
      url: 'https://www.ronie.work/equipment/receive/',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie':app.globalData.id
      },
      method:'POST',
      data:{
        agree:ag,
        equipment:name,
      },
      success(res){
        that.setData({
          detaillist:''
        })
        wx.showLoading({
          title:'请稍后'
        })
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {that.onReady()},
          })
        },1000)

      }
    })
  }
})