

cc.Class({
    extends: cc.Component,

    properties: {
        time:0.5,
        big:1.1,
        small:1,
    },

    // onLoad () {},

    start () {
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .to(this.time,{opacity:this.big})
            .to(this.time,{opacity:this.small})
        )
        .start();
    },

    // update (dt) {},
});
