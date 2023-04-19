

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.left = cc.find("left",this.node);
        this.right = cc.find("right",this.node);
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            var _pos = this.node.convertToNodeSpaceAR(event.getLocation());
            if (_pos.x < 0){
                
                cc.director.emit("玩家走", -1);
                cc.director.emit("按钮切帧",this.left,1);
                cc.director.emit("按钮切帧",this.right,0);
            }
            else{
                
                cc.director.emit("玩家走", 1);
                cc.director.emit("按钮切帧",this.left,0);
                cc.director.emit("按钮切帧",this.right,1);
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            var _pos = this.node.convertToNodeSpaceAR(event.getLocation());
            if (_pos.x < 0){
                
                cc.director.emit("玩家走", -1);
                cc.director.emit("按钮切帧",this.left,1);
                cc.director.emit("按钮切帧",this.right,0);
            }
            else{
                cc.director.emit("玩家走", 1);
                cc.director.emit("按钮切帧",this.left,0);
                cc.director.emit("按钮切帧",this.right,1);
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            cc.director.emit("玩家停");
            cc.director.emit("按钮切帧",this.left,0);
            cc.director.emit("按钮切帧",this.right,0);
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            cc.director.emit("玩家停");
            cc.director.emit("按钮切帧",this.left,0);
            cc.director.emit("按钮切帧",this.right,0);
        }, this)
    },

    start() {

    },

    // update (dt) {},
});
