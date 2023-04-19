

cc.Class({
    extends: cc.Component,

    properties: {
        bgPreMngPrefab: cc.Prefab,
        bgSprArr: [cc.SpriteFrame],
        mapArr: [cc.Prefab],
    },

    onLoad() {
        AD.mapMng = this;

        //正式
        var _map = cc.instantiate(this.mapArr[0]);
        _map.parent = this.node;

        //测试--开始
        // var _map = null;
        // for (var i = 0; i < this.node.children.length; i++) {
        //     if (this.node.children[i].active) {
        //         _map = this.node.children[i];
        //     }
        // }
        //测试--结束


        this.bg = cc.find("bg", _map);
        // this.bg.getComponent(cc.Sprite).spriteFrame = this.bgSprArr[parseInt(globalData.levelNow/10)];
        this.bg.zIndex = -2;
        this.airWallLeft = cc.find("airWallLeft", _map); this.airWallLeft.opacity = 0;
        this.airWallRight = cc.find("airWallRight", _map); this.airWallRight.opacity = 0;
        this.playerParent = cc.find("playerParent", _map);
        this.propParent = cc.find("propParent", _map);
        AD.mapMng.revivePosArr = cc.find("revivePos", _map).children;
        this.mapWidth = cc.find("ground", _map).children[0].width;
        cc.find("revivePos", _map).opacity = 0;
        this.propBehind = cc.find("propBehind", _map);
        this.propParent = cc.find("propPos", _map);
        AD.propPosArr = new Array();
        for (var i = 0; i < this.propParent.children.length; i++) {
            AD.propPosArr.push(this.propParent.children[i].position);
        }
        //中景
        this.bgPreMngN = cc.instantiate(this.bgPreMngPrefab);
        this.bgPreMngN.parent = _map;
        this.bgPreMngN.zIndex = -1;
    },

    start() {

        // AD.playerNow.parent = this.playerParent;
        // AD.playerNow.position = this.revivePosArr[0].position;
        //中景
        this.bgPreMngN.getComponent("bgPreMng").reset(this.mapWidth);
    },

    getRevivePos() {
        var _targetPos = this.revivePosArr[0];
        for (var i = 0; i < this.revivePosArr.length; i++) {
            if (AD.playerNow.x >= this.revivePosArr[i].x) {
                if (this.revivePosArr[i].x > _targetPos.x)
                    _targetPos = this.revivePosArr[i];
            }
        }

        return _targetPos.position;
    },
    update(dt) {
        this.bg.position = AD.gameScene.camera.position;
    },
});
