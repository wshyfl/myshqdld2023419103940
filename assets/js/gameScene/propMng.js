

cc.Class({
    extends: cc.Component,

    properties: {
        propPVPPrefab: cc.Prefab,
        coinBombOutPrefab: cc.Prefab,
        paoBombPrefab: cc.Prefab,
        shouLeiBombPrefab: cc.Prefab,
        effectHitPrefab: cc.Prefab,
        effectBrickBomb: cc.Prefab,
        effectGetProp: cc.Prefab,
        effectGetPropStar: cc.Prefab,
        effectStarBlink: cc.Prefab,
        doorEffect: cc.Prefab,
        keyLost: cc.Prefab,
        effectAddOne: cc.Prefab,
        coinBoxEffect: cc.Prefab,
        effectWoodBoxBomb: cc.Prefab,
        npcFire_fireBefore: cc.Prefab,
        npcFire_fireBehind: cc.Prefab,
        keyPrefab: cc.Prefab,
        effectHitBigPrefab: cc.Prefab,
        boxWoodBeShootSpr: cc.SpriteFrame,
    },

    onLoad() {
        AD.propMng = this;
        //爆出的金币
        this.coinBombOutPool = new cc.NodePool();
        this.effectHitPool = new cc.NodePool();
        this.effectGetPropPool = new cc.NodePool();
        this.effectAddOnePool = new cc.NodePool();
    },

    start() {

        //生成道具
        if (AD.modeType == "PVP模式") {
            this.schedule(() => {
                this.createProp();
            }, 10)
        }
    },
    createProp() {
        var _prop = cc.instantiate(this.propPVPPrefab);
        _prop.parent = this.node;
        _prop.position = AD.propPosArr[Tools.random(0,AD.propPosArr.length-1)];
        
    },
    createShouLeiBomb(_pos) {
        var _effect = cc.instantiate(this.shouLeiBombPrefab);
        _effect.parent = AD.mapMng.propParent;
        _effect.position = _pos;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 0.5)
    },
    createEffectPaoBomb(_pos) {
        var _effect = cc.instantiate(this.paoBombPrefab);
        _effect.parent = AD.mapMng.propParent;
        _effect.position = _pos;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 0.5)
    },
    createCoinBombOut(_pos, _num, ...isDiamond) {
        for (var i = 0; i < _num; i++) {
            var _bt = null;
            if (this.coinBombOutPool.size() > 0) {
                _bt = this.coinBombOutPool.get();
            }
            else
                _bt = cc.instantiate(this.coinBombOutPrefab);
            _bt.position = _pos;
            _bt.parent = AD.mapMng.propParent;
            if (isDiamond[0])//爆出的是钻石
                _bt.getComponent("prop_coinBombOut").reset(true);
            else
                _bt.getComponent("prop_coinBombOut").reset();
        }
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
        _bt.getComponent("npcBt").reset(_npcType, _angle)
    },
    //打击特效
    createEffectHit(_pos) {
        var _bt = null;
        if (this.effectHitPool.size() > 0) {
            _bt = this.effectHitPool.get();
        }
        else
            _bt = cc.instantiate(this.effectHitPrefab);

        _bt.position = _pos;
        _bt.parent = AD.mapMng.propParent;
        _bt.getComponent(cc.Animation).play();
        this.scheduleOnce(() => {
            this.effectHitPool.put(_bt);
        }, 0.3)
    },

    //打击特效
    createEffectHitBig(_pos) {
        var _bt = cc.instantiate(this.effectHitBigPrefab);
        _bt.scale = 2;
        _bt.position = _pos;
        _bt.parent = AD.mapMng.propParent;

        this.scheduleOnce(() => {
            _bt.destroy();
        }, 0.6)
    },
    //特效-砖块破碎
    createEffectBrickBomb(_pos) {
        var _effect = cc.instantiate(this.effectBrickBomb);
        _effect.parent = AD.mapMng.propParent;
        _effect.position = _pos;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 2)
    },
    //特效-获得道具
    createEffectGetProp(_pos) {
        var _bt = null;
        if (this.effectGetPropPool.size() > 0) {
            _bt = this.effectGetPropPool.get();
        }
        else
            _bt = cc.instantiate(this.effectGetProp);
        if (_bt) {
            for (var i = 0; i < _bt.children.length; i++) {
                _bt.children[i].getComponent(cc.ParticleSystem).resetSystem();
            }
            _bt.position = _pos;
            _bt.parent = AD.mapMng.propParent;
            this.scheduleOnce(() => {
                this.effectGetPropPool.put(_bt);
            }, 2)
        }
    },
    //特效-获得星星
    createEffectGetPropStar(_pos) {
        var _bt = cc.instantiate(this.effectGetPropStar);
        _bt.position = _pos;
        _bt.parent = AD.mapMng.propParent;
        this.scheduleOnce(() => {
            _bt.destroy();
        }, 2)

    },
    //特效-星星闪烁
    createEffectStarBlink(_node) {
        var _effect = cc.instantiate(this.effectStarBlink);
        _effect.parent = _node;
        _effect.position = cc.v2(0, 0);
    },
    //特效 +1
    createEffectAddOne(pos) {
        var _effect = null;
        if (this.effectAddOnePool.size() > 0)
            _effect = this.effectAddOnePool.get();
        else
            _effect = cc.instantiate(this.effectAddOne);
        _effect.parent = this.node;
        _effect.position = pos;
        _effect.scale = 1;
        cc.tween(_effect)
            .by(1, { y: 30, scale: -0.3 }, { easing: "sineOut" })
            .call(() => {
                this.effectAddOnePool.put(_effect)
            })
            .start();
    },
    //特效 木箱子破裂
    createEffectWoodBoxBomb(pos) {
        var _effect = cc.instantiate(this.effectWoodBoxBomb);
        _effect.parent = this.node;
        _effect.position = pos;
        _effect.scale = 1;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 1)

    },
    //特效 消耗钥匙
    createKey(_parent, _createPos, _targetPos) {
        AD.audioMng.playSfx("提示音");
        AD.gameScene.couldMoveCamera = false;
        var _effect = cc.instantiate(this.keyPrefab);
        _effect.parent = _parent;
        _effect.position = cc.v2(_createPos.x + AD.gameScene.camera.x, _createPos.y + AD.gameScene.camera.y);
        _effect.scale = 1;
        cc.tween(_effect)
            .by(0.3, { y: 100 }, { easing: "sineInOut" })
            .to(1, { position: _targetPos }, { easing: "sineInOut" })
            .call(() => {
                _effect.destroy();
                AD.gameScene.couldMoveCamera = true;
            })
            .start();

    },
    // update (dt) {},
});
