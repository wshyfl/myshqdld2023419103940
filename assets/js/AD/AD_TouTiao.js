window.AD_TouTiao = {
    //**头条相关 */
    bannerID_TT: "12n1lhlka3b1345865",//banner // 
    videoID_TT: "1lj6n2dahb2gfbcf45",//视频 //  
    chaPing_TT: "16b3h4eihe6d49qqln",//插屏 //  
    shareID_TT: "2552ffjcoa03if12bf", //分享//  
    appName: "像素英雄枪战",
    shareTitle_TT: "多人像素枪战，全民来PK！",
    shareDESC_TT: "多人像素枪战，全民来PK！",
    phone: "null",
    transcribeBoo: false, //录制视频是否成功
    fenXiangBoo: false, //是否调起分享

    autoVideoBoo: false, //自动视频开关
    fenXiangImgBoo: false, //分享界面相关开关
    autoVideoNum: 0, //关卡通关次数


    /**插屏 */
    chaPing() {
        console.log("显示插屏");
        if (AD.chanelName != AD.chanelName1)
            return;
        //const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
        const isIOS = tt.getSystemInfoSync().platform === "ios"
        // 插屏广告仅今日头条安卓客户端支持

        if (!isIOS) {
            const interstitialAd = tt.createInterstitialAd({
                adUnitId: AD_TouTiao.chaPing_TT
            });
            console.log("进来了");
            if (!interstitialAd) return;
            interstitialAd
                .load()
                .then(() => {
                    console.log("成功调取插屏");
                    interstitialAd.show();
                })
                .catch(err => {
                    console.log("头条插屏错误   " + JSON.stringify(err));
                });

            interstitialAd.onClose(function () {
                interstitialAd.destroy();
                console.log("头条插屏关闭  后销毁 ");

            });
            interstitialAd.onError(function (err) {
                console.log("头条插屏错误1   " + JSON.stringify(err));
            });
        }
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
        let video_retry_times = 0;
        let videoAd = tt.createRewardedVideoAd({
            adUnitId: AD_TouTiao.videoID_TT,
        });
        videoAd.load()
            .then(() => {
                videoAd.show()

                // cc.director.pause();//暂停creator
                // cc.game.pause();
            })
            .catch(err => {
                console.log(err.errMsg)
            });
        let loadCallback = () => {
            console.log("sdk videoAd start ........")
        };
        let errorCallback = (res) => {
            console.log(JSON.stringify(res));
            if (video_retry_times >= 0 && video_retry_times < 1) {
                videoAd.load()
                    .then(() => {
                        videoAd.show();
                        // cc.director.pause();
                    })
                    .catch(err => {
                        console.log(err.errMsg);

                        cc.director.resume();//暂停creator
                        //加载视频失败
                    });
                video_retry_times++;
            } else if (video_retry_times >= 1) {
                videoAd.offLoad(loadCallback);
                videoAd.offClose(closeCallback);
                videoAd.offError(errorCallback);
                console.log("miaoju_watch_retry_times" + video_retry_times);
                video_retry_times = -1;
            }
        };
        //关闭
        let closeCallback = (res) => {
            console.log("临时关闭视频：" + res);
            if (res.isEnded) {
                //发道具 
                //成功回调
                console.log("视频成功了，走成功回调");
                cc.director.resume();//暂停creator
                AD.reward();
            }
            else {
                console.log("视频失败了，走失败回调");
                // method1.call(caller,data[0]);
                cc.director.resume();//暂停creator
            }
            videoAd.offLoad(loadCallback);
            videoAd.offClose(closeCallback);
            videoAd.offError(errorCallback);
        };
        videoAd.onLoad(loadCallback);
        videoAd.onError(errorCallback);
        videoAd.onClose(closeCallback);
    },

    initBanner() {
        if (AD.chanelName != AD.chanelName1)
            return;


        console.log("头条banner init")
        const { windowWidth, windowHeight } = tt.getSystemInfoSync();
        var targetBannerAdWidth = 108;
        AD_TouTiao.TTBanner = tt.createBannerAd({
            adUnitId: AD_TouTiao.bannerID_TT,

            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 16) * 9-10 // 根据系统约
            }
        });

        AD_TouTiao.TTBanner.onResize(size => {
            console.log("改变size");
            AD_TouTiao.TTBanner.style.left = ((windowWidth - size.width) / 2);
            AD_TouTiao.TTBanner.style.top = windowHeight - size.height;
        });


        AD_TouTiao.TTBanner.onLoad(function () {
            // AD_TouTiao.TTBanner.show()
            //     .then(() => {
            //         console.log('广告显示成功');
            //     })
            //     .catch(err => {
            //         console.log('banner load错误 : ', err);
            //     })
        });

        let errCallBack = (res) => {
            console.log(res);
        };
        AD_TouTiao.TTBanner.onError(errCallBack);
    },
    /**显示banner */
    showBanner() {
        console.log("banner 调用");
        if (AD.chanelName != AD.chanelName1)
            return;

        if (AD_TouTiao.TTBanner == null)
            AD_TouTiao.initBanner();
        {
            AD_TouTiao.TTBanner.show()
                .then(() => {
                    console.log('广告显示成功');
                })
                .catch(err => {
                    console.log('广告组件出现问题', err);
                })
        }
    },
    /**隐藏banner */
    hideBanner() {
        if (AD.chanelName != AD.chanelName1 || AD_TouTiao.TTBanner == null)
            return;
        var isToutiaioBoo = tt.getSystemInfoSync().appName === "Toutiao";
        if (isToutiaioBoo) {
            AD_TouTiao.TTBanner.destroy();
            AD_TouTiao.TTBanner = null;
            AD_TouTiao.initBanner();
        } else {
            AD_TouTiao.TTBanner.hide();
        }
    },
    /**开始录屏 */
    luPingBegin() {
        if (AD.chanelName1 != "touTiao") return;
        if (AD.chanelName != AD.chanelName1)
            return;
        console.log("录屏开始")
        console.log("luping  開始")
        AD_TouTiao.transcribeBoo = false; //录制视频是否成功
        AD_TouTiao.fenXiangBoo = false; //是否调起分享
        AD_TouTiao.resVideoPathTouTiao = null; //录制视频地址
        let recorder = tt.getGameRecorderManager();
        if (!recorder) return;
        tt.onShow((res) => {
            recorder.resume();
        });
        tt.onHide(() => {
            recorder.pause();
        })

        recorder.onStart(res => {
            console.log('录屏开始');

        });

        recorder.start({ duration: 300, });
    },
    /**头条录屏结束 */
    luPingOver() {//头条录屏结束
        if (AD.chanelName1 != "touTiao") return;
        if (AD.chanelName != AD.chanelName1)
            return;
        if (AD_TouTiao.transcribeBoo == true) return;
        AD_TouTiao.transcribeBoo = true;
        console.log("录屏结束")
        if (AD.chanelName == AD.chanelName1) {
            console.log("luping  結束");
            let recorder = tt.getGameRecorderManager();
            if (!recorder) return;
            tt.offShow(() => {
            });
            tt.offHide(() => {
            });
            recorder.onStop(res => {
                AD_TouTiao.resVideoPathTouTiao = res.videoPath;
                console.log('录屏结束：' + res.videoPath);
                console.log('录屏结束：' + res);
                // AD_TouTiao.transcribeBoo = true;
            });

            recorder.stop();
        }


    },
    /**录屏分享  
     * @method ： 成功方法
     * @method1 ：失败方法
     * @caller ：作用域
     * @data ：参数
     * */
    luPingShare() {//胜利界面录屏分享
        if (AD.chanelName1 != "touTiao") return;
        if (AD.chanelName != AD.chanelName1) {
            // method1.call(caller,"无地址");  
            return;
        }
        if (AD_TouTiao.resVideoPathTouTiao == null) {
            // method1.call(caller,"无地址");  
            return;
        }

        // if (AD_TouTiao.fenXiangBoo) return;
        // AD_TouTiao.fenXiangBoo = true;
        cc.log("分享视频 = " + AD_TouTiao.resVideoPathTouTiao);
        tt.shareAppMessage({
            channel: 'video',
            query: "",
            templateId: AD_TouTiao.shareID_TT, // 替换成通过审核的分享ID
            title: AD_TouTiao.shareTitle_TT,
            desc: AD_TouTiao.shareDESC_TT,
            extra: {
                videoPath: AD_TouTiao.resVideoPathTouTiao, // 可用录屏得到的视频地址
                videoTopics: [AD_TouTiao.appName, "抖音小游戏"],
                hashtag_list: [AD_TouTiao.appName, "抖音小游戏"],
                video_title: AD_TouTiao.shareDESC_TT
            },
            success() {
                console.log('分享视频成功');
                // method.call(caller,data[0]);
                AD_TouTiao.fenXiangBoo = false;
                cc.director.emit("分享成功");
            },
            fail(e) {
                console.log(e);
                console.log('分享视频失败');
                // method1.call(caller,"分享失败");  
                if (e.errMsg && e.errMsg != "shareAppMessage:cancel") {
                    // AD_TouTiao.transcribeBoo = false;

                    // AD.globalNode.showTips("敬请期待")
                    cc.director.emit("系统提示", "录屏失败：录屏时长低于 3 秒");
                }
                // AD_TouTiao.fenXiangBoo = false;
            }
        })

    },
    /**视频分享 */
    shareTTNormal() {//头条视频分享分享
        if (AD.chanelName != AD.chanelName1)
            return;
        // if(AD_TouTiao.chanelName=="touTiao") 
        {//头条录屏
            cc.log("分享视频 = " + AD_TouTiao.resVideoPathTouTiao);
            tt.shareAppMessage({
                channel: '',
                query: "",
                templateId: AD_TouTiao.shareID_TT, // 替换成通过审核的分享ID
                title: AD_TouTiao.shareTitle_TT,
                desc: AD_TouTiao.shareDESC_TT,
                extra: {
                    videoPath: AD_TouTiao.resVideoPathTouTiao, // 可用录屏得到的视频地址
                    videoTopics: [AD_TouTiao.appName, AD_TouTiao.shareDESC_TT, "抖音小游戏"]
                },
                success() {

                },
                fail(e) {
                    console.log(e);
                    console.log('分享视频失败');
                    if (e.errMsg && e.errMsg != "shareAppMessage:cancel") {
                        cc.director.emit("系统提示", "录屏失败：录屏时长低于 3 秒");
                    }
                }
            })
        }
    },
    /**分享 */
    shareOver() {//
        if (AD_TouTiao.chanelName != AD_TouTiao.chanelName1)
            return;
        // if(AD_TouTiao.chanelName=="touTiao") 
        {//头条录屏
            cc.log("分享视频 = " + AD_TouTiao.resVideoPathTouTiao);
            tt.shareAppMessage({
                channel: '',
                query: "",
                templateId: AD_TouTiao.shareID_TT, // 替换成通过审核的分享ID
                title: AD_TouTiao.shareTitle_TT,
                desc: AD_TouTiao.shareDESC_TT,
                extra: {
                    videoPath: AD_TouTiao.resVideoPathTouTiao, // 可用录屏得到的视频地址
                    videoTopics: [AD_TouTiao.appName, AD_TouTiao.shareDESC_TT, "抖音小游戏"]
                },
                success() {

                },
                fail(e) {
                    console.log(e);
                    console.log('分享视频失败');
                }
            })
        }
    },
    /**添加到收藏 */
    addCollection() {
        if (AD.chanelName != AD.chanelName1)
            return;
        if (tt.onFavoriteStateChange) {
            tt.onFavoriteStateChange((isFavorited) => {
                if (isFavorited) {
                    console.log("收藏成功");
                } else {
                    console.log("收藏失败");
                }
            });
        }

    },
    /**更多游戏 */
    moreGameTT() {
        if (AD.chanelName != AD.chanelName1)
            return;
        console.log("moreGame_TT");
        if (tt.onMoreGamesModalClose) {
            // 监听弹窗关闭
            tt.onMoreGamesModalClose(function (res) {
                console.log("modal closed", res);
            });
            // 监听小游戏跳转
            tt.onNavigateToMiniProgram(function (res) {
                console.log(res.errCode);
                console.log(res.errMsg);
            });

            const systemInfo = tt.getSystemInfoSync();
            // iOS 不支持，建议先检测再使用
            if (systemInfo.platform !== "ios") {
                // 打开互跳弹窗
                tt.showMoreGamesModal({
                    appLaunchOptions: [
                        {
                            appId: "ttd01aa6a74f30eb0f"
                        },
                        {
                            appId: "tt725e04e3ed7480a8"
                        },
                        {
                            appId: "tt2b745dc9b45ef5b3"
                        },
                        {
                            appId: "ttb7bec1032894d01a"
                        },
                        {
                            appId: "ttd472a2cf4b589bc9"
                        },
                        {
                            appId: "tta48bd2363ba18de7"
                        },
                        {
                            appId: "tt4b4f3df2d475b5aa"
                        },
                        {
                            appId: "tt2dde5b63b2e42f61"
                        },
                        {
                            appId: "tta041d6fc3f6bd140"
                        },
                        {
                            appId: "ttc4fbb2465bc1faff" //
                        }
                    ],
                    success(res) {
                        console.log("success", JSON.stringify(res));
                    },
                    fail(res) {
                        console.log("fail", res.errMsg);
                    }
                });
            }
        }
        else {
            tt.showModal({
                title: "提示",
                content:
                    "当前客户端版本过低，无法使用该功能，请升级客户端或关闭后重启更新。"
            });
        }

    },
    showMoreGame(_btnID) {
        var _gameID = "";
        if (_btnID == 1)
            _gameID = "";//春节修炼手册
        else if (_btnID == 2)
            _gameID = "";//疯狂答题
        else if (_btnID == 3)
            _gameID = "";//功夫特牛
        else if (_btnID == 4)
            _gameID = "";//滚动金币跑酷
        else if (_btnID == 5)
            _gameID = "";//黄金矿工,冒险
        else if (_btnID == 6)
            _gameID = "";//火柴人特工
        else if (_btnID == 7)
            _gameID = "";//热血枪王
        else if (_btnID == 8)
            _gameID = "";//双人大比拼
        console.log("btnID  " + _btnID)
        AD_TouTiao.moreGameTT();//头条的更多游戏

    },
    /**是否为低版本 false 高版本为true */
    onMoreGamesModalClose() {
        if (AD.chanelName != AD.chanelName1)
            return false;
        if (cc.sys.os == "iOS") {
            return false;
        }
        return tt.onMoreGamesModalClose;
    },
    /**添加到小程序 */
    addShowFavoriteGuide() {
        if (AD.chanelName != AD.chanelName1)
            return;
        tt.showFavoriteGuide({
            type: "bar",
            content: "一键添加到我的小程序",
            position: "bottom",
            success(res) {
                console.log("引导组件展示成功");
            },
            fail(res) {
                console.log("引导组件展示失败");
            },
        });
    },
    /**自定义事件 */
    TDEvent(_type, level) {
        if (AD.chanelName != AD.chanelName1)
            return;
        switch (_type) {
            case 1: //进入关卡
                TDGA.onMissionBegin("关卡:" + level);
                break;
            case 2: //关卡胜利
                TDGA.onMissionCompleted("关卡:" + level);
                break;
            case 3: //关卡失败
                TDGA.onMissionFailed("关卡:" + level, "");
                break;
        }
    },

}