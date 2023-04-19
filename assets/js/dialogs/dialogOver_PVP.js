
cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Sprite,
        titleSpr: [cc.SpriteFrame],
        roles: [cc.Node],
        guns: [cc.Sprite],
        waterRole: [sp.Skeleton],
    },

    // onLoad () {},

    start() {

    },
    reset(_win) {
        if(!_win)
        AD.audioMng.playSfx("失败");
        else 
        AD.audioMng.playSfx("胜利欢呼");
        _win ? this.title.spriteFrame = this.titleSpr[0] : this.title.spriteFrame = this.titleSpr[1];
        for (var i = 0; i < 6; i++) {
            var _playerJS = AD.playerMngPVP.player[i].getComponent("playerPVP");
            //皮肤
            this.resetSkin(this.roles[i], _playerJS.skinType);
            //名字
            if (i < 3) {
                this.roles[i].children[0].children[0].getComponent(cc.Label).string = _playerJS.nameNow;
            }
            //枪支
            this.resetGun(this.guns[i], _playerJS.gunType);

        }
        if (_win) {
            for (var i = 0; i < 3; i++) {
                var _anim = this.roles[i].getComponent(sp.Skeleton);
                var _animWater = this.waterRole[i];
                this.playAct(_anim, _animWater, "shengli", (i + 1));
            }
            for (var i = 3; i < 6; i++) {
                var _anim = this.roles[i].getComponent(sp.Skeleton);
                var _animWater = this.waterRole[i];
                this.playAct(_anim, _animWater, "shibai", (i - 2));
            }
        }
        else {
            for (var i = 0; i < 3; i++) {
                var _anim = this.roles[i].getComponent(sp.Skeleton);
                var _animWater = this.waterRole[i];
                this.playAct(_anim, _animWater, "shibai", (i + 1));
            }
            for (var i = 3; i < 6; i++) {
                var _anim = this.roles[i].getComponent(sp.Skeleton);
                var _animWater = this.waterRole[i];
                this.playAct(_anim, _animWater, "shengli", (i - 2));
            }
        }

        this.scheduleOnce(() => {
            cc.director.emit("显示奖励PVP", _win);
        }, 3)
    },
    btnCallBack(event, type) {

    },
    resetSkin(_node, _skinType) {
        var _anim = _node.getComponent(sp.Skeleton);
        _anim.setSkin("js_" + _skinType);

    },
    resetGun(_spr, _gunType) {

        _spr.spriteFrame = AD.gunIconArr[_gunType];


    },
    playAct(_anim, _animWater, _name, _index) {

        _anim.setAnimation(0, _name + _index, true);
        _animWater.setAnimation(0, _name + _index, true);
    }
    // update (dt) {},
});
