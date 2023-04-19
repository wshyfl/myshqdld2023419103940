

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        AD.coinLabelNode = this.node;
        this.node.getComponent(cc.Label).string = globalData.getCoinNum();
        cc.director.on("金币数量变化",()=>{
            this.node.getComponent(cc.Label).string = globalData.getCoinNum();
        },this)
    },

    start () {

      var _btn =  this.node.parent.getChildByName("coin");
      if(_btn){
          _btn.on(cc.Node.EventType.TOUCH_START,()=>{
              cc.director.emit("展示货币弹窗","金币");
          },this)
      }
    },

    // update (dt) {},
});
