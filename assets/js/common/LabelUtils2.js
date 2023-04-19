var LabelUtils2 = cc.Class({
    extends: cc.Component,

    properties: {
        _ISDEBUG: false,
        _RELEASE_BASE_URL: "https://wanbgame.com/gameroot",
        _DEBUG_BASE_URL: "http://192.168.0.242:19800/label2",
        _labelName: "",
        location: "",
        locationCID: null,
        locationCIDList: null,
        labels: null,

        isPingBiIng: false,
        initLocationSucess: false,
        initLabelSucess: false,
        checkPingBiSucess: false,

    },
    getBaseUrl: function () {
        if (this._ISDEBUG) {
            return this._DEBUG_BASE_URL;
        }
        return this._RELEASE_BASE_URL;
    },

    statics: {
        instance: null
    },
    onLoad: function () {
        this.canRefresh = false;
    },
    /**
     * 在没有获取到标签配置之前统一返回false
     * 在没有获取到是否是特殊省份时统一返回false
     *
     *
     * @param key
     * @returns {boolean}
     */
    getLabel: function (key) {

        var self = this;
        if (!this.checkPingBiSucess)
            return false;

        var _switch = false;
        if (this.isPingBiIng)
            _switch = false;
        else {
            self.logFunc("*********"+JSON.stringify(self.labels));
            if (self.labels.hasOwnProperty(key)) {
                var temp = key;
                var obj = self.labels;
                for (var _temp in obj) {//用javascript的for/in循环遍历对象的属性 
                    if (_temp == temp) {
                        self.logFunc("获取到的开关 :" + temp + ",值是: " + obj[temp])
                        if (obj[temp] == 0)
                            _switch = false;
                        else
                            _switch = true;
                    }
                }
            }
            else {
                console.warn("传入的key 不存在 " +key);
                _switch = false;
            }
        }
        return _switch;
    },
    getZDJRate: function (key) {

        var self = this;
        if (!this.checkPingBiSucess)
            return false;

        var _switch = 0;
        if (this.isPingBiIng)
            _switch = 0;
        else {
            if (self.labels.hasOwnProperty(key)) {
                var temp = key;
                var obj = self.labels;
                for (var _temp in obj) {//用javascript的for/in循环遍历对象的属性 
                    if (_temp == temp) {
                        self.logFunc("获取到的开关 :" + temp + ",值是: " + obj[temp])
                        _switch = obj[temp];
                        
                    }
                }
            }
            else {
                console.warn("传入的key 不存在");
                _switch = 0;
            }
        }
        return _switch;
    },
    /**
     * 初始化步骤：
     *  1、异步执行ip定位，获取服务器标签配置，获取服务器上省份列表
     *  2、之后会判断当前省份是否是在屏蔽列表中，判断完成之后真正初始化完成
     *  3、
     * @param labelName
     */
    initLabel: function (labelName) {
        this.logFunc("initLabel:" + labelName)

        if (!!labelName && labelName.length > 0) {
            this._labelName = labelName;
        }
        this.logFunc("initLabel:  start  " + this._labelName)

        this._getMyLocation();
        this._fetchLabel();
        this._checkPingBi();

    },



    _checkPingBi: function () {
        var self = this;
        if (self.locationCID == null || self.locationCIDList == null) {
            self.scheduleOnce(function () {
                self._checkPingBi();
            }, 2)
            return;
        }


        self.checkPingBiSucess = true;
        self.isPingBiIng = (self.locationCIDList.indexOf(self.locationCID) != -1);
        self.logFunc("屏蔽省份包含本省份吗?  " + self.isPingBiIng);

        // JSON.stringify(res.gamecity_ids).indexOf('81000')

    },
    _fetchLabel: function () {
        let self = this;


        var _url = this._RELEASE_BASE_URL + "/" + this._labelName + ".json";
        self.logFunc("访问的网址是  " + _url)
        self._httpGets(_url, false, function (res) {

            self.logFunc("获取结果是: " + JSON.stringify(res));
            if (res != -1) {
                self.locationCIDList = JSON.stringify(res.gamecity_ids);
                self.logFunc("屏蔽省份list:  " + self.locationCIDList);
                self.labels = res.json;
                self.logFunc("获取到的开关是***:  " + JSON.stringify(res.json));

                self.initLabelSucess = true;


            } else {
                self.scheduleOnce(function () {
                    self._fetchLabel()
                }, 1)


            }

        })

    },



    _getMyLocation: function () {
        let self = this;
        self.logFunc("label:getLocation")
        this._httpGetsLocation("https://pv.sohu.com/cityjson?ie=utf-8", function (res) {



            if (res != -1) {
                self.initLocationSucess = true;
                let s2 = res.toString();
                let s3 = s2.substring(s2.indexOf("{"), s2.lastIndexOf("}") + 1);

                self.logFunc("yfl==  " + s3);
                let parse = JSON.parse(s3);
                self.logFunc("获取到的本地地址是:  " + parse.cid + (typeof parse.cid))
                self.locationCID = parse.cid.slice(0, 2) + '0000';
                self.logFunc("转换后的本地地址是  " + self.locationCID);

            } else {

                self.scheduleOnce(function () {
                    self._getMyLocation();
                }, 2)
            }


        });
        self.logFunc("label:getLocation  End")


    },

    _httpGetsLocation: function (url, callback) {
        let self = this;
        self.logFunc("label:_httpGetsLocation 1111 ")
        var xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                self.logFunc(xhr.status + ".......");
                if (xhr.status >= 200 && xhr.status <= 304) {
                    var respone = xhr.responseText;
                    callback(respone);
                } else {
                    callback(-1)

                }

            }
        };
        xhr.open("GET", url, true);


        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Host", "pv.sohu.com");
        xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Connection", "keep-alive");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");


        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        //  xhr.timeout = 5000; // 5 seconds for timeout
        xhr.timeout = 4000;
        let isCallback = false;
        xhr.ontimeout = function () {
            self.logFunc("xmlhttprequest location timeout");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.onerror = function (e) {
            self.logFunc(e + "xmlhttprequest location onerror")
            if (!isCallback) {
                isCallback = true;
                callback(-1);

            }
        };
        xhr.send();
    },

    _httpGets: function (url, needHeader, callback) {
        var self = this;
        self.logFunc("label:HttpGets  ");

        let xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            cc.log(" label location XML_HTTP_REQUEST onreadystatechange ");
            if (xhr.readyState === 4) {
                self.logFunc("httpGetsCode:" + xhr.status)
                if (xhr.status >= 200 && xhr.status <= 304) {
                    // var respone = xhr.responseText;
                    var respone = JSON.parse(xhr.responseText);
                    callback(respone);
                } else {
                    callback(-1);
                }

            }
        };

        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Connection", "keep-alive");
        /*
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        */

        xhr.timeout = 3000;
        let isCallback = false;
        xhr.ontimeout = function () {
            self.logFunc("xmlhttprequest timeout");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.onerror = function (e) {
            self.logFunc(e + "xmlhttprequest onerror")
            if (!isCallback) {
                isCallback = true;
                callback(-1);

            }
        };
        xhr.send();
    },

    logFunc(...obj) {
        return;
        console.log(obj)
    },
});

LabelUtils2.getInstance = function () {
    if (LabelUtils2.instance == null) {
        LabelUtils2.instance = new LabelUtils2();
    }
    return LabelUtils2.instance;
};
module.exports = LabelUtils2;
