

cc.Class({
    extends: cc.Component,

    properties: {
        openSpr: cc.SpriteFrame,
        closeSpr: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.newNode = new cc.Node();
        this.newNode.parent = this.node.parent;
        this.newNode.position = this.node.position;

        this.newNode.height = 500;
        this.newNode.width = 500;
        this.newNode.addComponent(cc.Mask);

        this.node.position = cc.v2(0, 0);
        this.node.parent = this.newNode;

        this.node.getComponent(cc.Sprite).spriteFrame = this.closeSpr
        this.opened = false;
        cc.director.on("星星数量变化", () => {
            if (this.opened == false) {
                this.opened = true;
                this.node.getComponent(cc.Sprite).spriteFrame = this.openSpr

                this.createEffect(this.node);
            }
        }, this)
    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1 && AD.gameScene.gameOver == false) {//玩家
            if (this.opened == false) {
                cc.director.emit("系统提示", "至少需要收集一颗星星哦")
                return;
            }

            AD.audioMng.stopMusic();
            AD.audioMng.playSfx("颤抖");
            this.scheduleOnce(() => {

                AD.audioMng.playSfx("飞入门");
            }, 1)
            AD.gameScene.gameOver = true;
            other.node.getComponent("player").playAct("待机");
            other.node.getComponent("player").gemeOverFunc();
            var _scaleX = 1;
            if (other.node.x > this.node.x)
                _scaleX = -1;
                
            var _jump = cc.jumpTo(0.5, this.newNode.position, 200, 1);

            cc.tween(other.node)
                .delay(1)
                .call(()=>{
                    other.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static
                })
                .then(_jump)
                .call(() => {

                    other.node.getComponent("player").playAct("跳跃");
                })
                .to(0.2, { opacity: 0, scale: 0 })
                .delay(0.5)
                .call(() => {
                    this.effect.active = false;
                    this.node.getComponent(cc.Sprite).spriteFrame = this.closeSpr
                    AD.audioMng.playSfx("关门");

                    this.newNode.height = 230;
                    this.newNode.width = 180;

                    cc.tween(this.node)
                        .delay(0.5)
                        .call(() => {
                            AD.audioMng.playSfx("门消失");
                        })
                        .delay(0.2)
                        .call(() => {
                            cc.tween(this.newNode)
                                .by(0.3, { y: -230 })
                                .start();
                        })
                        .by(0.3, { y: 230 })
                        .start();
                })

                .delay(1.8)
                .call(() => {
                    cc.director.emit("显示结算弹窗", true)
                })
                .start();
        }
    },
    createEffect(_parent) {
        this.effect = cc.instantiate(AD.propMng.doorEffect);
        this.effect.parent = _parent;
    }
    // update (dt) {},
});
