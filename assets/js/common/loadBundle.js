
cc.Class({
    extends: cc.Component,

    properties: {
        isAndroid: {
            default: false,
        },
        androidChanel:
        {
            default: "oppo",
            visible() {
                return this.isAndroid;
            }
        },
        needSub: {
            default: false,
            visible() {
                return !this.isAndroid;
            }
        },
        bundleAstNameArr: {
            default: [],
            type: [cc.String],
            visible() {
                return this.needSub;
            }
        },
        bundleSceneName:
        {
            default: "scene",
            visible() {
                return this.needSub;
            }
        },
        bundleSceneName2:
        {
            default: "scene",
            visible() {
                return this.needSub;
            }
        },

        sceneAll: {

            default: [],
            type: [cc.String],
            visible() {
                return this.needSub;
            }
        },
        sceneAll2: {

            default: [],
            type: [cc.String],
            visible() {
                return this.needSub;
            }
        },
        nextScene: {
            default: "",
        },
    },

    
    onLoad() {
        
        globalData.getDataAll();
        
        if (AD.chanelName == "4399Box" && AD.chanelName == AD.chanelName1)
            AD_4399Box.init();
        AD.chanel = this.androidChanel;
        AD.isAndroid = this.isAndroid;

        if (!this.needSub) {
            cc.director.loadScene(this.nextScene);
            return;
        }

        this.progressID = 0;//场景加载的 个数
        this.bundleIndex = 0;//资源bundle的加载个数
        this.loadAst();

        this.dianArr = cc.find("Canvas/dianLabel").children;
        this.dianLabelNum = -1;
        var _duration = 0.2;
        this.schedule(() => {
            this.dianLabelNum++;
            // if(this.dianLabelNum%6==0)
            if (this.dianLabelNum % 20 < this.dianArr.length) {
                cc.tween(this.dianArr[this.dianLabelNum % 20])
                    .by(_duration, { y: 20, angle: -90 }, { easing: "sineInOut" })
                    .by(_duration * 2, { y: -20 }, { easing: "sineInOut" })
                    .start();
            }
        }, 0.1, 1000, 0.5)
        this.numLabel = cc.find("Canvas/numLabel").getComponent(cc.Label);

        this.progressNum = 0;
        this.numLabel.string = this.progressNum;
        this.hadChangeScene = false;
    },
    //第一步 先加载所有资源
    loadAst() {
        if (this.bundleAstNameArr.length <= 0) {
            this.loadSceneBundle2();
            return;
        }
        var self = this;
        cc.assetManager.loadBundle(this.bundleAstNameArr[this.bundleIndex], (err, bundle) => {

            if (err) {
                console.log("加载错误  " + err);
            }
            else {

                // console.log("资源 " + this.bundleAstNameArr[this.bundleIndex] + " 加载成功");
                this.bundleIndex++;
                if (this.bundleIndex < this.bundleAstNameArr.length) {
                    self.loadAst();
                }
                else {
                    // console.log("资源bundle加载完毕 开始加载scene资源")
                    self.loadSceneBundle2();//加载secene资源
                }
            }

        }); //加载场景资源


    },
    //第二部 加载场景
    loadSceneBundle() {
        var self = this;
        cc.assetManager.loadBundle(this.bundleSceneName, (err, bundle) => {
            if (err) {
                // console.log("加载错误 " + err);
                cc.director.loadScene(this.nextScene);
                return;
            }
            for (var i = 0; i < this.sceneAll.length; i++) {
                bundle.loadScene(self.sceneAll[i], (err, scene) => {
                    self.changeScene(scene);
                })
            }

        }); //加载场景资源
    },
    //第二部 加载场景
    loadSceneBundle2() {
        var self = this;
        cc.assetManager.loadBundle(this.bundleSceneName2, (err, bundle) => {
            if (err) {
                // console.log("加载错误 " + err);
                cc.director.loadScene(this.nextScene);
                return;
            }
            for (var i = 0; i < this.sceneAll2.length; i++) {
                bundle.loadScene(self.sceneAll2[i], (err, scene) => {
                    self.changeScene(scene);
                })
            }

        }); //加载场景资源
    },
    changeScene(_scene) {
        var self = this;
        this.progressID++;
        console.log(_scene.name + "=>加载成功  " + "  this.progressID  " + this.progressID);
        if (this.progressID == this.sceneAll2.length) {
            // cc.director.loadScene(this.nextScene);
            this.loadSceneBundle()
        }
    },
    update(dt) {

        if (!this.needSub) {
            return;
        }

        if (this.progressNum < (this.progressID / 6 * 100) + 5)
            this.progressNum++;

        else {
            if (this.progressNum < 80)
                this.progressNum += dt * 10;
        }
        if (this.progressNum <= 100)
            this.numLabel.string = parseInt(this.progressNum) + "%";
        else {
            this.numLabel.string = "100%";
            if (this.progressID >= 6) {
                if (!this.hadChangeScene) {
                    this.hadChangeScene = true;
                    this.scheduleOnce(() => {
                        cc.director.loadScene(this.nextScene);
                    }, 0.5)
                }
            }
        }
    },
});
