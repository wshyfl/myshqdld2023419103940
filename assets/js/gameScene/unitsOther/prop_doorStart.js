

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.openNode = this.node.children[0];
        this.openNode.active = false;
        this.node.scale = 0;
        this.node.parent.height = 500;
        this.node.parent.width = 500;
    },

    start() {

        AD.playerNow.scale = 0;
        AD.playerNow.position = this.node.parent.position;
        cc.tween(this.node)
            .delay(1)
            .to(0.2, { scale: 1 })
            .delay(0.5)
            .call(() => {
                AD.audioMng.playSfx("开门");
                this.openNode.active = true;
                this.createEffect(this.openNode);
                AD.playerNow.position = this.node.parent.position;
                cc.tween(AD.playerNow)
                    .delay(0.5)
                    .call(() => {

                        AD.audioMng.playSfx("飞入门");
                    })
                    .to(0.4, { scale: 1, y: this.node.parent.y + 120 ,x: this.node.parent.x + 120 },{easing:"sineOut"})
                    .call(() => {
                        AD.playerNow.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                        AD.playerNow.getComponent("player").beginNow = true;
                    })
                    .start();
            })
            .delay(1.5)
            .call(() => {
                this.node.parent.height = 230;
                this.node.parent.width = 180;

                this.openNode.active = false;
                AD.audioMng.playSfx("关门");
            })
            .delay(0.5)
            .call(() => {
                AD.audioMng.playSfx("门消失");
            })
            .delay(0.2)
            .call(() => {
                cc.tween(this.node.parent)
                    .by(0.3, { y: -230 })
                    .start();
            })
            .by(0.3, { y: 230 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    },

    createEffect(_parent) {
        var _effect = cc.instantiate(AD.propMng.doorEffect);
        _effect.parent = _parent;
    }
    // update (dt) {},
});
