

cc.Class({
    extends: cc.Component,

    properties: {
        winNode: cc.Node,
        loseNode: cc.Node,
        coinLabel: cc.Label,
        stars: [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.winNode.active = this.loseNode.active = false;
    },

    start() {
        Tools.resetDialog2(this.node, true);
        this.stars[0].active = this.stars[1].active = this.stars[2].active = false;
        AD.gameOver()
    },
    reset(_win) {
        console.log("是胜利吗  " + _win);
        this.rewardNumTemp = { num: 0 };
        this.rate = 1;//加倍吗?
        this.hadGet = false;
        if (_win) {
            this.winNode.active = true;
            this.rewardNum = 50+AD.gameScene.starNum*50;//获得的金币数
            globalData.setLevel(AD.gameScene.starNum);


            if (AD.gameScene.hadShoot == false)
                cc.director.emit("成就触发", "好好先生", 1)
            this.resetWin();

            AD.audioMng.playSfx("胜利欢呼");
            cc.tween(this.rewardNumTemp)
                .delay(1.2 + AD.gameScene.starNum * 0.4)
                .call(() => {
                    AD.audioMng.playSfx("分数滚动");
                })
                .to(1.5, { num: this.rewardNum })
                .call(() => {

                })
                .start();
        }
        else {
            this.loseNode.active = true;
            this.rewardNum = 50;//获得的金币数
            AD.audioMng.playSfx("失败");
            AD.audioMng.stopMusic();

            cc.tween(this.rewardNumTemp)
                .delay(0.5)
                .to(1, { num: this.rewardNum })
                .start();
        }

    },
    resetWin() {
        var _durationShowStar = 0.3;
        cc.tween(this.node)
            .delay(1.2)
            .call(() => {
                if (AD.gameScene.starNum >= 1) {
                    this.stars[0].active = true;
                    this.playSfxStar(0);
                }
            })
            .delay(_durationShowStar)
            .call(() => {
                if (AD.gameScene.starNum >= 2) {
                    this.stars[1].active = true;
                    this.playSfxStar(1);
                }
            })
            .delay(_durationShowStar)
            .call(() => {
                if (AD.gameScene.starNum >= 3) {
                    this.stars[2].active = true;
                    this.playSfxStar(2);
                }
            })
            .start();
    },
    playSfxStar(_index) {
        this.scheduleOnce(() => {
            AD.audioMng.playSfx("星级", _index)
        }, 0.21)
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        this.isBack = false;
        switch (type) {
            case "加倍领取":
                if (this.hadGet) return;
                globalData.levelNow++;
                this.btn = event.target;
                this.rate = 5;
                AD.showAD(this.getDoubleSucess, this);
                break;
            case "下一关":
                if (this.hadGet) return;
                globalData.levelNow++;
                this.btn = event.target;
                this.rate = 1;
                this.getDoubleSucess();
                break;
            case "再来一次":
                if (this.hadGet) return;
                this.btn = event.target;
                this.rate = 1;
                this.getDoubleSucess();
                break;
            case "返回菜单":
                if (this.hadGet) return;
                this.isBack = true;
                this.btn = event.target;
                this.rate = 1;
                this.getDoubleSucess();
                break;
        }
    },
    getDoubleSucess() {
        this.hadGet = true;
        if (this.rate == 1)
            cc.director.emit("飞币", 10, this.btn, AD.coinLabelNode, 0);
        else
            cc.director.emit("飞币", 20, this.btn, AD.coinLabelNode, 0);
        globalData.setCoinNum(this.rewardNum * this.rate);
        this.scheduleOnce(() => {
            if (this.isBack)
                cc.director.emit("过场动画", "menuScene");
            else {
                if (globalData.levelNow > 39)
                    cc.director.emit("过场动画", "menuScene");
                else{
                    
                    // cc.director.emit("过场动画", "gameScene");
                    // if(this.rate==1)
                    {
                        this.tuiJian();
                    }
                }
            }
        }, 1.5)
    },
    tuiJian() {
        if (globalData.tuiJianIndex % 2 == 1)
            cc.director.emit("展示枪支弹窗");//枪支
        else
            cc.director.emit("展示角色弹窗");//枪支
        globalData.tuiJianIndex++;
    },

    update(dt) {

        this.coinLabel.string = "+" + parseInt(this.rewardNumTemp.num);
    },
});
