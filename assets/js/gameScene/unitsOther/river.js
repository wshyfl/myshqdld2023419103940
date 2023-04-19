

cc.Class({
    extends: cc.Component,

    properties: {

    },
    // onLoad () {},

    start() {

    },
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//碰到玩家
            other.node.getComponent("player").wuDiDurationTemp = 0;
            other.node.getComponent("player").hp = 0;
            other.node.getComponent("player").beHurt();
            other.node.getComponent("player").dieReasonIsRiver = true;
            AD.audioMng.playSfx("落水声")
        }
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == "npc") {//碰到玩家
            this.scheduleOnce(() => {
                AD.audioMng.playSfx("落水声");

                if (otherCollider.node.getComponent("npc").hadDied == false)
                    cc.director.emit("成就触发", "水花四溅", 1);
                AD.npcBallNum--;//变成泡泡的NPC的数量
                AD.audioMng.stopSfx("水泡状态");
            }, 0.3)
        }
    },
    // update (dt) {},

});
