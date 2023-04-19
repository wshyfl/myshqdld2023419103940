

cc.Class({
    extends: cc.Component,

    properties: {
        targetScale: 2,
        autoResume: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//玩家
            this.node.destroy();
            cc.director.emit("玩家大小变化", this.targetScale, this.autoResume);
            AD.audioMng.playSfx("吃星星");
            if (this.targetScale < 1)
                AD.effectMng.showTipsGetProps("缩小药水", other.node.position);
            else if (this.targetScale > 1)
                AD.effectMng.showTipsGetProps("放大药水", other.node.position);
        }
    },
    // update (dt) {},
});
