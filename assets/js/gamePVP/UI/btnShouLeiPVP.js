

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.yuanScale = this.node.scale;
        this.numNow = 0;
        cc.director.on("手雷数量变化", (_nunNow) => {
            this.numNow = _nunNow;
            this.change();
        }, this)
    },

    change() {

    },
    start() {
        this.node.opacity = 0;
        this.scheduleOnce(() => {
            this.node.scale = 0;
            this.node.opacity = 255;

        }, 0.1)
    },

    btnCallBack(event, type) {
        cc.director.emit("扔出手雷");
    },
    update(dt) {
        if (this.numNow > 0) {
            if (this.node.scale <= 0)
                this.node.scale = this.yuanScale
        }
        else {
            if (this.node.scale > 0)
                this.node.scale = 0;
        }
    },
});
