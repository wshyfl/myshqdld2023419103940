// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pos:cc.v2(0,0),
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // if (AD.chanelName1 == "oppo"){
        //     this.node.position = this.pos;
        // }
    },

    // update (dt) {},
});
