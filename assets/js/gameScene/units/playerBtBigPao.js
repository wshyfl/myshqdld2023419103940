

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        AD.audioMng.playSfx("蓄力发射");
        this.hp = 5;
        this.liftTime = 5;//存货时间



        this.scheduleOnce(() => {
            this.beHurt(100);
        }, this.liftTime);
    },

    start() {

    },
    reset(_playerNode) {
        this.playerNode = _playerNode;
        var _direction = 1;

        if (this.playerNode == null) {
            if (AD.playerNow.scaleX < 0)
                _direction = -1;
        }
        else {
            if (this.playerNode.scaleX < 0)
                _direction = -1;
        }
        this.direciton = _direction;
        this.act = cc.tween(this.node)
            .by(1.5, { x: 220 * _direction }, { easing: "sineOut" });
        this.act.start();
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == "npcBt") {
            otherCollider.node.destroy();
            this.beHurt(1);
        }
        else if (otherCollider.node.group == "player") {
            if (this.hp <= 0) return;
            this.hp = 0;

            this.scheduleOnce(() => {
                this.beHurt(1000);

                if (this.playerNode != null) {//PVP模式 碰到其他角色
                    if (this.playerNode.getComponent("playerPVP").isEnemy != otherCollider.node.getComponent("playerPVP").isEnemy) {//不是同一伙的
                        otherCollider.node.getComponent("playerPVP").xuanYunFunc();
                        return
                    }
                }


                //设置刚体的速度
                this.rigidbody = otherCollider.node.getComponent(cc.RigidBody);
                if (otherCollider.node.y > this.node.y + this.node.height / 2 - 15) {
                    var _js = otherCollider.node.getComponent("player");
                    if (_js) {
                        _js.playAct("跳跃");
                    }
                    else {
                        var _js = otherCollider.node.getComponent("playerPVP");
                        if (_js) {
                            _js.playAct("跳跃");
                        }
                    }

                    this.rigidbody.linearVelocity = cc.v2(0, 1500);
                }
                else {
                    var _direction = 1;
                    if (otherCollider.node.scaleX < 0)
                        _direction = -1;
                    this.rigidbody.linearVelocity = cc.v2(-_direction * 600, 300);
                }
            }, 0.02)

        }
        else {
            if (otherCollider.node.group == "npc") {
                this.act.stop();
                this.beHurt(1000);
                otherCollider.node.getComponent("npc").xuanYunFunc();
            }
            else if (otherCollider.node.group == "default") {
                this.act.stop();
            }
        }
    },
    beHurt(_num) {

        this.hp -= _num;
        if (this.hp <= 0) {
            AD.audioMng.playSfx("水泡破碎");
            this.node.destroy();
            AD.propMng.createEffectPaoBomb(this.node.position);
        }
    }
    // update (dt) {},
});
