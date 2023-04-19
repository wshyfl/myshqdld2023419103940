

cc.Class({
    extends: cc.Component,

    properties: {
        item: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.director.on("击败信息", (_killer, _beKilled,_isEnemy) => {
            var _item = cc.instantiate(this.item);
            _item.parent = this.node;
            _item.getComponent("jiShaItem").reset(_killer, _beKilled,_isEnemy);
        }, this)
    },

    // update (dt) {},
});
