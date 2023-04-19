
cc.Class({
    extends: cc.Component,

    properties: {
        frame2: cc.SpriteFrame,
    },

    // onLoad () {},

    start() {
        this.frame1 = this.node.getComponent(cc.Sprite).spriteFrame;
        this.frameArr = [this.frame1, this.frame2];
        this.index = 0;
        cc.director.on("按钮切帧", (_node, _index) => {
            if (_node == this.node)
                this.reset(_index);
        }, this);


        

    },

    reset(_index) {
        if(this.index== _index)return;
        this.index= _index
        this.node.getComponent(cc.Sprite).spriteFrame = this.frameArr[_index]
    }
    // update (dt) {},
});
