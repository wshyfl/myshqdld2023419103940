

cc.Class({
    extends: cc.Component,

    properties: {
        type: "大小",
        time: 0.5,
        delayDuration: 0.3,
        delayDurationBig: 0,
        repeatTimes: {
            default: 2,
            visible() {
                return this.delayDurationBig > 0;
            }
        },
        targetPos: {
            default: cc.v2(0, 0),
            visible() {
                return this.type == "坐标";
            }
        },
        big: {
            default: 1.1,
            visible() {
                return this.type == "大小";
            }
        },
        small: {
            default: 1,
            visible() {
                return this.type == "大小";
            }
        },
    },

    // onLoad () {},

    start() {
        if (this.type == "大小") {
            cc.tween(this.node)
                .repeatForever(
                    cc.tween()
                        .delay(this.delayDuration)
                        .to(this.time, { scale: this.big })
                        .to(this.time, { scale: this.small })
                )
                .start();
        }
        else if (this.type == "坐标") {
            this.yuanPos = this.node.position;
            if (this.delayDurationBig > 0) {
                this.schedule(function () {
                    cc.tween(this.node)
                        .repeat(this.repeatTimes,
                            cc.tween()
                                .delay(this.delayDuration)
                                .to(this.time, { position: this.targetPos })
                                .to(this.time, { position: this.yuanPos })
                        )
                        .start();
                }, this.delayDurationBig + this.time * 2)
            }
            else {
                cc.tween(this.node)
                    .repeatForever(
                        cc.tween()
                            .delay(this.delayDuration)
                            .to(this.time, { position: this.targetPos })
                            .to(this.time, { position: this.yuanPos })
                    )
                    .start();
            }

        }
    },

    // update (dt) {},
});
