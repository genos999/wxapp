const app = getApp()
Page({
    data: {
        active:'imgs',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        imgs:[],
        datashow:false,
        loadshow:true,
        popup: true,
        onReachBottom: true,
        num:12,
        oldnum:0,
        openid:'',
        oldId:''
    },
    onLoad: function (options) {
        var that = this
        if(!wx.getStorageSync('imgs')){
            that.getData()
        }else{
            wx.getStorage({
              key: 'imgs',
              success (res) {
                that.setData({
                    imgs:res.data,
                    oldId:res.data[0].id
                })
                let oldId = that.data.oldId
                that.cache(oldId)
              }
            })
            that.setData({
                datashow:true,
                loadshow:false,
                searchLoading: true,
                oldnum:that.data.num,
                num:that.data.num+2
            })
        }
        that.openid()
    },
    getData:function(res){
        var that = this
        wx.request({
            url:app.globalData.link+"/api/index/imgs",
            data: {num:that.data.num},
            method:"POST",
            success(res){
                that.setData({
                    imgs:res.data,
                    datashow:true,
                    loadshow:false,
                    searchLoading: true,
                    oldnum:that.data.num,
                    num:that.data.num+2
                })
                wx.setStorage({
                    key:"imgs",
                    data:res.data
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
               var list = that.data.imgs;
                for (var i = 0; i < res.data.length; i++) {
                  list.push(res.data[i]);
                }
                that.setData({
                  imgs: list,
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
    },
    submit:function(e){
        var that = this
        let formId = e.detail.formId
        let openId = that.data.openid
        wx.request({
            url:app.globalData.link+'/api/index/dataid',
            method:'POST',
            data:{formid:formId,openid:openId},
            success(res){
                
            }
        })
    },
    imgs:function(){
        
    },
    read:function(){
        wx.navigateTo({
            url:'/pages/read/read'
        })
    },
    index:function(){
        wx.navigateTo({
            url:'/pages/index/index'
        })
    },
    openid:function(){
        var that = this
        wx.login({
            success:function(res){                
                let code = res.code
                wx.request({
                    url:app.globalData.link+"/api/index/openid",
                    method:'POST',
                    data:{code:code},
                    success(res){
                        that.setData({
                            openid:res.data.openid
                        })
                    }
                })
            }
        })
    },
    cache:function(oldId){
        var that = this
        wx.request({
            url:app.globalData.link+'/api/index/cache',
            method:'POST',
            data:{page:'imgs',oldId:oldId},
            success(res){
                if(res.data==1){
                    wx.removeStorage({
                        key:"imgs",
                        success (res) {
                            console.log(res)
                        }
                    })
                }
            }
        })
    }
})