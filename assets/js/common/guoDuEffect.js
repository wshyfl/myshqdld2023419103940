

cc.Class({
    extends: cc.Component,

    properties: {
        animation:cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.node.group = "UI";
        this.node.position = cc.v2(0,0);
        this.animation.play();

    },

    start () {

    },
    reset(_targetScene){
        this.targetScene = _targetScene;
    },
    inEnd(){
        // console.log("进场结束");
        var self = this;
        cc.director.loadScene(this.targetScene,function(_end){
            // self.open();
            self.animation.play("effect_guoXhang_out");
        });
        
    },
    outEnd(){
        // console.log("出场结束  销毁");
        this.node.parent.destroy();
    },
    open(){

    },

    // update (dt) {},
});
