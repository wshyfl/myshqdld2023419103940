

cc.Class({
    extends: cc.Component,

    properties: {
        coinNumLabel: cc.Label,
        diamondNumLabel: cc.Label,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        Tools.resetDialog2(this.node, true);

        this.hadGet = false;
    },

    reset(_win) {
        this.rewardNumTemp = { num: 0 };
        this.rewardNumTemp2 = { num: 0 };
        this.rewardNum = 100;
        this.rewardNumDiamond = 50;
        if (!_win) {
            this.rewardNum = 100 / 2;
            this.rewardNumDiamond = 50 / 2;
        }

        cc.tween(this.rewardNumTemp)
        .delay(1.5)
        .call(() => {
            AD.audioMng.playSfx("分数滚动");
        })
        .to(1.1, { num: this.rewardNum })
        .call(() => {

        })
        .start();

        cc.tween(this.rewardNumTemp2)
        .delay(1.5)
        .call(() => {
        })
        .to(1.1, { num: this.rewardNumDiamond })
        .call(() => {

        })
        .start();

        this.coinNumLabel.string = "+" + 0;
        this.diamondNumLabel.string = "+" + 0;
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "返回":
                if (this.hadGet) return;
                this.rate = 1;
                this.getDoubleSucess();
                break;
            case "加倍领取":
                if (this.hadGet) return;
                this.rate = 5;
                AD.showAD(this.getDoubleSucess,this);
                break;
            case "普通领取":
                if (this.hadGet) return;
                this.rate = 1;
                this.getDoubleSucess();
                break;
        }
    },


    getDoubleSucess() {
        this.hadGet = true;
        cc.director.emit("飞币", 20, this.coinNumLabel.node, AD.coinLabelNode, 0);
        cc.director.emit("飞币", 10, this.diamondNumLabel.node, AD.diamondLabelNode, 3);
        globalData.setCoinNum(this.rewardNum * this.rate);
        globalData.setDiamondNum(this.rewardNumDiamond * this.rate);
        this.scheduleOnce(() => {
            cc.director.emit("过场动画", "menuScene");
        }, 1.5)
    },
    update (dt) {
        this.coinNumLabel.string = "+" + parseInt(this.rewardNumTemp.num);
        this.diamondNumLabel.string = "+" +  parseInt(this.rewardNumTemp2.num);
    },
});
