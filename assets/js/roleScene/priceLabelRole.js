
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {

    },

    start() {

        var _name = this.node.parent.name.split('item')[1];
        var index = parseInt(_name);
        this.node.getComponent(cc.Label).string = globalData.roleUnlockPrice[index];
       
        
        this.role = cc.instantiate(AD.roleScene.rolePrefab);
        this.role.parent = this.node.parent.getChildByName("colorBg");
        this.role.scale = 0.6;
        this.playerJS = this.role.children[0].getComponent("player");

        this.playerJS.playerType = index;
        this.playerJS.resetSkin();

    },

    // update (dt) {},
});
