const app = getApp()
var util = require('../../utils/util.js')
Page({
    data: {
        active:'read',
        menutop:app.globalData.menutop,
        menuheight:app.globalData.menuheight,
        id:'',
        img:"",
        code:app.globalData.link+"/static/code/code.png",
        text:"",
        day: '',
        month: '',
        year: '',
        author: '',
        preid:'',
        nextid:'',
        none:'',
        datashow:false,
        loadshow:true,
        title:''
    },
    onLoad: function (options) {
        var that = this
        that.setData({
            id:options.id
        })
        that.getData()
        that.none()
    },
    back:function(res){
      if(getCurrentPages().length==1){
        wx.navigateTo({
          url: '/pages/read/read'
        })
      }else{
        wx.navigateBack({
          delta:1
        })
      }
    },
    getData:function(res){
        var that = this
        var day = util.dateDay(new Date())
        var month = util.dateMonth(new Date())
        var year = util.dateYear(new Date())
        wx.request({
            url:app.globalData.link+"/api/index/art",
            data:{id:that.data.id},
            method:"POST",
            success(res){
                that.setData({
                    arr:res.data,
                    text:res.data.des,
                    day: day,
                    month: month,
                    year: year,
                    img:res.data.img,
                    author:res.data.author,
                    title:res.data.title
                })
            }
        })
        that.getId()
        
    },
    getId:function(){
      var that = this
      wx.request({
        url:app.globalData.link+"/api/index/getid",
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
    none:function(){
      var that = this
      wx.request({
        url:app.globalData.link+'/api/index/none',
        success(res){
          that.setData({
            none:res.data,
            datashow:true,
            loadshow:false
          })
        }
      })
    },
    onShareAppMessage:function(res){
      var that = this
      return{
        title:that.data.title,
        path:"pages/art/art?id="+that.data.id,
        imageUrl:app.globalData.link+'/'+that.data.img
      }
    },
    Canvas:function(){
      var that = this
      wx.showLoading({
        title: '生成中,请稍后...',
      })
      var rpx;
      //获取屏幕宽度，获取自适应单位
      wx.getSystemInfo({
        success: function(res) {
          rpx = res.windowWidth/375;
        },
      })
      var img = that.data.img;
      var code =that.data.code;
      let filePath = '';
      wx.downloadFile({
        url: app.globalData.link+'/'+img,
        success(res) {
          if (res.statusCode === 200) {
            wx.downloadFile({
              url: code,
              success(ress) {
                if (res.statusCode === 200) {
                  let ctx = wx.createCanvasContext("myCanvas", that);
                  ctx.fillStyle="#ffffff";
                  ctx.fillRect(0,270*rpx,375*rpx,600*rpx);
                  ctx.shadowOffsetX = 0;
                  ctx.shadowOffsetY  = 1;
                  ctx.shadowBlur   = 10;
                  ctx.shadowColor = 'rgba(127,127,127,0.4)';
                  ctx.drawImage(res.tempFilePath, 0, 0, 375*rpx, 265*rpx);
                  that.roundRect(ctx, 15*rpx, 180*rpx, 345*rpx, (441 - 180 + 20)*rpx, 10*rpx);
                  ctx.fillStyle='rgba(127,127,127,1)';
                  ctx.shadowOffsetX = 0;
                  ctx.shadowOffsetY  = 0;
                  ctx.shadowBlur   = 0;
                  ctx.shadowColor = 'black';
                  ctx.drawImage(ress.tempFilePath, (375 / 2 - 50)*rpx, (600 - 138 + (138 - 100) / 2)*rpx, 100*rpx, 100*rpx);
                  ctx.font="13px PingFangSC-Light sans-serif";
                  ctx.fillText(that.data.author,30*rpx,210*rpx);
                  ctx.fillText(app.globalData.appname,295*rpx,210*rpx);
                  that.canvas_text(ctx, that.data.day, "50px PingFangSC-Light sans-serif", 265*rpx);
                  that.canvas_text(ctx, that.data.month+"."+that.data.year, "18px PingFangSC-Light sans-serif", 325*rpx);
                  that.canvasTextAutoLine(that.data.text,ctx,190*rpx,375*rpx,25*rpx,"14px PingFangSC-Light sans-serif");
                  ctx.drawImage(code,140*rpx,480*rpx,100*rpx,100*rpx);
                  ctx.draw(true, _ => {
                    wx.canvasToTempFilePath({
                      canvasId: "myCanvas",
                      success(res) {
                        wx.hideLoading();
                        wx.showToast({
                          title: '长按保存图片后分享到朋友圈',
                          icon: 'none',
                          duration: 2000,
                          success() {
                            setTimeout(_ => {
                              wx.previewImage({
                                urls: [res.tempFilePath],
                              });
                              }, 2000);
                          }
                        })
                      },
                      fail(e) {
                        console.log(e)
                      }
                    }, this);
                  });
                }
              }
            })
          }
        }
      }) 
    },
    roundRect:function(ctx, x, y, w, h, r){
      ctx.beginPath();
      ctx.fillStyle="rgba(255, 255, 255, 0.7)";
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.lineTo(x + w, y + r);
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
      ctx.lineTo(x + w, y + h - r);
      ctx.lineTo(x + w - r, y + h);
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
      ctx.lineTo(x + r, y + h);
      ctx.lineTo(x, y + h - r);
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x + r, y);
      ctx.fill();
      ctx.closePath();
    },
    canvas_text:function(_paint, _text, _fontSzie, _height){
        _paint.font = _fontSzie;
        _paint.fillStyle = "#808080";
        _paint.textAlign = "center";
        _paint.textBaseline = "middle";
        _paint.fillText(_text, 375 / 2, _height);
    },
    canvasTextAutoLine:function(str,ctx,initX,initY,lineHeight,font){
        var rpx;
        //获取屏幕宽度，获取自适应单位
        wx.getSystemInfo({
          success: function(res) {
            rpx = res.windowWidth/375;
          },
        })
        var lineWidth = 0;
        var canvasWidth = 450*rpx; 
        var lastSubStrIndex= 0; 
        ctx.font = font;
        for(let i=0;i<str.length;i++){ 
            lineWidth+=ctx.measureText(str[i]).width; 
            if(lineWidth>canvasWidth/8*5){
                ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
                initY+=lineHeight;
                lineWidth=0;
                lastSubStrIndex=i;
            } 
            if(i==str.length-1){
                ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
            }
        }
    }
})