

cc.Class({
    extends: cc.Component,

    properties: {
        zheZhao:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        // this.panel.active = false;
        cc.director.on("过场动画", (_nextScene) => {
            this.nextScene = _nextScene;
            this.node.active = true;
            this.node.getComponent(cc.Animation).play("loading_in",false);
            AD.audioMng.stopMusic();
            AD.audioMng.playSfx("过渡开始");
            this.node.opacity = 255;
            
            AD.audioMng.stopSfx("水泡状态");
        }, this);
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;
        this.node.group = "UI";

        this.node.opacity = 0;

        this.node.active = false;
    },
    // reset(_nextScene) {
    //     this.nextScene = _nextScene;
    //     this.panel.active = true;
    //     this.show();
    //     this.scheduleOnce(()=>{
            
    //     this.jumpNow();
    //     },0.3)

    // },


    inEnd() {
        var self = this;
        cc.director.loadScene(this.nextScene, function (_end) {
            self.scheduleOnce(() => {
                AD.audioMng.playSfx("过渡结束");
                self.node.getComponent(cc.Animation).play("loading_out_2",false);
            }, 0.2)
            self.scheduleOnce(() => {
                self.node.active = false;
            }, 0.7)
        });
    },

    // open() {

    //     this.hide();
    //     //变黑
    //     cc.tween(this.panel)
    //         .delay(0.5)
    //         .call(() => {
    //             this.panel.active = false;
    //         })
    //         .start();
    // },

    // show() {
    //     for (var i = 0; i < this.itemArr.length; i++) {
    //         this.itemArr[i].scale = 0;
    //         this.itemArr[i].opacity = 0;
    //         cc.tween(this.itemArr[i])
    //             .to(0.3, { scale: 1, opacity: 255 })
    //             .start();
    //     }
    // },
    // hide() {
    //     for (var i = 0; i < this.itemArr.length; i++) {
    //         cc.tween(this.itemArr[i])
    //             .to(0.2, { scale: 0, opacity: 0 })
    //             .start();
    //     }
    // },



});
