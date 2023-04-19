

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
    },

    onLoad() {
        this.itemArr = this.content.children;
        this.itemCount = this.itemArr.length;


        this.ax = 1.5;//加速度
        this.startTime = 0;
        this.duration = 0;
        this.itemW = this.itemArr[0].width;
        this.zheZhaoArr = new Array();

    },

    start() {
        this.worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.viewW = this.content.parent.width / 2;
        this.initTouch();

        this.speed = 0;
        this.pageIndexNow = globalData.roleType;
        
        var _x = -this.itemArr[this.pageIndexNow].x;
        for (var i = 0; i < this.itemCount; i++) {
            this.zheZhaoArr.push(this.itemArr[i].getChildByName("zheZhao"));
            cc.tween(this.itemArr[i])
                .by(0.1, { x: _x }, { easing: "sineInOut" })
                .call()
                .start();
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "左":
                this.btnMove(-1);
                break;
            case "右":
                this.btnMove(1);

                break;
        }
    },
    btnMove(_left) {
        if (this.speed != 0 ) return;
        var _couldMove = false;
        for (var i = 0; i < this.itemCount; i++) {

            console.log("Math.abs(this.itemArr[i].x " +Math.abs(this.itemArr[i].x))
            if (Math.abs(this.itemArr[i].x) < 2) {
                _couldMove = true;
                var _name = this.itemArr[i].name.split('item')[1];
                this.pageIndexNow = parseInt(_name);

                break;
            }
        }

        this.scheduleOnce(()=>{
            this.huiGui();
            
        },0.2)

        if (_couldMove) {
            for (var i = 0; i < this.itemCount; i++) {

                cc.tween(this.itemArr[i])
                    .by(0.1, { x: this.itemW * _left }, { easing: "sineInOut" })
                    .call()
                    .start();
            }
        }
    },
    initTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.guanXing = false;
            this.node._touchListener.setSwallowTouches(false);
            this._offset = 0;
            this.startTime = this.getDate("millisecond");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

            this._offset += event.getDelta().x;

            var _x = event.getDelta().x;

            for (var i = 0; i < this.itemCount; i++) {
                this.itemArr[i].x += _x;
            }
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.duration = this.getDate("millisecond") - this.startTime;
            this.speed = this._offset / this.duration * 10;
            if(this.speed!=0)
            this.guanXing = true;
            console.log(" this.speed   " + this.speed)

        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.duration = this.getDate("millisecond") - this.startTime;
            this.speed = this._offset / this.duration * 10;
            if(this.speed!=0)

            this.guanXing = true;
        }, this)

    },

    huiGui() {
        var _distance = this.itemArr[0].width / 2;
        var _targetItem = null;
        for (var i = 0; i < this.itemCount; i++) {
            if (Math.abs(this.itemArr[i].x) < _distance) {
                _distance = Math.abs(this.itemArr[i].x);
                _targetItem = this.itemArr[i];
            }
        }
        var _duration = Math.abs(_targetItem.x) / 500;
        var _x = -_targetItem.x
        for (var i = 0; i < this.itemCount; i++) {

            cc.tween(this.itemArr[i])
                .by(_duration, { x: _x }, { easing: "sineInOut" })
                .call()
                .start();
        }

        this.scheduleOnce(() => {
            var _name = _targetItem.name.split('item')[1];
            this.pageIndexNow = parseInt(_name);
            console.log("当前选定的是 " + this.pageIndexNow);
            cc.director.emit("切换到角色的index", this.pageIndexNow);
        }, _duration)
    },
    update(dt) {

        if (this.guanXing) {
            for (var i = 0; i < this.itemCount; i++) {
                this.itemArr[i].x += this.speed;
            }


            
            if (this.speed < 0) {
                this.speed += this.ax;
                if (this.speed >= 0) {
                    this.speed = 0;
                    this.guanXing = false;
                    this.huiGui();
                }
            }
            else if (this.speed > 0) {
                this.speed -= this.ax;
                if (this.speed <= 0) {
                    this.speed = 0;
                    this.guanXing = false;
                    this.huiGui();
                }
            }

        }
        // if (this.guanXing == false) 
        {
            //***大小变化
            for (var i = 0; i < this.itemCount; i++) {

                if (this.itemArr[i].x < -this.itemW * 3) {
                    if (i == 0)
                        this.itemArr[i].x = this.itemArr[this.itemCount - 1].x + this.itemW;
                    else {

                        this.itemArr[i].x = this.itemArr[i - 1].x + this.itemW;
                    }
                }
                else if (this.itemArr[i].x > (this.itemCount - 4) * this.itemW) {
                    if (i == this.itemCount - 1)
                        this.itemArr[i].x = this.itemArr[0].x - this.itemW;
                    else {

                        this.itemArr[i].x = this.itemArr[i + 1].x - this.itemW;
                    }
                }
                var _scale = (this.viewW * 1.5 - Math.abs(this.itemArr[i].x)) / (this.viewW * 1.5);
                if (_scale < 0.7)
                    _scale = 0.7;
                else {
                    // this.itemArr[i].zIndex = parseInt(2000-Math.abs(this.itemArr[i].x) )

                    // this.itemArr[i].zIndex =this.itemArr[i].x
                }
                this.itemArr[i].scale = _scale;

                this.zheZhaoArr[i].opacity = (1-this.itemArr[i].scale) * 150

            }
        }
        

    },

    getDate(timeType) {
        var testDate = new Date();
        if (timeType == "year")
            return testDate.getYear();//获取当前年份(2位)
        else if (timeType == "year2")
            return testDate.getFullYear(); //获取完整的年份(4位,1970-????)
        else if (timeType == "month")
            return testDate.getMonth(); //获取当前月份(0-11,0代表1月)
        else if (timeType == "day")
            return testDate.getDate(); //获取当前日(1-31)
        else if (timeType == "week")
            return testDate.getDay(); //获取当前星期X(0-6,0代表星期天)
        else if (timeType == "millisecond")
            return testDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
        else if (timeType == "hour")
            return testDate.getHours(); //获取当前小时数(0-23)
        else if (timeType == "minute")
            return testDate.getMinutes(); //获取当前分钟数(0-59)
        else if (timeType == "second")
            return testDate.getSeconds(); //获取当前秒数(0-59)


    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
});
