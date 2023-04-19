

cc.Class({
    extends: cc.Component,

    properties: {
        isEnemy: false,
    },


    // onLoad () {},

    start() {
        this.bar = this.node.parent.getComponent(cc.Sprite);
        this.bar.fillRange = 0;
        this.targetScore = 10;
        this.numNow = 0;
        this.node.getComponent(cc.Label).string = this.numNow + "/" + this.targetScore;
        cc.director.on("分数变化", (_isEnemy) => {
            if (this.isEnemy == _isEnemy) {
                this.numNow++;
                if (this.numNow <= this.targetScore) {

                    this.node.getComponent(cc.Label).string = this.numNow + "/" + this.targetScore;
                    cc.tween(this.bar)
                        .to(0.3, { fillRange: this.numNow / this.targetScore })
                        .start();
                }
                if (this.numNow >= this.targetScore) {
                    if (AD.gameScene.gameOver == false) {
                        console.log("游戏胜利 胜利方是 " + _isEnemy);
                        AD.audioMng.stopMusic();
                        AD.gameScene.gameOver = true;

                        this.createTips(_isEnemy);

                    }
                }
            }
        }, this)
    },
    createTips(_isEnemy) {
        var _tips = cc.instantiate(AD.gameScene.tips_overPrefab);
        _tips.parent = cc.find("Canvas/UI");
        this.scheduleOnce(() => {
            cc.director.emit("显示结算PVP", !_isEnemy);
        }, 2)

    },

    // update (dt) {},
});
