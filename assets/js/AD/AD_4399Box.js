window.AD_4399Box = {
    chaPingSecond: 0,
    init() {
        if (AD.chanelName != AD.chanelName1 || AD.chanelName != "4399Box") return;
        {
            gamebox.login();

            setInterval(() => {
                AD_4399Box.chaPingSecond--;
            }, 1000);
        }
    },
    shiPin() {

        if (AD.chanelName != AD.chanelName1 || AD.chanelName != "4399Box") return;
        var _reward = false;
        const ad = gamebox.createRewardedVideoAd();
        ad.show().catch(() => {
            // 失败重试
            ad.load()
                .then(() => ad.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败', err)
                })
        })
        //监听 激励视频 广告加载事件回调函数
        const onLoadCb = (res) => {
            console.info('RewardedVideo onLoad' + res);
            //取消监听原生模板广告加载事件
            ad.offLoad(onLoadCb)
        };
        //监听 激励视频 广告错误事件回调函数
        const onErrorCb = (res) => {
            console.info('RewardedVideo onError' + res);
            //取消监听原生模板广告错误事件(监听取消的函数，应与监听回调函数为同一个）
            ad.offError(onErrorCb);
            //销毁原生模板广告
            ad.destroy();
        };
        //监听 激励视频 广告关闭事件回调函数
        const onCloseCb = (res) => {
            console.info('RewardedVideo onClose' + res);
            //取消监听原生模板广告关闭事件(监听取消的函数，应与监听回调函数为同一个）
            ad.offClose(onCloseCb);
            //销毁原生模板广告
            ad.destroy();
            if (_reward)
                AD.reward();
        };
        //监听 激励视频 广告播放完毕事件回调函数
        const onCompletedCb = (res) => {
            console.info('RewardedVideo onCompleted' + res);
            //取消监听原生模板广告播放完毕事件(监听取消的函数，应与监听回调函数为同一个）
            ad.offCompleted(onCompletedCb);
            _reward = true;
        };
        //监听原生模板广告加载事件
        ad.onLoad(onLoadCb)
        //监听原生模板广告关闭事件
        ad.onClose(onCloseCb);
        //监听原生模板广告错误事件
        ad.onError(onErrorCb)
        //监听原生模板广告播放完毕事件
        ad.onCompleted(onCompletedCb);






    },
    showBanner() {
        //可自定义 Banner 广告位置和宽高(单位px),默认最小宽度为 320 * pixelRatio(设备像素比),最小高度为 50 * pixelRatio
        //真机屏幕的实际宽度(单位px)为 screenWidth * pixelRatio,实际高度(单位px)为 screenWidth * pixelRatio 
        // screenWidth、screenWidth和pixelRatio(均可通过gamebox.getSystemInfoSync获取)
        //top 和 left 决定banner广告左上角顶点位置

        //获取真机设备像素比
        const pixelRatio = gamebox.getSystemInfoSync().pixelRatio;

        const widthN = 320 * pixelRatio;
        const heightN = 50 * pixelRatio;
        const bannerLeft = (gamebox.getSystemInfoSync().screenWidth * pixelRatio - widthN) / 2;
        const bannerTop = gamebox.getSystemInfoSync().screenHeight * pixelRatio - heightN;

        this.bannerAD = gamebox.createBannerAd({
            style: {
                width: widthN,
                height: heightN,
                left: bannerLeft,
                top: bannerTop
            }
        });
        this.bannerAD.show().catch(err => {
            console.info('Banner 广告显示失败', err)
        })
        //监听 Banner 广告加载事件回调函数
        const bannerOnLoadCb = (res) => {
            console.info('Banner onLoad' + res)
            //取消监听 Banner 广告加载事件(监听取消的函数，应与监听回调函数为同一个）
            this.bannerAD.offLoad(bannerOnLoadCb);
        };
        //监听 Banner 广告错误事件回调函数
        const bannerOnErrorCb = (res) => {
            console.info('Banner onError' + res)
            //取消监听 Banner 广告错误事件(监听取消的函数，应与监听回调函数为同一个）
            this.bannerAD.offError(bannerOnErrorCb);
        };
        //监听 Banner 广告加载事件
        this.bannerAD.onLoad(bannerOnLoadCb);

        //监听 Banner 广告错误事件
        this.bannerAD.onError(bannerOnErrorCb);

    },
    hideBanner() {
        if (this.bannerAD) {
            //隐藏 Banner 广告
            this.bannerAD.hide();
            //销毁 Banner 广告
            this.bannerAD.destroy();

        }
    },
    chaPing() {
        console.log('插屏 ***   '+AD_4399Box.chaPingSecond)
        if (AD_4399Box.chaPingSecond > 0) return;


        console.log('插屏 ***222')
        const interstitialAd = gamebox.createInterstitialAd();
        interstitialAd.show().catch(() => {
            // 失败重试
            interstitialAd.load()
                .then(() => interstitialAd.show())
                .catch(err => {
                    console.log('插屏 广告显示失败', err)
                })
        })
        //监听 InterstitialAd 广告加载事件回调函数
        const onLoadCb = (res) => {
            AD_4399Box.chaPingSecond = 60;

            console.info('插屏 onLoad' + res)
            //取消监听 InterstitialAd 广告加载事件(监听取消的函数，应与监听回调函数为同一个）
            interstitialAd.offLoad(onLoadCb)
        }
        //监听 InterstitialAd 广告关闭回调函数
        const onCloseCb = (res) => {
            console.info('插屏 onClose' + res)
            //取消监听 InterstitialAd 广告关闭(监听取消的函数，应与监听回调函数为同一个）
            interstitialAd.offClose(onCloseCb)

            //销毁 InterstitialAd 广告
            interstitialAd.destroy()
        }
        //监听 InterstitialAd 广告错误事件回调函数
        const onErrorCb = (res) => {
            console.info('插屏 onError' + res)
            //取消监听 InterstitialAd 广告错误(监听取消的函数，应与监听回调函数为同一个）
            interstitialAd.offError(onErrorCb)

            //销毁 InterstitialAd 广告
            interstitialAd.destroy()
        }
        //监听 InterstitialAd 广告加载事件
        interstitialAd.onLoad(onLoadCb)
        //监听 InterstitialAd 广告关闭
        interstitialAd.onClose(onCloseCb)

        //监听 InterstitialAd 广告错误
        interstitialAd.onError(onErrorCb)

    },

}