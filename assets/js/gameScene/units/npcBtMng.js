

cc.Class({
    extends: cc.Component,

    properties: {
        playerBtPrefab:cc.Prefab,
        effect_jingYa:cc.Prefab,
    },

    onLoad() {

        AD.npcBtMng = this;
        this.npcBtPool = new cc.NodePool();
    },

    start() {

    },

    createEffectJingYa(_parent,_isZhengMian,_pos){
        var _effect = cc.instantiate(this.effect_jingYa);
        _effect.parent = _parent;
        if(!_isZhengMian)
        _effect.scaleX = -1;
        else
        _effect.scaleX = 1;
    },
    createBt(_npcType, _angle, _pos, ...data) {
        var _bt = null;
        if (this.npcBtPool.size() > 0) {
            _bt = this.npcBtPool.get();
        }
        else
            _bt = cc.instantiate(this.playerBtPrefab);

            _bt.position = _pos;
            _bt.parent = AD.playerNow.parent;
            _bt.getComponent("npcBt").reset(_npcType,_angle)
        },
    // update (dt) {},
});
