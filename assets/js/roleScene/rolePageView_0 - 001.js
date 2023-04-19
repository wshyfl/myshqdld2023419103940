
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        autoPageTurningThreshold: {
            default: 20,
            tooltip: "快速翻动临界值;偏移值大于此临界值,自动翻页"
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.ax = 1.5;//加速度
        this.startTime = 0;
        this.duration = 0;
        this.itemArr = new Array();
        this.pageNums = this.content.children.length;
        for (var i = 0; i < this.pageNums; i++) {
            this.content.children[i].children[0].x = this.content.children[i].width / 2
            var _item = cc.instantiate(this.content.children[i]);
            this.itemArr.push(_item);
        };

        this.guanXing = false;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.guanXing = false;
            this.node._touchListener.setSwallowTouches(false);
            this._offset = 0;
            this.startTime = this.getDate("millisecond");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            this.content.x += event.getDelta().x;
            this._offset += event.getDelta().x;

        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.duration = this.getDate("millisecond") - this.startTime;
            this.speed = this._offset / this.duration * 10;

            this.guanXing = true;
            console.log(" this.speed   " + this.speed)

        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.duration = this.getDate("millisecond") - this.startTime;
            this.speed = this._offset / this.duration * 10;

            this.guanXing = true;
        }, this)


        this.worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        this.viewW = this.content.parent.width / 2;
        this.content.parent.x = -this.viewW
    },

    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "左":
                this.reset(this.pageIndexNow - 1);
                break;
            case "右":
                this.reset(this.pageIndexNow + 1);
                break;
        }
    },
    start() {
        this.pageIndexNow = globalData.roleType;
        this.content.x = -this.content.children[this.pageIndexNow].x;
    },
    huiGui() {
        if (this.content.x > 0)
            this.reset(0);
        else if (this.content.x < -this.content.width + this.itemArr[0].width)
            this.reset(this.pageNums - 2);
        else {
            for (var i = 0; i < this.pageNums; i++) {
                if (Math.abs(Math.abs(this.content.x) - this.content.children[i].x) <= this.itemArr[0].width / 2) {
                    if (i != this.pageIndexNow) {
                        this.reset(i);
                    }
                    else {
                        if (this._offset <= -this.autoPageTurningThreshold) {
                            this.reset(this.pageIndexNow + 1);
                        }
                        else if (this._offset >= this.autoPageTurningThreshold) {
                            this.reset(this.pageIndexNow);
                        }
                    }
                    return;
                }
            }
        }
    },
    reset(_pageIndex) {
        if (_pageIndex >= this.pageNums - 1)
            _pageIndex = this.pageNums - 2;
        else if (_pageIndex < 0)
            _pageIndex = 0;

        var _duration =Math.abs (this.content.x + this.content.children[_pageIndex].x) / this.content.children[_pageIndex].width * 0.3;
        cc.tween(this.content)
            .to(_duration, { x: -this.content.children[_pageIndex].x }, { easing: "sineInOut" })
            .call(() => {
                var _name = this.content.children[_pageIndex + 1].name;

                this.pageIndexNow = parseInt(_name[_name.length - 1]);
                console.log("当前选定的是 " + this.pageIndexNow);
                cc.director.emit("切换到角色的index", this.pageIndexNow);
            })
            .start();
    },

    update(dt) {
        if (this.guanXing) {
            this.content.x += this.speed;

            var _ax = this.ax;
            if (this.content.x > 0 || this.content.x < -this.content.width + this.itemArr[0].width)
                _ax = _ax * 30;

            if (this.speed < 0) {
                this.speed += _ax;
                if (this.speed >= 0) {
                    this.speed = 0;
                    this.guanXing = false;
                    this.huiGui();
                }
            }
            else if (this.speed > 0) {
                this.speed -= _ax;
                if (this.speed <= 0) {
                    this.speed = 0;
                    this.guanXing = false;
                    this.huiGui();
                }
            }

        }

        //***大小变化
        for (var i = 1; i < this.pageNums; i++) {
            var _item = this.content.children[i].children[0];
            var _startPos = _item.parent.convertToWorldSpaceAR(_item.position);
            _item.scale = (this.viewW * 2 - Math.abs(this.worldPos.x - _startPos.x)) / (this.viewW * 2);
            // this.content.children[i].zIndex = parseInt(_item.scale*100)
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
