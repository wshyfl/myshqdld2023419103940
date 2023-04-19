

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.node.scale = 0;
        cc.director.on("控制遮罩", (_scale) => {
            this.node.scale = _scale;
        }, this)

        this.node.group = "UI";
    },

    start() {
        var screenHeight = cc.winSize.height;
        var screenWidth = cc.winSize.width;
        this.node.position = cc.v2(screenWidth / 2, screenHeight / 2);
        this.node.opacity = 100;
    },

    // update (dt) {},
});
