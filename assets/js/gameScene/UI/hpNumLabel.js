

cc.Class({
    extends: cc.Component,

    properties: {
        hpHearts:[cc.Node],
        
    },

    // onLoad () {},

    start () {
       cc.director.on("复活",()=>{
            for(var i=0;i<3;i++){
            this.hpHearts[i].opacity = 255;
            this.hpHearts[i].scale = 1;
        }
       },this)
        
        cc.director.on("掉血",(_hpNow)=>{
                
            cc.tween(this.hpHearts[_hpNow-1])
            .to(0.3,{opacity:0,scale:0},{easing:"backInOut"})
            .start();
            
            
        },this);
    },

    // update (dt) {},
});
