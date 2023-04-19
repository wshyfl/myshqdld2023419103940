

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {
        this.hp = 5;
        this.spr = this.node.getComponent(cc.Sprite).spriteFrame;
        this.nodeBai =new cc.Node;
        this.nodeBai.parent = this.node;
        this.nodeBai.opacity = 0;
        this.nodeBai.addComponent(cc.Sprite);
        this.nodeBai.getComponent(cc.Sprite).spriteFrame = AD.propMng.boxWoodBeShootSpr;
    },
    beHit(_hurtNum){
        if(this.hp<=0)return;
        this.hp--;
        if(this.hp<=0){
            this.dieFunc();
        }
        else 
        {
            cc.tween(this.nodeBai)
            .to(0.05,{opacity:255})
            .to(0.05,{opacity:0})
            .start();
        }
    },
    dieFunc(){
        AD.propMng.createEffectWoodBoxBomb(this.node.position);
        this.node.destroy();
        AD.audioMng.playSfx("砖块破碎");
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if(otherCollider.node.group == "playerBt" && otherCollider.tag == 2)
                this.beHit(1);
    },
    // update (dt) {},
});
