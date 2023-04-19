

cc.Class({
    extends: cc.Component,

    properties: {
        rewardNumLabel: cc.Label,
        timeLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    start() {

        Tools.resetDialog2(this.node, true);

        this.resetLabel();
        this.schedule(() => {
            this.timeLabel.string = Tools.getSecond(globalData.data.onlineSecond, "分钟");
        }, 1)
    },
    resetLabel(){
        this.coinNum = globalData.getOnlineGetTimesToday() * 500 + 500;
        this.rewardNumLabel.string = this.coinNum;
        this.timeLabel.string = Tools.getSecond(globalData.data.onlineSecond, "分钟");
    },
    
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "领取":
                if(globalData.data.onlineSecond<=0){
                    this.startNode = event.target;
                    this.getSucess();
                }
                else 
                cc.director.emit("系统提示","时间还没到哦,等会再来吧");
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;

        }
    },
    getSucess() {
        globalData.setCoinNum(this.coinNum);
        for (var i = 0; i < 20; i++)
            cc.director.emit("飞币", 1, this.startNode, AD.coinLabelNode, 0);
        globalData.setOnlineGetTimesToday();
        globalData.data.onlineSecond = 5*60;
        this.resetLabel();
    },
    // update (dt) {},
});
