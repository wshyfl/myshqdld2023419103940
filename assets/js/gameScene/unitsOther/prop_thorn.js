

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onCollisionEnter (other,self) {
        if (other.tag == 1) {//碰到玩家
            other.node.getComponent("player").beHurt(1);
        }
    },

    // update (dt) {},
});
