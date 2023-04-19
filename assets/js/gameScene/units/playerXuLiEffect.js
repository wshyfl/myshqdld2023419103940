

cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        particle1: cc.ParticleSystem,
        particle2: cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.showNow = false;
        cc.director.on("显示蓄力特效", (_node) => {
            if (AD.modeType == "PVP模式") {
                if (_node != this.parentNode)
                    return;
            }
            this.particle1.resetSystem();
            this.particle2.resetSystem();
            this.showNow = true;
            this.node.x = this.yuanX + this.node.parent.scale * 125;
            this.node.opacity = 0;
            this.scheduleOnce(() => {
                this.node.opacity = 255;
            }, 0.2)

        }, this);
        cc.director.on("停止蓄力特效", (_node) => {
            if (AD.modeType == "PVP模式") {
                if (_node != this.parentNode)
                    return;
            }
            this.particle1.stopSystem();
            this.particle2.stopSystem();
            this.showNow = false;
        }, this);
        this.yuanX = this.node.x;
    },

    start() {

    },

    update(dt) {
        if (this.showNow) {
            this.node.x = this.yuanX + this.node.parent.scale * 125;
            // this.node.y = 0;
        }
    },
});
