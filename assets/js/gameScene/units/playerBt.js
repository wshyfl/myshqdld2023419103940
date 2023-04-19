
cc.Class({
    extends: cc.Component,

    properties: {
        sprBlue: cc.SpriteFrame,
        sprYellow: cc.SpriteFrame,
        sprRed: cc.SpriteFrame,
    },

    // onLoad () {},

    start() {

    },
    reset(_gunType, _angle, _isEnemy, _hurtRate) {
        // this.node.angle = _angle;
        this.hurtRate = 1;
        if (AD.modeType == "PVP模式") {
            this.isEnemy = _isEnemy;
            this.hurtRate = _hurtRate
        }
        this.shootDistance = 650;//1:攻击距离
        var _speed = AD.gunData[_gunType].Gun_Bulletrate;//2 速度
        this.hurtNum = AD.gunData[_gunType].Gun_Hurt * this.hurtRate;//2
        this.vx = -Math.sin(Tools.angleToRadian(_angle)) * _speed;
        this.vy = Math.cos(Tools.angleToRadian(_angle)) * _speed;
        this.yuanPos = this.node.position;
        this.dieNow = false;
        if (AD.modeType != "PVP模式") {
            if (_gunType == 1)
                this.node.children[0].getComponent(cc.Sprite).spriteFrame = this.sprYellow;
            else
                this.node.children[0].getComponent(cc.Sprite).spriteFrame = this.sprBlue;
        }
        else {
            if (_isEnemy)
                this.node.children[0].getComponent(cc.Sprite).spriteFrame = this.sprRed;
            else
                this.node.children[0].getComponent(cc.Sprite).spriteFrame = this.sprBlue;
        }

    },
    update(dt) {

        if (this.dieNow) return;
        this.node.x += this.vx;
        this.node.y += this.vy;


        this.moveDistance = Tools.getDistance(this.node.position, this.yuanPos);//移动了多远
        this.checkOutScreen();
    },
    //出屏检测
    checkOutScreen() {
        //向上出屏
        if (this.node.y > AD.gameScene.camera.y + 560) {
            this.dieFunc(1);
        }
        else {//运行距离超过射程长度
            if (this.moveDistance >= this.shootDistance) {
                this.dieFunc(1);
            }
        }

    },
    dieFunc(_dieReason) {
        if (this.dieNow) return;
        this.dieNow = true;
        AD.playerBtMng.playerBtPool.put(this.node);
        switch (_dieReason) {
            case 0://击中敌人
                AD.propMng.createEffectHit(this.node.position);
                break;
            case 1://出屏自动销毁
                break;
            case 2://击中障碍物
                AD.propMng.createEffectHit(this.node.position);
                break;
        }
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (this.dieNow) return;
        switch (otherCollider.tag) {
            case 10://击中敌人
                this.dieFunc(0);
                otherCollider.node.getComponent("npc").beHurt(this.hurtNum);
                break;
            case 0://击中地面
                this.dieFunc(2);
                break;
        }
        if (AD.modeType == "PVP模式") {
            if (otherCollider.node.group == "player") {
                var _js = otherCollider.node.getComponent("playerPVP");
                if (_js) {
                    if (_js.isEnemy != this.isEnemy) {//击中敌人
                        this.dieFunc(0);
                        _js.beHurt(this.hurtNum, this.node.x > otherCollider.node.x);
                    }
                }
            }
        }
    },
    //碰撞检测
    onCollisionEnter: function (other, self) {

        if (this.dieNow) return;
        switch (other.tag) {
            case 11://击中敌人的球=>持续球的时间
                this.dieFunc(0);
                if (AD.modeType == "PVP模式") {
                    console.log("击中敌人的球")
                }
                else {
                    other.node.parent.getComponent("npc").beHurt(this.hurtNum);
                }

                break;
        }
    },
});
