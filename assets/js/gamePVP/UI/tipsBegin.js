

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    // onLoad () {},

    start () {

    },
    begin(){
        console.log("游戏开始");
        AD.gameScene.beginNow = true;
        this.node.destroy();
    },

    second(){
        AD.audioMng.playSfx("秒");
    },
    go(){
        AD.audioMng.playSfx("go");
    },
    // update (dt) {},
});
