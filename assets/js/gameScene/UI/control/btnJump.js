
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {


    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            cc.director.emit("玩家跳");
            cc.director.emit("按钮切帧", this.node, 1);
            this.effect.active = false;
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.emit("按钮切帧", this.node, 0);
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            cc.director.emit("按钮切帧", this.node, 0);
        }, this)




        this.effect = cc.find("effect", this.node); this.effect.active = false;
        this.guideKey = "jump";
        if (AD.modeType != "PVP模式") {

            this.hadGuide = globalData.getGuideData(this.guideKey);
            if (this.hadGuide == false) {
                this.node.scaleY = 0;
                cc.director.on(this.guideKey, () => {
                    this.node.scale = 0;
                    globalData.setGuideData(this.guideKey, true);
                    cc.tween(this.node)
                        .to(0.3, { scale: 1 })
                        .call(() => {
                            this.effect.active = true;
                        })
                        .start();
                }, this)
            }
        }

    },


    // update (dt) {},
});
