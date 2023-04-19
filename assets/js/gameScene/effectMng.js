

cc.Class({
    extends: cc.Component,

    properties: {
        tipsGetProps: [cc.Prefab],
    },

    onLoad() {
        AD.effectMng = this;
    },

    start() {

    },
    showTipsGetProps(_propName, _pos) {
        var _tips = null;
        switch (_propName) {
            case "放大药水":
                _tips = cc.instantiate(this.tipsGetProps[0]);
                break;
            case "缩小药水":
                _tips = cc.instantiate(this.tipsGetProps[1]);
                break;
            case "获得钥匙":
                _tips = cc.instantiate(this.tipsGetProps[2]);
                break;
            case "水箱布满":
                _tips = cc.instantiate(this.tipsGetProps[3]);
                break;
            case "道具加血":
                _tips = cc.instantiate(this.tipsGetProps[4]);
                break;
            case "道具伤害":
                _tips = cc.instantiate(this.tipsGetProps[5]);
                break;
            case "道具手雷":
                _tips = cc.instantiate(this.tipsGetProps[6]);
                break;
        }
        _tips.parent = this.node;
        _tips.position = cc.v2(_pos.x + 30, _pos.y + 160);
        cc.tween(_tips)
            .delay(1)
            .to(0.2, { scaleY: 0 }, { easing: "backInOut" })
            .call(() => {
                _tips.destroy();
            })
            .start();
    },

    // update (dt) {},
});
