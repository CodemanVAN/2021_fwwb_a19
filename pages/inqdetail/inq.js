// pages/inqdetail/inq.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shebietag:'',
    id:'',
    inqres:'',
  },
  //输入接收函数
  taginput:function(e){
    this.setData({
      shebietag:e.detail.value
    })
  },
  scan:function(){
    var that=this
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        that.setData({
          shebietag:res.result
        })
      }
    })
  },
  //查询函数
  inq:function(){
    var that=this
    wx.request({
      url: 'https://www.ronie.work/equipment/queryE/',
      header:{
        'content-type':'application/x-www-form-urlencoded',
        'Cookie':app.globalData.id
      },
      method:'POST',
      data:{
        query:this.data.shebietag
      },
      success(res){
        that.setData({
          inqres:res.data
        })
        wx.showModal({
          cancelColor: 'cancelColor',
          title:'查询结果',
          content:res.data[0],
          success(res){
            if(res.confirm){
              wx.showToast({
                title: '申请已提交',
                duration:2000,
              })
            }
          }
        })
      }
    })
    
  }
})