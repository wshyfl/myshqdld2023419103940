
window.AD_oppo = {
    bannerID_box: "",//互推banner
    boxID: "562867",//互推九宫格
    bannerID_normal: "562863",//普通banner
    videoID_TT: "562866",//视频
    chaPing_TT: ["562865", "562865", "562865"],//原生插屏
    banner_electBox: "",//互推盒子id
    chaPingNum: 0, //原生插屏当前显示
    gameSkipNum: 0, //小游戏跳转顺序
    pkgNameAll: ["com.srdbp2.nearme.gamecenter", "com.mzqz.nearme.gamecenter", "com.mor.tddzz.nearme.gamecenter", "com.kdddmx.nearme.gamecenter"], //跳转小游戏包名

    reportingBoo: false, //原生数据是否上报
    chaPingBoo: false, //插屏开关
    bennerBoo: false, //广告显示开关 
    // heziBoo:true, //互推盒子开关
    levelNum: 0,//通过关卡数

    hadCallReset: false,
    switchOn() {

        AD.wuDianRate = 15;//自点击概率
        AD.delayTime = 3;//关闭按钮延时
        AD_oppo.chaPingBoo = true;
    },
    /**原生插屏 */
    loadData() {
        console.log("显示插屏");
        if (AD.chanelName != AD.chanelName1 || AD.chanelName1 != "oppo")
            return;
        AD_oppo.chaPingNum++;
        if (AD_oppo.chaPingNum > 2) {
            AD_oppo.chaPingNum = 0;
        }
        AD_oppo.nativeAd = qg.createNativeAd({
            adUnitId: AD_oppo.chaPing_TT[AD_oppo.chaPingNum],
        });
        AD_oppo.nativeAd.load();

        AD_oppo.nativeAd.onError(function (err) {
            console.log("加载失败" + JSON.stringify(err))
            AD_oppo.nativeAd.offError();
            AD_oppo.nativeAd.offLoad();
        })
        AD_oppo.nativeAd.onLoad(function (res) {
            console.log('原生广告加载完成', JSON.stringify(res));
            if (res && res.adList) {
                var data = res.adList;
                var listData = JSON.stringify(data);// 转成JSON格式
                var list = JSON.parse(listData);
                AD_oppo.result = list[list.length - 1];
                cc.director.emit("oppo_ChaPingShuaXin");
                AD_oppo.reportingBoo = false;
            }
            AD_oppo.nativeAd.offError();
            AD_oppo.nativeAd.offLoad();
        });

    },
    /**视频 
     * @method ： 成功方法
     * @method1 ：失败方法
     * @caller ：作用域
     * @data ：参数
     * */
    shiPin() {
        if (AD.chanelName != AD.chanelName1) {
            AD.reward();
            return;
        }

        console.log('调起视频', + AD_oppo.videoID_TT);
        if (AD_oppo.videoAd_Revive != null)
            AD_oppo.videoAd_Revive.destroy();
        //复活视频 初始化
        AD_oppo.videoAd_Revive = qg.createRewardedVideoAd({
            adUnitId: AD_oppo.videoID_TT
        })
        AD_oppo.videoAd_Revive.load();

        AD_oppo.videoAd_Revive.onLoad(function () {
            console.log("激励视频加载成功");
            AD_oppo.videoAd_Revive.show();
            AD_oppo.videoAd_Revive.offLoad();

        })
        AD_oppo.videoAd_Revive.onVideoStart(function () {
            AD_oppo.videoAd_Revive.offVideoStart()
            console.log("激励视频 开始播放");
        })
        AD_oppo.videoAd_Revive.onError((err) => {
            AD_oppo.videoAd_Revive.offError()
            qg.showToast({
                //message: '暂无广告，请稍后重试',
                title: '暂无广告，请稍后重试',
                duration: 2000
            })
            console.log('激励视频 加载错误:  ' + JSON.stringify(err))
        })

        AD_oppo.videoAd_Revive.onClose((res) => {
            console.log("视频关闭  结果是   " + JSON.stringify(res))
            if (res.isEnded) {
                console.log('复活 激励视频广告完成，发放奖励');
                AD.reward();
                AD_oppo.videoAd_Revive.offClose();
            } else {
                AD_oppo.videoAd_Revive.offClose();
                console.log('激励视频广告取消关闭，不发放奖励')
                // cc.director.emit("videoTipView");
            }
        })
    },

    bannerIndex: 0,
    /**显示banner */
    showBanner() {
        if (!AD_oppo.chaPingBoo) return;
        // if (AD_oppo.bannerIndex % 2 == 0)
        //     AD_oppo.showBannerNormal();
        // else
        //     AD_oppo.showGameBanner();
        // if (this.hadCallReset == false) {
        //     this.hadCallReset = true;
        //     setInterval(() => {
        //         AD_oppo.bannerIndex++;
        //     }, 10 * 1000)
        // }
        AD_oppo.showBannerNormal();
    },

    /**隐藏banner */
    hideBanner() {
        AD_oppo.hideBannerNormal();
        AD_oppo.hideGameBanner();
    },
    bannerAd: null,
    //普通banner
    showBannerNormal() {
        console.log("普通banner");
        if (AD_oppo.bannerAd != null) {
            AD_oppo.bannerAd.show()
            AD_oppo.hideGameBanner();
            return
        }

        let screenHeight = qg.getSystemInfoSync().screenHeight;
        let screenWidth = qg.getSystemInfoSync().screenWidth;
        AD_oppo.bannerAd = qg.createBannerAd({
            adUnitId: AD_oppo.bannerID_normal,
            style: {
                top: screenHeight - 150,
                left: 0,
                width: screenWidth,
                height: 300
            }
        })
        AD_oppo.bannerAd.show()
        AD_oppo.bannerAd.onError(function (err) {
            console.log(err);
        })

        AD_oppo.bannerAd.onLoad(function () {
            AD_oppo.hideGameBanner();
        })
        console.log("进入banner")
    },
    hideBannerNormal() {
        if (AD_oppo.bannerAd != null) {
            AD_oppo.bannerAd.destroy()
            AD_oppo.bannerAd = null;
        }
    },
    gameBannerAd: null,
    //互推banner--显示
    showGameBanner() {
        console.log("互推banner");
        if (AD_oppo.gameBannerAd) {
            AD_oppo.gameBannerAd.show();
            AD_oppo.hideBannerNormal();
            return
        }
        let screenHeight = qg.getSystemInfoSync().screenHeight;
        let screenWidth = qg.getSystemInfoSync().screenWidth;
        console.log("--------创建互推横幅广告")
        AD_oppo.gameBannerAd = qg.createGameBannerAd({
            adUnitId: AD_oppo.bannerID_box,
            style: {
                top: screenHeight,
                left: 0,
                orientation: 'horizontal'
            }
        })


        AD_oppo.gameBannerAd.show();
        AD_oppo.gameBannerAd.onLoad(function () {
            console.log('互推盒子横幅广告加载成功')
            AD_oppo.gameBannerAd.offLoad()
            AD_oppo.hideBannerNormal();
        })
        AD_oppo.gameBannerAd.onError(function (err) {
            console.log("互推盒子banner 失败:" + JSON.stringify(err))
            AD_oppo.gameBannerAd.offError()
            AD_oppo.showBannerNormal();
        })

    },
    //互推banner--隐藏
    hideGameBanner() {
        if (AD_oppo.gameBannerAd) {
            AD_oppo.gameBannerAd.destroy()
            AD_oppo.gameBannerAd = null;
        }
    },
    showBox() {
        AD_oppo.gamePortalAd = qg.createGamePortalAd({
            adUnitId: AD_oppo.boxID
        })
        AD_oppo.gamePortalAd.load().then(function () {
            console.log('load success')
        }).catch(function (error) {
            console.log('load fail with:' + error.errCode + ',' + error.errMsg)
            cc.director.emit("系统提示","请求失败 请稍后重试");
        })
        AD_oppo.gamePortalAd.onLoad(function () {
            console.log('互推盒子九宫格广告加载成功')
            AD_oppo.gamePortalAd.show();
            AD_oppo.gamePortalAd.offLoad()
            AD_oppo.hideGameBanner()
        })
        AD_oppo.gamePortalAd.onClose(function () {
            AD_oppo.gamePortalAd.offClose()
            AD_oppo.showBanner()
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
    /**oppo小游戏跳转 */
    gameSkipOppo(_num) {
        if (AD.chanelName != AD.chanelName1)
            return;
        qg.navigateToMiniGame({
            pkgName: AD_oppo.pkgNameAll[_num],
            path: '?page=pageB',
            extraData: {
                from: 'pageA'
            },
            success: function () {
                // AD_oppo.gameSkipNum++;
                // if (AD_oppo.gameSkipNum > 3) {
                //     AD_oppo.gameSkipNum = 0;
                // }
            },
            fail: function (res) {
                console.log(JSON.stringify(res))
            }
        })
    },

    /**开始录屏 */
    luPingBegin() {
    },
    /**头条录屏结束 */
    lupingOver() {//头条录屏结束 
    },
    /**录屏分享 */
    luPingShare() {//胜利界面录屏分享
    },
    /**普通分享 */
    share() {//
        if (AD.chanelName != AD.chanelName1)
            return;
        console.log("点击分享");
        qg.share();
    },
    /**更多游戏 */
    moreGameTT() {
    },
    showMoreGame(_btnID) {
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
    TDEvent(_type, level) {
        if (AD.chanelName != AD.chanelName1) return
        switch (_type) {
            case 1: //进入关卡
                TDGA.onMissionBegin(level);
                break;
            case 2: //关卡结束
                TDGA.onMissionCompleted(level);
                break;
        }
    },
}