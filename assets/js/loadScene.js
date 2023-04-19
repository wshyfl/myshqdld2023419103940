

cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Sprite,
    },

    onLoad() {
        globalData.getDataAll();
        this.initCollision();
        this.hadChangeScene = false;
        this.loadJSON();
        this.bar.fillRange = 0;
        cc.tween(this.bar)
            .to(3, { fillRange: 1 })
            .start();
    },

    start() {

            AD_WX.init();
    },


    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    },
    update(dt) {
        if (this.bar.fillRange < 1) {

        }
        else {
            if (this.hadChangeScene == false) {
                if (this.numNow >= this.numSum) {
                    this.hadChangeScene = true;
                    cc.director.loadScene("menuScene");
                    // cc.director.loadScene("gameScene");
                }
            }
        }
    },

    loadJSON() {
        var self = this;
        this.numNow = this.numSum = 0;

        this.numSum++;
        cc.resources.load('AchievementData', function (err, jsonAsset) {
            AD.achievement = jsonAsset.json;
            self.numNow++;

            if (globalData.data.achievement.length == 0) {
                for (var i = 0; i < AD.achievement.length; i++) {
                    cc.director.emit("成就触发", AD.achievement[i].nickname, 0)
                }
                globalData.setRoleUnlockState(0);
                globalData.setGunUnlockState(0);
            }
        });
        this.numSum++;

        cc.resources.load('NpcData', function (err, jsonAsset) {
            AD.npcData = jsonAsset.json;
            self.numNow++;

        });
        this.numSum++;
        cc.resources.load('GunData', function (err, jsonAsset) {
            AD.gunData = jsonAsset.json;
            self.numNow++;

        });
    },
});
