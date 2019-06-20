const app = getApp()
Page({
    data: {
        active:'review',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        link:app.globalData.link,
        datashow:false,
        loadshow:true,
        popup: true,
        onReachBottom: true,
        num:2,
        oldnum:0,
        arr:[],
        oldId:'',
        openid:''
    },
    onLoad: function (options) {
        var that = this
        if(!wx.getStorageSync('review')){
            that.getData()
        }else{
            wx.getStorage({
              key: 'review',
              success (res) {
                that.setData({
                    arr:res.data,
                    oldId:res.data[0].id
                })
                let oldId = that.data.oldId
                that.cache(oldId)
              }
            })
            that.setData({
                datashow:true,
                loadshow:false,
                oldnum:that.data.num,
                num:that.data.num+2
            })
        }
        that.openid()
    },
    imgs:function(){
        wx.navigateTo({
            url:'/pages/imgs/imgs'
        })
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
    review:function(){
        
    },
    getData:function(){
        var that = this
        wx.request({
            url:app.globalData.link+'/api/index/review',
            data:{id:that.data.id,num:that.data.num},
            method:'POST',
            success(res){
                that.setData({
                    arr:res.data,
                    datashow:true,
                    loadshow:false,
                    oldnum:that.data.num,
                    num:that.data.num+2
                })
                wx.setStorage({
                    key:"review",
                    data:res.data
                })
            }
        })
    },
    cache:function(oldId){
        var that = this
        wx.request({
            url:app.globalData.link+'/api/index/cache',
            method:'POST',
            data:{page:'review',oldId:oldId},
            success(res){
                if(res.data==1){
                    wx.removeStorage({
                        key:"review",
                        success (res) {
                            console.log(res)
                        }
                    })
                }
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
    onReachBottom: function () {
        var that = this;
        wx.showToast({
          title: '玩命加载中',
          icon:'none',
          duration:2000
        })
        wx.request({
          url: app.globalData.link+"/api/index/morereview",
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
        path:"pages/review/review"
      }
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
    submit:function(e){
        var that = this
        let formId = e.detail.formId
        let openId = that.data.openid
        wx.request({
            url:app.globalData.link+'/api/index/dataid',
            method:'POST',
            data:{formid:formId,openid:openId},
            success(res){
                // console.log('200')
            }
        })
    }
})