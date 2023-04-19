
cc.Class({
    extends: cc.Component,

    properties: {
        globalTips: cc.Prefab,
        coinFly: cc.Prefab,
        gunSpr: cc.Node,
        iconSpr: cc.Node,



    },

    onLoad() {

        AD.globalNode = this;
        cc.game.addPersistRootNode(this.node);
        cc.director.on("系统提示", (_content) => {
            AD.audioMng.playSfx("提示音");
            this.showTips(_content);
        }, this);
        cc.director.on("飞币", (_num, _startNode, _targetNode, _isCoin, func1, func2) => {
            for (var i = 0; i < _num; i++) {
                if (func1 && func2) {

                    this.showCoin(_startNode, _targetNode, _isCoin, func1, func2);
                }
                else
                    this.showCoin(_startNode, _targetNode, _isCoin);
            }
        }, this);



        this.initData();



    },


    start() {
        this.schedule(() => {
            if (globalData.data.onlineSecond > 0) {
                globalData.data.onlineSecond--;
                if (globalData.data.onlineSecond % 10 == 0)
                    globalData.saveData();
            }
        }, 1)

    },

    showTips(_content) {
        var _tips = cc.instantiate(this.globalTips);
        _tips.parent = cc.find("Canvas");
        _tips.group = "UI";
        _tips.position = cc.v2(0, 60);
        _tips.getChildByName("tips").getComponent(cc.Label).string = _content;
        _tips.scaleY = 0;

        // this.scheduleOnce(() => {
        //     cc.find("kuai0", _tips).x = -_tips.getChildByName("tips").width / 2 - 20
        //     cc.find("kuai1", _tips).x = _tips.getChildByName("tips").width / 2 + 20
        // }, 0.01)
        cc.tween(_tips)
            .to(0.2, { scaleY: 1 }, { easing: "backInOut" })
            .delay(1.2)
            // .by(0.5, { y: 100, opacity: 0 })
            .to(0.2, { scaleY: 0 }, { easing: "backInOut" })
            .call(() => {
                _tips.destroy();
            })
            .start();
    },
    showCoin(_startNode, _targetNode, _typeOfOBJ, ...func) {
        if (_startNode && _targetNode) {
            var _coin = cc.instantiate(this.coinFly);
            _coin.parent = cc.find("Canvas");
            _coin.group = "UI";
            var _startPos = _startNode.parent.convertToWorldSpaceAR(_startNode.position);
            var _targetPos = _targetNode.parent.convertToWorldSpaceAR(_targetNode.position);
            if (func[0] && func[1]) {
                _coin.getComponent("coinFly").reset(
                    cc.find("Canvas").convertToNodeSpaceAR(_startPos),
                    cc.find("Canvas").convertToNodeSpaceAR(_targetPos),
                    _typeOfOBJ, func[0], func[1]);

            }
            else {

                _coin.getComponent("coinFly").reset(
                    cc.find("Canvas").convertToNodeSpaceAR(_startPos),
                    cc.find("Canvas").convertToNodeSpaceAR(_targetPos),
                    _typeOfOBJ);
            }
        }


    },

    initData() {
        AD.nameArr = ["浮萍", "梦幻缘", "梅花", "溢目眼", "想听呼吸", "故勿相思", "心有你i", "饿货", "米虫教主", "大爷范",
            "一笑而过", "昨日恋人", "转角、爱", "山野到书房", "昨日恋人", "少女の思念", "温柔余生", "情定在深秋", "美如花", "落叶花吹雪",
            "昨日恋人", "生活 記、", "枕边事", "老师好", "记你的温柔", "专的味道", "经兮兮", "全国学渣代表", "一叶孤舟", "得未曾有", "你给的承诺", "我校班花",
            "从未分离", "忧伤旋律", "少年与喵", "魔幻宝贝", "依旧夺目", "哥哥姐姐", "啥么玩意儿", "谁有我聪明", "考试不及格", "无敌学霸",
            "三好学生", "鲜艳红领巾", "少先员", "班里我帅", "你们好呀", "我喜欢你啊", "答不对啊", "常州小学霸", "广东学霸哥", "我是小学渣",
            "学霸你好", "OOIIOO", "李丹我喜你", "幼儿大班", "刘大壮", "韩梅梅", "王二丫", "赵大宝", "隔壁老王", "放学别走",
            "AABBCC", "asdgfgzx", "6843327", "11111111", "666啊", "lkgiqh", "jackey", "wangda123", "Tomas", "别走啊",
            "隔壁好青年", "吃葡萄嫌葡萄酸", "哦卖噶", "夏了夏天", "小不点", "Cccc橙子", "霸二", "此籹子", "小拽", "幼稚的花",
            "小可爱", "血红小太阳", "泡菓奶", "我是好孩子", "眼睛妹", "冰淇凌", "春暖花开", "木兮", "某某人人", "带翅膀的猫",
            "微笑", "木子冉", "豆芽", "猜不透你的心", "周杰棍的双节伦", "繁华若梦惜流年", "人心难挽", "骑猪上高速", "打小就挺坏", "蚂蚁绊大象",
            "哇塞", "哟西哟西大大地", "云朵飘飘", "卡卡哇", "琪的彩虹", "悠悠", "对天空微笑", "霞霞", "国民小学生", "王者小学生",
            "逆天行", "开学肚疼", "月光小兔", "紫樱梦忆", "七个小梦想", "乖小孩", "可爱小凯蒂", "少先队员", "海绵宝宝", "雨水",
            "巧克力夹心", "墨尔本", "沐落枫心", "朝阳小百合", "嗄天啲风", "雾里看花", "请无视这小孩", "晴天鲑鲑", "人面小怪兽", "萌面超人",
            "森系女孩", "卖萌不是罪", "对着玻璃笑", "skrskr", "戴上小红帽", "圈圈奥特曼", "sunny", "香甜大果粒", "小鱼板儿", "阳光男孩",
            "小清新", "达利戈达", "小太阳", "小月亮", "明月几时有", "掘掘子", "转啊转", "宇帝", "小张同学", "小憨憨不敢", "小张睡不醒",
            "放学别走", "海淀小玫瑰", "奔跑的蜗牛", "猛龙超人", "咸鱼翻身", "路在何方", "无敌力霸王", "大花猫", "太空县城", "阿斯蒂芬", "西部点子王",
            "仙气飘飘", "绝世妖孽", "情浅凉心", "一个人的事", "陌小浅", "我强大无谓", "大妹子", "策白马啸西风", "哎呦你个喂", "我的深爱用错了人", "墨玲珑", "凉薄少女夢", "若只如初见", "镜湖月", "霓裳",
            "何处来何处去", "浅浅爱", "潇湘夜雨", "万古青天", "提桶跑路", "青期", "小小怪同学", "未来可期", "无为而治", "花小喵", "柒月的风", "狂妄称帝", "执手闯天涯",
            "这题太难了", "中正平和", "笑掉大牙", "要钱给他", "天马奥特曼", "算了吧", "童话故事是真的", "佛系少年", "我与江南", "喵喵小姐", "南乔几经秋", "风格不统一",
            "雪花飘飘", "火箭兔子", "肩膀的忧伤", "何必想太多", "橘子味的香蕉", "落阳一地的殇", "我是王者", "洛灵兮", "嘻嘻嘻", "梦岛千寻", "另一半的我", "小光头"
        ];

        //枪图标
        AD.gunIconArr = new Array();
        for (var i = 0; i < this.gunSpr.children.length; i++) {
            AD.gunIconArr.push(this.gunSpr.children[i].getComponent(cc.Sprite).spriteFrame);
        }

        //头像图标
        AD.roleIconArr = new Array();
        for (var i = 0; i < this.iconSpr.children.length; i++) {
            AD.roleIconArr.push(this.iconSpr.children[i].getComponent(cc.Sprite).spriteFrame);
        }


    },
    //获取随机打乱顺序的昵称数组
    getNameRandom() {
        AD.nameArr = Tools.getNewArr(AD.nameArr, AD.nameArr.length - 1);
    },
    //获取随机打乱顺序的icon数组
    getRoleIconRandom() {
        AD.roleIconArr = Tools.getNewArr(AD.roleIconArr, AD.roleIconArr.length);
        for (var i = 0; i < 6; i++)
            console.log("AD.roleIconArr  " + AD.roleIconArr[i].name)
    },
    //初始化跑马灯
    initPaoMaDeng() {
        this.schedule(() => {
            if (cc.director.getScene().name == "gameScene") return;
            var _deng = cc.instantiate(this.paoMaDengPrefab);
            _deng.group = "UI";
            _deng.parent = this.node;
            _deng.x = cc.winSize.width / 2;
            _deng.y = 720 - 100;
            _deng.getComponent("paoMaDengMng").nameLabel.string = AD.nameArr[Tools.random(0, AD.nameArr.length - 1)];
            _deng.getComponent("paoMaDengMng").junXianLabel.string = globalData.junXianArr[Tools.random(7, 14)];
        }, 10)
    },
    // update (dt) {},
});
