

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        AD.keyLabelNode = this.node;
        this.node.getComponent(cc.Label).string = globalData.getKeyNum();
        this.numJiLu = globalData.getKeyNum();
        cc.director.on("钥匙数量变化", () => {
            this.node.getComponent(cc.Label).string = globalData.getKeyNum();
            this.scheduleOnce(() => {
                var _num = globalData.getKeyNum();
                if (this.numJiLu > _num) {
                    // this.createEffectKeyLost();
                }
            }, 0.05)
        }, this)
    },
    createEffectKeyLost() {
        var _effect = cc.instantiate(AD.propMng.keyLost);
        _effect.parent = this.node;
        _effect.position = cc.v2(0,0);
        _effect.scale = 0;
        cc.tween(_effect)
            .by(0.2, { y: 50, scale: 0.8,angle:-300 },{easing:"sineOut"})
            .by(1, { y: -250, opacity: -255,angle:-400 },{easing:"sineIn"})
            .call(() => {
                _effect.destroy();
            })
            .start();
    },

    // update (dt) {},
});
