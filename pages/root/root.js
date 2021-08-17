// pages/root/root.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isborrowed:false,
    detaillist:{0:{'isborrowed':true},1:{'isborrowed':false}}
  },

  change:function(){
    this.setData({
      isborrowed:true
    })
    for(var k in this.data.detaillist){
      console.log(k,this.data.detaillist[k].isborrowed)
    }
    wx.downloadFile({
      url: 'url',
    })
  }
})