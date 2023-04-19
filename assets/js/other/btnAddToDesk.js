

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (AD.chanelName != "vivo" && AD.chanelName1 != "oppo" && AD.chanelName1 != "QQ") {
            this.node.active = false;
        }
        else {
            cc.tween(this.node)
                .repeatForever(
                    cc.tween()
                        .to(0.3, { scale: 1.1 })
                        .to(0.3, { scale: 1.0 })
                )
                .start();
        }
    },


    btnCallBack() {
        AD.addToDesk();
    }
    // update (dt) {},
});
