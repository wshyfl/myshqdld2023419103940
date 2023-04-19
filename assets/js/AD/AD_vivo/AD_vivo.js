

window.AD_vivo = {
    box_id: "4d246f6308e24dcb8eedb352d6f63322",//盒子广告
    bannerBox_id: "",//banner盒子
    bannerID_TT: "1c87e932259c4481abf70fb0e43af736",//banner普通
    videoID_TT: "ab5a7fbda5d044cc85dba3499ed865d8",//视频
    chaPing_TT: ["98b49e44b7124342b4cf8ab46bfd4c4c", "98b49e44b7124342b4cf8ab46bfd4c4c", "98b49e44b7124342b4cf8ab46bfd4c4c"],//原生插屏
    isAutoChaPing: false,//false:模板插屏  true:原生自定义插屏
    chaPingNum: 0, //原生插屏当前显示
    gameSkipNum: 0, //小游戏跳转顺序
    pkgNameAll: ["com.srdbp2.nearme.gamecenter", "com.mzqz.nearme.gamecenter", "com.mor.tddzz.nearme.gamecenter", "com.kdddmx.nearme.gamecenter"], //跳转小游戏包名
    boxPortalAd: null,//盒子广告
    reportShow: false, //是否上报
    reportClick: false, //是否上报
    chaPingBoo: false, //插屏开关
    bennerBoo: false, //广告显示开关
    levelNum: 0,
    banner: null,
    boxBannerAd: null,
    couldShowChaPing: true,//
    chaPingInterval: 5,

    wuDianRate: 0,//自点击概率
    //开关开启调用一次
    switchOn() {
        this.wuDianRate = 20;//自点击概率
        this.chaPingBoo = true;
    },
    //加载插屏数据--游戏开始 调用一次
    init() {
        //加载插屏数据
        this.loadData();
        setInterval(() => {
            this.loadData();//加载插屏数据
        }, 20000);
    },
    /**原生插屏 */
    loadData() {
        if (!this.isAutoChaPing)
            return
        console.log("显示插屏");
        if (AD.chanelName != AD.chanelName1 || AD.chanelName1 != "vivo")
            return;
        if (AD_vivo.nativeAd == null) {
            AD_vivo.chaPingNum++;
            if (AD_vivo.chaPingNum == this.chaPing_TT.length) {
                AD_vivo.chaPingNum = 0;
            }
            AD_vivo.nativeAd = qg.createNativeAd({
                adUnitId: AD_vivo.chaPing_TT[AD_vivo.chaPingNum],
            });
        }

        let adLoad = this.nativeAd.load()
        adLoad && adLoad.then(() => {
            console.log("=======加载成功");
        }).catch(err => {
            console.log('加载失败', JSON.stringify(err));
        })
        AD_vivo.nativeAd.onLoad(function (res) {
            console.log('原生广告加载完成', JSON.stringify(res));
            if (res && res.adList) {
                var data = res.adList;
                var listData = JSON.stringify(data);// 转成JSON格式
                var list = JSON.parse(listData);
                AD_vivo.result = list[list.length - 1];

                AD_vivo.reportShow = false;
                AD_vivo.reportClick = false;
                cc.director.emit("vivo_dataShuaXin");
            }
        });
    },
    /**视频 */
    shiPin() {
        if (AD.chanelName != AD.chanelName1) {
            AD.reward()
            return;
        }

        const rewardedAd = qg.createRewardedVideoAd({
            posId: AD_vivo.videoID_TT,
        });

        rewardedAd.onError(err => {
            cc.audioEngine.resumeAll();
            console.log("激励视频广告加载失败", err);
            qg.showToast({
                message: "暂无广告"
            });
        });
        rewardedAd.onLoad(function (res) {
            console.log('激励视频广告加载完成-onload触发', JSON.stringify(res));
            cc.audioEngine.pauseAll();
            rewardedAd.show().then(() => {
                console.log('激励视频广告展示完成');
            }).catch((err) => {
                cc.audioEngine.resumeAll();
                console.log('激励视频广告展示失败', JSON.stringify(err));
                qg.showToast({
                    message: "暂无广告"
                });
                switch (err.errCode) {
                    case -3:
                        console.log("激励广告加载失败---调用太频繁", JSON.stringify(err));
                        // qg.showToast({
                        //     message: "游戏暂无广告，请稍后再试"
                        // });
                        // TipManager.instace.addUITip({
                        //     name:"提示语句",
                        //     text: "视频加载失败,游戏暂无广告，请稍后再试"
                        // });
                        break;
                    case -4:
                        console.log("激励广告加载失败--- 一分钟内不能重复加载", JSON.stringify(err));
                        // qg.showToast({
                        //     message: "游戏暂无广告，请稍后再试"
                        // });
                        // TipManager.instace.addUITip({
                        //     name:"提示语句",
                        //     text: "视频加载失败,游戏暂无广告，请稍后再试"
                        // });
                        break;
                    case 30008:
                        // 当前启动来源不支持激励视频广告，请选择其他激励策略
                        break;
                    default:
                        // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/AD?id=广告错误码信息 对错误码做分类处理
                        console.log("激励广告展示失败")
                        // console.log(JSON.stringify(err))
                        // qg.showToast({
                        //     message: "游戏暂无广告，请稍后再试"
                        // });
                        // TipManager.instace.addUITip({
                        //     name:"提示语句",
                        //     text: "视频加载失败,游戏暂无广告，请稍后再试"
                        // });
                        break;
                }

            })
        })
        const func = (res) => {
            cc.audioEngine.resumeAll();
            console.log('视频广告关闭回调')
            if (res && res.isEnded) {
                console.log("正常播放结束，可以下发游戏奖励");
                AD.reward()
            } else {
                console.log("播放中途退出，不下发游戏奖励");
                // method1.call(caller,data[0]);
            }
            // AD.audioMng.playMusic();
        }
        rewardedAd.onClose(func);
    },


    showBox() {
        if (AD.chanelName != AD.chanelName1) return
        if (AD.chanelName1 != "vivo") return

        if (qg.createBoxPortalAd) {
            if (AD_vivo.boxPortalAd) return
            AD_vivo.boxPortalAd = qg.createBoxPortalAd({
                posId: AD_vivo.box_id,

                marginTop: 50
            })
            AD_vivo.boxPortalAd.onError(function (err) {
                console.log("盒子九宫格广告加载失败", err)
            })
            AD_vivo.boxPortalAd.onClose(function () {
                console.log('盒子九宫格广告close')
                AD_vivo.boxPortalAd = null;
                if (AD_vivo.boxPortalAd.isDestroyed) {
                    return
                }
                // 当九宫格关闭之后，再次展示Icon
                AD_vivo.boxPortalAd.show()
            })
            // 广告数据加载成功后展示
            AD_vivo.boxPortalAd.show().then(function () {
                console.log('盒子九宫格广告show success')
            })
        }
        else {
            console.log('暂不支持互推盒子相关 API')
        }
    },
    hideBox() {
        if (AD_vivo.boxPortalAd != null) {
            AD_vivo.boxPortalAd.isDestroyed = true
            AD_vivo.boxPortalAd.destroy();
            AD_vivo.boxPortalAd = null;
        }
    },



    initBanner() {
        if (AD_vivo.chanelName != AD_vivo.chanelName1)
            return;
        const {
            screenHeight,
            screenWidth,
        } = qg.getSystemInfoSync();
        AD_vivo.banner = qg.createBannerAd({
            posId: AD_vivo.bannerID_TT,
        });
        AD_vivo.banner.onResize(size => {
            console.log("改变size");
            if (AD_vivo.banner.style.left < ((screenWidth - size.width) / 2)) {
                AD_vivo.banner.style.left = ((screenWidth - size.width) / 2);
            }
        });
        AD_vivo.banner.onLoad(function () {

        });

        let errCallBack = (res) => {
            console.log(res);
        };
        AD_vivo.banner.onError(errCallBack);
    },
    /**显示banner */
    showBanner(...isBox) {
        console.log("banner 调用  showBanner");
        if (AD.chanelName != AD.chanelName1)
            return;
        if (this.isAutoChaPing) {
            cc.director.emit("vivo_bannerShow");
            return
        }

        // if (isBox[0])
        //     this.showBoxBanner();
        // else
            this.showBannerNormal();

    },
    showBoxBanner() {
        if (qg.createBoxBannerAd) {
            //销毁普通banner
            if (AD_vivo.banner != null) {
                AD_vivo.banner.destroy();
                AD_vivo.banner = null;
                AD_vivo.initBanner();
            }
            //销毁盒子广告
            this.hideBox();
            AD_vivo.boxBannerAd = qg.createBoxBannerAd({
                posId: AD_vivo.bannerBox_id
            })
            AD_vivo.boxBannerAd.onError(function (err) { console.log("盒子横幅广告加载失败", err) })
            // 广告数据加载成功后展示
            AD_vivo.boxBannerAd.show().then(function () { console.log('"盒子横幅广告 show success') })
        } else {
            console.log('暂不支持互推盒子相关 API')
        }
    },
    showBannerNormal() {

        console.log("广告 "+"普通横幅");
        if (AD_vivo.banner == null)
            AD_vivo.initBanner();
        if (AD_vivo.boxBannerAd != null) {
            AD_vivo.boxBannerAd.destroy()
        }
        AD_vivo.banner.show()
            .then(() => {
                console.log('广告显示成功');
            })
            .catch(err => {
                console.log('广告组件出现问题', JSON.stringify(err));
            })
    },
    /**隐藏banner */
    hideBanner() {
        if (AD.chanelName != AD.chanelName1)
            return;
        if (this.isAutoChaPing) {
            cc.director.emit("vivo_bannerClose");
            return
        }

        if (AD_vivo.banner != null) {
            AD_vivo.banner.destroy();
            AD_vivo.banner = null;
            AD_vivo.initBanner();
        }
        if (AD_vivo.boxBannerAd != null) {
            AD_vivo.boxBannerAd.destroy()
        }
    },
    chaPing() {
        if (AD.chanelName != AD.chanelName1)
            return;
        AD_vivo.showBox()
        //自渲染插屏
        if (this.isAutoChaPing) {
            cc.director.emit("vivo_ChaPingShow");
            return;
        }

        console.log("广告 "+"插屏");
        if (this.couldShowChaPing == false) return;
        setTimeout(() => {
            this.couldShowChaPing = true;
        }, 1000 * this.chaPingInterval)
        this.couldShowChaPing = false;

        console.log("广告 "+"插屏2");
        //原生模板插屏
        const {
            screenHeight,
            screenWidth,
        } = qg.getSystemInfoSync();


        AD_vivo.chaPingNum++;
        if (AD_vivo.chaPingNum > 2) {
            AD_vivo.chaPingNum = 0;
        }

        console.log("广告 "+"插屏3");

        var _x = 0;
        if (screenWidth > screenHeight)
            _x = (screenWidth - 720) / 2;
        console.log("当前屏幕高度：" + screenHeight);
        const customAd = qg.createCustomAd({
            posId: AD_vivo.chaPing_TT[AD_vivo.chaPingNum],
            style: {
                // top: (screenHeight - 630) / 2//竖屏
                top: (screenHeight - 630) / 2,
                left: _x,
            }
        });
        customAd.onError(err => {
            console.log("原生模板广告加载失败", err);
        });
        customAd.show().then(() => {
            console.log('原生模板广告展示完成');
            cc.director.emit("vivo插屏显示", true)
        }).catch((err) => {
            console.log('原生模板广告展示失败', JSON.stringify(err));
        })
        customAd.onClose(() => {
            console.log('原生模板广告关闭');
            cc.director.emit("vivo插屏显示", false)
        })
    },
    /**添加到桌面 */
    addDesktop() {
        if (AD.chanelName != AD.chanelName1)
            return;


        qg.hasShortcutInstalled({
            success: function (res) {
                // 判断图标未存在时，创建图标
                if (res == false) {
                    qg.installShortcut({
                        success: function () {
                            // 执行用户创建图标奖励
                        },
                        fail: function (err) { },
                        complete: function () { }
                    })
                }
            },
            fail: function (err) { },
            complete: function () { }
        })
    },
    /**普通分享 */
    shareOver() {//
        if (AD.chanelName != AD.chanelName1)
            return;
        qg.share();
    },
    /**是否为低版本 false 高版本为true */
    onMoreGamesModalClose() {
        if (AD.chanelName != AD.chanelName1)
            return false;
        if (cc.sys.os == "iOS") {
            return false;
        }
        return false;
        // return tt.onMoreGamesModalClose;
    },
    /**添加到小程序 */
    addShowFavoriteGuide() {

    },
    /**自定义事件 */
    TDEvent(_eventID, _eventName) {
    },

    //获得随机整数 上下限都包括
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    couldZDJ() {
        if (this.random(1, 100) < this.wuDianRate) {
            return true;
        }
        return false;
    },
}