

cc.Class({
    extends: cc.Component,

    properties: {
        showArr: {
            default: [],
            type: [cc.Node],
            displayName: "需要显示的节点"
        },
        hideArr: {
            default: [],
            type: [cc.Node],
            displayName: "需要隐藏的节点"
        },
        tips: "",
    },

    // onLoad () {},

    start() {
        for (var i = 0; i < this.showArr.length; i++) {
            this.showArr[i].active = false;
        }
        this.node.opacity = 0;
    },

    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 1) {//玩家


            if (this.tips != "") {
                cc.director.emit("系统提示", this.tips);
            }
            AD.audioMng.playSfx("显示隐藏")
            for (var i = 0; i < this.showArr.length; i++) {

                this.showArr[i].active = true;

            }
            this.aa()
        }
    },
    aa() {
        for (var i = 0; i < this.hideArr.length; i++) {
            var _node = this.hideArr[i];
            cc.tween(_node)
                .to(0.4, { opacity: 0 })
                .call(() => {


                })
                .start();
        }
        this.scheduleOnce(() => {
            for (var i = 0; i < this.hideArr.length; i++)
                this.hideArr[i].active = false
            this.node.destroy();
        }, 0.4)
    }

    // update (dt) {},
});
