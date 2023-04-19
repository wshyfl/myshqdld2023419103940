

cc.Class({
    extends: cc.Component,

    properties: {
        isSelf: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.bar = cc.find("bar", this.node).getComponent(cc.ProgressBar); this.bar.progress = 0;
        this.icon = cc.find("iconParent/mask/icon", this.node).getComponent(cc.Sprite);
        this.processLabel = cc.find("processLabel", this.node).getComponent(cc.Label);
        this.processLabel.string = parseInt(this.bar.progress * 100) + "%";
        this.nameLabel = cc.find("nameLabel", this.node).getComponent(cc.Label);
    },

    start() {
        var _time = Tools.random(100, 300) * 0.01;
        // _time=0.1;//测试删除
        if (this.isSelf) {

            _time = 0.01;
            this.nameLabel.string = "我";
        }
        this.scheduleOnce(() => {
            this.matchSucess();
            AD.audioMng.playSfx("按钮");
        }, _time)
    },

    matchSucess() {
        //进度条
        var _time = Tools.random(200, 400) * 0.01;
        // _time=0.1;//测试删除
        cc.tween(this.bar)
            .to(_time, { progress: 1 })
            .call(() => {
                cc.director.emit("匹配进度完成");
            })
            .start();
        if (this.isSelf) return;
        var _index = this.node.getSiblingIndex();
        //头像
        this.icon.spriteFrame = AD.roleIconArr[_index];
        //昵称
        this.nameLabel.string = AD.nameArr[_index];

    },

    update(dt) {
        this.processLabel.string = parseInt(this.bar.progress * 100) + "%";
    },
});
