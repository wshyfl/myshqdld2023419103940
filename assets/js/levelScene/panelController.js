

cc.Class({
    extends: cc.Component,

    properties: {
        levelItem: cc.Prefab,
    },

    onLoad() {
        this.bgIndex = 0; this.bgIndexTemp = -1;
    },

    start() {

        this.initTouch();

        this.init();
    },
    initTouch() {
        cc.find("Canvas/touchNode").on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.find("Canvas/touchNode")._touchListener.setSwallowTouches(false);
            
            if (this.node.angle > this.bianJieMaxAngle || this.node.angle <this.bianJieMinAngle)return;
            this.timeStart = Tools.getDate("millisecond")
            this.posStart = event.getLocation();
            this.moveState = 1;
            this.guanXingSpeed = 0;
            AD.panelController.zhuanDonging = false;
            this.offset = 0;
        }, this);
        cc.find("Canvas/touchNode").on(cc.Node.EventType.TOUCH_MOVE, (event) => {
          
            if (this.node.angle > this.bianJieMaxAngle || this.node.angle <this.bianJieMinAngle)return;
            this.moveState = 1;
            this.distanceX -= event.getDelta().x;
            this.offset += event.getDelta().x;
            // if (this.distanceX < 0)
            //     this.distanceX = 0;

        }, this);
        cc.find("Canvas/touchNode").on(cc.Node.EventType.TOUCH_CANCEL, (event) => {


            AD.panelController.zhuanDonging = (this.offset != 0);
            //计算惯性
            this.guanXingSpeed = (event.getLocation().x - this.posStart.x) / (Tools.getDate("millisecond") - this.timeStart) * 10;
            this.moveState = 0;
            if (this.guanXingSpeed > this.maxSpeed)
                this.guanXingSpeed = this.maxSpeed;
            else if (this.guanXingSpeed < -this.maxSpeed)
                this.guanXingSpeed = -this.maxSpeed;
        }, this);
        cc.find("Canvas/touchNode").on(cc.Node.EventType.TOUCH_END, (event) => {
            AD.panelController.zhuanDonging = (this.offset != 0);
            //计算惯性
            this.guanXingSpeed = (event.getLocation().x - this.posStart.x) / (Tools.getDate("millisecond") - this.timeStart) * 10;
            this.moveState = 0;
            if (this.guanXingSpeed > this.maxSpeed)
                this.guanXingSpeed = this.maxSpeed;
            else if (this.guanXingSpeed < -this.maxSpeed)
                this.guanXingSpeed = -this.maxSpeed;

            console.log("当前角度是 " + this.node.angle);
        }, this);
    },
    update(dt) {

        switch (this.moveState) {
            case 0://松手=>惯性运动
                this.distanceX -= this.guanXingSpeed;
                if (this.guanXingSpeed > 0) {
                    if (this.angleNow > this.minAngle && this.angleNow < this.maxAngle)
                        this.guanXingSpeed -= this.reduceRate * dt;
                    else
                        this.guanXingSpeed -= this.reduceRateOut * dt;

                    if (this.guanXingSpeed <= 0) {
                        this.guanXingSpeed = 0;
                        if (this.angleNow < this.minAngle) {
                            this.moveState = 2;
                        }
                    }
                }
                else if (this.guanXingSpeed < 0) {
                    if (this.angleNow > this.minAngle && this.angleNow < this.maxAngle)
                        this.guanXingSpeed += this.reduceRate * dt;
                    else
                        this.guanXingSpeed += this.reduceRateOut * dt;
                    if (this.guanXingSpeed >= 0) {
                        this.guanXingSpeed = 0;
                        if (this.angleNow > this.maxAngle) {
                            console.log("bbb")
                            this.moveState = 2;
                        }
                    }
                }

                this.angleNow = this.distanceX / this.angleToMoveRate;
                this.node.angle = this.angleNow;
                break;
            case 1://1 手指按下=>固定转动
                this.angleNow = this.distanceX / this.angleToMoveRate;

                this.node.angle = this.angleNow;
                break;
            case 2://超出边界=>回退运动
                this.moveState = -1;
                var _targetAngle = this.minAngle;
                if (this.angleNow > this.maxAngle)
                    _targetAngle = this.maxAngle;


                var _duration = Math.abs(this.angleNow - _targetAngle) / this.forceOut;
                cc.tween(this.node)
                    .to(_duration, { angle: _targetAngle }, { easing: "sineInOut" })
                    .call(() => {

                        this.distanceX = this.node.angle * this.angleToMoveRate;
                    })
                    .start();
                break;
        }


        this.changeBg();
    },
    init() {
        var _levelNow = globalData.getLevel();
        var _levelNumSum = 40;//总关数

        var _angleDuration = 4;//间隔角度
        var _offsetAngle = 8;

        this.guanXingSpeed = 0;//惯性速度

        this.angleNow = _levelNow * _angleDuration - _offsetAngle;//当前角度
        this.moveState = 0;//0 惯性转动 1 手指按下=>固定转动  2 超出边界=>回退运动
        this.angleToMoveRate = 50;//滑动距离与角度变化的 兑换 比例==>越大 角度变化越慢


        this.maxSpeed = 60;//最大转速
        this.reduceRate = 50;//减速度
        this.reduceRateOut = 200;//超出边界的减速度
        this.forceOut = 40;//超出边界后 恢复力(矫正角度的力度)

        this.bianJieMaxAngle = 160;//边界最大角度
        this.bianJieMinAngle = -20;//边界最小角度



        AD.panelController = this;
        AD.panelController.zhuanDonging = false;



        //生成按钮
        var _radius = 3500 - 60;//半径
        this.minAngle = 0;//最小角度
        this.maxAngle = _levelNumSum * _angleDuration - 18;//最大角度

        if (this.angleNow > this.maxAngle) this.angleNow = this.maxAngle;
        if (this.angleNow < this.minAngle) this.angleNow = this.minAngle;
        this.distanceX = this.angleNow * this.angleToMoveRate;

        for (var i = 0; i < _levelNumSum; i++) {
            var _levelItem = cc.instantiate(this.levelItem);
            _levelItem.parent = this.node;
            var _x = Math.sin(Tools.angleToRadian(i * _angleDuration - _offsetAngle)) * _radius;
            var _y = Math.cos(Tools.angleToRadian(i * _angleDuration - _offsetAngle)) * _radius;
            _levelItem.position = cc.v2(_x, _y);
            _levelItem.angle = -i * _angleDuration + _offsetAngle;
            _levelItem.getComponent("levelItem").reset(i);

        }
    },
    changeBg() {

        if (this.node.angle > 30 && this.node.angle <= 70)
            this.bgIndex = 1;
        else if (this.node.angle > 70 && this.node.angle <= 110)
            this.bgIndex = 2;
        else if (this.node.angle > 110 && this.node.angle <= 200)
            this.bgIndex = 3;
        else
            this.bgIndex = 0;
        if (this.bgIndex != this.bgIndexTemp) {
            this.bgIndexTemp = this.bgIndex;
            cc.director.emit("切换背景", this.bgIndexTemp);
        }
    },
});
