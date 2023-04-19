

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        
       
        this.duration = 0;
    },
    //普通碰撞
    onCollisionStay(other, self) {

        if (other.node.group == "player" && other.tag == 1) {//玩家
            if(this.duration<=0)
            {
                this.duration = Tools.random(10,30)*0.002;
                this._scaleRate = 1;
                other.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2( 0, 1200*this._scaleRate),
                other.node.getComponent(cc.RigidBody).getWorldCenter(), true);
                
                
            }
        }
    },
    update (dt) {
        if(this.duration>0)
        this.duration-=dt;
    },
});
