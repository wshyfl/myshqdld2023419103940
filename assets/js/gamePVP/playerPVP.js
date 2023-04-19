

cc.Class({
    extends: cc.Component,

    properties: {
        isAI: true,
        isEnemy: false,
        shootPoint: cc.Node,
        gunNode: cc.Node,
        armNode: cc.Node,
        body: cc.Node,
        shuiPaoBig: cc.Node,
        waterNum: cc.Sprite,
        effectFire: cc.Animation,
        isPlaying: false,
        li: 9500,
    },
    onLoad() {
        this.beginNow = false;
        this.jumpForceRate = 1;//起跳力道 比例
        this.animWater = cc.find("water", this.node).getComponent(sp.Skeleton);
        this.anim = this.body.getComponent(sp.Skeleton);
        // this.anim.setAnimation(1, "xuli", true);
        this.playerType = globalData.roleType;
        cc.director.on("更换角色", (_type) => {
            this.playerType = _type;
            this.resetSkin();
        }, this);
        cc.director.on("更换枪支", (_type) => {
            this.gunType = _type;
            this.resetGun();
        }, this);
        this.shuiPaoBig.scale = 0;

        this.scheduleOnce(() => {
            this.beginNow = true;
        }, Tools.random(10, 30) * 0.1)

        if (this.isPlaying) {
            this.init();

            if (!this.isAI) {

                AD.playerNow = this.node;
                this.beginNow = true;
            }
        }


        this.gunType = globalData.gunType;

        this.resetGun();
        this.resetSkin();
        this.dieReasonIsRiver = false;//掉进河里死亡的吗?
    },

    start() {


    },
    reset(_index) {
        this.index = _index;

        if (this.isAI) {

            this.nameNow = AD.nameArr[_index];
            cc.find("hpDi/nameLabel", this.node).getComponent(cc.Label).string = this.nameNow;
        }
        else
            this.nameNow = "我";

    },
    init() {
        this.hp = this.hpSum = 200;//血量
        if (!this.isAI)
            this.hp = this.hpSum = 200 * 1.5;//血量
        this.moveSpeed = 350;//移速
        this.initConst();
        this.playAct("待机");
    },
    //初始化常量
    initConst() {
        var self = this;
        this.scaleRate = 1;//大小比例
        this.shootDurationTemp = 0;//攻击间隔 计时
        this.direction = 1;//朝向
        this.wuDiDuration = 3;//无敌时间
        this.wuDiDurationTemp = 0;
        this.showTipsNoBtDuration = 0;

        this.couldMove = false;
        this.couldShoot = false;
        this.couldJump = true;
        this.actingIsBaoTi = false;//正在播放"爆踢"动作?
        this.dingNpcDuration = 0.5;//顶NPC的间隔

        this.shootDistance = 650;//1:攻击距离
        this.xuLing = false;
        this.couldXuLi = true;
        this.xuLiDuration = 0;


        this.saveDuration = 2;





        this.actingIsBaoTiDuration = 0;
        this.biggerDuration = 0;
        this.smallDuration = 0;

        this.hurtRate = 1;
        this.hurtRateDrutation = 0;
        this.shouLeiNum = 1;
        if (!this.isAI)
            this.scheduleOnce(() => {

                cc.director.emit("手雷数量变化", this.shouLeiNum);
            }, 0.1)
        this.beHurtDuration = 0;
        if (!this.isAI)
            this.initEmit();
        else
            this.initAI();
        //---帧事件 监听
        this.anim.setEventListener((a, evt) => {

            if (evt.data.name == "ti") {//爆踢==>NPC挨踢
                if (this.baoTiTargetNpc) {
                    var _playerJS = this.baoTiTargetNpc.getComponent("playerPVP");
                    if (_playerJS.ball.active) {
                        if (self.node.x > self.baoTiTargetNpc.x)
                            self.baoTiTargetNpc.getComponent("playerPVP").tiBaoFunc(-1);
                        else
                            self.baoTiTargetNpc.getComponent("playerPVP").tiBaoFunc(1);

                        console.log("击败信息 2222222222");
                        cc.director.emit("击败信息", self.nameNow, self.baoTiTargetNpc.getComponent("playerPVP").nameNow, this.isEnemy);
                    }

                }
                if (!this.isAI) {
                    if (AD.baoTiTargetNpc) {
                        var _playerJS = AD.baoTiTargetNpc.getComponent("playerPVP");
                        if (_playerJS.ball.active) {
                            if (this.node.x > AD.baoTiTargetNpc.x)
                                AD.baoTiTargetNpc.getComponent("playerPVP").tiBaoFunc(-1);
                            else
                                AD.baoTiTargetNpc.getComponent("playerPVP").tiBaoFunc(1);
                            // var _js = AD.baoTiTargetNpc.getComponent("playerPVP");
                            // if (_js)

                            console.log("击败信息 33333333");
                            cc.director.emit("击败信息", self.nameNow, _playerJS.nameNow, this.isEnemy);
                        }
                    }
                }
            }
        });
        //---动作完毕监听
        this.anim.setCompleteListener((a, evt) => {

            switch (a.animation.name) {
                case "tishuipao"://爆踢完毕
                    self.actingIsBaoTi = false;
                    self.playAct("待机");
                    break;
                case "fire":
                    self.xuLing = false;
                    break;
            }
        });
        this.smoke = cc.find("Canvas/smoke");
        this.smoke.parent = this.node.parent;
        this.smokeHeight = 10; this.smokePlayerYJiLu = 1000;

        this.hpDi = cc.find("hpDi", this.node);
        this.hpBar = cc.find("hpBar", this.hpDi).getComponent(cc.Sprite);
        this.hpBar.fillRange = this.hp / this.hpSum;

        this.ball = cc.find("ball", this.node); this.ball.active = false;
        this.ballBg = cc.instantiate(AD.gameScene.npcBallBgEffect);
        this.ballBg.parent = this.node;
        this.ballBg.zIndex = -1;
        this.ballBg.scale = 1;// this.ball.scale;
        this.ballBg.position = this.ball.position;
        this.ballBg.active = false;

        this.effectXuanYun = cc.instantiate(AD.gameScene.effectXuanYun)
        this.effectXuanYun.parent = this.hpDi;
        this.effectXuanYun.active = false;
        this.xuanYunDurationSum = 2;//碰到 大泡后 眩晕的时长
        this.xuanYunDuration = 0;

        // if (this.isEnemy)
        //     this.scheduleOnce(() => {
        //         this.beHurt(10000);
        //     }, 2)
        // if (!this.isEnemy && !this.isAI)
        //     this.scheduleOnce(() => {
        //         this.beHurt(10000);
        //     }, 2)

        cc.director.on("手雷爆炸了", (_pos, _isEnemy) => {
            if (this.isEnemy != _isEnemy) {
                if (Tools.getDistance(_pos, this.node.position) < 400) {
                    this.beBomb(_pos, this.node.position);
                }
            }
        }, this)

        this.schedule(() => {
            if (this.beHurtDuration <= 0) {
                this.btNum += parseInt(this.btNumSum * 0.1);
                if (this.btNum > this.btNumSum)
                    this.btNum = this.btNumSum;
                this.waterNum.fillRange = this.btNum / this.btNumSum;
            }
        }, 1)
    },
    //被手雷炸了
    beBomb(_pos1, _pos2) {
        if (this.hp <= 0) return;
        console.log("被手雷炸了");
        this.beHurt(this.hpSum / 2);

        // var _angle = Tools.getAngle(_pos2,_pos1);
        // var _vx = -Math.sin(Tools.angleToRadian(_angle)) * 500;
        // var _vy = Math.cos(Tools.angleToRadian(_angle)) * 1200;
        if (_pos2.x > _pos1.x)
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(Tools.random(300, 600), Tools.random(600, 1400));
        else
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-Tools.random(300, 600), Tools.random(600, 1400));
    },
    rengLeiFunc() {
        this.shouLeiNum--;
        AD.playerBtMng.createShouLei(this.node.position, this.isEnemy, this.node.scaleX);
        if (!this.isAI) {
            cc.director.emit("手雷数量变化", this.shouLeiNum);
            AD.effectMng.showTipsGetProps("道具手雷", this.node.position);
        }
    },

    initEmit() {
        cc.director.on("扔出手雷", () => {
            this.rengLeiFunc();
        }, this);
        cc.director.on("玩家走", (_direction) => {

            if (this.xuanYunDuration > 0) return;
            if (this.actingIsBaoTi || this.hp <= 0 || !this.beginNow) return;
            this.couldMove = true;
            this.direction = _direction;
            this.node.scaleX = this.direction * this.scaleRate;
        }, this);
        cc.director.on("玩家停", () => {
            this.couldMove = false;
        }, this);
        cc.director.on("玩家跳", () => {
            if (this.xuanYunDuration > 0) return;
            if (this.beginNow)
                this.jumpFunc();
        }, this);
        cc.director.on("开始射击", () => {
            if (this.xuanYunDuration > 0) return;
            if (!this.beginNow || this.hp <= 0) return;
            this.couldShoot = true;
            if (AD.baoTiTargetNpc) {
                this.playAct("爆踢");
                this.scheduleOnce(() => {
                    AD.audioMng.playSfx("爆踢");
                }, 0.2)
                this.couldMove = false;
            }
        }, this);
        cc.director.on("停止射击", () => {
            this.couldShoot = false;

        }, this);
        cc.director.on("蓄力", (_num) => {
            if (this.xuanYunDuration > 0) return;
            if (this.actingIsBaoTi || !this.couldXuLi || !this.beginNow || this.hp <= 0) return;
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
                if (this.xuLing == false) {
                    AD.audioMng.playSfx("蓄力");
                    cc.director.emit("显示蓄力特效", this.node);
                }
                this.xuLing = true;
            }
        }, this);
        cc.director.on("蓄力抬起", (_num) => {

            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
                this.couldXuLi = true;
                this.xuLing = false;
                AD.audioMng.stopSfx("蓄力");
                cc.director.emit("停止蓄力特效", this.node);
            }
        }, this);

        cc.director.on("增加子弹", (_num) => {
            // this.btNum += _num;
            // console.log("增加子弹")
            // if (this.btNum > this.btNumSum)
            this.btNum = this.btNumSum;
            this.waterNum.fillRange = this.btNum / this.btNumSum;
        }, this);

        cc.director.on("复活", (_num) => {
            this.reviveFunc();
        }, this);
        cc.director.on("玩家大小变化", (_targetScale, _autoResume) => {
            if (_autoResume) {//自动恢复
                this.biggerDuration = 0;
                this.smallDuration = 0;

                if (_targetScale > 1) {
                    if (this.scaleRate < 1)
                        this.scaleRate = 1;
                    else if (this.scaleRate == 1) {

                        this.scaleRate = _targetScale;
                        this.biggerDuration = 10;
                    }
                }
                else if (_targetScale < 1) {
                    if (this.scaleRate > 1)
                        this.scaleRate = 1;
                    else if (this.scaleRate == 1) {
                        this.scaleRate = _targetScale;
                        this.smallDuration = 10;
                    }
                }
            }
            else {
                if (_targetScale > 1) {
                    if (this.scaleRate < 1)
                        this.scaleRate = 1;
                    else if (this.scaleRate == 1)
                        this.scaleRate = _targetScale;
                }
                else if (_targetScale < 1) {
                    if (this.scaleRate > 1)
                        this.scaleRate = 1;
                    else if (this.scaleRate == 1)
                        this.scaleRate = _targetScale;
                }
            }


            this.node.scaleX = this.direction * this.scaleRate;
            this.node.scaleY = this.scaleRate;

        }, this);
    },
    initAI() {
        this.enemyNode = null;
        this.friendNode = null;
        this.jumpDuration = 0;
        //蓄力
        this.xuLiDurationAI = Tools.random(5, 30);
        this.funcXuLiAI = () => {
            if (this.actingIsBaoTi || !this.couldXuLi || !this.beginNow) return;
            this.xuLing = true;
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
                if (this.xuLing == false) {
                    AD.audioMng.playSfx("蓄力");
                    cc.director.emit("显示蓄力特效", this.node);
                }


            }
            else {
                //没能蓄力成功 重新蓄力
                this.scheduleOnce(this.funcXuLiAI, 1);
            }
        };
        this.scheduleOnce(this.funcXuLiAI, this.xuLiDurationAI);


        //移动
        this.moveStateAI = 0;//正常大移动
        this.moveDurationSmall = -Tools.random(2, 6);
        this.stopDuration = -Tools.random(10, 50) * 0.1;
        this.directionBig = 0;
        if (this.node.x < 0)//向右走
            this.directionBig = 1;
        else//向左走
            this.directionBig = -1;

        this.couldMove = true;
        this.direction = this.directionBig;
        this.node.scaleX = this.direction * this.scaleRate;


        this.direction = 1;
        this.node.scaleX = this.direction * this.scaleRate;

        //跳跃--测试用
        this.schedule(() => {
            if (Tools.random(1, 2) == 1)
                this.jumpFunc();
        }, 5)
    },

    getProp(_propName) {
        var _sucess = false;
        switch (_propName) {
            case "回血":
                if (this.hp > 0) {
                    this.hp = this.hpSum;
                    this.hpBar.fillRange = this.hp / this.hpSum;
                    _sucess = true;
                    if (!this.isAI)
                        AD.effectMng.showTipsGetProps("道具加血", this.node.position);
                }
                break;
            case "伤害":
                if (this.hp > 0) {
                    _sucess = true;
                    this.hurtRate = 1.3;
                    this.hurtRateDrutation = 10;
                    if (!this.isAI)
                        AD.effectMng.showTipsGetProps("道具伤害", this.node.position);
                }
                break;
            case "手雷":
                if (this.hp > 0) {
                    _sucess = true;
                    this.shouLeiNum = 1;
                    if (!this.isAI) {
                        cc.director.emit("手雷数量变化", this.shouLeiNum);
                    }
                }
                break;
        }
        console.log("获得道具效果  " + _propName);

        return _sucess;
    },
    //眩晕
    xuanYunFunc() {
        if (this.ball.active) return;

        AD.audioMng.playSfx("眩晕");
        this.playAct("待机");
        this.effectXuanYun.active = true;
        this.xuanYunDuration = this.xuanYunDurationSum;

    },
    update(dt) {

        if (this.beHurtDuration > 0) {
            this.beHurtDuration -= dt;
        }
        if (this.saveDuration > 0) {
            this.saveDuration -= dt;
        }

        if (this.actingIsBaoTi) {

            this.actingIsBaoTiDuration += dt;
            if (this.actingIsBaoTiDuration > 2)
                this.actingIsBaoTi = false;
        }
        else
            this.actingIsBaoTiDuration = 0;
        if (AD.gameScene.gameOver || !this.beginNow) return;

        //烟
        if (this.smokeHeight < 10) {
            if (Math.abs(this.smokePlayerYJiLu - this.node.y) > 10) {
                this.smokeHeight = 10;
            }
        }


        if (this.xuanYunDuration > 0) {//眩晕状态
            this.xuanYunDuration -= dt;
            if (this.xuanYunDuration <= 0) {
                this.effectXuanYun.active = false;
                this.playAct(this.animeNamePre);
            }
            return;
        }
        this.moveFunc(dt);
        //攻击
        this.createBtFunc(dt);
        //蓄力
        this.xuLiFunc(dt);
        //大小
        this.scaleFunc(dt);

        if (this.hurtRateDrutation > 0) {
            this.hurtRateDrutation -= dt;
            if (this.hurtRateDrutation <= 0)
                this.hurtRate = 1;
        }

        if (this.showTipsNoBtDuration > 0)
            this.showTipsNoBtDuration -= dt;
    },
    scaleFunc(dt) {
        if (AD.gameScene.gameOver) return;
        if (this.biggerDuration > 0) {
            this.biggerDuration -= dt;
            if (this.biggerDuration <= 0) {
                this.scaleRate = 1;
            }
            if (this.node.scaleX != this.direction * this.scaleRate)
                this.node.scaleX = this.direction * this.scaleRate;
            this.node.scaleY = this.scaleRate;

        }
        else if (this.smallDuration > 0) {
            this.smallDuration -= dt;
            if (this.smallDuration <= 0) {
                this.scaleRate = 1;
            }
            if (this.node.scaleX != this.direction * this.scaleRate)
                this.node.scaleX = this.direction * this.scaleRate;
            this.node.scaleY = this.scaleRate;

        }
    },
    xuLiFunc(dt) {
        if (AD.gameScene.gameOver || this.hp <= 0) return;
        if (this.xuLing && this.couldXuLi) {
            this.playAct("蓄力中");
            this.xuLiDuration += dt;

            this.shuiPaoBig.scale = this.xuLiDuration / this.xuLiDurationSum / this.body.scale / 0.7;
            if (!this.isAI)
                AD.xuLiBtn.xuLi(this.xuLiDuration / this.xuLiDurationSum);
            if (this.xuLiDuration >= this.xuLiDurationSum) {


                this.couldXuLi = false;
                console.log("蓄力完成");
                this.shuiPaoBig.scale = 0;
                this.playAct("蓄力开火");
                // this.effectFire.play("effectShoot0");
                var _pos = this.shuiPaoBig.parent.convertToWorldSpaceAR(this.shuiPaoBig.position);
                var _btPos = AD.playerBtMng.node.convertToNodeSpaceAR(_pos);
                cc.director.emit("生成大泡泡", cc.v2(_btPos.x + 50 * this.node.scaleX, _btPos.y), this.direction, this.scaleRate, this.node);

                if (this.isAI) {
                    //重置蓄力
                    this.scheduleOnce(() => {
                        this.xuLiDurationAI = Tools.random(10, 30);
                        this.scheduleOnce(this.funcXuLiAI, this.xuLiDurationAI);
                        this.couldXuLi = true;
                    }, 1)
                }
            }
        }
        else {
            this.xuLiDuration = 0;
            this.shuiPaoBig.scale = 0;
            if (!this.isAI)
                AD.xuLiBtn.xuLi(0);
        }
    },

    moveFunc(dt) {
        if (!AD.gameScene.couldMoveCamera) {
            this.playAct("待机");
            return;
        }
        if (AD.gameScene.gameOver) return;
        if (this.actingIsBaoTi || this.hp <= 0 || this.xuLing || this.ballBg.active) return;

        if (this.node.scaleX > 0)
            this.hpDi.scaleX = 1;
        else
            this.hpDi.scaleX = -1;

        this.moveRate = 1;
        if (this.isAI) {
            if (this.jumpDuration > 0)
                this.jumpDuration -= dt;
            this.stopDuration -= dt;
            if (this.stopDuration > 0) {
                this.moveRate = 0;
                if (this.stopDuration <= 0) {

                }
            }
            else if (this.stopDuration <= -6) {
                this.stopDuration = Tools.random(150, 200) * 0.01;
            }

            //最低优先级--没有敌人 也没有队友
            if (this.friendNode == null && this.enemyNode == null) {//(优先级:4)
                this.couldShoot = false;
                this.direction = this.directionBig;



                this.moveDurationSmall -= dt;
                if (this.moveDurationSmall > 0)
                    this.direction = -this.directionBig;
                else if (this.moveDurationSmall <= -10) {
                    this.moveDurationSmall = Tools.random(2, 5);
                }
            }
            //有敌人
            if (this.enemyNode) {//(优先级:3)
                this.enemyNode.x > this.node.x ?
                    this.direction = 1 :
                    this.direction = -1;
                this.couldShoot = true;//开火
                this.moveRate = 0.5;

                if (this.enemyNode.getComponent("playerPVP").ball.active)//敌人处于 球形状态---处决(优先级:2)
                {
                    this.moveRate = 1;
                    this.couldShoot = false;//不能开火
                }
                else {
                    if (this.shouLeiNum > 0)
                        this.rengLeiFunc();
                }
            }
            //有队友在射程范围内
            if (this.friendNode) {
                if (this.friendNode.getComponent("playerPVP").ball.active) {//队友是球形状态---救援目标(优先级:2)
                    this.friendNode.x > this.node.x ?
                        this.direction = 1 :
                        this.direction = -1;
                    this.moveRate = 1;
                    if (this.enemyNode) {//同时又有敌人
                        if (this.enemyNode.getComponent("playerPVP").ball.active) {//并且敌人也是球形状态
                            if (Math.abs(this.enemyNode.x - this.node.x) < Math.abs(this.friendNode.x - this.node.x)) {//进行距离判断--处决目标离得更近---处决目标(优先级:1)
                                this.enemyNode.x > this.node.x ?
                                    this.direction = 1 :
                                    this.direction = -1;
                            }
                        }
                    }
                }
            }
        }


        this.node.scaleX = this.direction * this.scaleRate;//转向
        if (this.couldMove && AD.gameScene.beginNow) {
            var _vx = this.moveSpeed * dt * this.direction * this.moveRate;

            this.node.x += _vx;
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1)
                if (_vx != 0)
                    this.playAct("移动");
                else
                    this.playAct("待机");
        }
        else {
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1)
                this.playAct("待机");
        }
    },
    jumpFunc() {
        if (this.isAI)
            if (this.jumpDuration > 0) return;
        if (this.xuanYunDuration > 0) return;
        if (AD.gameScene.gameOver) return;
        if (this.hp <= 0 || !this.couldJump || this.actingIsBaoTi || this.xuLing) return;
        if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
            this.jumping = true;
            this.playAct("跳跃");
            AD.audioMng.playSfx("跳跃");
            this.jumpDuration = 1;
            this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0, this.li * this.jumpForceRate * this.scaleRate * this.scaleRate),
                this.node.getComponent(cc.RigidBody).getWorldCenter(), true);


        }
    },
    createBtFunc(dt) {
        if (AD.gameScene.gameOver || this.hp <= 0) return;
        if (this.couldShoot) {
            if (this.shootDurationTemp <= 0) {
                this.createBt();



                this.shootDurationTemp = this.shootDuration;
            }
        }
        if (this.shootDurationTemp > 0)
            this.shootDurationTemp -= dt;
    },
    createBt() {
        if (AD.gameScene.gameOver) return;
        if (this.actingIsBaoTi || this.xuLing) return;
        if (this.btNum <= 0) {
            if (this.showTipsNoBtDuration <= 0) {
                cc.director.emit("系统提示", "水枪没水了");
                this.showTipsNoBtDuration = 2;
            }

            return;
        }

        if (Math.abs(this.node.x - AD.gameScene.camera.x) < 600) {
            if (this.gunType != 2)
                AD.audioMng.playSfx("枪声");
            else
                AD.audioMng.playSfx("蓄力发射");
        }

        cc.tween(this.shootPoint.parent)
            .to(0.05, { x: this.gunX - 20 })
            .to(0.05, { x: this.gunX })
            .start();

        this.btNum--;
        AD.gameScene.hadShoot = true;
        this.waterNum.fillRange = this.btNum / this.btNumSum;
        var _pos = this.shootPoint.parent.convertToWorldSpaceAR(cc.v2(this.shootPoint.x + 140, this.shootPoint.y));
        var _btPos = AD.playerBtMng.node.convertToNodeSpaceAR(_pos);


        var _randomAngle = this.shootRandomAngle;//随机角度的上下限 绝对值
        switch (this.gunType) {
            case 0://普通连发水枪
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                this.effectFire.play("effectShoot1");
                break;
            case 1://发射黄色水泡  射速快
                this.effectFire.play("effectShoot3");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                break;
            case 2://散射水泡   射速较慢
                _randomAngle = 0.1;//不受表格控制
                this.effectFire.play("effectShoot1");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + 4.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction - 4.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + 1.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction - 1.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                break;
            case 3://子弹很多
                this.effectFire.play("effectShoot2");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                break;
            case 4://发射两排子弹
                this.effectFire.play("effectShoot3");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, cc.v2(_btPos.x, _btPos.y + 5), this.isEnemy, this.hurtRate);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, cc.v2(_btPos.x, _btPos.y - 5), this.isEnemy, this.hurtRate);
                break;
            case 5://散射+连发水枪
                this.effectFire.play("effectShoot3");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + 3 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction - 3 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos, this.isEnemy, this.hurtRate);
                break;
        }
    },

    //脚下的烟雾
    smokeFunc(..._isJump) {
        if (this.smokeHeight < 10) return;
        this.smokeHeight = 0;
        this.smokePlayerYJiLu = this.node.y;
        var _tempY = 0;
        if (_isJump[0])
            _tempY = -16;
        this.smoke.position = cc.v2(this.node.x, this.node.y - 48 + _tempY);
        this.smoke.children[0].getComponent(cc.ParticleSystem).resetSystem();
        this.smoke.children[1].getComponent(cc.ParticleSystem).resetSystem();
    },
    //被攻击
    beHurt(_hurtNum, ..._isRight) {
        if (AD.gameScene.gameOver) return;
        if (this.hp <= 0) return;
        // if (this.wuDiDurationTemp > 0) return;
        // this.wuDiDurationTemp = this.wuDiDuration;//进入无敌
        this.hp -= _hurtNum;
        this.beHurtDuration = 3;
        // AD.audioMng.playSfx("受伤");
        this.hpBar.fillRange = this.hp / this.hpSum;
        if (this.hp <= 0) {
            this.dieFunc();
            AD.audioMng.playSfx("受伤");

            var _speedX = 0;
            if (_isRight[0] == true)
                _speedX = -1
            else if (_isRight[0] == false)
                _speedX = 1
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(_speedX * 100, 800);
            this.saveDuration = 2;
            return;
        }



        // cc.tween(this.node)
        //     .repeat(6,
        //         cc.tween()
        //             .to(0.1, { opacity: 0 })
        //             .to(0.1, { opacity: 255 })
        //             .delay(0.3)
        //     )
        //     .call(() => {
        //         this.wuDiDurationTemp = 0;//无敌时间结束
        //         console.log("无敌时间结束")
        //     })
        //     .start();
    },
    //死亡
    dieFunc() {
        //5秒后自动爆炸
        this.scheduleOnce(() => {
            if (this.ball.active) {
                this.tiBaoFunc(0);
            }
        }, 5)

        this.gunNode.active = this.armNode.active = false;
        this.node.getComponent(cc.PhysicsCircleCollider).radius = 80;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
        this.ball.active = true;
        this.ballBg.active = true;
        this.body.opacity = 130;
        this.animWater.node.opacity = 130;
        this.hpDi.active = false;
        if (!this.isAI) {
            // AD.audioMng.playSfx("变成泡泡");
            // AD.audioMng.playSfx("水泡状态");
        }

        this.playAct("泡泡");


    },

    //踢爆
    tiBaoFunc(_direction) {
        this.baoTiTargetNpc = null;
        this.node.getComponent(cc.RigidBody).gravityScale = 2;//角度衰减值
        this.playAct("待机");
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
        this.node.getComponents(cc.PhysicsBoxCollider)[0].enabled = false;
        this.node.getComponents(cc.PhysicsBoxCollider)[1].enabled = false;
        if (this.ball.active) {
            cc.director.emit("分数变化", !this.isEnemy);
            this.ball.active = false;
        }
        this.ballBg.active = false;
        this.body.opacity = 255;
        this.animWater.node.opacity = 255;

        this.node.getComponent(cc.RigidBody).linearDamping = 0.5;//速度衰减值
        this.node.getComponent(cc.RigidBody).angularDamping = 0.5;//速度衰减值


        var _a = Tools.random(0, 1);
        if (_a == 0)
            _a = -1;


        if (_direction == 0) {//踩爆
            // if (!this.isAI)
            //     AD.audioMng.stopSfx("水泡状态");
            AD.audioMng.playSfx("踢爆泡泡");
            AD.audioMng.playSfx("击飞");
            // if (!this.isAI)
            cc.director.emit("击杀效果", "踩爆", this.node.position);
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 800);

            var _a = Tools.random(0, 1);
            if (_a == 0)
                _a = -1;

            cc.tween(this.node)
                .by(2, { angle: 1000 * _a })
                .delay(2)
                .call(() => {
                    this.reviveFunc();
                })
                .start();
        }
        else {//踢爆
            // if (!this.isAI)
            //     AD.audioMng.stopSfx("水泡状态");
            AD.audioMng.playSfx("踢爆泡泡");
            // if (this.node.y > AD.playerNow.y + 20) {

            //     cc.director.emit("击杀效果", "空接");
            // }
            // else
            {
                // if (this.isAI)
                cc.director.emit("击杀效果", "踢爆", this.node.position);
            }
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(800 * _direction, 1400);
            cc.tween(this.node)
                .by(2, { angle: 1500 * -_direction })
                .delay(2)
                .call(() => {
                    // this.node.destroy();
                    this.reviveFunc();
                })
                .start();
        }

        //爆出金币
        // AD.propMng.createCoinBombOut(this.node.position, AD.npcData[this.type].Npc_GoldNum);
        AD.propMng.createEffectPaoBomb(this.node.position);//特效--泡泡破碎


    },
    reviveFunc(...help) {

        if (help[0]) {//被救活
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 600);
            AD.propMng.createEffectPaoBomb(this.node.position);//特效--泡泡破碎
            // if (!this.isAI)
            //     AD.audioMng.stopSfx("水泡状态");
            AD.audioMng.playSfx("踢爆泡泡");
        }
        else {//自动复活
            // this.node.x = 0;
            // this.node.y = 0;
            this.node.position = AD.mapMng.revivePosArr[this.index];
            this.btNum = this.btNumSum;
            this.waterNum.fillRange = this.btNum / this.btNumSum;
            this.shouLeiNum = 1;
            if (!this.isAI)
                cc.director.emit("手雷数量变化", this.shouLeiNum);
        }

        this.actingIsBaoTi = false;//正在播放"爆踢"动作?
        this.gunNode.active = this.armNode.active = true;
        this.node.getComponent(cc.RigidBody).gravityScale = 3;//角度衰减值
        this.node.getComponent(cc.PhysicsCircleCollider).radius = 35;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
        this.node.angle = 0;
        this.node.getComponent(cc.RigidBody).linearDamping = 0;//速度衰减值
        this.node.getComponent(cc.RigidBody).angularDamping = 0;//速度衰减值
        this.hp = this.hpSum;
        this.hpDi.active = true;
        this.hpBar.fillRange = this.hp / this.hpSum;
        this.playAct("待机");
        this.node.getComponent(cc.PhysicsCircleCollider).enabled = true;
        this.node.getComponents(cc.PhysicsBoxCollider)[0].enabled = true;
        this.node.getComponents(cc.PhysicsBoxCollider)[1].enabled = true;
        this.ball.active = false;
        this.ballBg.active = false;
        this.body.opacity = 255;
        this.animWater.node.opacity = 255;
        // cc.tween(this.node)
        //     .repeat(6,
        //         cc.tween()
        //             .to(0.1, { opacity: 0 })
        //             .to(0.1, { opacity: 255 })
        //             .delay(0.3)
        //     )
        //     .call(() => {
        //         this.wuDiDurationTemp = 0;//无敌时间结束
        //         console.log("无敌时间结束")
        //     })
        //     .start();
        // if (this.dieReasonIsRiver) {
        //     this.dieReasonIsRiver = false;
        //     this.node.position = AD.mapMng.getRevivePos();
        // }
    },
    playAct(_name) {
        switch (_name) {
            case "爆踢":
                if (this.anim.animation != "tishuipao" && this.hp > 0) {
                    this.anim.setAnimation(0, "tishuipao", false);
                    // if (!this.isAI)
                    this.actingIsBaoTi = true;//正在播放"爆踢"动作?
                    this.animWater.setAnimation(0, "tishuipao", false);
                }
                break;
            case "待机":
                if (this.anim.animation != "daiji" && this.hp > 0) {
                    this.anim.setAnimation(0, "daiji", true);
                    this.animWater.setAnimation(0, "daiji", true);
                }
                break;
            case "移动":
                if (this.anim.animation != "yidong" && this.hp > 0) {
                    this.anim.setAnimation(0, "yidong", true);
                    this.animWater.setAnimation(0, "yidong", true);
                }
                break;
            case "跳跃":
                if (this.anim.animation != "tiao" && this.hp > 0) {
                    this.anim.setAnimation(0, "tiao", false);
                    this.animWater.setAnimation(0, "tiao", false);
                }
                break;
            case "死亡":
                if (this.anim.animation != "siwang") {
                    this.anim.setAnimation(0, "siwang", false);
                    this.animWater.setAnimation(0, "siwang", false);
                }
                break;
            case "蓄力开火":
                if (this.anim.animation != "fire") {
                    this.anim.setAnimation(0, "fire", false);
                    this.animWater.setAnimation(0, "fire", false);
                }
                break;
            case "蓄力中":
                if (this.anim.animation != "xuli") {
                    this.anim.setAnimation(0, "xuli", true);
                    this.animWater.setAnimation(0, "xuli", true);
                    console.log("蓄力动作")
                }
                break;
            case "泡泡":
                if (this.anim.animation != "paopao") {
                    this.anim.setAnimation(0, "paopao", true);
                    this.animWater.setAnimation(0, "paopao", true);
                }
                break;
        }
    },
    jumpForceNow() {

        this.playAct("跳跃");
        // this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0, 15000 * this.jumpForceRate * this.scaleRate * this.scaleRate),
        //     this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (selfCollider.tag == 2) {//烟雾触发器
            //    var _playerY = selfCollider.node.parent.convertToWorldSpaceAR(selfCollider.node.position)
            //    var _otherY = otherCollider.node.parent.convertToWorldSpaceAR(otherCollider.node.position)
            //    console.log("selfCollider.node " +_playerY)
            //    console.log("otherCollider.node " +_otherY)
            //     if(_playerY>_otherY)
            this.smokeFunc();
            this.couldJump = true;
        }
        if (otherCollider.tag == 10) {
            this.beHurt();
        }

    },
    onEndContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.tag == 2) {//烟雾触发器
            this.smokeFunc(true);
            // this.couldJump = false;
        }

    },

    onPreSolve: function (contact, selfCollider, otherCollider) {

    },

    onCollisionEnter(other, self) {
        if (other.tag == 11) {
            // this.beHurt();
            if (Math.abs(this.node.x - other.node.parent.x) <
                this.node.width * Math.abs(this.node.scaleX) * 0.5 + other.node.parent.width * Math.abs(other.node.parent.scaleX) * 0.5) {
                if (this.node.y > other.node.parent.y) {
                    var _playerJS = other.node.parent.getComponent("playerPVP");
                    if (_playerJS) {
                        if (_playerJS.ball.active && this.isEnemy != _playerJS.isEnemy) {
                            console.log("击败信息 1111111");
                            _playerJS.tiBaoFunc(0);
                            cc.director.emit("击败信息", this.nameNow, other.node.parent.getComponent("playerPVP").nameNow, this.isEnemy);
                            this.jumpForceNow();
                        }
                    }
                    // other.node.parent.getComponent("playerPVP").tiBaoFunc(0);
                }
            }
        }
    },
    //普通碰撞
    onCollisionStay(other, self) {

        if (this.isAI) {
            if (self.tag == 777 && other.tag == 777) {//角色之间撞到了
                var _playerJS = other.node.getComponent("playerPVP");
                if (_playerJS) {
                    if (this.index > _playerJS.index) {
                        this.jumpFunc();
                    }
                }
                // if (this.node.x > other.node.x) {


                // }
            }
            if (other.tag == 666) {//碰到角色
                var _playerJS = other.node.getComponent("playerPVP");
                if (_playerJS) {
                    if (this.isEnemy == _playerJS.isEnemy) {
                        this.friendNode = other.node;
                    }
                    else
                        this.enemyNode = other.node;
                }
            }
            if (self.tag == 1) {//碰到身体本身碰撞框
                //边界
                if (other.tag == 886) {//转向向右
                    this.directionBig = 1;
                    this.moveDurationSmall = -Tools.random(3, 5);
                }
                else if (other.tag == 888) {//转向向左
                    this.directionBig = -1;
                    this.moveDurationSmall = -Tools.random(3, 5);
                }

                if (other.tag == 99) {//跳跃触发器
                    this.jumpFunc();
                }
                if (other.tag == 10) {//碰到NPC的(子节点)球形碰撞框 左半框
                    var _playerJS = other.node.parent.getComponent("playerPVP");
                    var _isSelfNode = (other.node.parent == this.node);
                    if (_playerJS && !_isSelfNode) {
                        if (this.isEnemy == _playerJS.isEnemy) {//自己人
                            // _playerJS.ball.active = false;
                            if (this.hp > 0 && _playerJS.saveDuration <= 0) {
                                if (_playerJS.ball.active)
                                    _playerJS.reviveFunc(true);
                            }
                        }
                        else {//敌人
                            if (this.node.x > other.node.parent.x && this.direction < 0) {
                                if (!this.couldShoot) {
                                    if (this.anim.animation != "tishuipao") {
                                        this.baoTiTargetNpc = other.node.parent;
                                        this.playAct("爆踢");
                                    }
                                }
                            }
                            else if (this.node.x < other.node.parent.x && this.direction > 0) {
                                if (!this.couldShoot) {
                                    if (this.anim.animation != "tishuipao") {
                                        this.baoTiTargetNpc = other.node.parent;
                                        this.playAct("爆踢");
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        else {
            if (other.tag == 10 && self.tag == 1) {//碰到NPC的球形碰撞框 左半框
                var _playerJS = other.node.parent.getComponent("playerPVP");
                var _isSelfNode = (other.node.parent == this.node);
                if (_playerJS && !_isSelfNode) {
                    if (this.isEnemy == _playerJS.isEnemy) {//自己人
                        if (_playerJS.saveDuration <= 0 && this.hp > 0) {
                            _playerJS.ball.active = false;
                            _playerJS.reviveFunc(true);
                        }

                    }
                    else {//敌人

                        if (this.node.x > other.node.parent.x && this.direction < 0) {
                            if (!this.couldShoot) {
                                cc.director.emit("变成爆踢", other.node.parent);//把踢爆对象传进去
                            }
                        }
                        else if (this.node.x < other.node.parent.x && this.direction > 0) {
                            if (!this.couldShoot)
                                cc.director.emit("变成爆踢", other.node.parent);//把踢爆对象传进去
                        }
                        else
                            cc.director.emit("变成射击");
                    }
                }

            }
        }
    },
    //普通碰撞
    onCollisionExit(other, self) {

        if (this.isAI) {
            if (other.tag == 666) {//碰到角色
                var _playerJS = other.node.getComponent("playerPVP");
                if (_playerJS) {
                    if (this.isEnemy == _playerJS.isEnemy) {
                        this.friendNode = null;
                    }
                    else
                        this.enemyNode = null;

                }
            }
        }
        else {
            if (other.tag == 10 && self.tag == 1) {//碰到NPC的球形碰撞框
                cc.director.emit("变成射击");
            }
        }
    },
    gemeOverFunc() {
        // this._swirlEffect = new sp.VertexEffectDelegate();
        // this._swirlEffect.initSwirlWithPowOut(0, 2);


        // this._jitterEffect = new sp.VertexEffectDelegate();
        // this._jitterEffect.initJitter(20, 20);

        // // this.anim.setVertexEffectDelegate(this._swirlEffect);//效果1
        // this.anim.setVertexEffectDelegate(this._jitterEffect);//效果2
    },

    resetSkin() {
        this.skinType = Tools.random(1, 10);
        if (!this.isAI)
            this.skinType = (this.playerType + 1);

        this.anim.setSkin("js_" + this.skinType);
    },

    resetGun() {

        if (this.isAI) {
            var _rateArr = [30, 25, 20, 15];
            this.gunType = Tools.random(0, 4);
            var _sum = 0;
            for (var i = 0; i < _rateArr.length; i++) {
                _sum += _rateArr[i];

            }
            var _num = 0;
            var _targetNum = Tools.random(0, _sum);
            var _targetIndex = -1;
            for (var i = 0; i < _rateArr.length; i++) {
                _num += _rateArr[i];
                if (_targetNum <= _num) {
                    this.gunType = i;
                    break;
                }
            }

        }
        this.shootPoint.parent.getComponent(cc.Sprite).spriteFrame = AD.gunIconArr[this.gunType];

        this.shootPosArr = [cc.v2(305, 16), cc.v2(308, 44), cc.v2(332, -3), cc.v2(320, -32), cc.v2(320, 37), cc.v2(340, -11)];
        this.shootPoint.position = this.shootPosArr[this.gunType];
        this.gunX = this.shootPoint.parent.x;

        //枪支相关

        this.shootDuration = AD.gunData[this.gunType].Gun_Firerate;//攻击间隔
        this.shootRandomAngle = AD.gunData[this.gunType].Gun_Accurate;//攻击随机角度
        this.btNumSum = this.btNum = parseInt(AD.gunData[this.gunType].Gun_Ammo / 2);//子弹数量
        this.xuLiDurationSum = 0.7//1.5;//蓄力需要的时长
        this.waterNum.fillRange = this.btNum / this.btNumSum;
    },
});
