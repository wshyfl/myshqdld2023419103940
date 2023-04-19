

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        var aa = this.node.getComponents(cc.PhysicsBoxCollider);
        for (var i = 0; i < this.node.getComponents(cc.PhysicsBoxCollider).length; i++) {
            this.node.getComponents(cc.PhysicsBoxCollider)[i].sensor = true;
        }
        this.node.addComponent(cc.BoxCollider);
        this.node.getComponent(cc.BoxCollider).size.width = 180;
        this.node.getComponent(cc.BoxCollider).size.height = 90;
        this.node.getComponent(cc.RigidBody).enabled = false;
        this.node.group = "npcBt"
    },

    start() {
        this.hp = 5;
        this.closedNode = cc.find("closed", this.node); this.closedNode.active = true;
        this.openedNode = cc.find("opened", this.node); this.openedNode.active = false;

        var _coinBoxEffect = cc.instantiate(AD.propMng.coinBoxEffect);
        _coinBoxEffect.parent = this.openedNode;

        this.node.parent = AD.mapMng.propBehind;

        // AD.keyLabelNode
        this.lostKey = false;
        this.openByAD = false;
    },
    beHit(_hurtNum) {
        if (this.hp <= 0) return;
        this.hp -= _hurtNum;
        if (this.hp <= 0) {
            cc.tween(this.node)
                .repeat(10,
                    cc.tween()
                        .by(0.02, { x: 10 })
                        .by(0.02, { x: -10 })
                )
                .to(0.1, { scale: 1.2 })
                .call(() => {
                    this.dieFunc();
                })
                .to(0.1, { scale: 1 })
                .call(() => {
                })
                .start();
        }
    },
    dieFunc() {
        AD.audioMng.playSfx("开宝箱");
        //爆出金币
        AD.propMng.createCoinBombOut(this.node.position, 10, true);
        if (this.openByAD) {
            AD.propMng.createCoinBombOut(this.node.position, 40, true);
            cc.director.emit("系统提示", "钻石雨来啦");
        }
        // this.node.destroy();
        this.closedNode.active = false;
        this.openedNode.active = true;

    },


    //普通碰撞
    onCollisionEnter(other, self) {
        if (this.hp > 0 && this.lostKey == false) {
            if (other.tag == 1) {//玩家
                if (globalData.setKeyNum(-1)) {
                    this.lostKey = true;
                    this.scheduleOnce(() => {
                        this.scheduleOnce(() => {
                            this.beHit(10);
                        }, 1.3)
                        var _startPos = AD.keyLabelNode.parent.convertToWorldSpaceAR(AD.keyLabelNode.position);
                        var _targetPos = this.node.parent.convertToNodeSpaceAR(_startPos);
                        AD.propMng.createKey(this.node.parent, _targetPos, this.node.position);
                    }, 0.2)
                }
                else {
                    if (cc.find("Canvas/dialogMng").childrenCount <= 0) {
                        cc.director.emit("显示打开宝箱弹窗");
                        cc.director.on("打开宝箱", () => {
                            this.openByAD = true;

                            this.beHit(10);
                        }, this)
                    }
                }
            }
        }

    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

    },
    update(dt) {

    },
});
