//石家庄玩呗网络科技有限公司
window.AD_WX = {

    chaPingID: "adunit-bd9f56eb1be7db9e",
    shiPinID: "adunit-bae3f3117fd96efe",
    bannerID: "adunit-8b5e6fd67dd36157",
    wx_ad_yuanSheng: "adunit-321d2c71e417f68b",

    bannerWX: null,
    share_wx_title: "水枪大乱斗，全民来PK！",
    share_wx_imageUrlId: "DpEc8jAOTF20wctGmlcDeg==",
    share_wx_imageUrl: "https://mmocgame.qpic.cn/wechatgame/3wpIaJLkc3cdTz1vSZpXxo9WZEA1llPnh5t5fXOMibM77QktsL6ySvh1icFUXOdhtD/0",
    videoIsShowing: false,
    yuanShengIsOk: false,
    shareCount: 1,
    shareContent: {
        title: "水枪大乱斗，全民来PK！",
        imageUrlId: "DpEc8jAOTF20wctGmlcDeg==",
        imageUrl: "https://mmocgame.qpic.cn/wechatgame/3wpIaJLkc3cdTz1vSZpXxo9WZEA1llPnh5t5fXOMibM77QktsL6ySvh1icFUXOdhtD/0",
    },
    chaPing() {
        if (AD.chanelName != "WX") return;
        console.log("插屏广告初始化   ");

        var _chaPingWX = wx.createInterstitialAd({
            adUnitId: AD_WX.chaPingID,
        })
        _chaPingWX.onLoad(function () {
            _chaPingWX.show();
            _chaPingWX.offLoad();
        })

        let errorCallback = (res) => {
            console.log("插屏错误 " + res.errMsg + "errCode " + res.errCode)
        };
        _chaPingWX.onError(errorCallback);
        let closeCallback = (res) => {
            console.log("插屏关闭 " + JSON.stringify(res));
            _chaPingWX = null;
        };
        _chaPingWX.onClose(closeCallback)

    },

    shiPin() {
        console.log("视频展示 ");
        if (AD.chanelName != "WX") return

        AD_WX.videoIsShowing = false;
        let video_retry_times = 0;
        let videoAd = wx.createRewardedVideoAd({
            adUnitId: AD_WX.shiPinID,
        });
        videoAd.load()
            .then(() => {
                cc.game.pause();
                videoAd.show()
                AD_WX.hideYuanSheng();
                AD_WX.videoIsShowing = true;
                // cc.director.pause();//暂停creator
            })
            .catch(err => {
                console.log(err.errMsg)
            });
        let loadCallback = () => { };
        let errorCallback = (res) => {
            console.log(JSON.stringify(res));
            if (video_retry_times >= 0 && video_retry_times < 1) {
                videoAd.load()
                    .then(() => {
                        videoAd.show();
                        AD_WX.hideYuanSheng();
                        AD_WX.videoIsShowing = true;
                    })
                    .catch(err => { console.log("视频错误 " + res.errMsg + "errCode " + res.errCode) });
                video_retry_times++;
            } else if (video_retry_times >= 1) {
                videoAd.offLoad(loadCallback);
                videoAd.offClose(closeCallback);
                videoAd.offError(errorCallback);
                console.log("miaoju_watch_retry_times" + video_retry_times);
                video_retry_times = -1;
            }
        };
        let closeCallback = (res) => {
            cc.game.resume();
            console.log(res);
            AD_WX.videoIsShowing = false;
            if (res.isEnded) {
                //发道具 
                AD.reward();
            }
            cc.director.resume();//
            videoAd.offLoad(loadCallback);
            videoAd.offClose(closeCallback);
            videoAd.offError(errorCallback);
        };
        videoAd.onLoad(loadCallback);
        videoAd.onError(errorCallback);
        videoAd.onClose(closeCallback);
    },
    showBanner() {
        console.log("banner 调用");
        if (AD.chanelName != "WX")
            return;


        this.hideBanner();

        let winSize = wx.getSystemInfoSync();

        console.log(winSize);
        let bannerHeight = 80;
        let bannerWidth = 300;

        AD_WX.bannerWX = wx.createBannerAd({
            adUnitId: AD_WX.bannerID, //填写广告id
            adIntervals: 40,
            style: {
                left: (winSize.windowWidth - bannerWidth) / 2,
                top: winSize.windowHeight - bannerHeight,
                width: bannerWidth,
            }
        });
        AD_WX.bannerWX.show(); //banner 默认隐藏(hide) 要打开
        //微信缩放后得到banner的真实高度，从新设置banner的top 属性
        AD_WX.bannerWX.onResize(res => {
            AD_WX.bannerWX.style.top = winSize.windowHeight - AD_WX.bannerWX.style.realHeight;
        })

        let errorCallback = (res) => {
            console.log("banner错误 " + res.errMsg + "  errCode : " + res.errCode)
        };
        AD_WX.bannerWX.onError(errorCallback);
    },
    hideBanner() {
        if (AD.chanelName != "WX") return
        if (AD_WX.bannerWX) {
            console.log("banner 隐藏 ")
            AD_WX.bannerWX.hide();
            AD_WX.bannerWX.destroy();
        }
    },
    shareOver(num, adType) {//分享结束

        var _times = 0;
        if (AD_WX.shareCount == 1)
            _times = 0;
        else if (AD_WX.shareCount == 2 || AD_WX.shareCount == 3)
            _times = 1;
        else if (AD_WX.shareCount == 4 || AD_WX.shareCount == 5)
            _times = 2;
        else if (AD_WX.shareCount == 6 || AD_WX.shareCount == 7)
            _times = 3;
        else if (AD_WX.shareCount == 8 || AD_WX.shareCount == 9)
            _times = 4;
        else if (AD_WX.shareCount == 10 || AD_WX.shareCount == 11)
            _times = 5;
        else
            _times = 6;

        if (num > (3000 + _times * 500)) {//分享成功 
            AD_WX.shareCount++;
            GlobalData.saveDiamondNum(20);
        }
        else //分享失败
        {
            AD_WX.shareLose();
        }
    },
    shareLose() {//分享失败
        cc.director.emit("系统提示", "分享失败，请稍后重试")
    },
    shareAndCallback(adType) {
        let startShare = false;
        let startCountTime = false;
        let endTime = 0;
        let shareTime = 1;
        // let shareTime = _getShareTime();
        let startTime = Tools.getDate("millisecond");

        wx.offShow();
        wx.offHide();
        wx.onShow((res) => {
            console.log("显示:" + JSON.stringify(res) + startShare + startCountTime);

            if (startShare && startCountTime) {
                endTime = Tools.getDate("millisecond");
                let timee = endTime - startTime;
                console.log(timee + "...花费时间");
                AD_WX.shareOver(timee, adType);
            }
            else if (startShare) {
                console.log("分享失败2");
                AD_WX.shareLose(adType);
            }
            else {
                AD_WX.shareLose(adType);
            }
        });
        wx.onHide(() => {
            console.log("隐藏" + startShare + startCountTime);
            if (startShare && !startCountTime) {
                console.log("开始计时");
                startCountTime = true;
                endTime = 0;

            }
        });
        startShare = true;

        wx.shareAppMessage(AD_WX.shareContent);

    },


    init() {
        if (AD.chanelName != "WX") return
        console.log("微信初始化  ********** ");
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        wx.onShareAppMessage(function () {
            return {

                title: AD_WX.share_wx_title,
                imageUrl: AD_WX.share_wx_imageUrl

            }
        })
        // wx.showShareMenu({
        //     withShareTicket: true,
        //     menus: ['shareAppMessage', 'shareTimeline']
        //   })
    },

    //原生广告--样式类似于QQ的积木广告
    showYuanSheng() {
        if (AD.chanelName != "WX" || AD_WX.videoIsShowing)
            return;

        const {
            screenHeight,
            screenWidth,
        } = wx.getSystemInfoSync();

        console.log("屏幕高度：" + screenHeight);
        console.log("屏幕宽度：" + screenWidth);
        AD_WX.yuanSheng = wx.createCustomAd({
            adUnitId: AD_WX.wx_ad_yuanSheng, //填写广告id
            adIntervals: 30,
            style: {
                top: 50, //根据系统约定尺寸计算出广告高度 1440 - (700 / 16 * 9)
                left: screenWidth / 8 * 7,

                fixed: true,
            }
        });
        AD_WX.yuanSheng.onLoad((res) => {
            AD_WX.yuanShengIsOk = true;
            AD_WX.yuanSheng.show();
            console.log("原生广告加载成功 展示");
            AD_WX.yuanSheng.offLoad();
        })

        AD_WX.yuanSheng.onError((res) => {
            console.log("原生广告加载错误  errMsg " + res.errMsg + "     errCode  " + res.errCode);
            AD_WX.yuanSheng.offError();
        })

    },

    hideYuanSheng() {
        if (AD_WX.yuanSheng) {
            AD_WX.yuanSheng.destroy();
            AD_WX.yuanSheng = null;
            AD_WX.yuanShengIsOk = false;
        }

    },
}