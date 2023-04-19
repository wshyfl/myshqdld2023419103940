
cc.Class({
    extends: cc.Component,

    properties: {
        dialogOver: cc.Prefab,
        dialogOverPVP: cc.Prefab,
        dialogGetReward: cc.Prefab,
        dialogSignPrefab: cc.Prefab,
        dialogRevive: cc.Prefab,
        dialogChouJiang: cc.Prefab,
        dialogPause: cc.Prefab,
        dialogRolePrefab: cc.Prefab,
        dialogAchievement: cc.Prefab,
        dialogCoinBox: cc.Prefab,
        dialogRole: cc.Prefab,
        dialogGun: cc.Prefab,
        dialogOnline: cc.Prefab,
        dialogOpenBox: cc.Prefab,
        dialogPiPei: cc.Prefab,


    },
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.director.on("显示结算PVP", (_win) => {
            var _dialog = cc.instantiate(this.dialogOverPVP);
            _dialog.parent = cc.find("Canvas/dialogMng");
            _dialog.getComponent("dialogOver_PVP").reset(_win);
            AD.chaPing(true);
            AD.showBanner();
        }, this);
        cc.director.on("显示奖励PVP", (_win) => {
            var _dialog = cc.instantiate(this.dialogGetReward);
            _dialog.parent = cc.find("Canvas/dialogMng");
            _dialog.getComponent("dialogGetReward").reset(_win);
        }, this);
        cc.director.on("显示匹配弹窗", () => {
            var _dialog = cc.instantiate(this.dialogPiPei);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.hideBanner();
        }, this);
        cc.director.on("显示结算弹窗", (_win) => {
            var _dialog = cc.instantiate(this.dialogOver);
            _dialog.parent = cc.find("Canvas/dialogMng");
            _dialog.getComponent("dialogOver").reset(_win);
            AD.chaPing(true);
            AD.showBanner();
        }, this);
        cc.director.on("展示角色弹窗", () => {
            var _dialog = cc.instantiate(this.dialogRole);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.showBanner();
            AD.chaPing();
        }, this);
        cc.director.on("展示枪支弹窗", () => {
            var _dialog = cc.instantiate(this.dialogGun);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.showBanner();
            AD.chaPing();
        }, this);
        // cc.director.emit("展示签到弹窗",true);//自动弹出(每天一次)
        // cc.director.emit("展示签到弹窗");//点击签到按钮 弹出
        cc.director.on("展示签到弹窗", (autoShow) => {
            var _dialog = cc.instantiate(this.dialogSignPrefab);
            _dialog.parent = cc.find("Canvas/dialogMng");
            if (autoShow)
                _dialog.getComponent("dialogSign").reset(autoShow);
            else {
                _dialog.getComponent("dialogSign").reset();
                AD.chaPing();
                AD.showBanner();
            }
        }, this);
        cc.director.on("展示抽奖弹窗", () => {
            var _dialog = cc.instantiate(this.dialogChouJiang);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.hideBanner();
        }, this);

        cc.director.on("展示暂停弹窗", () => {
            var _dialog = cc.instantiate(this.dialogPause);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.showBanner();
        }, this);
        cc.director.on("展示复活二级窗", () => {
            var _dialog = cc.instantiate(this.dialogRevive);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.showBanner();
        }, this);

        cc.director.on("展示成就弹窗", () => {
            var _dialog = cc.instantiate(this.dialogAchievement);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.showBanner();
        }, this);
        cc.director.on("展示在线奖励", () => {
            var _dialog = cc.instantiate(this.dialogOnline);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.showBanner();
        }, this);
        cc.director.on("展示货币弹窗", (_typeName) => {
            var _dialog = cc.instantiate(this.dialogCoinBox);
            _dialog.parent = cc.find("Canvas/dialogMng");
            _dialog.getComponent("dialogCoinBox").reset(_typeName);
            AD.chaPing();
            AD.showBanner();
        }, this);
        cc.director.on("显示打开宝箱弹窗", (_typeName) => {
            var _dialog = cc.instantiate(this.dialogOpenBox);
            _dialog.parent = cc.find("Canvas/dialogMng");
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
