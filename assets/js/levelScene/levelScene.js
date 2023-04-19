

cc.Class({
    extends: cc.Component,

    properties: {
        colliderBigger: [cc.Node],
        bgNode: [cc.Node],
        chapters:[cc.Node],
    },

    onLoad() {
        this.levelPanel = cc.find("panel", this.node);
        this.colliderBigger[0].x = cc.winSize.width / 2 + 100;
        this.colliderBigger[1].x = -cc.winSize.width / 2 - 100;
        cc.director.on("切换背景", this.changeBg, this);
        for (var i = 0; i < 4; i++) {
            this.bgNode[i].opacity = 0;
            this.chapters[i].opacity = 0;
        }
    },

    start() {

        AD.showBanner();
        AD.chaPing();
       
        // cc.director.emit("展示角色弹窗");//枪支
    },

    changeBg(_index) {
        for (var i = 0; i < 4; i++) {
            if (i != _index && this.bgNode[i].opacity != 0) {
                cc.tween(this.bgNode[i])
                .to(0.5,{opacity:0})
                .start();
                cc.tween(this.chapters[i])
                .to(0.5,{opacity:0})
                .start();
            }
            else  if (i == _index) {
                cc.tween(this.bgNode[i])
                .to(0.5,{opacity:255})
                .start();
                
                cc.tween(this.chapters[i])
                .to(0.5,{opacity:255})
                .start();
            }
        }
    },


    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "返回菜单":
                cc.director.loadScene("menuScene");
                break;
        }
    },

    // update (dt) {},
});
