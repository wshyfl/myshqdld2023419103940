

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pageIndexNow = 0;
    },

    start() {

    },
    //普通碰撞
    onCollisionStay(other, self) {
        
        if(other.node.scale>=0.98){
            
        // cc.director.emit("切换到角色的index", this.pageIndexNow);
        }
    },

    // update (dt) {},
});
