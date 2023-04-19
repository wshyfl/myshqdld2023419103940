
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    start() {
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;
        this.node.children[0].active = false;
        cc.director.on("vivo插屏显示", (_show) => {
            this.node.children[0].active = _show;
        }, this)
    },

    // update (dt) {},
});
