

cc.Class({
    extends: cc.Component,

    properties: {
  
        posTarget:cc.v2(100,0),
        durationStay:{
            default:0.4,
            displayName:"停留时间"
        },
        duration:{
            default:2,
            displayName:"动作时间"
        },
        repeatTimes:{
            default:-1,
            displayName:"重复次数",
            tooltip:"-1:一直重复"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.onGround =false;
        var _posYuan = this.node.position;
        if(this.repeatTimes<0){
            cc.tween(this.node)
            .repeatForever(
                cc.tween()
                .delay(this.durationStay)
                .to(this.duration,{position:this.posTarget},{easing:"sineInOut"})
                .delay(this.durationStay)
                .to(this.duration,{position:_posYuan},{easing:"sineInOut"})
            )
            .start();
        }
        else {
            cc.tween(this.node)
            .repeat(this.repeatTimes,
                cc.tween()
                .delay(this.durationStay)
                .to(this.duration,{position:this.posTarget},{easing:"sineInOut"})
                .delay(this.durationStay)
                .to(this.duration,{position:_posYuan},{easing:"sineInOut"})
            )
            .start();
        }
    },

    start () {
        this.tempX = this.node.x;
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 1) {
            this.onGround =true;
        }
        
    },
    onEndContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 1) {
            this.onGround =false;
        }
        
    },
    update (dt) {
        if(this.onGround){
            AD.playerNow.x+=this.node.x-this.tempX;
        }
        this.tempX=this.node.x;
       
    },
    moveFunc(){
       
    }
});
