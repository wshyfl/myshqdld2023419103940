

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
        this.npcJS = this.node.parent.getComponent("npc");
    },


    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//碰到玩家碰撞框===>(进入攻击范围)
            if (this.npcJS.type == 0)
            this.npcJS.moveState = 1;
            this.npcJS.inShootDistance = true;
        }
    },
    onCollisionExit(other, self) {
        if (other.tag == 1) {//碰到玩家碰撞框===>(进入攻击范围)
            this.npcJS.inShootDistance = false;
            if (this.npcJS.type != 0 && this.npcJS.type != 1)
                this.npcJS.moveState = 0;
        }
    },
    onCollisionStay(other, self) {
        if (other.tag == 1) {//碰到玩家碰撞框===>(进入攻击范围)
            this.npcJS.inShootDistance = true;
            // if (this.npcJS.type != 0 && this.npcJS.type != 1)
            // this.npcJS.moveState = 0;
        }
    },
    // update (dt) {},
});
