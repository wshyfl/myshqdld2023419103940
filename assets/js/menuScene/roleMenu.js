
cc.Class({
    extends: cc.Component,

    properties: {
        anim: sp.Skeleton,
        animWater: sp.Skeleton,
    },

    // onLoad () {},

    start() {

        this.node.x = -800;
        this.playAct("移动");
        cc.tween(this.node)
            .to(1.0, { x: -203 })
            .call(() => {
                this.playAct("待机");
            })
            .start();

        this.schedule(() => {
            this.playAct("胜利");
        }, 8)

        var self = this;
        this.playActTimes = 0;
        //---动作完毕监听
        this.anim.setCompleteListener((a, evt) => {

            switch (a.animation.name) {
                case "shengli1"://爆踢完毕
                    self.playActTimes++;
                    // console.log("次数   " +self.playActTimes)
                    if (self.playActTimes >= 2)
                        self.playAct("待机");
                    break;
                    case "shengli2"://爆踢完毕
                    self.playActTimes++;
                    console.log("次数   " +self.playActTimes)
                    if (self.playActTimes >= 6)
                        self.playAct("待机");
                    break;
                    case "shengli3"://爆踢完毕
                    self.playActTimes++;
                    console.log("次数   " +self.playActTimes)
                    if (self.playActTimes >= 4)
                        self.playAct("待机");
                    break;
            }
        });
    },
    playAct(_name) {
        switch (_name) {
            case "爆踢":
                if (this.anim.animation != "tishuipao") {
                    this.anim.setAnimation(0, "tishuipao", false);
                    // if (!this.isAI)
                    this.actingIsBaoTi = true;//正在播放"爆踢"动作?
                    this.animWater.setAnimation(0, "tishuipao", false);
                }
                break;
            case "待机":
                if (this.anim.animation != "daiji") {
                    this.anim.setAnimation(0, "daiji", true);
                    this.animWater.setAnimation(0, "daiji", true);
                }
                break;
            case "移动":
                if (this.anim.animation != "yidong") {
                    this.anim.setAnimation(0, "yidong", true);
                    this.animWater.setAnimation(0, "yidong", true);
                }
                break;
            case "跳跃":
                if (this.anim.animation != "tiao") {
                    this.anim.setAnimation(0, "tiao", false);
                    this.animWater.setAnimation(0, "tiao", false);
                }
                break;
            case "死亡":
                if (this.anim.animation != "siwang") {
                    this.anim.setAnimation(0, "siwang", false);
                    this.animWater.setAnimation(0, "siwang", false);
                }
                break;
            case "蓄力开火":
                if (this.anim.animation != "fire") {
                    this.anim.setAnimation(0, "fire", false);
                    this.animWater.setAnimation(0, "fire", false);
                }
                break;
            case "蓄力中":
                if (this.anim.animation != "xuli") {
                    this.anim.setAnimation(0, "xuli", true);
                    this.animWater.setAnimation(0, "xuli", true);
                    console.log("蓄力动作")
                }
                break;
            case "泡泡":
                if (this.anim.animation != "paopao") {
                    this.anim.setAnimation(0, "paopao", true);
                    this.animWater.setAnimation(0, "paopao", true);
                }
                break;
            case "胜利":
                this.playActTimes = 0;
                var _type = Tools.random(1, 3);// _type = 3;
                this.anim.setAnimation(0, "shengli" + _type, true);
                this.animWater.setAnimation(0, "shengli" + _type, true);
                break;
        }
    },


    // update (dt) {},
});
