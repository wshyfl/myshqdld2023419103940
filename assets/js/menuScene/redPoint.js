

cc.Class({
    extends: cc.Component,

    properties: {
        target: "签到"
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.listener();
        this.schedule(() => {
            this.listener();
        }, 0.3);
        cc.tween(this.node.children[0])
        .delay(Tools.random(1,50)*0.01)
        .repeatForever(
            cc.tween()
            .to(0.5,{scale:0.9})
            .to(0.5,{scale:1.1})
        )
        .start();
    },
    listener() {
        var _targetScale = 0;
        switch (this.target) {
            case "签到":
                var _signData = null;
                var _res = cc.sys.localStorage.getItem(globalData.keyData + "sign" + "3");
                if (_res != null) {
                    _signData = JSON.parse(_res);
                    cc.log("_signData = " + _signData)
                }
                if (_signData == null) {
                    _targetScale = 1;
                }
                else {
                    if (_signData.signData) {
                        var _hadSign = false;
                        for (var i = 0; i < _signData.signData.length; i++) {
                            if (_signData.signData[i] == Tools.getDateDayString()) {
                                _hadSign = true;
                                break;
                            }
                        }
                    }
                    if (_hadSign)
                        _targetScale = 0;
                    else
                        _targetScale = 1;

                }
                break;
            case "抽奖":
                _targetScale = 1;
                break;
            case "挑战":
                for (var i = 0; i < AD.achievement.length; i++) {
                    var _data = globalData.data.achievement[i];
                    if (_data.numNow >= _data.numTarget && _data.hadGet == false) {
                        _targetScale = 1;
                        break;
                    }
                }
                break;
            case "在线奖励":
                if (globalData.data.onlineSecond <= 0)
                    _targetScale = 1;
                break;
        }

        this.node.scale = _targetScale;
    },


    // update (dt) {},
});
