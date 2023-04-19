cc.Class({
    extends: cc.Component,

    properties: {
        btnUnlock: cc.Node,
        btnUse: cc.Node,
        btnUsing: cc.Node,
        priceLabel: cc.Label,
        rolePrefab: cc.Prefab,
        content: cc.Node,
    },
    // onLoad () {},

    start() {
        AD.audioMng.playMusic();
        AD.roleScene = this;
        this.roleIndexNow = globalData.roleType;

        cc.director.on("切换到角色的index", (_roleIndexNow) => {
            this.roleIndexNow = _roleIndexNow;
            this.resetBtn();
        }, this)
        this.ADNode = cc.find("ADNode", this.btnUnlock);
        this.priceItemNodeArr = new Array;
        // for (var i = 0; i < this.content.children.length; i++) {
        //     var _priceNode = this.content.children[i].getChildByName("price");
        //     this.priceItemNodeArr.push(_priceNode);
        // }
        
        AD.hideBanner();
        AD.chaPing();
        this.resetBtn();
    },

    resetBtn() {
        this.btnUnlock.active = false;
        this.btnUse.active = false;
        this.btnUsing.active = false;
        this.priceLabel.node.active = false;

        var _unlockState = globalData.getRoleUnlockState(this.roleIndexNow);
        // for (var i = 0; i < globalData.roleNumMax; i++) {
        //     var _unlockStateTemp = globalData.getRoleUnlockState(i);
        //     if ((_unlockStateTemp > 0))
        //         this.priceItemNodeArr[i].opacity = 0;
        //     else
        //         this.priceItemNodeArr[i].opacity = 255;
        // }
        switch (_unlockState) {
            case 0://未解锁
                this.btnUnlock.active = true;
           
                var _show = (globalData.getCoinNum() >= globalData.roleUnlockPrice[this.roleIndexNow]);
                this.ADNode.active = !_show;
                this.priceLabel.node.active = _show;
                this.priceLabel.string = globalData.roleUnlockPrice[this.roleIndexNow];

                break;
            case 1://已解锁
                this.btnUse.active = true;
                this.priceLabel.node.active = false;
                break;
            case 2://使用中
                this.priceLabel.node.active = false;
                this.btnUsing.active = true;
                break;
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "解锁":
                if (globalData.setCoinNum(-globalData.roleUnlockPrice[this.roleIndexNow])) {
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
        globalData.setRoleUnlockState(this.roleIndexNow);
        this.resetBtn();
    },
    // update (dt) {},
});
