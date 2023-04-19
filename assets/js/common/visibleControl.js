

cc.Class({
    extends: cc.Component,

    properties: {
        targetChanelArr: [cc.String]
    },

    onLoad() {
        if (AD.chanelName != AD.chanelName1 && AD.chanelName != "WX") {
            this.node.active = false;
            return;
        }
        var _show = false;
        for (var i = 0; i < this.targetChanelArr.length; i++) {
            if (AD.chanelName == this.targetChanelArr[i]) {
                _show = true;
                break;
            }
        }
        this.node.active = _show;
    },

    start() {

    },

    // update (dt) {},
});
