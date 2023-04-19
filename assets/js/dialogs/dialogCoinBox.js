
cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        coinNode: cc.Node,
        diamondNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        Tools.resetDialog2(this.node, true);

    },
    reset(_typeName) {
        this.typeName = _typeName;
        this.coinNode.active = false;
        this.diamondNode.active = false;
        switch (_typeName) {
            case "金币":
                this.coinNum = 2500;
                this.coinNode.active = true;
                break;
            case "钻石":
                this.coinNum = 200;
                this.diamondNode.active = true;
                break;
        }
        this.coinLabel.string = this.coinNum;
    },

    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        cc.director.resume();
        switch (type) {
            case "领取":
                this.startNode = event.target;
                AD.showAD(this.getSucess, this);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;

        }
    },
    getSucess() {
        switch (this.typeName) {
            case "金币":
                this.coinNum = 2500;
                this.coinNode.active = true;

                globalData.setCoinNum(this.coinNum);
                for (var i = 0; i < 20; i++)
                    cc.director.emit("飞币", 1, this.startNode, AD.coinLabelNode, 0);

                break;
            case "钻石":
                this.coinNum = 200;
                this.diamondNode.active = true;

                globalData.setDiamondNum(this.coinNum);
                for (var i = 0; i < 20; i++)
                    cc.director.emit("飞币", 1, this.startNode, AD.diamondLabelNode, 3);
                break;
        }

        Tools.resetDialog2(this.node, false);
    },
    // update (dt) {},
});
