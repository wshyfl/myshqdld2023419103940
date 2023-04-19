

cc.Class({
    extends: cc.Component,

    properties: {
        delayTime: 0,
        hadShowAct: {
            default: false,
            displayName: "有小变大动画吗?"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.isDie = false;
        if (this.delayTime > 0) {

            if (this.hadShowAct)
                this.node.scale = 0;
            this.scheduleOnce(() => {
                this.delayTime = 0;
                AD.audioMng.playSfx("金币出现");
                cc.tween(this.node)
                    .to(0.2, { scale: 1.1 }, { easing: "sineInOut" })
                    .to(0.1, { scale: 1.0 }, { easing: "sineInOut" })
                    .start();
            }, this.delayTime)
        }
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1 && this.isDie == false && this.delayTime <= 0) {//玩家

            this.isDie = true;
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.05)
            // cc.director.emit("飞币", 1, this.node, AD.coinLabelNode, 0);
            globalData.setCoinNum(1);
            AD.propMng.createEffectGetProp(this.node.position);
            AD.propMng.createEffectAddOne(this.node.position);//+1特效

            AD.audioMng.playSfx("金币");
        }
    },
    // update (dt) {},
});
