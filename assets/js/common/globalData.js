window.globalData = {

    clearDataNow: false,//清除数据吗?
    keyFirst: "key_firstShuiQiangDaZuoZhan0",
    keyData: "key_dataShuiQiangDaZuoZhan0",
    firstToMenu: true,


    roleType: 0,
    gunType: 0,
    signAutoShow: false,//可以主动弹出签到吗?

    tuiJianIndex:0,
    levelNow: 0,
    roleUnlockPrice: [1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000],
    gunUnlockPrice: [1000, 2000, 3000, 4000, 5000, 6000],

    roleNumMax: 10,//角色的总数量
    gunNumMax: 6,//枪的总数量

    data: {
        level: 0,
        levelStarsNum: [],
        coinNum: 0,//金币数
        diamondNum: 0,//钻石数
        keyNum: 0,//钥匙数
        roleUnlockState:
            [0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0],//0 未解锁 1已经锁(未使用)  2使用中
        gunUnlockState:
            [0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0],//0 未解锁 1已经锁(未使用)  2使用中


        signFirstToGame: true,//玩家首次进入游戏吗? 首次不弹出签到
        signHadShowTodayDate: null,//今天主动弹出的日期记录 
        chouJiangDate: null,//抽奖日期
        hadGuide: false,
        achievement: [],
        onlineGetDate: null,//在线奖励 领取的日期
        onlineGetTimesToday: 0,//在线奖励 今天领取的次数
        onlineSecond: 300,//在线时间
        guideData: { "move": false, "jump": false, "shoot": false, "tiBao": false ,"xuLi": false },
    },
    getGuideData(key) {
        var _value = Tools.getValueFromObj(globalData.data.guideData, key);
        return _value;
    },
    setGuideData(key, _value) {
        var _sucess = Tools.setValueFromObj(globalData.data.guideData, key, _value);
        if (_sucess) {

            console.log("存储成功")
            globalData.saveData();
        }
        return _value;
    },

    resetOnlineGetTimesToday() {
        if (globalData.data.onlineGetDate != Tools.getDateDayString()) {
            globalData.data.onlineGetTimesToday = 0;//重置本日领取次数
            globalData.data.onlineGetDate = Tools.getDateDayString();
            this.saveData();
        }
    },
    getOnlineGetTimesToday() {
        return globalData.data.onlineGetTimesToday;
    },
    setOnlineGetTimesToday() {
        globalData.data.onlineGetTimesToday++;
        cc.director.emit("在线奖励次数变了");
        this.saveData();
    },
    getDiamondNum() {
        return this.data.diamondNum;
    },
    setDiamondNum(_addNum) {
        if (this.data.diamondNum + _addNum >= 0) {
            this.data.diamondNum += _addNum;
            cc.director.emit("钻石数量变化");
            this.saveData();
            return true;
        }
        return false;
    },
    getLevel() {
        return this.data.level;
    },
    setLevel(_starsNum) {
        var _starsNumIsAdd = 0;
        if (this.levelNow == this.getLevel()) {//新解锁关卡
            this.data.level++;
            _starsNumIsAdd = _starsNum;
            this.data.levelStarsNum.push(_starsNum);//--直接存储星数
            this.saveData();
        }
        else {//没有解锁新关卡
            if (this.data.levelStarsNum[this.levelNow] < _starsNum) {

                _starsNumIsAdd = _starsNum - this.data.levelStarsNum[this.levelNow];
                this.data.levelStarsNum[this.levelNow] = _starsNum;//存储 更高的星数
            }
        }

        if (_starsNumIsAdd == 0) return;
        if (this.levelNow < 10) {
            cc.director.emit("成就触发", "精灵勇者", _starsNumIsAdd);
        }
        else if (this.levelNow < 20) {
            cc.director.emit("成就触发", "黄昏贤者", _starsNumIsAdd);
        }
        else if (this.levelNow < 30) {
            cc.director.emit("成就触发", "暗夜使者", _starsNumIsAdd);
        }
        else if (this.levelNow < 40) {
            cc.director.emit("成就触发", "霓虹行者", _starsNumIsAdd);
        }

    },
    //获取关卡星数
    getStarNum(_levelNum) {
        var _num = 0;
        if (_levelNum < this.data.levelStarsNum.length)
            _num = this.data.levelStarsNum[_levelNum];
        return _num;
    },
    getStarNumSum(...level) {
        var _num = 0;
        var _levelStart = 0;
        var _levelEnd = this.data.levelStarsNum.length;


        if (level[0])
            _levelStart = level[0];
        if (level[1])
            _levelEnd = level[1];


        for (var i = _levelStart; i < _levelEnd; i++) {
            if (i < this.data.levelStarsNum.length)
                _num += this.data.levelStarsNum[i];
        }
        return _num;
    },


    getGunUnlockState(_gunIndex) {
        return this.data.gunUnlockState[_gunIndex];
    },
    setGunUnlockState(_gunIndex) {
        for (var i = 0; i < this.data.gunUnlockState.length; i++) {
            if (this.data.gunUnlockState[i] > 0)
                this.data.gunUnlockState[i] = 1;
        }
        if (this.data.gunUnlockState[_gunIndex] == 0) {
            cc.director.emit("成就触发", "水枪大师", 1)
        }
        this.data.gunUnlockState[_gunIndex] = 2;
        globalData.gunType = _gunIndex;
        this.saveData();
    },
    getRoleUnlockState(_roleIndex) {
        return this.data.roleUnlockState[_roleIndex];
    },
    setRoleUnlockState(_roleIndex) {
        for (var i = 0; i < this.data.roleUnlockState.length; i++) {
            if (this.data.roleUnlockState[i] > 0)
                this.data.roleUnlockState[i] = 1;
        }
        if (this.data.roleUnlockState[_roleIndex] == 0) {
            cc.director.emit("成就触发", "服装收藏家", 1)
        }
        this.data.roleUnlockState[_roleIndex] = 2;
        globalData.roleType = _roleIndex;


        cc.director.emit("切换展示角色", _roleIndex);
        this.saveData();
    },

    getKeyNum() {
        return this.data.keyNum;
    },
    setKeyNum(_addNum) {
        if (this.data.keyNum + _addNum >= 0) {
            this.data.keyNum += _addNum;
            cc.director.emit("钥匙数量变化");
            this.saveData();
            return true;
        }
        return false;
    },
    getCoinNum() {
        return this.data.coinNum;
    },
    setCoinNum(_addNum) {
        if (this.data.coinNum + _addNum >= 0) {
            this.data.coinNum += _addNum;
            cc.director.emit("金币数量变化");
            this.saveData();
            return true;
        }
        return false;
    },


    getAchievement() {
        return this.data.achievement;
    },


    getDataAll() {
        // return;
        if (this.clearDataNow)
            globalData.clearAllData();
        cc.debug.setDisplayStats(false);
        if (cc.sys.localStorage.getItem(globalData.keyFirst) != 1) {
            cc.sys.localStorage.setItem(globalData.keyFirst, 1);
            globalData.saveData();
            cc.log("首次进入游戏")
            globalData.data = globalData.getData();

        }
        else {
            cc.log("非首次进入游戏 " + cc.sys.localStorage.getItem(globalData.keyFirst))
            globalData.data = globalData.getData();

        }


        //获取当前角色index
        for (var i = 0; i < this.data.roleUnlockState.length; i++) {
            if (this.data.roleUnlockState[i] == 2) {
                globalData.roleType = i;
                break;
            }
        }
        //获取当前枪支index
        for (var i = 0; i < this.data.gunUnlockState.length; i++) {
            if (this.data.gunUnlockState[i] == 2) {
                globalData.gunType = i;
                break;
            }
        }
        //角色
        for (var i = 0; i < this.data.roleUnlockState.length; i++) {
            if (globalData.getRoleUnlockState(i) == 2) {
                globalData.roleType = i;
                break;
            }
        }


        globalData.resetOnlineGetTimesToday();

    },
    clearAllData() {
        cc.sys.localStorage.removeItem(globalData.keyFirst);
        cc.sys.localStorage.removeItem(globalData.keyData);
    },
    saveData() {

        cc.sys.localStorage.setItem(globalData.keyData, JSON.stringify(globalData.data));
    },
    getData() {
        var _res = cc.sys.localStorage.getItem(globalData.keyData);
        cc.log("_res = " + _res)
        if (_res != null)
            return JSON.parse(_res);

    },



    changeScene(_nextScene) {
        cc.director.emit("显示过场", _nextScene);
        // cc.director.loadScene(_nextScene);
    }
}