

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {

    },
    //0普通视频角标  1头条视频图标
    // adIconIndex: 0,//0普通视频角标  1头条视频图标
    onEnable() {
        AD.wuDianRate>0 ?
            this.adIconIndex = 0 : this.adIconIndex = 1;
        for (var i = 0; i < this.node.childrenCount; i++) {
            if (this.adIconIndex == 0)//普通视频图标
            {
                if (this.node.children[i].getComponent(cc.Sprite).spriteFrame.name == "icon_shiPin_2") {
                    this.node.children[i].active = true;
                }
                else if (this.node.children[i].getComponent(cc.Sprite).spriteFrame.name == "icon_shiPin_1") {
                    this.node.children[i].active = false;
                }
            }
            else if (this.adIconIndex == 1) {
                if (this.node.children[i].getComponent(cc.Sprite).spriteFrame.name == "icon_shiPin_1") {
                    this.node.children[i].active = true;
                }
                else if (this.node.children[i].getComponent(cc.Sprite).spriteFrame.name == "icon_shiPin_2") {
                    this.node.children[i].active = false;
                }
            }
        }

    },
    // update (dt) {},
});
