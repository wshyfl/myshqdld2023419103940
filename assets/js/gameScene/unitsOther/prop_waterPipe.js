

cc.Class({
    extends: cc.Component,

    properties: {
        duration: {
            default: 2,
            displayName: "开门时长"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.collisioning = false;
        this.timmer = 0;
        this.opened = false;
        this.node.zIndex =1;
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 1) {//碰到玩家
            this.collisioning = true;

        }
    },
    onEndContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 1) {//碰到玩家
            this.collisioning = false;

        }

    },

    update(dt) {
        if (this.opened) return;

        if (this.collisioning) {

            this.timmer += dt;
            if (this.timmer >= this.duration){
                this.opened = true;
                this.node.getComponents(cc.PhysicsBoxCollider)[0].enabled = false;
            }
        }
        else {
            if (this.timmer > 0) {
                this.timmer -= dt;
                if (this.timmer <= 0)
                    this.timmer = 0;
            }
        }
    },
});
