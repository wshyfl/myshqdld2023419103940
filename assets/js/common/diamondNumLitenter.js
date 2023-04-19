

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        AD.diamondLabelNode = this.node;
        this.node.getComponent(cc.Label).string = globalData.getDiamondNum();
        cc.director.on("钻石数量变化",()=>{
            this.node.getComponent(cc.Label).string = globalData.getDiamondNum();
        },this)
    },

    start () {

      var _btn =  this.node.parent;
      if(_btn){
          _btn.on(cc.Node.EventType.TOUCH_START,()=>{
              cc.director.emit("展示货币弹窗","钻石");
          },this)
      }
    },

    // update (dt) {},
});
