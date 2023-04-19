

cc.Class({
    extends: cc.Component,

    properties: {
        sprCoin: cc.SpriteFrame,
        sprDiamond: cc.SpriteFrame,
    },

    // onLoad () {},

    start() {


        // this.scheduleOnce(() => { this.die() }, 0.1)
        this.node.group = "playerBt";
    },

    reset(...isDiamond) {
        this.couldCollision = false;
        this.isDie = false;
      

        this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;

        // for(var i=0;i< this.node.getComponents(cc.PhysicsCircleCollider).length;i++)
        // this.node.getComponents(cc.PhysicsCircleCollider)[i].enabled = true;

        this.node.group = "playerBt";
        this.isDiamond = false;
        if (isDiamond[0]) {
            this.isDiamond = true;
        }
        if (this.isDiamond){
            
            this.node.getComponent(cc.Sprite).spriteFrame = this.sprDiamond;
            this.scheduleOnce(() => {
                this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(Tools.random(-1100, 1100), Tools.random(800, 1800)),
                    this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
            }, 0.02)
        }
        else{
            
            this.node.getComponent(cc.Sprite).spriteFrame = this.sprCoin;
            this.scheduleOnce(() => {
                this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(Tools.random(-800, 800), Tools.random(800, 1200)),
                    this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
            }, 0.02)
        }

        this.timer = 0;
        this.scheduleOnce(() => {
            this.timer = 1;
        }, 0.5)
    },

    dieFunc() {
        if (this.isDie) return;
        this.isDie = true;
        this.scheduleOnce(() => {
            AD.propMng.coinBombOutPool.put(this.node);
        }, 0.05)
        // cc.director.emit("飞币", 1, this.node, AD.coinLabelNode, 0);
        if (this.isDiamond)
            globalData.setDiamondNum(1);
        else
            globalData.setCoinNum(1);
        AD.audioMng.playSfx("金币");
        AD.propMng.createEffectAddOne(this.node.position);//+1特效

        AD.propMng.createEffectGetProp(this.node.position);//获得道具特效
    },
    // //碰撞检测
    // onBeginContact: function (contact, selfCollider, otherCollider) {


    //     switch (otherCollider.tag) {
    //         case 1://击中玩家
    //             this.dieFunc(0);
    //             break;
    //     }
    // },
    update(dt) {

        // if (this.isDie) return;
        // if (AD.playerNow && this.timer != 0) {
        //     if (Tools.getDistance(this.node.position, AD.playerNow.position) < 50) {
        //         this.dieFunc(0);
        //     }
        // }

    },
      //普通碰撞
      onCollisionStay(other, self) {
        if (this.isDie) return;
        if (AD.playerNow && this.timer != 0) {
            if (other.node.group == "player"){
                this.dieFunc(0);
            }
        }
       
      },
});
