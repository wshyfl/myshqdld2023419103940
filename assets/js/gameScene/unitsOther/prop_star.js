

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.isDie = false;
        this.node.getComponent(cc.Sprite).enabled = false;
        AD.propMng.createEffectStarBlink(this.node);
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1 && this.isDie == false) {//玩家

            this.isDie = true;
            this.node.scale = 0;
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.05)
            AD.gameScene.starNum++;
            cc.director.emit("飞币", 1, this.node, AD.starLabelNode, 1);
            cc.director.emit("星星数量变化");
            AD.propMng.createEffectGetPropStar(this.node.position);
            AD.audioMng.playSfx("吃星星");
        }
    },
    die() {

    },
    // update (dt) {},
});
