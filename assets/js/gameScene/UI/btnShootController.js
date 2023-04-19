

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.effect.active)
                this.effect.active = false;
            cc.director.emit("开始射击");
            cc.director.emit("按钮切帧", this.node, 1);
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            cc.director.emit("停止射击");
            cc.director.emit("按钮切帧", this.node, 0);
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.emit("停止射击");
            cc.director.emit("按钮切帧", this.node, 0);
        }, this)

        this.node.children[0].active = false;//踢爆
        this.node.children[1].active = true;//射击
        AD.baoTiTargetNpc = null;
        cc.director.on("变成爆踢", (_npc) => {
            if (this.hadGuideTiBao == false) {
                this.effect.active = true;
            }
            if (!this.node.children[0].active) {
                this.node.children[0].active = true;
                this.node.children[1].active = false;
                AD.baoTiTargetNpc = _npc;
            }
        }, this);
        cc.director.on("变成射击", () => {
            if (this.effect.active)
                this.effect.active = false;
            if (this.node.children[0].active) {
                this.node.children[0].active = false;
                this.node.children[1].active = true;
                AD.baoTiTargetNpc = null;
            }
        }, this);

    },

    start() {


        this.effect = cc.find("effect", this.node); this.effect.active = false;
        this.guideKey = "shoot";

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

            this.hadGuideTiBao = globalData.getGuideData("tiBao");
        }
        else 
        this.hadGuideTiBao = true;

    },


    // update (dt) {},
});
