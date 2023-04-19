
cc.Class({
    extends: cc.Component,

    properties: {
        gunParent: cc.Node,
        zhanLiLabel: cc.Label,
        namesParent: cc.Node,
        teDianLabel: cc.Label,
    },

    onLoad() {
        var _arr = new Array();
        for (var i = 0; i < globalData.gunNumMax; i++) {
            if (globalData.getGunUnlockState(i) == 0)
                _arr.push(i);
        }

        var _switchOn = true;
        if (AD.chanelName == "WX")
            if (AD.wuDianRate <= 0)
                _switchOn = false;

        if (_arr.length <= 0 || !_switchOn) {
            console.log("所有角色解锁完了");
            this.node.destroy();


            if (AD.modeType == "PVP模式")
                cc.director.emit("显示匹配弹窗");
            else
                cc.director.emit("过场动画", "gameScene");
            return;
        }
        _arr = Tools.getNewArr(_arr, _arr.length);
        this.targetIndex = _arr[0];
        // this.gunSpr.spriteFrame = AD.gunIconArr[this.targetIndex];
        for (var i = 0; i < this.gunParent.children.length; i++) {
            this.gunParent.children[i].active = (i == this.targetIndex);
        }


    },

    start() {
        // Tools.resetDialog2(this.node, true);
        // this.zhanLiLabel.string = "战力：" + 100;
        // this.nameLabel.string = "枪名字";
        // this.teDianLabel.string = "速射";
        for (var i = 0; i < this.namesParent.children.length; i++)
            this.namesParent.children[i].active = (i == this.targetIndex);
    },

    btnCallBack(event, type) {
        cc.director.resume();
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "领取":
                this.startNode = event.target;
                AD.showAD(this.getSucess, this);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);



                if (AD.modeType == "PVP模式")
                    cc.director.emit("显示匹配弹窗");
                else
                    cc.director.emit("过场动画", "gameScene");

                console.log("当前关卡是 " + globalData.levelNow);
                break;

        }
    },
    getSucess() {

        Tools.resetDialog2(this.node, false);
        globalData.setGunUnlockState(this.targetIndex);
        cc.director.emit("更换枪支", this.targetIndex)
        cc.director.emit("系统提示", "枪支解锁成功");



        if (AD.modeType == "PVP模式")
            cc.director.emit("显示匹配弹窗");
        else
            cc.director.emit("过场动画", "gameScene");

        console.log("当前关卡是 " + globalData.levelNow);

    },
    // update (dt) {},
});
