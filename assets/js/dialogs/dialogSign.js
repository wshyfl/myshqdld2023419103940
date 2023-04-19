
//调用
// cc.director.emit("展示签到弹窗",true);//自动弹出(每天一次)
// cc.director.emit("展示签到弹窗");//点击签到按钮 弹出


// cc.director.on("展示签到弹窗", (autoShow) => {
//     var _dialog = cc.instantiate(this.dialogSignPrefab);
//     _dialog.parent = cc.find("Canvas/dialogMng");
//     if (autoShow)
//         _dialog.getComponent("dialogSign").reset(autoShow);
//     else
//         _dialog.getComponent("dialogSign").reset();
//     AD.chaPing();
//     AD.showBanner();
// }, this);

cc.Class({
    extends: cc.Component,

    properties: {
        itemParent: cc.Node,
        signingEffect: cc.Node,//1-6天 可以签到的特效
        signingEffect7: cc.Node,//7天 可以签到的特效

    },
    onLoad() { },
    reset(..._autoShow) {
        this.keyFirst = globalData.keyFirst + "sign" + "3";
        this.keyData = globalData.keyData + "sign" + "3";

        this.signAutoShow = false;//可以自动弹出吗?
        this.data = {
            signData: [null, null, null, null, null, null, null],
            signHadShowTodayDate: null,//今天主动弹出的日期记录 
        };

        this.getDataAll();


        if (_autoShow[0]) {//想要自动弹出
            if (!this.signAutoShow) {//今天已经自动弹出过吗?
                this.node.destroy();
                return;
            }
            this.data.signHadShowTodayDate = this.getDateDayString();
            this.saveData();
        }


        this.items = this.itemParent.children;
        for (var i = 0; i < 7; i++) {
            this.items[i].on(cc.Node.EventType.TOUCH_START, (event) => {
                this.itemsClick(event.target.name);
            }, this)
        }
        this.resetShow();
        this.resetDialog2(this.node, true);
    },

    itemsClick(_itemName) {
        var _index = parseInt(_itemName[_itemName.length - 1]);
        if (this.couldSign) {
            if (this.signDays == _index - 1) {
                this.signSucess();
                AD.audioMng.playSfx("按钮");
            }
        }

    },

    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "签到":
                break;
            case "已签到":
                this.resetDialog2(this.node, false);
                break;
        }
    },

    resetShow() {
        this.couldSign = this.getSignData();//
        this.signDays = this.getSignDays();//已经签到他天数

        if (this.signDays < 7) {
            this.signingEffect.active = this.couldSign;
            this.signingEffect.position = this.items[this.signDays].position;
            if (this.signDays == 6) {

                this.signingEffect.active = false;
                this.signingEffect7.active = this.couldSign;
                this.signingEffect7.position = this.items[this.signDays].position;
            }
            else
                this.signingEffect7.active = false;
        }
        else {
            this.signingEffect7.active = false;
            this.signingEffect.active = false;
        }

        for (var i = 0; i < 7; i++) {
            var _showSigned = (i < this.signDays);
            console.log(i + "      " + _showSigned)
            this.items[i].getChildByName("yiQianDao").active = _showSigned;
        }

    },
    signSucess() {
        AD.audioMng.playSfx("获得奖励");

        switch (this.signDays) {
            case 0:
                globalData.setCoinNum(500);
                cc.director.emit("系统提示", "恭喜获得500金币");
                cc.director.emit("飞币", 10, this.items[this.signDays], AD.coinLabelNode, 0);

                break;
            case 1://解锁角色
                // globalData.setDiamondNum(50);
                // cc.director.emit("系统提示", "恭喜获得50钻石");
                // cc.director.emit("飞币", 10, this.items[this.signDays], AD.diamondLabelNode, 3);

                globalData.setKeyNum(2);
                cc.director.emit("系统提示", "恭喜获得2把钥匙");
                break;
            case 2:
                globalData.setCoinNum(2000);
                cc.director.emit("系统提示", "恭喜获得2000金币");
                cc.director.emit("飞币", 10, this.items[this.signDays], AD.coinLabelNode, 0);
                break;
            case 3:
                globalData.setDiamondNum(100);
                cc.director.emit("系统提示", "恭喜获得100钻石");
                cc.director.emit("飞币", 10, this.items[this.signDays], AD.diamondLabelNode, 3);
                break;
            case 4:
                globalData.setCoinNum(3000);
                cc.director.emit("系统提示", "恭喜获得3000金币");
                cc.director.emit("飞币", 10, this.items[this.signDays], AD.coinLabelNode, 0);
                break;
            case 5:
                globalData.setDiamondNum(150);
                cc.director.emit("系统提示", "恭喜获得150钻石");
                cc.director.emit("飞币", 10, this.items[this.signDays], AD.diamondLabelNode, 3);
                break;
            case 6://解锁武器--5
                cc.director.emit("系统提示", "解锁新武器-究极幻影");
                globalData.setGunUnlockState(5);
                break;
        }

        console.log("签到获得 " + this.signDays);
        this.setSignData();
        this.resetShow();


        this.scheduleOnce(() => {

            this.resetDialog2(this.node, false);
        }, 1)
        console.log("第" + this.signDays + "天签到成功 ")
    },
    // update (dt) {},
    getSignData() {
        if (this.data.signData[0] == null)
            return true;
        for (var i = 0; i < 7; i++) {
            if (this.data.signData[i] == this.getDateDayString())
                return false;
        }
        return true;
    },
    //获取已签到天数
    getSignDays() {
        for (var i = 0; i < 7; i++) {
            if (this.data.signData[6] != null)
                return 7;
            if (this.data.signData[i] == null)
                return i;
        }
        return 0;
    },
    //签到满七天 重置
    resetSignData() {
        console.log("aa " + this.data.signData)
        if (this.data.signData[6] != null && this.data.signData[6] != this.getDateDayString()) {
            for (var i = 0; i < 7; i++) {
                this.data.signData[i] = null;
            }
        }
    },
    setSignData() {
        for (var i = 0; i < 7; i++) {
            if (this.data.signData[i] == null) {
                this.data.signData[i] = this.getDateDayString();
                // this.data.signData[i] = "000";//测试  连续签到
                break;
            }
        }
        this.saveData();
    },

    //今天主动弹出的日期记录
    checkSignHadShowToday() {
        this.signAutoShow = (this.data.signHadShowTodayDate != this.getDateDayString()) //可以主动弹出签到吗?        
    },
    getDataAll() {
        // this.clearAllData();
        if (cc.sys.localStorage.getItem(this.keyFirst) != 1) {
            cc.sys.localStorage.setItem(this.keyFirst, 1);
            this.saveData();
            cc.log("首次进入游戏")
            this.data = this.getData();
        }
        else {
            this.data = this.getData();

        }

        //重置每日登陆奖励
        this.resetSignData();
        //今天主动弹出的日期记录
        this.checkSignHadShowToday();
    },
    clearAllData() {
        cc.sys.localStorage.removeItem(this.keyFirst);
        cc.sys.localStorage.removeItem(this.keyData);
    },
    saveData() {
        cc.sys.localStorage.setItem(this.keyData, JSON.stringify(this.data));

        var _res = cc.sys.localStorage.getItem(this.keyData);
        cc.log("存储成功" + _res)
    },
    getData() {
        var _res = cc.sys.localStorage.getItem(this.keyData);
        cc.log("_res = " + _res)
        if (_res != null)
            return JSON.parse(_res);

    },

    //获取  "20200101" 格式的  今天的 时间日期 addDate: -1表示昨天  1表示明天 2表示后天.....
    getDateDayString(...addDate) {
        var _strLog = "";
        if (addDate[0]) {
            var day1 = new Date();
            day1.setTime(day1.getTime() + addDate[0] * 24 * 60 * 60 * 1000);
            var _year = day1.getFullYear();
            var _month = (day1.getMonth() + 1);
            var _day = day1.getDate();
            if (addDate[0] > 0)
                _strLog = "当前日期+" + addDate[0];
            else
                _strLog = "当前日期" + addDate[0];
        }
        else {
            var _year = this.getDate("year2");
            var _month = this.getDate("month") + 1;
            var _day = this.getDate("day");

            _strLog = "今天日期是";
        }

        if (_month < 10)
            _month = "0" + _month;
        if (_day < 10)
            _day = "0" + _day;
        var _str = "" + _year + _month + _day;

        // console.log(_strLog + " : " + _str)
        return _str;
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

    resetDialog2(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("zheZhao");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            _dialog.active = true;
            _zheZhao.opacity = 0;
            _bg.scale = 0;

            cc.tween(_zheZhao)
                .to(0.2, { opacity: 180 })
                .start();

            cc.tween(_bg)
                .to(0.2, { scale: 1 }, { easing: "sineInOut" })
                .start();

        }
        else {
            cc.tween(_zheZhao)
                .to(0.05, { scale: 1.05 })
                .to(0.2, { opacity: 0 })
                .start();

            cc.tween(_bg)
                .to(0.2, { scale: 0 }, { easing: "sineInOut" })
                .call(() => {
                    _dialog.destroy();
                })
                .start();
        }
    },
});
