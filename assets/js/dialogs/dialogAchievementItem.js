

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        DESCLable: cc.Label,
        numLabel: cc.Label,
        numRewardLabel: cc.Label,
        btnGet: cc.Node,
        btnNotCompolete: cc.Node,
        btnHadGet: cc.Node,
    },

    // onLoad () {},

    start() {

    },

    reset(_index) {
        this.index = _index;
        cc.director.emit("获取成就", AD.achievement[_index].nickname, this.try, this);//获取成就
    },
    try(_data) {
        if (_data == null) {
            console.warn("*************成就获取失败")
            return;
        }
        this.nameLabel.string = _data.nickname;
        this.DESCLable.string = _data.displayName;
        this.numLabel.string = "（" + _data.numNow + "/" + _data.numTarget + "）";

        this.numRewardLabel.string = _data.rewardNum;

        this.btnGet.active = this.btnNotCompolete.active = this.btnHadGet.active = false;
        if (globalData.data.achievement[this.index].numNow < _data.numTarget) {
            this.btnNotCompolete.active = true;
        }
        else {
            this.btnGet.active = !globalData.data.achievement[this.index].hadGet;
            this.btnHadGet.active = globalData.data.achievement[this.index].hadGet;
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        globalData.data.achievement[this.index].hadGet = true;

        globalData.setDiamondNum(AD.achievement[this.index].rewardNum);
        cc.director.emit("系统提示", "恭喜获得" + AD.achievement[this.index].rewardNum + "钻石");
        this.try( globalData.data.achievement[this.index]);
        
        cc.director.emit("飞币", 10, event.target, AD.diamondLabelNode, 3);
        
    },
    // update (dt) {},
});
