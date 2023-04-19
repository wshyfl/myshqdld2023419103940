window.AD_UC = {

  ucBanner: null,
  //UC视频

  //UC 横竖屏
  init() {
    if (AD.chanelName != AD.chanelName1) return;
    uc.requestScreenOrientation({
      orientaiton: 2, // 1:竖屏模式 2：横屏模式,传感器模式的横屏，对应 android SCREEN_ORIENTATION_SENSOR_LANDSCAPE
      success: res => {
        console.log("UC初始化  " + res);
      },
      fail: res => {
        console.error(res);
      },
    });
  },
  shiPin() {
    // AD.audioMng.stopAll();
    console.log("UC视频调用~~~~!!!!")

    var loaded = false;
    const rewardedVideoAd = uc.createRewardVideoAd();
    rewardedVideoAd.load()
      .then()
      .catch(err => console.log(err));
    rewardedVideoAd.onLoad(() => {
      console.log('激励视频广告加载成功0');
      if (!loaded) {
        loaded = true;
        console.log('激励视频广告加载成功*****');
      }
    });
    rewardedVideoAd
    .show()
    .then()
    .catch(err => console.log(err));
    rewardedVideoAd.onError(err => {
      console.log(err);

      rewardedVideoAd.offClose(); // 取消关闭事件的监听，不传 callback 的话会取消所有的监听
      rewardedVideoAd.offLoad(); // 取消 load 事件的监听，不传 callback 的话会取消所有的监听
      rewardedVideoAd.offError(); // 取消 error 事件的监听，不传 callback 的话会取消所有的监听

    });
    rewardedVideoAd.onClose(res => {
      console.log('关闭*****............... '+res.isEnded);
      // 用户点击了【关闭广告】按钮
      if (res && res.isEnded) {
        // 正常播放结束，可以下发游戏奖励
        console.log('发放奖励*****');
        AD.reward();
      } else {
        // 播放中途退出，不下发游戏奖励
      }
      rewardedVideoAd.offClose(); // 取消关闭事件的监听，不传 callback 的话会取消所有的监听
      rewardedVideoAd.offLoad(); // 取消 load 事件的监听，不传 callback 的话会取消所有的监听
      rewardedVideoAd.offError(); // 取消 error 事件的监听，不传 callback 的话会取消所有的监听
    });
  },

  chaPing() {
    const interstitialAd = uc.createInterstitialAd();
    interstitialAd.load()
      .then()
      .catch(err => console.log("UC广告加载错误 " + err));
    interstitialAd.onLoad(() => {
      console.log('插屏广告加载成功');
    });
    interstitialAd
      .show()
      .then()
      .catch(err => console.log("UC展示失败 " + err));
    interstitialAd.onError(err => {
      console.log("UC广告错误 " + err);
    });
    interstitialAd.onClose(res => {
      console.log("UC广告关闭 ");
    });
  },

  initBanner() {
    if (AD.chanelName != AD.chanelName1) return;

  },

  showBanner() {
    if (AD.chanelName != AD.chanelName1) return;

    if (AD_UC.ucBanner) {
      AD_UC.ucBanner.destroy();
      AD_UC.ucBanner = null;
    }


    console.log('AD_UC.ucBanner 广告加载 start ');
    let res = uc.getSystemInfoSync();
    if (typeof res === 'string') {
      try {
        res = JSON.parse(res);
      } catch (e) { }
    }

    let deviceWidth = res.screenWidth > res.screenHeight ? res.screenHeight : res.screenWidth;
    let width = deviceWidth / 2;
    let height = width * 194 / 345;
    AD_UC.ucBanner = uc.createBannerAd({
      style: {
        width: width,
        height: height,
        gravity: 7,
      }
    });
    AD_UC.ucBanner.onError(err => {
      console.log('AD_UC.ucBanner 广告加载出错', err);
    });
    AD_UC.ucBanner.onLoad(() => {
      console.log('AD_UC.ucBanner 广告加载成功');
    });
    AD_UC.ucBanner.show();

  },
  hideBanner() {
    if (AD.chanelName != AD.chanelName1) return;

    if (AD_UC.ucBanner) {
      AD_UC.ucBanner.hide();
      AD_UC.ucBanner.destroy();
      AD_UC.ucBanner = null

    }
  },
  share() {
    if (AD.chanelName != AD.chanelName1) return;
    uc.shareAppMessage({
      query: '', // 查询字符串，必须是 key1=val1&key2=val2 的格式。

      success: res => {
        console.log('UC分享成功 ', JSON.stringify(res));
      },
      fail: err => {
        console.log('UC分享失败 ', JSON.stringify(err));
      },
    });
  },
}