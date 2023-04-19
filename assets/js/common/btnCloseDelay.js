

cc.Class({
    extends: cc.Component,

    properties: {

    },
    // onLoad () {},

    start() {

    },

    onEnable() {
        this.node.scale = 0;

        var _targetScale = 1;
        if (AD.btnCloseIsBig)
            _targetScale = 1.5;
            
        cc.tween(this.node)
            .delay(AD.delayTime)
            .to(0.2, { scale: _targetScale })
            .start();
    },
    // update (dt) {},
});
