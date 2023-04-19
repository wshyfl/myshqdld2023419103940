
cc.Class({
    extends: cc.Component,

    properties: {
        role: cc.Node,
    },

    onLoad() {


        var _arr = new Array();
        for (var i = 0; i < globalData.roleNumMax; i++) {
            if (globalData.getRoleUnlockState(i) == 0)
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
        this.role.getComponent("player").isPlaying = false
    },

    start() {
        this.role.getComponent("player").playerType = this.targetIndex;
        this.role.getComponent("player").resetSkin();
        this.role.getComponent("player").isPlaying = false
        Tools.resetDialog2(this.node, true);

    },

    btnCallBack(event, type) {
        cc.director.resume();
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "领取":
                AD.showAD(this.getSucess, this);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                if (AD.modeType == "PVP模式")
                    cc.director.emit("显示匹配弹窗");
                else
                    cc.director.emit("过场动画", "gameScene");
                break;

        }
    },
    getSucess() {
        Tools.resetDialog2(this.node, false);
        globalData.setRoleUnlockState(this.targetIndex);
        cc.director.emit("更换角色", this.targetIndex)
        cc.director.emit("系统提示", "角色解锁成功");

        if (AD.modeType == "PVP模式")
            cc.director.emit("显示匹配弹窗");
        else
            cc.director.emit("过场动画", "gameScene");

        console.log("当前关卡是 " + globalData.levelNow);
    },
    // update (dt) {},
});
