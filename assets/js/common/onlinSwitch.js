
var LabelUtils2 = require("LabelUtils2");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        window.version = "1.0.0";
        if (AD.chanelName1 == "uc"
            || AD.chanelName1 == "BD"
            || AD.chanelName1 == "android"
            || AD.chanelName1 == "4399Box") {
            return
        }
        cc.game.addPersistRootNode(this.node);

        this.isOpen = false;
        if (AD.chanelName == AD.chanelName1) {
            this.getSwitchKey();
            LabelUtils2.getInstance().initLabel(this.key);
            var _funcGetShare = function () {
                //关闭按钮 概率
                var _close = LabelUtils2.getInstance().getLabel(this.switch)//
                if (_close == true) {
                    this.isOpen = true;
                    this.switchOn();
                    this.unschedule(_funcGetShare);
                    if (AD.chanelName1 == "oppo") {
                        var _rate = parseInt(LabelUtils2.getInstance().getZDJRate("ZDJ"))//
                        console.log("*************** _rate// " + _rate)
                        if (_rate > 0) {
                            AD.wuDianRate = _rate;
                            console.log("*************** 重置_rate// " + _rate)

                        }
                    }
                }
                console.log("*************** // " + _close)
            };
            this.schedule(_funcGetShare, 0.5, 40, 0.5);
            this.scheduleOnce(() => {
                if (!this.isOpen)
                    this.schedule(_funcGetShare, 5);
            }, 22)
            // this.schedule(_funcGetShare, 5)
        }



    },

    start() {
        if (AD.chanelName1 == "uc"
            || AD.chanelName1 == "BD"
            || AD.chanelName1 == "android") {
            return
        }
        this.scheduleOnce(() => {
            AD_vivo.loadData();
            AD_oppo.loadData();
        }, 0.3)
        this.schedule(() => {
            AD_vivo.loadData();
            AD_oppo.loadData();
        }, 20)



        if (AD.chanelName1 == "WX") {
            this.yuanShengSecond = 0;
            this.schedule(function () {
                if (AD_WX.yuanShengIsOk == false) {
                    AD_WX.showYuanSheng();
                    this.yuanShengSecond = 0;
                }
                else {
                    this.yuanShengSecond++;
                    if (this.yuanShengSecond == 30) {
                        AD_WX.hideYuanSheng();
                    }
                }
            }, 1)
        }
        if (AD.chanelName1 == "huaWei") {
            cc.game.on(cc.game.EVENT_HIDE, event => {
                console.log("------------>后台了");
            }, this);
            cc.game.on(cc.game.EVENT_SHOW, event => {
                console.log("------------>前台了,开始上报");
                cc.director.emit("chaPingReportAdShow");
            }, this);
        }
    },
    getSwitchKey() {
        switch (AD.chanelName1) {
            case "touTiao":  //
                this.key = "";
                this.switch = "switch";
                break;
            case "oppo":  //OPPO
                this.key = "com.sqdld.oppo0712";
                this.switch = "switch";
                window.version = "1.0.4";
                break;
            case "vivo":  //vivo 
                window.version = "1.0.3";
                this.key = "com.sqdld.vivo0711";
                this.switch = "switch3";
                break;
            case "huaWei":  //华为 
                this.key = "";
                this.switch = "switch";
                break;
            case "QQ":  //QQ
            window.version = "1.0.0.0";
                this.key = "com.sqdld.QQ0802";
                this.switch = "switch";
                break;
            case "WX":  //
                this.key = "com.wbgame.drsqdz.wx0410";
                this.switch = "switch";
                break;
            case "4399Box":  //
                this.key = "";
                this.switch = "switch";
                break;
            case "BD":  //
                this.key = "";
                this.switch = "switch";
                break;
        }
    },

    switchOn() {
        switch (AD.chanelName1) {
            case "touTiao":
                AD.delayTime = 0.01;//关闭按钮延时
                AD.wuDianRate = 0;//自点击概率
                break;
            case "vivo":
                // AD.wuDianRate = 10;//自点击概率
                // AD.audioMng.playMusic();
                // AD.delayTime = 3;//关闭按钮延时
                // AD_vivo.chaPingBoo = true;
                // AD_vivo.addZhuoMianBoo = true;
                AD_vivo.switchOn();
                break;
            case "oppo":

                AD_oppo.switchOn();
                break;
            case "huaWei":
                AD_HuaWei.bennerBoo = true;
                AD.wuDianRate = 15;//自点击概率
                AD.delayTime = 3;//关闭按钮延时
                break;
            case "QQ":
                AD.wuDianRate = 10;//自点击概率
                AD.delayTime = 3;//关闭按钮延时
                break;
            case "uc":
                AD_UC.init();
                break;
            case "4399Box":
                AD.wuDianRate = 10;//自点击概率
                AD.delayTime = 3;//关闭按钮延时
                break;
            case "WX":
                AD.wuDianRate = 10;//自点击概率
                AD.delayTime = 3;//关闭按钮延时
                break;
            case "BD":
                AD.wuDianRate = 10;//自点击概率
                AD.delayTime = 3;//关闭按钮延时
                break;
        }
    },
    // update (dt) {},
});

