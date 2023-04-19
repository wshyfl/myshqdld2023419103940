
cc.Class({
    extends: cc.Component,

    properties: {
        effect: cc.Node,
        tips: cc.Node,
    },

    // onLoad () {},

    start() {
        AD.xuLiBtn = this;
        this.bar = cc.find("bar", this.node).getComponent(cc.Sprite);
        this.bar.fillRange = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            cc.director.emit("蓄力");
            cc.director.emit("按钮切帧", this.node, 1);
            this.effect.active = false;
            if (this.effect.active)
                this.effect.active = false;
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            cc.director.emit("蓄力抬起");
            cc.director.emit("按钮切帧", this.node, 0);
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.emit("蓄力抬起");
            cc.director.emit("按钮切帧", this.node, 0);
        }, this);
        cc.director.on("提示蓄力", () => {
            this.effect.active = true;
        }, this)

        this.tips.active = (globalData.levelNow == 1)
        
        this.effect = cc.find("effect", this.node); this.effect.active = false;
        this.guideKey = "xuLi";
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
    xuLi(_rate) {
        this.bar.fillRange = _rate;
    },

    // update (dt) {},
});
