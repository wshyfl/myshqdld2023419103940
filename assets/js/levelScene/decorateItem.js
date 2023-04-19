
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node = this.node;
        this.couldChange = true;
        this.node.children[0].scale = this.node.children[0].scale*0.8
        this.yuanScale = this.node.children[0].scale;
    },


    update(dt) {
        
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//碰到NPC的球形碰撞框 左半框
          
            this.node.children[0].scale = 0;
        }
    },
     //普通碰撞
     onCollisionExit(other, self) {
      
        if (other.tag == 1) {//碰到NPC的球形碰撞框 左半框
            if(this.node.children[0].scale==0){
                AD.audioMng.playSfx("装饰出现");
                cc.tween(this.node.children[0])
                    .to(0.3, { scale: this.yuanScale*1.1 }, { easing: "sineIn" })
                    .to(0.1, { scale: this.yuanScale*1 }, { easing: "sineInOut" })
                    .call(() => {
                        
                    })
                    .start();

            }
        }
        else  if (other.tag == 2) {//碰到NPC的球形碰撞框 左半框
          
        }
    },
});
