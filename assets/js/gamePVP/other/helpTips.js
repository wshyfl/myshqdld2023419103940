// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // onLoad () {},

    start() {
        this.yuanScale = this.node.scale;
        this.parentNode = this.node.parent.parent;
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .to(0.5,{opacity:150})
            .to(0.5,{opacity:255})
        )
        .start();
    },

    update(dt) {
        this.node.angle = this.parentNode.angle;
        if(this.parentNode.scaleX>0)
        this.node.scaleX = this.yuanScale;
        else 
        this.node.scaleX = -this.yuanScale;
    },
});
