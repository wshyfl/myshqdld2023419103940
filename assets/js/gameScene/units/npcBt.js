
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

    },
    reset(_npcType, _angle) {
        // this.node.angle = _angle;

        this.paoWuXian = false;
        this.hurtDistance = 0;//范围伤害 的 范围
        switch (_npcType) {
            case 3://水枪男	远程	手里拿着水枪，玩家进入范围，会发射红色水泡
                break;
            case 4://水枪女	远程	手里拿着水枪，玩家进入范围，会发射红色水泡，射速较快
                break;
            case 5://投掷怪	远程抛物线	手里拿着水泡，进入范围会超玩家方向扔，水泡是范围伤害

                this.paoWuXian = true;

                this.hurtDistance = 200;//范围伤害 的 范围


                var _duration = Math.abs(AD.playerNow.x - this.node.x) * 0.004;
                var _targetPos = cc.v2(AD.playerNow.x, AD.playerNow.y - AD.playerNow.height * AD.playerNow.scaleY * 0.5);
                var _height = Math.abs(AD.playerNow.x - this.node.x) * 0.5;
                var _jump = cc.jumpTo(_duration, _targetPos, _height, 1);
                cc.tween(this.node).then(_jump).start();
                //落地自动销毁
                this.scheduleOnce(() => {
                    if (this.dieNow) return;
                    this.dieFunc(2);
                }, _duration)
                break;
        }
        if (this.paoWuXian) return;
        this.shootDistance = 500;//1:攻击距离
        var _speed = 10;//2 速度
        this.vx = -Math.sin(Tools.angleToRadian(_angle)) * _speed;
        this.vy = Math.cos(Tools.angleToRadian(_angle)) * _speed;
        this.yuanPos = this.node.position;
        this.dieNow = false;
    },
    update(dt) {
        if (this.dieNow) return;
        if (!this.paoWuXian) {
            this.node.x += this.vx;
            this.node.y += this.vy;
            this.moveDistance = Tools.getDistance(this.node.position, this.yuanPos);//移动了多远
            this.checkOutScreen();
        }
    },
    //出屏检测
    checkOutScreen() {
        //向上出屏
        if (this.node.y >AD.gameScene.camera.y +  560) {
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
        // AD.npcBtMng.npcBtPool.put(this.node);
        this.node.destroy();

        if (this.hurtDistance > 0) {//范围伤害 的 范围
            if (Tools.getDistance(this.node.position, AD.playerNow.position) < this.hurtDistance)
            {
                AD.playerNow.getComponent("player").beHurt((this.node.x > AD.playerNow.x));

            }
            
            AD.propMng.createEffectHitBig(this.node.position);
            return;
        }
        
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
            case 1://击中玩家
                this.dieFunc(0);
                otherCollider.node.getComponent("player").beHurt((this.node.x > AD.playerNow.x));
                break;
            case 0://击中地面
                this.dieFunc(2);
                break;
        }
    },

});
