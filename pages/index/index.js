const app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {
        active:'index',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        arr:[],
        day: '',
        month: '',
        year: '',
        popup: true,
        openid:'',
        oldId:''
    },
    onLoad: function (options) {
        var that = this
        var day = util.dateDay(new Date())
        var month = util.dateMonth(new Date())
        var year = util.dateYear(new Date())
        if(!wx.getStorageSync('key')){
            that.getData()
        }else{
            wx.getStorage({
              key: 'key',
              success (res) {
                that.setData({
                    arr:res.data,
                    oldId:res.data.id
                })
                let oldId = that.data.oldId
                that.cache(oldId)
              }
            })
            that.setData({
                day: day,
                month: month,
                year: year
            })
        }
        that.openid()
    },
    getData:function(){
        var that = this
        var day = util.dateDay(new Date())
        var month = util.dateMonth(new Date())
        var year = util.dateYear(new Date())
        wx.request({
            url:app.globalData.link+'/api/index/poster',
            method:'POST',
            success(res){
                that.setData({
                    arr:res.data,
                    day: day,
                    month: month,
                    year: year,
                    oldId:res.data.id
                })
                wx.setStorage({
                    key:"key",
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
    onShareAppMessage:function(res){
      var that = this
      return{
        title:that.data.arr.content,
        path:"pages/index/index",
        imageUrl:that.data.arr.img
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
            data:{page:'index',oldId:oldId},
            success(res){
                if(res.data==1){
                    wx.removeStorage({
                        key:"key",
                        success (res) {
                            console.log(res)
                        }
                    })
                }
            }
        })
    }
})