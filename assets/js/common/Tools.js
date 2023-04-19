window.Tools = {

    //获得随机整数 上下限都包括
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },

    //弧度转角度
    radianToAngle(radian) {
        return radian * 180 / Math.PI;
    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
    //获得两点之间的弧度
    getAngle(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return angle;//角度转弧度
    },

    getRadian(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return this.angleToRadian(angle);//角度转弧度
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

        // testDate.getMilliseconds(); //获取当前毫秒数(0-999)

        // testDate.toLocaleDateString(); //获取当前日期

        // var mytime=testDate.toLocaleTimeString();//获取当前时间

        // testDate.toLocaleString( ); //获取日期与时间
    },
    //计算月份差 date1是 "20200101"
    getMonthNumber(date1, date2) {
        //默认格式为"20030303",根据自己需要改格式和方法
        var year1 = date1.substr(0, 4);
        var year2 = date2.substr(0, 4);
        var month1 = date1.substr(4, 2);
        var month2 = date2.substr(4, 2);

        var len = (year2 - year1) * 12 + (month2 - month1);
        return len;

    },
    //计算天数差 date1是  "20200101"
    getDayNumber(date1, date2) {
        //默认格式为"20030303",根据自己需要改格式和方法
        var year1 = date1.substr(0, 4);
        var year2 = date2.substr(0, 4);
        var month1 = date1.substr(4, 2);
        var month2 = date2.substr(4, 2);

        var day1 = date1.substr(6, 2);
        var day2 = date2.substr(6, 2);

        var temp1 = year1 + "/" + month1 + "/" + day1;
        var temp2 = year2 + "/" + month2 + "/" + day2;

        var dateaa = new Date(temp1);
        var datebb = new Date(temp2);
        var date = datebb.getTime() - dateaa.getTime();
        var time = Math.floor(date / (1000 * 60 * 60 * 24));
        // alert(time);
        return time;

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
            var _year = Tools.getDate("year2");
            var _month = Tools.getDate("month") + 1;
            var _day = Tools.getDate("day");

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

    //去重
    uniqueArr(arr) {
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (newArr.indexOf(arr[i]) == -1) {
                newArr.push(arr[i])
            }
        }
        return newArr;
    },
    jiangXuArr(arr) {
        var sortby = function (a, b) {
            return -(a - b);
        };
        return arr.sort(sortby);
    },
    shengXuArr(arr) {
        var sortby = function (a, b) {
            return a - b;
        };
        return arr.sort(sortby);
    },

    getIndexInArray(arr, value) //元素为 object  获取数组的索引
    {
        for (var i = 0; i < arr.length; i++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(value))
                return i;
        }
        return -1;
    },
    removeElementFromArr(arr, value)//
    {
        var index = Tools.getIndexInArray(arr, value);
        if (index > -1) {
            arr.splice(index, 1);
        }

        return arr;
    },
    getIndexInArray2(arr, value) //元素为 object  获取数组的索引
    {
        for (var i = 0; i < arr.length; i++) {
            // if (JSON.stringify(arr[i]) === JSON.stringify(value))
            if (arr[i] == value)
                return i;
        }
        return -1;
    },
    removeElementFromArr2(arr, value)//
    {
        // console.log("value------------------\n "  + value);
        var index = Tools.getIndexInArray2(arr, value);
        // console.log("arr0------------------\n "  + arr + "  index  " + index);
        if (index > -1) {
            arr.splice(index, 1);
        }

        // console.log("arr1*****************\n "  + arr);
        return arr;
    },
    //分解字符串
    strToArr(_str, _separator) {
        var _aar = _str.split("" + _separator);// 在每个逗号(,)处进行分解。
        return _aar;
    },
    getShowStr(_num) {
        _num = parseInt(_num)
        var _showPrice = null;
        var _ziMu = null;
        if (_num >= 1000000000000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000000000000)).toFixed(2);;
            _ziMu = "cc"
        }
        else if (_num >= 1000000000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000000000)).toFixed(2);;
            _ziMu = "bb"
        }
        else if (_num >= 1000000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000000)).toFixed(2);;
            _ziMu = "aa"
        }
        else if (_num >= 1000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000)).toFixed(2);;
            _ziMu = "T"
        }
        else if (_num >= 1000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000)).toFixed(2);;
            _ziMu = "B"
        }
        else if (_num >= 1000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000)).toFixed(2);;
            _ziMu = "M"
        }
        else if (_num >= 1000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000)).toFixed(2);;
            _ziMu = "K"
        }
        else {
            _showPrice = _num;
            _ziMu = ""
        }

        return "" + _showPrice + _ziMu
    },
    //四舍五入保留几位小数  1.356  2 = 1.35
    fixValue(value, n) {
        var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            s += '.';
        }
        for (var i = s.length - s.indexOf('.'); i <= n; i++) {
            s += "0";
        }
        return s;
    },
    getNewArr(Arr, num)	//传入2个参数，一个数组，要获取数组的长度 (目的 将一个数组打乱后重新返回)
    {
        var arr = new Array();  //这个数组的目的是把传入进来的数组复制一份
        for (var i in Arr) {
            arr.push(Arr[i]);
        }  //这个for 循环用来把传入的数组复制一份  

        var return_arr = new Array();  //存储随机数用的数组
        for (var i = 0; i < num; i++) 	//获取随机数
        {
            if (arr.length > 0) {
                var nums = Math.floor(Math.random() * arr.length);  //从arr里面随机一个地址并 赋给变量nums
                return_arr[i] = arr[nums];	//将arr地址里的值 给   return_arr[i];
                arr.splice(nums, 1);	//删除 地址上的数字，防止在随机出来重复的
            }
            else {
                break;
            }
        }
        return return_arr;		//返回获取的5个值
    },
    //交换数组中两个元素的位置
    swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
    //获取屏幕大小
    getWindowSize() {
        return cc.winSize;//推荐  原因  短
    },
    setNodeColor(_node, _Re, _Ge, _Be) {
        var colorCode = new cc.color(_Re, _Ge, _Be, 255);
        _node.color = colorCode;
        if (_node.children.length > 0) {
            for (var i = 0; i < _node.children.length; i++) {
                _node.children[i].color = colorCode;
                if (_node.children[i].children.length > 0) {
                    for (var j = 0; j < _node.children[i].children.length; j++) {
                        _node.children[i].children[j].color = colorCode;
                    }
                }
            }
        }
    },

    resetDialog(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("zheZhao");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            _dialog.active = true;
            _zheZhao.opacity = 0;
            _bg.scale = 0;

            cc.tween(_zheZhao)
                .to(0.15, { opacity: 180 })
                .start();

            cc.tween(_bg)
                .to(0.15, { scale: 1 })
                .start();

        }
        else {
            cc.tween(_zheZhao)
                .to(0.15, { opacity: 0 })
                .start();

            cc.tween(_bg)
                .to(0.15, { scale: 0 })
                .call(() => {
                    _dialog.active = false;
                })
                .start();
        }
    },
    resetDialog2(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("zheZhao");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            _dialog.active = true;
            _zheZhao.opacity = 0;
            _bg.scale = 0;

            cc.tween(_zheZhao)
                .to(0.15, { opacity: 180 })
                .start();

            cc.tween(_bg)
                .to(0.15, { scale: 1 })
                .start();

        }
        else {
            cc.tween(_zheZhao)
                .to(0.15, { opacity: 0 })
                .start();

            cc.tween(_bg)
                .to(0.15, { scale: 0 })
                .call(() => {
                    _dialog.destroy();
                })
                .start();
        }
    },
    log(...data) {
        return;
        var _groupName = null;
        if (typeof (data[0]) == 'string')
            _groupName = data[0];
        else
            _groupName = data[0].toString();

        console.group(_groupName);
        if (data.length > 1)
            data.forEach(element => {
                console.log(element);
            });
        console.groupEnd();

    },
    // 抛物线创建
    create(t, startPoint, endPoint, height, angle) {
        // 把角度转换为弧度
        let radian = angle * 3.14159 / 180;
        // 第一个控制点为抛物线左半弧的中点
        let q1x = startPoint.x + (endPoint.x - startPoint.x) / 4;
        let q1 = cc.v2(q1x, height + startPoint.y + Math.cos(radian) * q1x);
        // 第二个控制点为整个抛物线的中点
        let q2x = startPoint.x + (endPoint.x - startPoint.x) / 2;
        let q2 = cc.v2(q2x, height + startPoint.y + Math.cos(radian) * q2x);
        // 曲线配置
        // return cc.bezierTo(t, [q1, q2, endPoint]).easing(cc.easeInOut(0.5));
        return cc.bezierTo(t, [q1, q2, endPoint]).repeat(1);
    },
    couldShake: true,
    //震屏
    shakeScreen(..._rate) {
        if (!AD.couldShake) return;
        if (!this.couldShake) return;
        this.couldShake = false;
        var rate = 1;
        if (_rate[0])
            rate = _rate[0];
        var _time = 0.03 * rate; var _length = 5 * rate; 
        var _scale = 0.02 * rate;
        var _camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
        // cc.tween(_camera)
        // .to(_time,{zoomRatio:1-_scale})
        // .to(_time,{zoomRatio:1+_scale})
        // .start();
        var _canvas = cc.find("Canvas/Main Camera");
        // var _yuanX = _canvas.x;
        // var _yuanY = _canvas.y;
        cc.tween(_canvas)
            .by(_time, { position: cc.v2(-_length, _length) })
            .by(_time, { position: cc.v2(_length, -_length) })
            .by(_time, { position: cc.v2(_length, _length) })
            .by(_time, { position: cc.v2(-_length, -_length) })
            .call(() => {
                this.couldShake = true;
            })
            .start();
        // var _canvas = cc.find("Canvas");
        // cc.tween(_canvas)
        //     .to(_time, { position: cc.v2(_yuanX - _length, _yuanY), scale: 1 - _scale })
        //     .to(_time, { position: cc.v2(_yuanX, _yuanY + _length), scale: 1 })
        //     .to(_time, { position: cc.v2(_yuanX + _length, _yuanY), scale: 1 + _scale })
        //     .to(_time, { position: cc.v2(_yuanX, _yuanY), scale: 1 })
        //     .start();
        // cc.tween(_canvas)
        //     .to(_time, { scale: 1 - _scale })
        //     .to(_time, { scale: 1 })
        //     .to(_time, { scale: 1 + _scale })
        //     .to(_time, { scale: 1 })
        //     .start();
    },

    getSecond(_secondNow, jingQueDu) {

        var _hour = parseInt(_secondNow / 3600);
        var _hourLabel = null;
        if (_hour >= 10) {
            _hourLabel = _hour;
        }
        else
            _hourLabel = "0" + _hour;

        var _minite = parseInt((_secondNow - _hour * 3600) / 60);
        var _miniteLabel = null;
        if (_minite >= 10) {
            _miniteLabel = _minite;
        }
        else
            _miniteLabel = "0" + _minite;


        var _second = parseInt(_secondNow - _hour * 3600 - _minite * 60);
        var _secondLabel = null;
        if (_second >= 10) {
            _secondLabel = _second;
        }
        else
            _secondLabel = "0" + _second;

        // var _string = _hourLabel + ":" + _miniteLabel + ":" + _secondLabel;
        // var _string = _miniteLabel + ":" + _secondLabel;
        var _string = _secondLabel;

        switch (jingQueDu) {
            case "小时":
                _string = _hourLabel + ":" + _miniteLabel + ":" + _secondLabel;
                break;
            case "分钟":
                _string = _miniteLabel + ":" + _secondLabel;
                break;
            case "秒":
                _string = _secondLabel;
                break;
            default:
                console.warn("精确度参数 传入错误");
                break;
        }
        return _string;
    },
    getSecond2(_secondNow, ...fenMiao) {

        var _hour = parseInt(_secondNow / 3600);
        var _hourLabel = null;
        if (_hour >= 10) {
            _hourLabel = _hour;
        }
        else
            _hourLabel = "0" + _hour;

        var _minite = parseInt((_secondNow - _hour * 3600) / 60);
        var _miniteLabel = null;
        if (_minite >= 10) {
            _miniteLabel = _minite;
        }
        else
            _miniteLabel = "0" + _minite;


        var _second = parseInt(_secondNow - _hour * 3600 - _minite * 60);
        var _secondLabel = null;
        if (_second >= 10) {
            _secondLabel = _second;
        }
        else
            _secondLabel = "0" + _second;

        // var _string = _hourLabel + ":" + _miniteLabel + ":" + _secondLabel;
        var _string = _miniteLabel + ":" + _secondLabel;
        // var _string = _secondLabel;
        // if (fenMiao[0]) {
        //     _string = _hourLabel + ":" + _miniteLabel + ":" + _secondLabel;
        // }
        return _string;
    },
    //改变龙骨插槽图片
    changeSlotTexture(_node, _soltName, _textureIndex) {
        var animation = _node.getComponent(dragonBones.ArmatureDisplay);
        var _armature = animation.armature();
        var _solt = _armature.getSlot(_soltName);
        _solt.displayIndex = _textureIndex;

    },
    copyToClipBoard(str) {
        if (cc.sys.isNative) {
            qx.copyToClipBoard(str);
        } else if (cc.sys.isBrowser) {
            var textArea = null;
            textArea = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = str;
                document.body.appendChild(textArea);
            }
            textArea.select();
            try {
                const msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
                cc.log("已经复制到剪贴板");
                document.body.removeChild(textArea);
            } catch (err) {
                cc.log("复制到剪贴板失败");
            }
        }
    },
    //改变颜色 #51bde7
    colorOfString(_color) {
        if (_color == null || _color.length != 7) {
            return null;
        }
        var color = _color.toLowerCase();
        if (color.charAt(0) != "#") {
            return;
        }
        color = color.slice(1);
        var r = parseInt(color[0] + color[1], 16);
        var g = parseInt(color[2] + color[3], 16);
        var b = parseInt(color[4] + color[5], 16);
        return new cc.Color(r, g, b, 255);
    },
    //图片闪白  _spr:sprite
    shanBai(_sprite) {
        _sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;//闪白
        //返回正常色
        // this.scheduleOnce(() => {
        //     _sprite.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
        // }, 0.05);
    },
    getValueFromObj(obj, key) {
        var _value = null;
        if (obj.hasOwnProperty(key)) {
            var temp = key;
            for (var _temp in obj) {//用javascript的for/in循环遍历对象的属性 
                if (_temp == temp) {
                    console.log("key: " + temp + ",value: " + obj[temp])
                    _value = obj[temp];
                }
            }
        }

        else {
            console.warn("传入的key 不存在");
        }
        return _value;
    },

    setValueFromObj(obj, key, _value) {

        var _sucess = false;
        if (obj.hasOwnProperty(key)) {
            var temp = key;
            for (var _temp in obj) {//用javascript的for/in循环遍历对象的属性 
                if (_temp == temp) {
                    console.log("key: " + temp + ",value: " + obj[temp])
                    obj[temp] = _value;
                    _sucess = true;
                }
            }
        }


        return _sucess;
    },
}