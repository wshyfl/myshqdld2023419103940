

cc.Class({
    extends: cc.Component,

    properties: {
        btnRevive:cc.Node,
    },
    // onLoad () {},

    start() {
        Tools.resetDialog2(this.node, true);

        cc.tween(this.btnRevive)
        .repeatForever(
            cc.tween()
            .to(0.3,{scale:1.05},{easing:"sineInOut"})
            .to(0.3,{scale:0.95},{easing:"sineInOut"})
        )
        .start();
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "复活":
                AD.showAD(this.reviveSucess,this);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                
            AD.gameScene.gameOver = true;
                cc.director.emit("显示结算弹窗",false)
                break;
        }
    },
    reviveSucess(){
        cc.director.emit("复活");
        Tools.resetDialog2(this.node, false);
    },


    // update (dt) {},
});
