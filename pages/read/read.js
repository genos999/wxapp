const app = getApp()
Page({
    data: {
        active:'read',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        reads:[],
        link:app.globalData.link,
        datashow:false,
        loadshow:true,
        popup: true,
        onReachBottom: true,
        num:2,
        oldnum:0,
        openid:'',
        oldId:''
    },
    onLoad: function (options) {
        var that = this
        if(!wx.getStorageSync('reads')){
            that.getData()
        }else{
            wx.getStorage({
              key: 'reads',
              success (res) {
                that.setData({
                    reads:res.data,
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
    getData:function(){
    	var that = this
    	wx.request({
            url:app.globalData.link+"/api/index/readarr",
            data:{id:that.data.id,num:that.data.num},
            method:"POST",
            success(res){
                that.setData({
                    reads:res.data,
                    datashow:true,
                    loadshow:false,
                    oldnum:that.data.num,
                    num:that.data.num+2
                })
                wx.setStorage({
                    key:"reads",
                    data:res.data
                })
                console.log('no')
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
          url: app.globalData.link+"/api/index/morereadarr",
          data: {oldnum:that.data.oldnum},
          method: "POST",
          success: function (res) {
            if(res.data!=''){
               var list = that.data.reads;
                for (var i = 0; i < res.data.length; i++) {
                  list.push(res.data[i]);
                }
                that.setData({
                  reads: list,
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
        path:"pages/read/read"
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
                console.log('200')
            }
        })
    },
    imgs:function(){
        wx.navigateTo({
            url:'/pages/imgs/imgs'
        })
    },
    read:function(){
        
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
            data:{page:'read',oldId:oldId},
            success(res){
                if(res.data==1){
                    wx.removeStorage({
                        key:"reads",
                        success (res) {
                            console.log(res)
                        }
                    })
                }
            }
        })
    }
})