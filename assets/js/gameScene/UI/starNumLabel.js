

cc.Class({
    extends: cc.Component,

    properties: {
        stars: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        AD.starLabelNode = this.node;
        this.node.getComponent(cc.Label).string = globalData.getStarNumSum();
        this.starsNumThisLevel = 0;

        if (this.stars.length > 0) {
            cc.director.on("显示星星", () => {
                
                for (var i = 0; i < 3; i++) {
                    if (this.stars[i].scale == 0) {
                        AD.audioMng.playSfx("显示星星");
                        cc.tween(this.stars[i])
                        .to(0.3, { opacity: 255, scale: 0.75 }, { easing: "backOut" })
                        .start();
                        break;
                    }
                }
                
            }, this);
            for (var i = 0; i < 3; i++) {
                this.stars[i].opacity = 0;
                this.stars[i].scale = 0;
            }

            AD.starLabelNode = this.stars[0];
        }
        cc.director.on("星星数量变化", () => {
            this.node.getComponent(cc.Label).string = globalData.getStarNumSum();
            this.starsNumThisLevel++;
            
            AD.starLabelNode = this.stars[this.starsNumThisLevel];

            // cc.director.getScheduler().setTimeScale(0.5);
            // AD.playerNow.getComponent(cc.RigidBody).gravityScale = 0;
            // AD.playerNow.getComponent(cc.RigidBody).linearVelocity.y = 0
            // this.scheduleOnce(()=>{
            //     cc.director.getScheduler().setTimeScale(1);
            //     AD.playerNow.getComponent(cc.RigidBody).gravityScale = 3;

            // },0.3)

        }, this)
    },

    // update (dt) {},
});
