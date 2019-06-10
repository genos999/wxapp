const app = getApp()
Page({
    data: {
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        arr:[],
        link:app.globalData.link,
        datashow:false,
        loadshow:true,
        popup: true,
        q:'',
        onReachBottom: true,
        num:3,
        oldnum:0
    },
    onLoad: function (options) {
        var that = this
        that.setData({
            q:options.q
        })
        that.getData()
    },
    getData:function(){
        var that = this
        wx.request({
            url:app.globalData.link+"/api/index/search",
            data:{q:that.data.q,num:that.data.num},
            method:"POST",
            success(res){
                that.setData({
                    arr:res.data,
                    datashow:true,
                    loadshow:false,
                    oldnum:that.data.num,
                    num:that.data.num+2
                })
                if(res.data==''){
                    wx.showToast({
                      title: '无搜索结果...',
                      icon:'none',
                      duration:2000
                    })
                }
            }
        })
    },
    back:function(res){
      wx.navigateBack({
        delta:1
      })
    },
    onReachBottom: function () {
        var that = this;
        wx.showToast({
          title: '玩命加载中',
          icon:'none',
          duration:2000
        })
        wx.request({
          url: app.globalData.link+"/api/index/moresearch",
          data: {q:that.data.q,oldnum:that.data.oldnum},
          method: "POST",
          success: function (res) {
            if(res.data!=''){
               var list = that.data.arr;
                for (var i = 0; i < res.data.length; i++) {
                  list.push(res.data[i]);
                }
                that.setData({
                  arr: list,
                  oldnum:that.data.num,
                  num:that.data.num+2,

                })
                wx.hideToast();
            }else{
                wx.showToast({
                  title: '已无更多数据...',
                  icon:'none',
                  duration:2000
                })
            }
          }
        })
    }
})