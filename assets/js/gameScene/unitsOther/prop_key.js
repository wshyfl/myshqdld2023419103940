

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.isDie = false;
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1 && this.isDie == false) {//玩家
            this.isDie = true;
            this.scheduleOnce(()=>{
                this.node.destroy();
            },0.05)
            globalData.setKeyNum(1);
            cc.director.emit("飞币", 1, this.node, AD.keyLabelNode, 2);//0金币  1星星 2钥匙
            AD.propMng.createEffectGetProp(this.node.position);//获得道具特效
            
            AD.effectMng.showTipsGetProps("获得钥匙",other.node.position);
            AD.audioMng.playSfx("吃星星");
        }
    },
    // update (dt) {},
});
