

cc.Class({
    extends: cc.Component,

    properties: {
        spr: cc.Node,
        itemParent: cc.Node,
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.node.group = "UI";
        this.spr.active = false;
        this.itemArr = this.itemParent.children;

        for (var i = 0; i < this.itemArr.length; i++) {
            var _spr = cc.instantiate(this.spr);
            _spr.parent = this.itemArr[i];
            _spr.active = true;
            _spr.scale = 0;
            var _pos = this.spr.parent.convertToWorldSpaceAR(this.spr.position);
            var _btPos = this.itemArr[i].convertToNodeSpaceAR(_pos);
            _spr.position = _btPos;

            //大小
          
            // 一侧大小
            // if (i % 2 == 1) {
            //     this.itemArr[i].scaleX = 1;
            //     this.itemArr[i].scaleY = 0;

            //     cc.tween(this.itemArr[i])
            //     .delay(1)
            //     .to(0.3, { scaleY: 1})
            //     .delay(2)
            //     .to(0.3, { scaleX: 0})
            //     .start();
            // }
            // else {
            //     this.itemArr[i].scaleX = 0;
            //     this.itemArr[i].scaleY = 1;
            //     cc.tween(this.itemArr[i])
            //     .delay(1)
            //     .to(0.3, { scaleX: 1})
            //     .delay(2)
            //     .to(0.3, { scaleY: 0})
            //     .start();
            // }

            //掉落
            // this.itemArr[i].scale = 0;
            // cc.tween(this.itemArr[i])
            //     .delay(1)
            //     .to(0.2, { scale: 1 })
            //     .delay(Tools.random(100,200)*0.01)
            //     .by(0.5, { y: -1000 },{easing:"sineIn"})
            //     .start();
        }
    },

    start() {
     


        // this.scheduleOnce(()=>{
        //     Tools.setNodeColor(this.spr,100,100,100);
        // },1)
        cc.director.on("显示方块",()=>{
            this.show();
        },this);
        cc.director.on("隐藏方块",()=>{
            this.hide();
        },this);
    },
    onEnable(){
    },
    show(){
        for (var i = 0; i < this.itemArr.length; i++){
            this.itemArr[i].scale = 0;
            cc.tween(this.itemArr[i])
                .to(0.2, { scale: 1 })
                .start();
        }
    },
    hide(){
        for (var i = 0; i < this.itemArr.length; i++){
            cc.tween(this.itemArr[i])
                .to(1.2, { scale: 0 })
                .start();
        }
    },

    // update (dt) {},
});
