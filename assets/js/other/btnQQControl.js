

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (AD.chanelName == "WX")
            if (AD.wuDianRate <= 0)
                this.node.active = false;
    },

    // update (dt) {},
});
