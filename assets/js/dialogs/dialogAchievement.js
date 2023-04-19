

cc.Class({
    extends: cc.Component,

    properties: {
        item:cc.Prefab,
        content:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        Tools.resetDialog2(this.node, true);

        for(var i=0;i<AD.achievement.length;i++){
            var _item = cc.instantiate(this.item);
            _item.parent = this.content;
            _item.getComponent("dialogAchievementItem").reset(i);
        }
    },


    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;
        }
    },

    // update (dt) {},
});
