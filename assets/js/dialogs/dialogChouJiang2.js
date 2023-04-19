//数据里需要加上 chouJiangDate
// data:{
//     chouJiangDate: null,//抽奖日期
// },
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        btnClose: cc.Node,
        btnClose2: cc.Node,
        ADNode: cc.Node,
        effectNode: cc.Node,
        effectChouJiang: cc.Prefab,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.angleArr = new Array();
        for (var i = 0; i < 8; i++) {
            this.angleArr.push(-i * 45 + 22.5);
        }

        this.bg.angle = 0;
        this.intervalTime = 0.2;//单格转过需要的时间
        this.intervalTimeSum = 0;//转过剩余轮盘需要的时间
        this.rotateRate = 1;
        this.lastIndex = -1;
        this.rateArr = [25, 20, 20, 3, 10, 15, 5, 2];//各个各自的概率
        //[null,"5000金币","2个皇冠","2000金币",null,"10000金币","1个皇冠","1000金币"]
        this.isChouJianging = false;
        this.btnClose.scale = 1;
        this.btnClose2.scale = 1;
        this.ADNode.active = (globalData.data.chouJiangDate == Tools.getDateDayString())
        this.effectNode.active = false;



    },
    onDisable() {

    },

    start() {
        Tools.resetDialog2(this.node, true);
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "抽奖":
                if (this.isChouJianging) return;

                if (globalData.data.chouJiangDate != Tools.getDateDayString()) {
                    globalData.data.chouJiangDate = Tools.getDateDayString();
                    globalData.saveData();
                    this.chouJiang();

                }
                else
                    AD.showAD(this.chouJiang, this);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;
        }


    },
    chouJiang() {
        AD.audioMng.stopMusic();
        AD.audioMng.playSfx("抽奖");
        this.isChouJianging = true;

        this.btnClose.scale = 0;
        this.btnClose2.scale = 0;
        this.effectNode.active = true;
        this.effectNode.opacity = 0;

        var _effect = cc.instantiate(this.effectChouJiang);
        _effect.parent = this.effectNode;
        cc.tween(this.effectNode)
            .to(0.5, { opacity: 255 })
            .delay(3)
            .to(0.5, { opacity: 0 })
            .call(() => {
                _effect.destroy();
            })
            .start();

        this.getTaregetIndex();
        var _angle = -this.angleArr[this.targetIndex] - 360 * 5 + Tools.random(-10, 10);

        var _self = this;
        cc.tween(this.bg)
            .to(4, { angle: _angle }, { easing: 'sineInOut' })
            .call(() => {
                _self.reward();
                this.effectNode.active = false;
                AD.audioMng.bgmType = "";
                AD.audioMng.playMusic();
            })
            .start();
    },

    getTaregetIndex() {
        var _max = 0;
        for (var i = 0; i < this.rateArr.length; i++)
            _max += this.rateArr[i];
        var _rr = Tools.random(1, _max);
        var _rate = 0;
        for (var i = 0; i < this.rateArr.length; i++) {
            _rate += this.rateArr[i];
            if (_rr < _rate) {
                this.targetIndex = i
                break;
            }
        }
        // this.targetIndex = 6;
        // console.log("ttttt " + this.targetIndex)

    },
    update(dt) {
        if (this.bg.angle <= -360) {
            this.bg.angle = this.bg.angle + 360;
        }

    },
    reward() {
        AD.audioMng.playSfx("获得奖励");
        this.ADNode.active = (globalData.data.chouJiangDate == Tools.getDateDayString())
        console.log("this.targetIndex " + this.targetIndex);


        switch (this.targetIndex) {
            case 0://100金币
                globalData.setCoinNum(100);
                cc.director.emit("系统提示", "恭喜获得100金币");
                cc.director.emit("飞币", 10, this.bg, AD.coinLabelNode, 0);
                break;
            case 2://200金币
                globalData.setCoinNum(200)
                cc.director.emit("系统提示", "恭喜获得200金币");
                cc.director.emit("飞币", 15, this.bg, AD.coinLabelNode, 0);
                break;
            case 5://500金币
                globalData.setCoinNum(500)
                cc.director.emit("系统提示", "恭喜获得500金币");
                cc.director.emit("飞币", 20, this.bg, AD.coinLabelNode, 0);
                break;
            case 1://20钻石
                globalData.setDiamondNum(10);
                cc.director.emit("系统提示", "恭喜获得10钻石");
                cc.director.emit("飞币", 10, this.bg, AD.diamondLabelNode, 3);
                break;
            case 4://
                globalData.setKeyNum(1);
                cc.director.emit("系统提示", "恭喜获得一把钥匙");
                // cc.director.emit("飞币", 15, this.bg, AD.diamondLabelNode, 3);
                break;
            case 6://50钻石
                globalData.setDiamondNum(50);
                cc.director.emit("系统提示", "恭喜获得50钻石");
                cc.director.emit("飞币", 20, this.bg, AD.diamondLabelNode, 3);
                break;
            case 3://小恐龙皮肤
                cc.director.emit("系统提示", "恭喜解锁新皮肤");
                globalData.setRoleUnlockState(8);
                break;
            case 7://彩虹独角兽皮肤
                cc.director.emit("系统提示", "恭喜解锁新皮肤");
                globalData.setRoleUnlockState(9);
                break;

        }
        console.log("抽奖获得 " + this.targetIndex);

        this.btnClose.scale = 1;
        this.btnClose2.scale = 1;
        this.isChouJianging = false;
    },
});
