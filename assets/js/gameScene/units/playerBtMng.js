

cc.Class({
    extends: cc.Component,

    properties: {
        playerBtPrefab: cc.Prefab,
        bigPaoPrefab: cc.Prefab,
        shouLeiPrefab: cc.Prefab,
    },

    onLoad() {

        AD.playerBtMng = this;
        this.playerBtPool = new cc.NodePool();
    },

    start() {
        if (AD.modeType == "PVP模式") {
            cc.director.on("生成大泡泡", (_pos, _direction, scaleRate, _playerNode) => {
                this.createBigPao(_pos, _direction, scaleRate, _playerNode);
            }, this)
        }
        else {
            cc.director.on("生成大泡泡", (_pos, _direction, scaleRate) => {
                this.createBigPao(_pos, _direction, scaleRate);
            }, this)
        }


    },

    createBt(_gunType, _angle, _pos, ...data) {
        var _bt = null;
        if (this.playerBtPool.size() > 0) {
            _bt = this.playerBtPool.get();
        }
        else
            _bt = cc.instantiate(this.playerBtPrefab);

        _bt.position = _pos;
        _bt.parent = this.node;
        if (AD.modeType == "PVP模式")
            _bt.getComponent("playerBt").reset(_gunType, _angle, data[0], data[1])
        else
            _bt.getComponent("playerBt").reset(_gunType, _angle)
    },
    //生成大泡泡
    createBigPao(_pos, _direction, scaleRate, _playerNode) {
        var _bt = cc.instantiate(this.bigPaoPrefab);

        _bt.position = _pos;
        _bt.parent = this.node;
        _bt.scaleX = _direction * scaleRate;
        _bt.scaleY = scaleRate;
        if (AD.modeType == "PVP模式")
            _bt.getComponent("playerBtBigPao").reset(_playerNode);
        else
            _bt.getComponent("playerBtBigPao").reset(null);
    },

    createShouLei(_pos, _isEnemy, _direction) {
        var _shouLei = cc.instantiate(this.shouLeiPrefab);
        _shouLei.parent = this.node;
        _shouLei.position = cc.v2(_pos.x,_pos.y+60);
        _shouLei.getComponent("shouLeiPVP").reset(_isEnemy, _direction);
    },
    // update (dt) {},
});
