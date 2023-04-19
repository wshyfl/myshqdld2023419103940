

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//玩家
            this.node.destroy();
            cc.director.emit("增加子弹",1);
            AD.audioMng.playSfx("补充水分");
            AD.propMng.createEffectGetProp(this.node.position);//获得道具特效
            AD.effectMng.showTipsGetProps("水箱布满",other.node.position);
        }
    },
    // update (dt) {},
});
