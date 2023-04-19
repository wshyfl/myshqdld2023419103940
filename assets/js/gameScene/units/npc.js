

cc.Class({
    extends: cc.Component,

    properties: {
        type: 3,
        minX: {
            default: 0,
            displayName: "左侧X"
        },
        maxX: {
            default: 0,
            displayName: "右侧X"
        },
        speed: {
            default: 3,
            displayName: "移速"
        },
        shootPoint: cc.Node,

    },
    onLoad() {
        this.ball = cc.find("ball", this.node);
        this.body = cc.find("body", this.node);
        this.createHpAndXuanYun();
        this.anim = this.body.getComponent(sp.Skeleton);
        this.reset();
        this.initPhysics();

        this.changeDirectionDuration = 0;
    },
    //初始化物理属性
    initPhysics() {
        this.node.getComponent(cc.RigidBody).linearDamping = 0.5;//速度衰减值
        this.node.getComponent(cc.RigidBody).angularDamping = 3;//速度衰减值
    },
    //生成眩晕和血条 球形 动画
    createHpAndXuanYun() {
        // var _ballAnim = cc.instantiate(AD.gameScene.npcBallEffect);
        // _ballAnim.parent = this.ball;
        this.ballBg = cc.instantiate(AD.gameScene.npcBallBgEffect);
        this.ballBg.parent = this.node;
        this.ballBg.zIndex = -1;
        this.ballBg.scale = 0.85;// this.ball.scale;
        this.ballBg.position = this.ball.position;

        var _npcHpXuanYun = cc.instantiate(AD.gameScene.npcHpXuanYun)
        _npcHpXuanYun.parent = this.node;
        this.effectXuanYun = cc.find("effectXuanYun", _npcHpXuanYun);
        this.effectXuanYun.active = false;
        this.hpBar = cc.find("hpDi/hpBar", _npcHpXuanYun).getComponent(cc.Sprite); this.hpBar.node.parent.active = false;
        switch (this.type) {
            case 0:
                this.effectXuanYun.y = 80;
                this.hpBar.node.parent.y = 66;
                break;
            case 1:
                this.effectXuanYun.y = 80;
                this.hpBar.node.parent.y = 66;
                break;
            case 2:
                break;
            case 3:
                this.effectXuanYun.y = 90;
                this.hpBar.node.parent.y = 75;
                break;
            case 4:
                this.effectXuanYun.y = 90;
                this.hpBar.node.parent.y = 75;
                break;
            case 5:
                this.effectXuanYun.y = 106;
                this.hpBar.node.parent.y = 88;
                _npcHpXuanYun.x = 13;
                break;
            case 6:
                this.effectXuanYun.y = 77;
                this.hpBar.node.parent.y = 60;
                break;
        }
    },
    reset() {
        this.isPlayingShuiPaoSfx = false;//自己正在播放水泡音效吗?
        this.hp = this.hpSum = AD.npcData[this.type].Npc_Health;//血量
        this.hpBar.fillRange = this.hp / this.hpSum;
        this.autoResumeHpDuration = 0;//自动回血时间
        this.autoResumeHpDurationSum = 3;//自动回血时间
        this.beBallingDuration = 3;//变球的持续时间
        this.beBallingDurationTemp = 0;//变球的持续时间
        this.shootPre = 0.5;//攻击前摇=>在普通移动状态下  默认攻击间隔为0.5秒
        this.xuanYunDurationSum = 2;//碰到 大泡后 眩晕的时长
        this.initConst();
    },
    initConst() {
        this.hadDied = false;//已经死亡
        this.node.angle = 0;
        this.xuanYunDuration = 0;//眩晕时间
        this.beHurtDuration = 0;//被击时间
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
        this.ball.active = false;
        this.ballBg.active = false;
        this.direction = Tools.random(0, 1);
        if (this.direction == 0)
            this.direction = -1;
        this.body.scaleX = this.direction;

        this.moveState = 0;//处于战斗状态?
        this.moveRate = 1;//移动速率
        this.stayDuration = 1;//边界 转向滞留 间隔

        this.tipsNotFraidDuration = 0;
        this.isShootType = false;
        if (this.type == 1 || this.type == 3 || this.type == 4 || this.type == 5 || this.type == 6)
            this.isShootType = true;
        if (this.isShootType)
            this.initShoot();
        this.initAnim();

        if (this.type == 2) {
            this.scheduleOnce(() => {
                this.body.y = -50;
                cc.tween(this.body)
                    .repeatForever(
                        cc.tween()
                            .by(0.5, { y: 10 })
                            .by(0.5, { y: -10 })
                    )
                    .start();
                var _npcFire_fireBehind = cc.instantiate(AD.propMng.npcFire_fireBehind);
                _npcFire_fireBehind.parent = this.node;
                _npcFire_fireBehind.y = -15;
                _npcFire_fireBehind.zIndex = -1;


                var _npcFire_fireBefore = cc.instantiate(AD.propMng.npcFire_fireBefore);
                _npcFire_fireBefore.parent = this.node;
                _npcFire_fireBefore.y = -15;

                var _scale = 1.3;
                _npcFire_fireBefore.scale = _npcFire_fireBehind.scale = _scale;
                // this.node.scale = 1.3
            }, 0.1)
        }
    },
    initAnim() {
        var self = this;
        //---帧事件 监听
        this.anim.setEventListener((a, evt) => {

            if (evt.data.name == "npc2_gongji") {//飞刀怪	近战	在循环路段巡逻，玩家靠近后，会主动攻击
                if (self.inShootDistance) {
                    if ((self.direction == 1 && AD.playerNow.x > self.node.x) || (self.direction == -1 && AD.playerNow.x < self.node.x)) {


                        AD.playerNow.getComponent("player").beHurt(1);
                    }
                }
            }
            else if (evt.data.name == "npc4_gongji" || evt.data.name == "npc5_gongji") {///npc4_gongji:水枪女+水枪男   npc5_gongji:投掷怪
                self.createBt();
            }
        });
        //---动作完毕监听
        this.anim.setCompleteListener((a, evt) => {

            switch (a.animation.name) {
                case "gongji_kaishi"://角色1 攻击结束
                    self.playAct("角色1冲刺");
                    break;
                case "gongji_jieshu"://角色1 攻击结束
                    self.playAct("待机");
                    break;
                case "gongji"://角色2 gongji结束
                    self.playAct("待机");
                    if (self.type == 1)
                        self.attackEndDuration = self.attackEndDurationSum;
                    break;
                case "fangshou_tiao"://角色7 变小 完毕=>进入变小待机
                    self.playAct("角色7缩小待机");
                    break;
                case "fangshou_huifu"://角色7 变大 完毕=>恢复成正常待机
                    self.playAct("待机");
                    self.scheduleOnce(() => {
                        self.moveState = 0;
                    }, 1);//一秒后 开始移动
                    break;
            }
        });

    },

    update(dt) {
        if (this.hadDied) return;


        if (this.xuanYunDuration > 0) {//眩晕状态
            this.xuanYunDuration -= dt;
            if (this.xuanYunDuration <= 0) {
                this.effectXuanYun.active = false;
                this.playAct(this.animeNamePre);
            }
            return;
        }

        if (this.changeDirectionDuration > 0)
            this.changeDirectionDuration -= dt;
        if (this.beBallingDurationTemp > 0) {//球形状态
            // this.beBallingDurationTemp -= dt;
            // if (this.beBallingDurationTemp <= 0) {
            //     //变回普通状态
            //     this.beNormalFunc();
            // }
            // this.node.x = this.ballX;
            this.ball.angle = -this.node.angle
            this.ballBg.angle = -this.node.angle
            if (Math.abs(this.node.x - AD.gameScene.camera.x) > cc.winSize.width / 2 || Math.abs(this.node.y - AD.gameScene.camera.y) > cc.winSize.height / 2) {
                if (this.isPlayingShuiPaoSfx)//自己正在播放水泡音效吗?)
                {
                    this.isPlayingShuiPaoSfx = false
                    AD.npcBallNum--;//变成泡泡的NPC的数量
                    AD.audioMng.stopSfx("水泡状态");
                }
            }
            else {
                if (this.isPlayingShuiPaoSfx == false)//自己正在播放水泡音效吗?)
                {
                    this.isPlayingShuiPaoSfx = true
                    AD.audioMng.playSfx("水泡状态");
                    AD.npcBallNum++;//变成泡泡的NPC的数量
                }
            }
        }
        else {//普通状态
            //自动回血
            if (this.hp < this.hpSum) {
                if (this.autoResumeHpDuration > 0) {
                    this.autoResumeHpDuration -= dt;
                    if (this.autoResumeHpDuration <= 0) {
                        this.autoResumeHpDuration = this.autoResumeHpDurationSum;
                        this.hp += 1;
                        this.hpBar.node.parent.active = true;
                        this.hpBar.fillRange = this.hp / this.hpSum;
                        if (this.hp == this.hpSum) {
                            this.hpBar.node.parent.active = false;
                        }
                    }

                }
            }
            switch (this.type) {
                case 0:
                    if (this.moveState == 1) {//在攻击范围内
                        this.moveFuncFight(dt);
                    }
                    else if (this.moveState == 0) {
                        // if (this.anim.animation != "gongji")
                        this.moveFunc(dt);
                    }
                    break;
                case 1:
                    if (this.attackEndDuration > 0)
                        this.attackEndDuration -= dt;
                    if (this.inShootDistance) {
                        this.moveState = 0;
                        if (this.attackEndDuration <= 0) {
                            this.playAct("角色2攻击");
                        }
                        else {

                            this.playAct("待机");
                        }

                        if (AD.playerNow.x > this.node.x)
                            this.direction = 1;
                        else
                            this.direction = -1;
                        this.body.scaleX = this.direction;
                    }
                    else {
                        if (this.anim.animation != "gongji") {
                            // this.moveState = 0;


                            if (this.moveState == 0)
                                this.moveFunc(dt);
                            else {
                                if (this.beHurtDuration > 0) {
                                    this.beHurtDuration -= dt;
                                    if (this.beHurtDuration <= 0)
                                        this.moveState = 0;
                                }
                            }
                        }

                    }
                    break;
                case 2://火人	近战	在循环路段巡逻，不会主动攻击玩家，玩家水枪对其无效
                    this.moveFunc(dt);
                    break;
                case 3://水枪男	远程	手里拿着水枪，玩家进入范围，会发射红色水泡
                case 4://水枪女	远程	手里拿着水枪，玩家进入范围，会发射红色水泡，射速较快
                case 5://投掷怪	远程抛物线	手里拿着水泡，进入范围会超玩家方向扔，水泡是范围伤害
                    if (this.inShootDistance) {//在攻击范围内
                        this.moveFuncFight(dt);
                    }
                    else {
                        if (this.anim.animation != "gongji") {
                            this.moveFunc(dt);
                        }
                    }
                    break;
                case 6://地刺怪	近战	在循环路段巡逻，看见玩家后，会钻地变刺，同时无敌   普通巡逻状态下，可以被攻击

                    if (this.inShootDistance) {//在攻击范围内
                        // this.moveFuncFight(dt);
                        if (this.anim.animation == "daiji" || this.anim.animation == "yidong") {
                            this.playAct("角色7缩小");
                            AD.audioMng.playSfx("npc害怕");
                            AD.npcBtMng.createEffectJingYa(this.node, (this.body.scaleX < 0), cc.v2(0, 0));
                        }
                        this.moveState = -2;
                        this.attackEndDuration = 0;
                    }
                    else {//预警接触 恢复正常走路
                        if (this.anim.animation != "daiji" && this.anim.animation != "yidong") {
                            this.attackEndDuration += dt;
                            if (this.attackEndDuration >= this.attackEndDurationSum)
                                this.playAct("角色7放大");
                        }


                        if (this.moveState == 0)
                            if (this.anim.animation == "daiji" || this.anim.animation == "yidong")
                                this.moveFunc(dt);
                    }
                    break;
            }

        }

    },
    moveFunc(dt) {
        if (this.node.x >= this.maxX && this.direction == 1) {

            this.playAct("待机");
            this.moveState = -1;
            this.moveRate = 0;
            this.scheduleOnce(() => {
                this.moveState = 0;//切换普通移动
                this.direction = -1;
                this.body.scaleX = this.direction;
                this.moveRate = 1;
            }, this.stayDuration);
        }
        else if (this.node.x <= this.minX && this.direction == -1) {

            this.moveRate = 0;
            this.playAct("待机");
            this.moveState = -1;
            this.scheduleOnce(() => {
                this.moveState = 0;//切换普通移动
                this.direction = 1;
                this.body.scaleX = this.direction;
                this.moveRate = 1;
            }, this.stayDuration);
        }
        else {
            this.playAct("移动");
        }
        var _speed = this.direction * this.speed * this.moveRate;
        this.node.x += _speed;


        if (this.isShootType)//攻击前摇=>在普通移动状态下  默认攻击间隔为1秒
            this.shootDurationTemp = this.shootPre;
    },
    moveFuncFight(dt) {

        //攻击状态的移动
        switch (this.type) {
            case 0://电锯男	近战	在循环路段巡逻，看见玩家会猛冲过去
                if (this.node.x >= this.maxX - 50 && this.direction == 1) {
                    this.playAct("角色1冲刺结束");
                    this.moveState = 0;//切换普通移动
                    this.changeMoveRate(1, 0.3, () => {
                        this.moveRate = 1;
                    })

                }
                else if (this.node.x <= this.minX + 50 && this.direction == -1) {
                    this.playAct("角色1冲刺结束");
                    this.moveState = 0;//切换普通移动
                    this.changeMoveRate(1, 0.3, () => {
                        this.moveRate = 1;
                    })
                }
                else {
                    // this.moveRate = 3;//发狂冲刺的最高速率

                    if (this.moveRate == 1) {
                        this.moveRate = 0;
                        AD.npcBtMng.createEffectJingYa(this.node, (this.body.scaleX < 0), cc.v2(0, 0));
                        this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0, 4000),
                            this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
                        AD.audioMng.playSfx("npc吃惊");
                        this.playAct("待机");
                        this.scheduleOnce(() => {
                            this.changeMoveRate(3, 0.3, () => {

                            })
                            this.playAct("角色1冲刺");
                        }, 0.5)
                    }

                }
                var _speed = this.direction * this.speed * this.moveRate;
                this.node.x += _speed;
                break;
            case 1://飞刀怪	近战	在循环路段巡逻，玩家靠近后，会主动攻击
                break;
            case 2://火人	近战	在循环路段巡逻，不会主动攻击玩家，玩家水枪对其无效
                break;
            case 3://水枪男	远程	手里拿着水枪，玩家进入范围，会发射红色水泡
            case 4://水枪女	远程	手里拿着水枪，玩家进入范围，会发射红色水泡，射速较快
            case 5://投掷怪	远程抛物线	手里拿着水泡，进入范围会超玩家方向扔，水泡是范围伤害
                if (this.anim.animation != "gongji") {
                    this.playAct("待机");

                    if (this.changeDirectionDuration <= 0) {

                        if (AD.playerNow.x > this.node.x) {
                            this.direction = 1;
                            this.changeDirectionDuration = 0.5;
                        }
                        else {

                            this.direction = -1;
                            this.changeDirectionDuration = 0.5;
                        }
                        this.body.scaleX = this.direction;
                    }
                }
                this.createBtFunc(dt);
                break;

            case 6://
                break;
        }
    },

    initShoot() {
        this.couldShoot = true;
        this.shootRandomAngle = 2;//攻击随机角度
        this.shootDurationTemp = 0;//攻击间隔 计时
        this.attackEndDuration = 1;//攻击后摇
        this.attackEndDurationSum = 1;//攻击后摇
        this.inShootDistance = false;//在攻击范围内
        switch (this.type) {
            case 1://飞刀怪	近战	在循环路段巡逻，玩家靠近后，会主动攻击
                this.shootDuration = 0.5;//攻击间隔   
                break;
            case 3://水枪男	远程	手里拿着水枪，玩家进入范围，会发射红色水泡
                this.shootDuration = 3;//攻击间隔   
                break;
            case 4://水枪女	远程	手里拿着水枪，玩家进入范围，会发射红色水泡，射速较快
                this.shootDuration = 1;//攻击间隔
                break;
            case 5://投掷怪	远程抛物线	手里拿着水泡，进入范围会超玩家方向扔，水泡是范围伤害
                this.shootDuration = 3;//攻击间隔
                break;
        }
    },
    createBtFunc(dt) {
        if (this.couldShoot) {
            if (this.shootDurationTemp <= 0) {
                this.shootDurationTemp = this.shootDuration;
                if (this.type == 3 || this.type == 4 || this.type == 5) {
                    if (AD.playerNow.x > this.node.x && this.direction == 1) {
                        this.playAct("发射子弹");
                    }
                    else if (AD.playerNow.x < this.node.x && this.direction == -1) {
                        this.playAct("发射子弹");
                    }
                }
            }
        }
        if (this.shootDurationTemp > 0)
            this.shootDurationTemp -= dt;
        if (this.attackEndDuration > 0)
            this.attackEndDuration -= dt;
    },
    createBt() {

        if (this.shootPoint) {
            var _pos = this.shootPoint.parent.convertToWorldSpaceAR(this.shootPoint.position);
            var _btPos = AD.playerBtMng.node.convertToNodeSpaceAR(_pos);

            var _randomAngle = this.shootRandomAngle;//随机角度的上下限 绝对值
        }

        switch (this.type) {
            case 1://飞刀怪	近战	在循环路段巡逻，玩家靠近后，会主动攻击

                break;
            case 3://水枪男	远程	手里拿着水枪，玩家进入范围，会发射红色水泡
                AD.npcBtMng.createBt(this.type, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
            case 4://水枪女	远程	手里拿着水枪，玩家进入范围，会发射红色水泡，射速较快
                AD.npcBtMng.createBt(this.type, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
            case 5://投掷怪	远程抛物线	手里拿着水泡，进入范围会超玩家方向扔，水泡是范围伤害
                AD.npcBtMng.createBt(this.type, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
        }
    },
    changeMoveRate(_targetRate, _duration, _callFunc) {
        var _obj = { num: this.moveRate };
        cc.tween(_obj)
            .to(_duration, { num: _targetRate })
            .call(() => {
                _obj.num = _targetRate;
            })
            .start();
        var _func = () => {
            this.moveRate = _obj.num;
            if (this.moveRate == _targetRate) {
                this.unschedule(_func);
                _callFunc.call(this);
            }
        };
        this.schedule(_func, 0.01);
    },

    beHurt(_hurtNum) {
        if (this.hadDied) return;
        if (this.type == 2) {
            if (this.tipsNotFraidDuration <= 0) {
                cc.director.emit("系统提示","火精灵不怕水枪")
                this.tipsNotFraidDuration = 10;
                this.scheduleOnce(()=>{
                    this.tipsNotFraidDuration = 0;

                },10)
            }
            return;
        }
        if (this.type == 6) {
            if (this.anim.animation == "daiji" || this.anim.animation == "yidong")
                this.hp -= _hurtNum;
        }
        else if (this.type != 2)
            this.hp -= _hurtNum;


        if (this.hp <= 0) {
            this.beBallFunc();
            this.hpBar.node.parent.active = false;
        }
        else {
            if (this.hp < this.hpSum) {
                this.autoResumeHpDuration = this.autoResumeHpDurationSum;
                this.hpBar.node.parent.active = true;
                this.hpBar.fillRange = this.hp / this.hpSum;
            }
            if (this.type == 1) {
                var _direction = -1;
                if (AD.playerNow.x > this.node.x)
                    _direction = 1;
                if (_direction != this.direction) {
                    AD.npcBtMng.createEffectJingYa(this.node, (this.body.scaleX > 0), cc.v2(0, 0));
                    this.moveState = -1;
                    this.playAct("待机");
                    this.beHurtDuration = 0.5;
                    if (AD.playerNow.x > this.node.x)
                        this.direction = 1;
                    else
                        this.direction = -1;
                    this.body.scaleX = this.direction;
                }
            }
        }
    },
    //变成球形状态
    beBallFunc() {

        if (this.beBallingDurationTemp <= 0) {//原来是普通状态 变成 球形状态 (做些动作)
            this.body.opacity = 130;
            AD.audioMng.playSfx("变成泡泡");
            AD.audioMng.playSfx("水泡状态");
            AD.npcBallNum++;//变成泡泡的NPC的数量
            this.isPlayingShuiPaoSfx = true;
            this.node.getComponent(cc.RigidBody).gravityScale = 1;//角度衰减值
            this.node.getComponents(cc.PhysicsBoxCollider)[0].enabled = false;
            this.node.getComponents(cc.PhysicsBoxCollider)[1].enabled = false;
            var _direction = 1;
            if (AD.playerNow.x > this.node.x)
                _direction = -1;
            this.node.getComponent(cc.RigidBody).fixedRotation = false;
            this.node.getComponent(cc.RigidBody).angularVelocity = 10 * _direction;
            this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(_direction * 800, 4000),
                this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
            this.playAct("泡泡");
        }
        this.beBallingDurationTemp = this.beBallingDuration;//变球的持续时间
        this.scheduleOnce(() => {
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = true;
            this.ball.active = true;

            this.ballBg.active = true;
        }, 0.01);
        this.ballX = this.node.x;
    },
    //变回普通状态
    beNormalFunc() {
        this.hp = this.hpSum;
        this.hpBar.node.parent.active = false;
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
        this.ball.active = false;

        this.ballBg.active = false;
        AD.propMng.createEffectPaoBomb(cc.v2(this.node.x + this.ball.x, this.node.y + this.ball.y));//特效--泡泡破碎
        if (this.type == 6) {
            this.playAct("待机");
            this.moveState = 0;
        }
    },
    //眩晕
    xuanYunFunc() {
        if (this.ball.active) return;
        if (this.type == 6) {//带刺的
            if (this.anim.animation != "daiji" && this.anim.animation != "yidong")
                return;
        }
        else if (this.type == 2)
            return;

        cc.director.emit("成就触发", "天旋地转", 1);
        AD.audioMng.playSfx("眩晕");
        this.playAct("待机");
        this.effectXuanYun.active = true;
        this.xuanYunDuration = this.xuanYunDurationSum;

    },
    //死亡
    dieFunc(_direction) {
        if (this.hadDied) return;

        this.node.getComponent(cc.RigidBody).gravityScale = 2;//角度衰减值
        this.playAct("死亡");
        this.hadDied = true;
        this.beBallingDurationTemp = 0;
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
        this.node.getComponents(cc.PhysicsBoxCollider)[0].enabled = false;
        this.node.getComponents(cc.PhysicsBoxCollider)[1].enabled = true;
        this.ball.active = false;

        this.node.getComponent(cc.RigidBody).linearDamping = 0.5;//速度衰减值
        this.node.getComponent(cc.RigidBody).angularDamping = 0.5;//速度衰减值

        this.body.opacity = 255;
        this.ballBg.active = false;
        this.node.parent = cc.find("Canvas/effectMng");
        if (_direction == 0) {//踩爆

            cc.director.emit("成就触发", "原地爆炸", 1);//存储成就
            AD.npcBallNum--;//变成泡泡的NPC的数量
            AD.audioMng.stopSfx("水泡状态");
            this.isPlayingShuiPaoSfx = false;
            AD.audioMng.playSfx("踢爆泡泡");
            AD.audioMng.playSfx("击飞");
            cc.director.emit("击杀效果", "踩爆");
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 800);

            var _a = Tools.random(0, 1);
            if (_a == 0)
                _a = -1;

            cc.tween(this.node)
                .by(2, { angle: 1000 * _a })
                .call(() => {
                    // this.node.destroy();
                })
                .start();
        }
        else {//踢爆
            AD.npcBallNum--;//变成泡泡的NPC的数量
            AD.audioMng.stopSfx("水泡状态");
            AD.audioMng.playSfx("踢爆泡泡");
            // this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(8000 * _direction, 8000),
            //     this.node.getComponent(cc.RigidBody).getWorldCenter(), true);

            if (this.node.y > AD.playerNow.y + 20) {

                cc.director.emit("击杀效果", "空接");
                cc.director.emit("成就触发", "空中接力", 1);//存储成就
            }
            else {

                cc.director.emit("击杀效果", "踢爆");
                cc.director.emit("成就触发", "泡泡达人", 1);//存储成就
            }
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(800 * _direction, 1400);
            cc.tween(this.node)
                .by(2, { angle: 1500 * -_direction })
                .call(() => {
                    // this.node.destroy();
                })
                .start();
        }

        if (globalData.getGuideData("tiBao") == false) {
            globalData.setGuideData("tiBao");
        }
        //爆出金币
        AD.propMng.createCoinBombOut(this.node.position, AD.npcData[this.type].Npc_GoldNum);
        AD.propMng.createEffectPaoBomb(this.node.position);//特效--泡泡破碎

    },
    playAct(_name) {
        if (_name != "待机")
            this.animeNamePre = _name;
        switch (_name) {
            case "待机":
                if (this.anim.animation != "daiji" && this.hp > 0) {
                    this.anim.setAnimation(0, "daiji", true);
                }
                break;
            case "移动":
                if (this.anim.animation != "yidong" && this.hp > 0) {
                    this.anim.setAnimation(0, "yidong", true);
                }
                break;
            case "死亡":
                if (this.anim.animation != "siwang") {
                    this.anim.setAnimation(0, "siwang", false);
                }
                break;
            case "泡泡":
                if (this.anim.animation != "paopao") {
                    this.anim.setAnimation(0, "paopao", true);
                }
                break;
            case "角色1冲刺":
                if (this.anim.animation != "gongji_chong" && this.hp > 0) {
                    this.anim.setAnimation(0, "gongji_chong", true);
                }
                break;
            case "角色1冲刺开始":
                if (this.anim.animation != "gongji_kaishi" && this.hp > 0) {
                    this.anim.setAnimation(0, "gongji_kaishi", false);
                }
                break;
            case "角色1冲刺结束":
                if (this.anim.animation != "gongji_jieshu" && this.hp > 0) {
                    this.anim.setAnimation(0, "gongji_jieshu", false);
                }
                break;
            case "角色2攻击":
                if (this.anim.animation != "gongji" && this.hp > 0) {
                    this.anim.setAnimation(0, "gongji", false);
                }
                break;
            case "发射子弹":
                if (this.anim.animation != "gongji" && this.hp > 0) {
                    this.anim.setAnimation(0, "gongji", false);
                }
                break;
            case "角色7缩小":
                if (this.anim.animation != "fangshou_tiao" && this.hp > 0) {
                    this.anim.setAnimation(0, "fangshou_tiao", false);
                }
                break;
            case "角色7放大":
                if (this.anim.animation != "fangshou_huifu" && this.hp > 0) {
                    this.anim.setAnimation(0, "fangshou_huifu", false);
                }
                break;
            case "角色7缩小待机":
                if (this.anim.animation != "fangshou_daiji" && this.hp > 0) {
                    this.anim.setAnimation(0, "fangshou_daiji", true);
                }
                break;
        }
    },


    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == "player" && this.ball.active == false
            && this.hadDied == false && otherCollider.node.getComponent(cc.RigidBody).linearVelocity.y < -5) {

            this.rigidbody = otherCollider.node.getComponent(cc.RigidBody);

            this.scheduleOnce(() => {
                if (Math.abs(this.node.x - otherCollider.node.x) < (this.node.width / 2 + otherCollider.node.width * otherCollider.node.scaleY / 2) * 0.8) {
                    otherCollider.node.getComponent("player").playAct("跳跃");
                    AD.audioMng.playSfx("水泡破碎")
                    this.rigidbody.linearVelocity = cc.v2(0, 800);
                }


            }, 0.02)
        }
    },
    onPreSolve: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.group == "player" && this.ball.active == true) {
            this.rigidbody = this.node.getComponent(cc.RigidBody);
            if (otherCollider.node.getComponent("player").anim.animation == "yidong") {
                var _direction = 1;
                if (AD.playerNow.x > this.node.x)
                    _direction = -1;
                this.rigidbody.linearVelocity = cc.v2(_direction * 30, this.rigidbody.linearVelocity.y);
                this.rigidbody.angularVelocity = _direction * 30;
            }
        }

    }
});
