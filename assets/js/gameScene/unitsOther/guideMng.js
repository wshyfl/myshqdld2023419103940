

cc.Class({
    extends: cc.Component,

    properties: {
        keyGuide:"a",
    },

    // onLoad () {},

    start () {
       this.hadGuide =  globalData.getGuideData(this.keyGuide);
    },

    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//玩家
            this.node.destroy();
            
            if(this.hadGuide==false){
                cc.director.emit(this.keyGuide);
            }
            AD.audioMng.playSfx("显示隐藏")
            
        }
    },
    // update (dt) {},
});
