

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        AD.audioMng.playSfx("暂停");
        Tools.resetDialog2(this.node, true);
        this.scheduleOnce(() => {
            cc.director.pause();
        }, 0.2)
    },

    btnCallBack(event, type) {
        cc.director.resume();
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "继续游戏":
                Tools.resetDialog2(this.node, false);
                break;
            case "返回菜单":
                cc.director.emit("过场动画", "menuScene");
                break;
            case "重新开始":
                if (AD.modeType == "PVP模式")
                    cc.director.emit("过场动画", "gamePVP");
                else
                    cc.director.emit("过场动画", "gameScene");
                break;
        }
    },


    // update (dt) {},
});
