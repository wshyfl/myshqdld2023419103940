

cc.Class({
    extends: cc.Component,

    properties: {
        hp: {
            default: 3,
            displayName: "血量"
        },
        type: {
            default: "普通砖块",
            displayName: "砖块类型",
            tooltip: "普通砖块,问号砖块"
        },
        destroySelf: {
            default: true,
            displayName: "会销毁吗",
            tooltip: "血量为0 会销毁吗",
            visible() {
                return this.type == "问号砖块";
            },
        },
        dieSpr: {
            default: null,
            type: cc.SpriteFrame,
            displayName: "破碎后图片",
            tooltip: "节点不销毁 破碎后图片",
            visible() {
                return (this.type == "问号砖块");
            },
        },
        showNodes: {
            default: [],
            type: [cc.Node],
            displayName: "破碎触发物体",
            tooltip: "砖块破碎后触发物体",
            visible() {
                return (this.type == "问号砖块");
            },
        },
        showAct: {
            default: true,
            displayName: "触发物出现动作",
            tooltip: "触发物出现 会播放动作吗?",
            visible() {
                return (this.type == "问号砖块");
            },
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (var i = 0; i < this.showNodes.length; i++) {
            this.showNodes[i].active = false;
        }
    },

    start() {
        this.hp = 1;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 1) {//碰到玩家
            var _player = otherCollider.node;
            var _playerJS = otherCollider.node.getComponent("player");
            if (_player.y < this.node.y) {
                if (Math.abs(_player.x - this.node.x) < (this.node.width + _player.width * Math.abs(_player.scaleX)) / 2*0.8) {
                    this.beHurt("底部撞碎")
                }
            }
        }
    },
    beHurt(_reason) {

        if (this.hp > 0) {
            cc.tween(this.node)
                .by(0.1, { y: 30 }, { easing: "sineIn" })
                .by(0.1, { y: -30 }, { easing: "sineOut" })
                .call(() => {
                    if (this.type == "问号砖块") {
                        if (this.hp <= 0) {
                            console.log("问号砖块销毁,生成道具");
                            if (this.dieSpr)
                                this.node.getComponent(cc.Sprite).spriteFrame = this.dieSpr;
                            for (var i = 0; i < this.showNodes.length; i++) {
                                this.showNodes[i].active = true;
                                AD.audioMng.playSfx("物体出现")
                                if (this.showAct)
                                    cc.tween(this.showNodes[i])
                                        .by(0.1, { y: this.node.height / 2 + this.showNodes[i].height / 2 })
                                        .start();
                            }
                        }
                    }

                })
                .start();
        }


        this.hp--;
        if (this.hp <= 0) {
            if (this.hp == 0)
                this.die(_reason);
        }
        else {


        }

    },
    die(_reason) {
        if (this.destroySelf){
            AD.audioMng.playSfx("砖块破碎");
            this.node.destroy();
            AD.propMng.createEffectBrickBomb(this.node.position);
        }
        switch (_reason) {
            case "底部撞碎":
                console.log("问号砖块销毁,生成破碎特效");
                switch (this.type) {
                    case "问号砖块":

                        break;
                }
                break;
        }
        console.log("砖块死亡原因 " + _reason);
    },
    // update (dt) {},
});
