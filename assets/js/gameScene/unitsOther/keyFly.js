

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

        // var _targetPos = this.node.parent.convertToNodeSpaceAR(_startPos);
    },

    reset(_box) {
        this.node.parent = cc.find("Canvas/UI");
        var _startPos = AD.keyLabelNode.parent.convertToWorldSpaceAR(AD.keyLabelNode.position);
        var _targetPos = this.node.parent.convertToNodeSpaceAR(_startPos);
        this.node.position = _targetPos
        this.box = _box;
        this.moveNow = false;
        cc.tween(this.node)
            .by(0.3, { y: 100 }, { easing: "sineInOut" })
            .call(() => {
                this.moveNow = true;
            })
            .start();
    },
    update(dt) {
        if (this.moveNow) {
            var _startPos = this.box.parent.convertToWorldSpaceAR(cc.v2(this.box.x , this.box.y ));
            var _targetPos = this.node.parent.convertToNodeSpaceAR(_startPos);
            var _angle = Tools.getAngle( _targetPos,this.node.position);

            this.vx = -Math.sin(Tools.angleToRadian(_angle)) * 3;
            this.vy = Math.cos(Tools.angleToRadian(_angle)) * 3;
            this.node.x += this.vx;
            this.node.y += this.vy;
            // var _startPos = AD.keyLabelNode.parent.convertToWorldSpaceAR(AD.keyLabelNode.position);
        }
    },
});
