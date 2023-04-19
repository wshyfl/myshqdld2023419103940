

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        AD.roleIconArr = Tools.getNewArr(AD.roleIconArr, AD.roleIconArr.length);
        AD.nameArr= Tools.getNewArr(AD.nameArr, AD.nameArr.length);

        this.completeNum = 0;
        cc.director.on("匹配进度完成",()=>{
            this.completeNum++;
            if(this.completeNum==6){
                cc.director.emit("过场动画","gamePVP");
            }
        },this)
    },

    start () {

    },


    // update (dt) {},
});
