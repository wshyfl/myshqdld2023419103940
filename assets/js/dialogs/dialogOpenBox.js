
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
        Tools.resetDialog2(this.node, true);
        cc.director.emit("玩家停");
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "领取":
                AD.showAD(this.openSucess, this);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;

        }
    },
    openSucess() {
        Tools.resetDialog2(this.node, false);
        setTimeout(() => {
            cc.director.emit("打开宝箱");
        }, 500);
    },

    // update (dt) {},
});
