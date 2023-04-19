

cc.Class({
    extends: cc.Component,

    properties: {
        coin: cc.Node,
        star: cc.Node,
        key: cc.Node,
        diamond: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    //id  0小花  1分数
    reset(_startPos, _targetPos, _typeOfOBJ,...func) {
        this.coin.active = (_typeOfOBJ == 0);
        this.star.active = (_typeOfOBJ == 1);
        this.key.active = (_typeOfOBJ == 2);
        this.diamond.active = (_typeOfOBJ == 3);
        this.node.angle = Tools.random(0, 360);
        console.log("cc.director.getScene().name  " +cc.director.getScene().name)
        if (cc.director.getScene().name == "gameScene")
        {
            if( AD.gameScene.gameOver == false)
            _startPos = cc.v2(_startPos.x - AD.gameScene.camera.x, _startPos.y - AD.gameScene.camera.y)
        }
        this.node.position = _startPos;
        var _x = _startPos.x + Tools.random(-100, 100);
        var _y = _startPos.y + Tools.random(-100, 100);
        var _randomTime1 = Tools.random(-20, 20) * 0.01;
        var _randomTime2 = Tools.random(-20, 20) * 0.01;

        var _randomAngle = Tools.random(0,1);
        if(_randomAngle==0)
        _randomAngle = -1;
        cc.tween(this.node)
            .to(0.5 + _randomTime1, { position: cc.v2(_x, _y), angle: this.node.angle + 180 * 2*_randomAngle }, { easing: "sineOut" })
            .to(0.8 + _randomTime2, { position: _targetPos, opacity: 100, scale: 0.5, angle: this.node.angle + 180 * 4 *_randomAngle}, { easing: "sineInOut" })
            .call(() => {
                this.node.destroy();
                AD.audioMng.playSfx("金币");
                if(_typeOfOBJ==1){//0金币  1星星 2钥匙
                    cc.director.emit("显示星星")
                }
            })
            .start();
    },
    // update (dt) {},
});
