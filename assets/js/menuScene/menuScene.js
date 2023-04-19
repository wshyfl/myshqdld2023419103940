

cc.Class({
    extends: cc.Component,

    properties: {
        nameParent: cc.Node,
        btnMoreGame: cc.Node,
        btnEffectArr: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        AD.audioMng.playMusic();
        // cc.director.emit("展示枪支弹窗");//枪支
        cc.director.emit("展示签到弹窗", true);//自动弹出(每天一次)
        this.btnMoreGame.active = false;
        if (AD.isAndroid && AD.chanel == "oppo")
            this.btnMoreGame.active = true;
        if (AD.chanelName == "oppo") {
            if (AD_oppo.chaPingBoo)
                this.btnMoreGame.active = true;
        }

    },

    start() {
        this.playerType = globalData.roleType;
        cc.director.on("更换角色", (_type) => {
            this.playerType = _type;
            this.resetName();
        }, this);

        this.resetName();

        AD.showBanner();
        this.showEffect();
        this.schedule(() => {
            this.showEffect();
        }, 3);
    },
    resetName() {
        for (var i = 0; i < this.nameParent.children.length; i++) {
            this.nameParent.children[i].active = (i == this.playerType);
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "签到":
                cc.director.emit("展示签到弹窗");//点击签到按钮 弹出
                break;
            case "抽奖":
                cc.director.emit("展示抽奖弹窗");//点击签到按钮 弹出
                break;
            case "成就":
                cc.director.emit("展示成就弹窗");//点击签到按钮 弹出
                break;
            case "在线":
                cc.director.emit("展示在线奖励");//点击签到按钮 弹出
                break;
            case "角色":
                cc.director.loadScene("roleScene");
                break;
            case "武器":
                cc.director.loadScene("weaponScene");
                break;
            case "开始":
                AD.modeType = "关卡模式";
                cc.director.loadScene("levelScene");
                break;
            case "pvp":
                AD.modeType = "PVP模式";
                if (globalData.tuiJianIndex % 2 == 1)
                    cc.director.emit("展示枪支弹窗");//枪支
                else
                    cc.director.emit("展示角色弹窗");//枪支
                globalData.tuiJianIndex++;


                break;
            case "更多游戏":
                AD.moreGame();
                break;
        }
    },
    showEffect() {
        var _index = Tools.random(0, 3);
        for (var i = 0; i < 4; i++) {
            if (i == _index) {
                this.btnEffectArr[i].active = true;
                cc.tween(this.btnEffectArr[i].parent)
                    .delay(0.3)
                    .to(0.1, { scale: 1.05 }, { easing: "sineInOut" })
                    .to(0.3, { scale: 1 }, { easing: "sineInOut" })
                    .start();
                break;
            }
        }
        this.scheduleOnce(() => {
            for (var i = 0; i < 4; i++) {
                if (this.btnEffectArr[i].active) {
                    this.btnEffectArr[i].active = false;
                    break;
                }
            }
        }, 1);


    },
    // update (dt) {},
});
