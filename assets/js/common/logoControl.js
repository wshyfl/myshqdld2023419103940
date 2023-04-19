
cc.Class({
    extends: cc.Component,

    properties: {
        targetChanel: "",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.targetChanel != "") {
            if (AD.logoNameArr) {
                AD.logoNameArr.push(this.node);
            }
            else {
                AD.logoNameArr = new Array();
                AD.logoNameArr.push(this.node);
            }
        }


    },

    start() {
        if (this.targetChanel != "")
            this.node.active = (this.targetChanel == AD.chanelName1);
        else {
            var _active = true;
            for (var i = 0; i < AD.logoNameArr.length; i++) {
                if (AD.logoNameArr[i].getComponent("logoControl").targetChanel == AD.chanelName1) {
                    _active = false;
                }
            }
            this.node.active = _active;
        }
        if(AD.chanelName1 =="android")
        this.node.active =false;
    },

    // update (dt) {},
});
