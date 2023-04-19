

cc.Class({
    extends: cc.Component,

    properties: {
        shootPoint: cc.Node,
        body: cc.Node,
        shuiPaoBig: cc.Node,
        waterNum: cc.Sprite,
        effectFire: cc.Animation,
        isPlaying: false,
        li: 13000,
    },
    onLoad() {
        this.beginNow = false;
        this.jumpForceRate = 1;//起跳力道 比例
        this.animWater = cc.find("water", this.node).getComponent(sp.Skeleton);
        this.anim = this.body.getComponent(sp.Skeleton);
        this.playAct("待机");
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



        if (this.isPlaying) {
            this.init();
            AD.playerNow = this.node;
        }

        this.resetSkin();

        this.gunType = globalData.gunType;
        this.resetGun();
        this.dieReasonIsRiver = false;//掉进河里死亡的吗?
    },

    start() {


    },
    init() {
        this.hp = this.hpSum = 3;//血量
        this.moveSpeed = 350;//移速
        this.initConst();
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
        cc.director.on("玩家走", (_direction) => {
            if (this.actingIsBaoTi || this.hp <= 0 || !this.beginNow) return;
            this.couldMove = true;
            this.direction = _direction;
            this.node.scaleX = this.direction * this.scaleRate;
        }, this);
        cc.director.on("玩家停", () => {
            this.couldMove = false;
        }, this);
        cc.director.on("玩家跳", () => {
            if (this.beginNow)
                this.jumpFunc();
        }, this);
        cc.director.on("开始射击", () => {
            if (!this.beginNow) return;
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
        this.xuLing = false;
        this.couldXuLi = true;
        this.xuLiDuration = 0;
        cc.director.on("蓄力", (_num) => {
            if (this.actingIsBaoTi || !this.couldXuLi || !this.beginNow) return;
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
                if (this.xuLing == false) {
                    AD.audioMng.playSfx("蓄力");
                    cc.director.emit("显示蓄力特效");
                }
                this.xuLing = true;
            }
        }, this);
        cc.director.on("蓄力抬起", (_num) => {

            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
                this.couldXuLi = true;
                this.xuLing = false;
                AD.audioMng.stopSfx("蓄力");
                cc.director.emit("停止蓄力特效");
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
        this.jingZhiIngDuration = 0;
        cc.director.on("星星数量变化", () => {
            // if (this.anim.animation == "tiao") 
            {
                this.jingZhiIngDuration = 0.5;
                this.node.getComponent(cc.RigidBody).gravityScale = 1;
                this.jingZhiIngPos = this.node.position;
                cc.director.getScheduler().setTimeScale(0.1);
                this.scheduleOnce(() => {
                    cc.director.getScheduler().setTimeScale(1);
                    this.jingZhiIngDuration = 0;
                    this.node.getComponent(cc.RigidBody).gravityScale = 3;
                }, 0.05)
            }
        }, this);

        this.biggerDuration = 0;
        this.smallDuration = 0;
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

        //---帧事件 监听
        this.anim.setEventListener((a, evt) => {

            if (evt.data.name == "ti") {//爆踢==>NPC挨踢
                if (AD.baoTiTargetNpc)
                    AD.baoTiTargetNpc.getComponent("npc").dieFunc(self.direction);
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


    },
    update(dt) {


        if (!this.isPlaying || !this.isPlaying || AD.gameScene.gameOver || !this.beginNow) return;
        this.moveFunc(dt);
        //攻击
        this.createBtFunc(dt);
        //蓄力
        this.xuLiFunc(dt);
        //大小
        this.scaleFunc(dt);
        if (this.jingZhiIngDuration > 0) {
            this.node.position = this.jingZhiIngPos;
            // this.jingZhiIngDuration -= dt;
        }
        if (this.smokeHeight < 10) {
            if (Math.abs(this.smokePlayerYJiLu - this.node.y) > 10) {
                this.smokeHeight = 10;
            }
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
            AD.xuLiBtn.xuLi(this.xuLiDuration / this.xuLiDurationSum);
            if (this.xuLiDuration >= this.xuLiDurationSum) {
                this.couldXuLi = false;
                console.log("蓄力完成");
                this.shuiPaoBig.scale = 0;
                this.playAct("蓄力开火");
                // this.effectFire.play("effectShoot0");
                var _pos = this.shuiPaoBig.parent.convertToWorldSpaceAR(this.shuiPaoBig.position);
                var _btPos = AD.playerBtMng.node.convertToNodeSpaceAR(_pos);
                cc.director.emit("生成大泡泡", cc.v2(_btPos.x + 50 * this.node.scaleX, _btPos.y), this.direction, this.scaleRate);
            }
        }
        else {
            this.xuLiDuration = 0;
            this.shuiPaoBig.scale = 0;

            AD.xuLiBtn.xuLi(0);
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

        if (this.gunType != 2)
            AD.audioMng.playSfx("枪声");
        else
            AD.audioMng.playSfx("蓄力发射");

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
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                this.effectFire.play("effectShoot1");
                break;
            case 1://发射黄色水泡  射速快
                this.effectFire.play("effectShoot3");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
            case 2://散射水泡   射速较慢
                _randomAngle = 0.1;//不受表格控制
                this.effectFire.play("effectShoot1");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + 4.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction - 4.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + 1.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction - 1.5 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
            case 3://子弹很多
                this.effectFire.play("effectShoot2");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
            case 4://发射两排子弹
                this.effectFire.play("effectShoot3");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, cc.v2(_btPos.x, _btPos.y + 5));
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, cc.v2(_btPos.x, _btPos.y - 5));
                break;
            case 5://散射+连发水枪
                this.effectFire.play("effectShoot3");
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction + 3 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                AD.playerBtMng.createBt(this.gunType, -90 * this.direction - 3 + Tools.random(-_randomAngle * 10, _randomAngle * 10) * 0.1, _btPos);
                break;
        }
    },

    moveFunc(dt) {
        if( !AD.gameScene.couldMoveCamera){
            this.playAct("待机");
            return;
        }
        if (AD.gameScene.gameOver) return;
        if (this.actingIsBaoTi || this.hp <= 0 || this.xuLing) return;
        if (this.couldMove && AD.gameScene.beginNow) {
            this.node.x += this.moveSpeed * dt * this.direction;
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1)
                this.playAct("移动");
        }
        else {
            if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1)
                this.playAct("待机");
        }
    },
    jumpFunc() {
        if (AD.gameScene.gameOver) return;
        if (this.hp <= 0 || !this.couldJump || this.actingIsBaoTi || this.xuLing) return;
        if (Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y) <= 1) {
            this.jumping = true;
            this.playAct("跳跃");
            AD.audioMng.playSfx("跳跃");
            this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0, this.li * this.jumpForceRate * this.scaleRate * this.scaleRate),
                this.node.getComponent(cc.RigidBody).getWorldCenter(), true);


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
    beHurt(..._isRight) {
        if (AD.gameScene.gameOver) return;
        if (this.wuDiDurationTemp > 0) return;
        this.wuDiDurationTemp = this.wuDiDuration;//进入无敌
        cc.director.emit("掉血", this.hp);
        this.hp--;
        AD.audioMng.playSfx("受伤");
        if (this.hp <= 0) {
            this.dieFunc();
            return;
        }

        var _speedX = 0;
        if (_isRight[0] == true)
            _speedX = -1
        else if (_isRight[0] == false)
            _speedX = 1
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(_speedX * 100, 800);
        cc.tween(this.node)
            .repeat(6,
                cc.tween()
                    .to(0.1, { opacity: 0 })
                    .to(0.1, { opacity: 255 })
                    .delay(0.3)
            )
            .call(() => {
                this.wuDiDurationTemp = 0;//无敌时间结束
                console.log("无敌时间结束")
            })
            .start();
    },
    //死亡
    dieFunc() {
        this.playAct("死亡");
        cc.director.emit("展示复活二级窗");


    },
    reviveFunc() {
        this.hp = this.hpSum;


        this.playAct("待机");
        cc.tween(this.node)
            .repeat(6,
                cc.tween()
                    .to(0.1, { opacity: 0 })
                    .to(0.1, { opacity: 255 })
                    .delay(0.3)
            )
            .call(() => {
                this.wuDiDurationTemp = 0;//无敌时间结束
                console.log("无敌时间结束")
            })
            .start();
        if (this.dieReasonIsRiver) {
            this.dieReasonIsRiver = false;
            this.node.position = AD.mapMng.getRevivePos();
        }
    },
    playAct(_name) {
        switch (_name) {
            case "爆踢":
                if (this.anim.animation != "tishuipao" && this.hp > 0) {
                    this.anim.setAnimation(0, "tishuipao", false);
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
        }
        if (otherCollider.tag == 10) {
            this.beHurt();
        }
        else if (otherCollider.tag == 11) {
            // this.beHurt();
            if (Math.abs(this.node.x - otherCollider.node.x) <
                this.node.width * Math.abs(this.node.scaleX) * 0.5 + otherCollider.node.width * Math.abs(otherCollider.node.scaleX) * 0.5) {
                if (this.node.y > otherCollider.node.y) {
                    console.log("碰到NPC圆圈");
                    otherCollider.node.getComponent("npc").dieFunc(0);
                    this.jumpForceNow();
                }
                else {
                    if (otherCollider.node.getComponent(cc.RigidBody).linearVelocity.y < 0 && this.dingNpcDuration <= 0) {
                        this.dingNpcDuration = 0.5;
                        this.scheduleOnce(() => {
                            this.dingNpcDuration = 0;
                        }, this.dingNpcDuration)
                        cc.director.emit("成就触发", "杂技高手", 1);
                        otherCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 60);
                        console.log("头顶NPC")
                    }
                }
            }
        }
    },
    onEndContact: function (contact, selfCollider, otherCollider) {
        if (selfCollider.tag == 2) {//烟雾触发器
            this.smokeFunc(true);
        }

    },

    onPreSolve: function (contact, selfCollider, otherCollider) {

    },
    //普通碰撞
    onCollisionStay(other, self) {
        if (other.tag == 10) {//碰到NPC的球形碰撞框 左半框
            if (this.node.x > other.node.parent.x && this.direction < 0) {
                if (!this.couldShoot)
                    cc.director.emit("变成爆踢", other.node.parent);
            }
            else if (this.node.x < other.node.parent.x && this.direction > 0) {
                if (!this.couldShoot)
                    cc.director.emit("变成爆踢", other.node.parent);
            }
            else
                cc.director.emit("变成射击");
        }
    },
    //普通碰撞
    onCollisionExit(other, self) {
        if (other.tag == 10) {//碰到NPC的球形碰撞框
            cc.director.emit("变成射击");

        }
    },
    gemeOverFunc() {
        this._swirlEffect = new sp.VertexEffectDelegate();
        this._swirlEffect.initSwirlWithPowOut(0, 2);


        this._jitterEffect = new sp.VertexEffectDelegate();
        this._jitterEffect.initJitter(20, 20);

        // this.anim.setVertexEffectDelegate(this._swirlEffect);//效果1
        this.anim.setVertexEffectDelegate(this._jitterEffect);//效果2
    },

    resetSkin() {
        this.anim.setSkin("js_" + (this.playerType + 1));

    },

    resetGun() {
        this.shootPoint.parent.getComponent(cc.Sprite).spriteFrame = AD.gunIconArr[this.gunType];

        this.shootPosArr = [cc.v2(305, 16), cc.v2(308, 44), cc.v2(332, -3), cc.v2(320, -32), cc.v2(320, 37), cc.v2(340, -11)];
        this.shootPoint.position = this.shootPosArr[this.gunType];
        this.gunX = this.shootPoint.parent.x;

        //枪支相关

        this.shootDuration = AD.gunData[this.gunType].Gun_Firerate;//攻击间隔
        this.shootRandomAngle = AD.gunData[this.gunType].Gun_Accurate;//攻击随机角度
        this.btNumSum = this.btNum = AD.gunData[this.gunType].Gun_Ammo;//子弹数量
        this.xuLiDurationSum = 1//1.5;//蓄力需要的时长
        this.waterNum.fillRange = this.btNum / this.btNumSum;
    },
});
