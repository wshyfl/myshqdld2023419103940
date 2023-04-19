

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // cc.director.emit("成就触发","测试",1);//存储成就 昵称:"测试" 数值:1
    onLoad() {

        cc.director.on("成就触发", (_nickname, _num) => {
            this.callFunc(_nickname, _num);
        }, 1);


        cc.director.on("获取成就", (_nickname, caller, call) => {
            var _jieShou = this.getAchievement(_nickname);
            if (call && caller)
                caller.call(call, _jieShou)
        }, 1);
    },



    callFunc(_nickname, _num) {
        var _obj = { nickname: "", displayName: "", numNow: 0, numTarget: 1, rewardNum: 10 };



        var _isNewData = true;//是一个新数据?
        for (var i = 0; i < globalData.data.achievement.length; i++) {
            if (globalData.data.achievement[i].nickname == _nickname) {
                globalData.data.achievement[i].numNow += _num;
                if (globalData.data.achievement[i].numNow < 0)
                    globalData.data.achievement[i].numNow = 0;
                globalData.saveData();
                _isNewData = false;//是一个新数据?---不是
                break;
            }
        }


        if (_isNewData) {//是一个新数据?---是新数据
            _obj.nickname = _nickname;
            var _getDataSucess = false;
            for (var i = 0; i < AD.achievement.length; i++) {
                if (AD.achievement[i].nickname == _nickname) {
                    _getDataSucess = true;
                    _obj.numTarget = AD.achievement[i].numTarget;//目标(通过 昵称 读表获取)
                    _obj.displayName = AD.achievement[i].displayName;//描述(通过 昵称 读表获取)
                    _obj.rewardNum = AD.achievement[i].rewardNum;//奖励数值(通过 昵称 读表获取)
                    _obj.hadGet = false;//还没有领取过奖励
                }
            }
            if (!_getDataSucess) {
                console.warn("JSON数值获取失败 请检查传入的<昵称>");
                return;
            }

            _obj.numNow = _num;

            globalData.data.achievement.push(_obj);
            globalData.saveData();
        }


        // console.log("成就存储成功 " + JSON.stringify(globalData.data.achievement))
    },

    getAchievement(_nickname) {
        var _targetOBJ = null;
        for (var i = 0; i < globalData.data.achievement.length; i++) {
            if (globalData.data.achievement[i].nickname == _nickname) {
                _targetOBJ = globalData.data.achievement[i];
                break;
            }
        }
        if (_targetOBJ == null) {
            console.warn("成就获取失败=> " + _nickname);
        }
        else {
            // console.log("成就获取成功=> " + _nickname+JSON.stringify(_targetOBJ));
        }
        return _targetOBJ;
    },
    // update (dt) {},
});
