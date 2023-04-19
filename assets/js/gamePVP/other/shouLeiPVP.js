

cc.Class({
    extends: cc.Component,

    properties: {

    },
    // onLoad () {},

    start() {

        this.isDie = false;
        this.scheduleOnce(() => {
            this.dieFunc();
        }, 1.5)

        this.scheduleOnce(() => {
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = true;
        }, 0.1)
    },
    dieFunc() {
        if (this.isDie == false) {
            cc.director.emit("手雷爆炸了", this.node.position, this.isEnemy);
            if (Math.abs(this.node.x - AD.gameScene.camera.x) < 600)
                AD.audioMng.playSfx("踢爆泡泡");
            this.node.destroy();
            this.isDie = true;
            AD.propMng.createShouLeiBomb(this.node.position);
        }
    },
    reset(_isEnemy, _direction) {
        this.isEnemy = _isEnemy;
        if (_direction > 0) {
            _direction = 1;
        }
        else
            _direction = -1;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(_direction * 1000, 1000);
        this.node.getComponent(cc.RigidBody).angularVelocity = _direction * Tools.random(100, 1000);
    },
    // update (dt) {},
});
