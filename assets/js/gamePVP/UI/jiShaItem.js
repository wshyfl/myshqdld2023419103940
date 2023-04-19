
cc.Class({
    extends: cc.Component,

    properties: {
        nameKiller: cc.Label,
        nameBeKilled: cc.Label,
    },

    // onLoad () {},

    start() {

    },
    reset(_killer, _beKilled, _isEnemy) {
        this.node.scaleY = 0;
        this.nameKiller.string = _killer;
        this.nameBeKilled.string = _beKilled;
        if (_isEnemy) {
            this.nameKiller.node.color = new cc.Color(218, 112, 112);
            this.nameBeKilled.node.color = new cc.Color(91, 255, 134);
        }
        cc.tween(this.node)
            .to(0.2, { scaleY: 1 })
            .delay(3)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    // update (dt) {},
});
