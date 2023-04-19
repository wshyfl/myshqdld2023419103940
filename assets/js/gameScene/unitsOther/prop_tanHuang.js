

cc.Class({
    extends: cc.Component,

    properties: {
        force:1600
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.duration = 0;
    },
    //普通碰撞
    onBeginContact(contact, selfCollider, other) {
        if (other.tag == 1 && selfCollider.tag == 1) {//玩家
            if(this.duration==0)
            {
                this.rigidbody = other.node.getComponent(cc.RigidBody);
                this.rigidbody.linearVelocity = cc.v2(0, this.force);
                cc.tween(this.node)
                .to(0.05,{scaleY:0.5})
                .to(0.05,{scaleY:1})
                .start();
                this.scheduleOnce(()=>{
                    this.duration =0;
                },0.3);
                AD.audioMng.playSfx("弹簧");
            }
        }
    },
    update (dt) {
        if(this.duration>0)
        this.duration-=dt;
    },
});
