

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
    },
    reset(_index) {

        this.indexNow = _index;
        this.node.children[1].getComponent(cc.Label).string = this.indexNow + 1;
        this.unlock = cc.find("unlock", this.node);
        // console.log("globalData.getLevel() " +globalData.getLevel())
        // console.log("this.indexNow " +this.indexNow)
        this.unlock.active = (this.indexNow > globalData.getLevel());
        this.stars = cc.find("stars", this.node).children;
        for (var i = 0; i < 3; i++) {
            this.stars[i].active = (i < globalData.getStarNum(this.indexNow));
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        if (!AD.panelController.zhuanDonging) {
            globalData.levelNow = this.indexNow;

            if (globalData.tuiJianIndex % 2 == 1)
                cc.director.emit("展示枪支弹窗");//枪支
            else
                cc.director.emit("展示角色弹窗");//枪支
            globalData.tuiJianIndex++;
            
        }
    },

    // update (dt) {},
});
