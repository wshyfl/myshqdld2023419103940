window.AD_BD = {
    appSid_BD: 'f57e0c3d',
    videoID_BD: '7829000',//OK


    bannerADType: 0,
    _bannerAd: null,


    videoIsPlaying: false,


    init() {

        const canvas = swan.createCanvas();
        const ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, 0, 0);

        //打开调试功能
        swan.setEnableDebug({
            enableDebug: true
        })
    },

    shiPin() {
        if (AD_BD.videoIsPlaying == false) {
            AD_BD.videoIsPlaying = true;

            console.log("调用视频");
            //百度视频


            // AD.audioMng.stopMusic();
            cc.audioEngine.pauseAll();
            cc.director.pause();
            //百度小游戏视频广告
            let BaiDuVideoAd = swan.createRewardedVideoAd({
                adUnitId: AD_BD.videoID_BD,//广告位id 
                appSid: AD_BD.appSid_BD,
            })//appid
            BaiDuVideoAd.load()
                .then(() => BaiDuVideoAd.show())
                .catch(err => console.log(err))

            let onLoadFuc = function () {//加载成功回调
                console.log("BD广告加载成功")
            }
            BaiDuVideoAd.onLoad(onLoadFuc);//加载成功
            BaiDuVideoAd.offLoad(onLoadFuc); //offLoad对应的函数将取消对应的监听事件

            BaiDuVideoAd.onError(err => {
                console.log("错误 " + err)
                cc.director.resume();

                setTimeout(()=>{
                   
            cc.audioEngine.resumeAll();
                },100)

                AD_BD.videoIsPlaying = false;

            })
            var closeFunc = (res) => {
                BaiDuVideoAd.offClose(closeFunc)

                cc.director.resume();
                setTimeout(()=>{
                    cc.audioEngine.resumeAll();
                },100)

                AD_BD.videoIsPlaying = false;



                if (res.isEnded) {
                    console.log('激励视频完整播放后关闭')
                    AD.reward();

                } else {
                    console.log('激励视频中途被关闭')


                }
            }
            BaiDuVideoAd.onClose(closeFunc)
        }
    },

    daoLiang(_appID) {
        swan.navigateToMiniProgram({
            appKey: _appID,
            path: '/path/page/0',
            extraData: {},
            success: (res) => {
                console.log('navigateToMiniProgram success', res);
            },
            fail: (error) => {
                console.log('navigateToMiniProgram fail', error);
            }
        });
    },
    share() {
        swan.shareAppMessage({});
    },
    showBanner() {
        ADD.globalNode.showBDView();
    },
    hideBanner() {
        cc.director.emit("销毁")
    },
}