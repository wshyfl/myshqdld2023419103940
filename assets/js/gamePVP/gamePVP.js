

cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Node,
        effectXuanYun: cc.Prefab,
        npcBallEffect: cc.Prefab,
        npcBallBgEffect: cc.Prefab,
        tips_overPrefab: cc.Prefab,
        tips_beginPrefab: cc.Prefab,
        effectTips: cc.Node,
        effectTipsSpr: [cc.SpriteFrame],
    },

    onLoad() {
        AD.gameScene = this;
        this.initData();
        AD.audioMng.playMusic();
        this.hadShoot = false;

        AD.audioMng.playMusic();
        this.scheduleOnce(() => {
            this.createTips();//倒计时开始

        }, 1)

    },
    initData() {
        this.starNum = 0;
        this.gameOver = false;
        this.beginNow = false;
        this.couldMoveCamera = true;
        this.vyA = 0;

        this.effectTips.scale = 0;
        cc.director.on("击杀效果", (_type, _playerPos) => {
            var _index = -1;
            switch (_type) {
                case "踩爆":
                    _index = 0;
                    break;
                case "空接":
                    _index = 1;
                    break;
                case "踢爆":
                    _index = 2;
                    break;
            }
            if (_index != -1) {
                this.effectTips.scale = 1;
                this.effectTips.getChildByName("tips_tiBao").getComponent(cc.Sprite).spriteFrame = this.effectTipsSpr[_index];
                this.effectTips.getComponent(cc.Animation).play();
                this.effectTips.position = cc.v2(_playerPos.x, _playerPos.y + 120)
                this.scheduleOnce(() => {
                    this.effectTips.scale = 0;
                }, 1)
            }
        }, this);

    },
    start() {
        this.beginFunc();


        if (AD.chanelName1 == "android" && AD.chanel == "vivo") {
            if (AD.wuDianRate > 0) {
                AD.showBanner();
                this.schedule(() => {
                    AD.showBanner();
                }, 10)
            }
            else
                AD.hideBanner();
        }
        else {
            AD.showBanner();
            this.schedule(() => {
                AD.showBanner();
            }, 10)
        }


        if (AD.chanelName1 == "vivo" || AD.chanelName1 == "oppo") {
            this.schedule(() => {
                AD.chaPing();
            }, 30)
        }

        // cc.director.emit("展示角色弹窗")
    },
    beginFunc() {
        this.initKeyBoard();
    },
    update(dt) {
        if (AD.playerNow && AD.playerNow.getComponent("playerPVP").hp > 0) {
            this.camera.x = AD.playerNow.x;
            if (this.camera.x <= AD.mapMng.airWallLeft.x + cc.winSize.width / 2)
                this.camera.x = AD.mapMng.airWallLeft.x + cc.winSize.width / 2
            else if (this.camera.x >= AD.mapMng.airWallRight.x - cc.winSize.width / 2)
                this.camera.x = AD.mapMng.airWallRight.x - cc.winSize.width / 2


            if (AD.playerNow.y - this.camera.y > 280) {//上限---立即跟随
                this.camera.y = AD.playerNow.y - 280;
                this.vyA = 0;
            }
            else if (AD.playerNow.y - this.camera.y < -200) {//下限---立即跟随

                this.camera.y = AD.playerNow.y + 200;
                this.vyA = 0;
            }
            else {//中间区域--如果玩家没有跳跃---缓动跟随
                if (Math.abs(AD.playerNow.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
                    if (Math.abs(this.camera.y - (AD.playerNow.y + 80)) > 5) {
                        var _vy = (this.camera.y - (AD.playerNow.y + 80)) / 30;
                        if (this.vyA < 1) {
                            this.vyA += dt * 5;
                            if (this.vyA > 1)

                                this.vyA = 1;
                        }
                        this.camera.y -= _vy * this.vyA;
                        // if(_vy>0)
                        // this.camera.y -= 5;
                        // else 
                        // this.camera.y += 5;
                    }
                    else
                        this.vyA = 0;
                }
                else
                    this.vyA = 0;
            }


            if (this.camera.y < -400)
                this.camera.y = -400;
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "重新开始":
                cc.director.emit("展示暂停弹窗")
                break;
        }
    },
    initKeyBoard() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    },
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                cc.director.emit("玩家走", -1);
                break;
            case cc.macro.KEY.d:
                cc.director.emit("玩家走", 1);
                break;
            case cc.macro.KEY.w:
                cc.director.emit("玩家跳");
                break;
            case cc.macro.KEY.e:
                cc.director.emit("蓄力");
                break;
            case cc.macro.KEY.space:
                cc.director.emit("开始射击");
                break;
        }
    },

    onKeyUp: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                cc.director.emit("玩家停");
                break;
            case cc.macro.KEY.d:
                cc.director.emit("玩家停");
                break;
            case cc.macro.KEY.e:
                cc.director.emit("蓄力抬起");
                break;
            case cc.macro.KEY.space:
                cc.director.emit("停止射击");
                break;
        }
    },

    createTips() {
        var _tips = cc.instantiate(AD.gameScene.tips_beginPrefab);
        _tips.parent = cc.find("Canvas/UI");


    },
});
