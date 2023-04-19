
cc.Class({
    extends: cc.Component,

    properties: {
        targetScene:"",
    },

    // onLoad () {},

    start () {

    },
    btnCallBack(event,type){
        AD.audioMng.playSfx("按钮");
        cc.director.loadScene(this.targetScene);
    }
    // update (dt) {},
});
