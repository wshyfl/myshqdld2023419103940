

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
        this.reset();
        cc.tween(this.node)
        .delay(6)
        .repeat(4,
            cc.tween()
            .to(0.2,{opacity:100})
            .to(0.2,{opacity:255})
            .delay(0.2)
            )
            .call(()=>{
                this.node.destroy();
            })
            .start();
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .by(0.5,{y:15},{easing:"sineInOut"})
            .by(0.5,{y:-15},{easing:"sineInOut"})
        )
        .start();
    },
    reset() {
        var _index = Tools.random(0, 2);
        this.porpName = null;
        switch (_index) {
            case 0:
                this.porpName = "回血";
                break;
            case 1:
                this.porpName = "伤害";
                break;
            case 2:
                this.porpName = "手雷";
                break;
        }
        for (var i = 0; i < 3; i++) {
            this.node.children[i].active = (i == _index);
        }
    },

    onCollisionEnter(other, self) {
        if (other.node.group == "player") {
            if (other.tag == 1) {
                var _playerJS = other.node.getComponent("playerPVP");
                if (_playerJS) {
                    var _sucess = _playerJS.getProp(this.porpName);
                    if (_sucess){
                        
                        this.node.destroy();
                        AD.audioMng.playSfx("吃星星");
                    }
                }
            }
        }
    }
    // update (dt) {},
});
