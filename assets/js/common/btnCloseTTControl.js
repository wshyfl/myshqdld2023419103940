
cc.Class({
    extends: cc.Component,

    properties: {
        isTT: true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (this.isTT)
            this.node.active = (AD.chanelName == "touTiao");
        else
            this.node.active = (AD.chanelName != "touTiao");
    },

    // update (dt) {},
});
