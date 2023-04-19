

cc.Class({
    extends: cc.Component,

    properties: {
        guns: cc.Node,
        names: cc.Node,
        btnUnlock: cc.Node,
        btnUse: cc.Node,
        btnUsing: cc.Node,
        priceLabel: cc.Label,

        barHurt:cc.Sprite,
        barDanJia:cc.Sprite,
        barSpeed:cc.Sprite,
        teDian:cc.Label,
    },


    // onLoad () {},

    start() {
        AD.audioMng.playMusic();
     
        
        this.gunsArr = this.guns.children;
        this.namesArr = this.names.children;
        this.gunIndexNow = globalData.gunType;
        this.resetBtn();

        AD.showBanner();
        AD.chaPing();
        cc.director.on("切换到枪支的index", (_roleIndexNow) => {
            this.gunIndexNow = _roleIndexNow;
            this.resetBtn();
        }, this)
        this.ADNode = cc.find("ADNode", this.btnUnlock);
        cc.tween(this.guns)
            .repeatForever(
                cc.tween()
                    .by(1.0, { y: 10 }, { easing: "sineInOut" })
                    .by(1.0, { y: -10 }, { easing: "sineInOut" })
            )
            .start();
    },

    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "返回菜单":
                cc.director.loadScene("menuScene");
                break;
        }
    },

    resetBtn() {
        this.btnUnlock.active = false;
        this.btnUse.active = false;
        this.btnUsing.active = false;
        this.priceLabel.node.active = false;
        this.castNum = AD.gunData[this.gunIndexNow].Gun_Price;
        for (var i = 0; i < this.gunsArr.length; i++) {
            this.gunsArr[i].active = (i == this.gunIndexNow);
            this.namesArr[i].active = (i == this.gunIndexNow);
        }
        var _unlockState = globalData.getGunUnlockState(this.gunIndexNow);
        switch (_unlockState) {
            case 0://未解锁
                this.btnUnlock.active = true;
                var _show = (globalData.getDiamondNum() >= this.castNum);
                this.ADNode.active = !_show;
                this.priceLabel.node.active = _show;
                this.priceLabel.string = this.castNum;
                break;
            case 1://已解锁
                this.btnUse.active = true;
                break;
            case 2://使用中
                this.btnUsing.active = true;
                break;
        }


        //属性变化
        this.barHurt.fillRange = AD.gunData[this.gunIndexNow].Gun_Hurt/30;//伤害
        this.barDanJia.fillRange = AD.gunData[this.gunIndexNow].Gun_Ammo/200;//弹夹
        this.barSpeed.fillRange =  (1/AD.gunData[this.gunIndexNow].Gun_Firerate)/(1/0.05);//射速

        this.teDian.string = AD.gunData[this.gunIndexNow].Gun_Explain;//介绍
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "解锁":
                if (globalData.setDiamondNum(-this.castNum)) {
                    this.unlockSucess();
                }
                else {
                    AD.showAD(this.unlockSucess, this);
                }
                break;
            case "使用":
                this.unlockSucess();
                break;
            case "返回菜单":
                cc.director.loadScene("menuScene");
                break;
        }
    },
    unlockSucess() {
        globalData.setGunUnlockState(this.gunIndexNow);
        this.resetBtn();
    },
    // update (dt) {},
});
