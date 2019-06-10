const app = getApp()
Page({
    data: {
        active:'imgs',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        arr:[],
        datashow:false,
        loadshow:true,
        popup: true,
        onReachBottom: true,
        num:12,
        oldnum:0,
    },
    onLoad: function (options) {
        var that = this
        that.getData()
    },
    getData:function(res){
        var that = this
        wx.request({
            url:app.globalData.link+"/api/index/imgs",
            data: {num:that.data.num},
            method:"POST",
            success(res){
                that.setData({
                    arr:res.data,
                    datashow:true,
                    loadshow:false,
                    searchLoading: true,
                    oldnum:that.data.num,
                    num:that.data.num+2
                })
            }
        })
    },
    hidePopup(flag = true) {
        this.setData({
            "popup": flag
        });
    },
    showPopup() {
        this.hidePopup(false);
    },
    formSubmit: function(e) {
        var that = this
        var q = e.detail.value.q
        wx.navigateTo({
          url: '/pages/search/search?q='+q
        })
        that.hidePopup()
    },
    onReachBottom: function () {
        var that = this;
        wx.showToast({
          title: '玩命加载中',
          icon:'none',
          duration:2000
        })
        wx.request({
          url: app.globalData.link+"/api/index/moreimgs",
          data: {oldnum:that.data.oldnum},
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
    },
    onShareAppMessage:function(res){
      return{
        title:'终于等到你了，还好没有放弃。',
        path:"pages/imgs/imgs"
      }
    }
})