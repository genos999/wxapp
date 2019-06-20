const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
Page({
    data: {
        active:'music',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        id:'',
        author: '',
        preid:'',
        nextid:'',
        datashow:false,
        loadshow:true,
        img:'',
    },
    onLoad: function (options) {
        var that = this
        that.setData({
            id:options.id
        })
        that.getData()
    },
    back:function(res){
      if(getCurrentPages().length==1){
        wx.navigateTo({
          url: '/pages/review/review'
        })
      }else{
        wx.navigateBack({
          delta:1
        })
      }
      innerAudioContext.stop()
    },
    getData:function(res){
        var that = this
        wx.request({
            url:app.globalData.link+"/api/index/music",
            data:{id:that.data.id},
            method:"POST",
            success(res){
                that.setData({
                    arr:res.data,
                    img:res.data.img,
                    datashow:true,
                    loadshow:false,
                })
                innerAudioContext.autoplay = true
                innerAudioContext.src = res.data.music
                innerAudioContext.onPlay(() => {
                  
                })
                innerAudioContext.onError((res) => {
                    
                })
            }
        })
        that.getId()
    },
    getId:function(){
      var that = this
      wx.request({
        url:app.globalData.link+"/api/index/getmusicid",
        method:'POST',
        data:{id:that.data.id},
        success(res){
          that.setData({
            preid:res.data.preId,
            nextid:res.data.nextId
          })
        }
      })
    },
    onShareAppMessage:function(res){
      var that = this
      return{
        title:that.data.title,
        path:"pages/music/music?id="+that.data.id,
        imageUrl:app.globalData.link+'/'+that.data.img
      }
    }
})