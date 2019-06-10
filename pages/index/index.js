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
        popup: true
    },
    onLoad: function (options) {
        var that = this
        that.getData()
        // that.uploadFormIds()
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
                    year: year
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
    getFormID:function(e){
        var that = this
        let formId = e.detail.formId
        wx.request({
            url:app.globalData.link+'/api/index/formid',
            method:'POST',
            data:{formid:formId},
            success(res){
                console.log(res)
            }
        })
    }
})