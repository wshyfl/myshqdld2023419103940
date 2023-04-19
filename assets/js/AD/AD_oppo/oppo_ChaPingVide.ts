
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const { ccclass, property } = cc._decorator;
/**插屏界面 */
@ccclass
export default class oppo_ChaPingVide extends cc.Component {

    /**当前界面节点 */
    @property({
        type: cc.Node,
        displayName: "当前界面节点"
    }) currentNode: cc.Node = null;
    /*title */
    @property({
        type: cc.Label,
        displayName: "title"
    }) title: cc.Label = null;
    /*desc */
    @property({
        type: cc.Label,
        displayName: "desc"
    }) desc: cc.Label = null;
    /**icon */
    @property({
        type: cc.Node,
        displayName: "icon"
    }) icon: cc.Node = null;
    /**img */
    @property({
        type: cc.Node,
        displayName: "img"
    }) img: cc.Node = null;


    onLoad() {
        if (window["AD"].chanelName1 != "oppo") {
            this.node.destroy();
        }

        this.node.destroy();
        cc.director.on("关闭插屏", (_uuid) => {
            if (this.node.uuid != _uuid) {
                this.node.destroy();
            }
        }, this);
        this.title.node.active = true;
        this.desc.node.active = true; this.title.node.scale = this.desc.node.scale = 0;
    }

    start() {

    }
    onEnable() {
        if (window["AD_oppo"].result == null) {
            this.currentNode.active = false;
            return;
        }
        this.currentNode.active = true;
        // this.currentNode.scale = 0.4;
        // this.currentNode.runAction(cc.scaleTo(0.2, 1, 1));
        cc.director.on("oppo_ChaPingShuaXin", this.dataUpdate, this); //刷新
        //广告点击
        this.img.on(cc.Node.EventType.TOUCH_START, () => {
            if (window["AD"].chanelName != window["AD"].chanelName1) return;
            this.reportAdClick();
            this.node.active = false;
        }, this);
        this.init();
    }
    onDisable() {
        cc.director.off("oppo_ChaPingShuaXin", this.dataUpdate, this);
        cc.director.off("关闭插屏", (_uuid) => {
            if (this.node.uuid != _uuid) {
                this.node.destroy();
            }
        }, this);
    }
    onDestroy() {

        // window["AD_oppo"].result = null;
    }
    /**初始化 */
    public init(): void {
        console.log("展示数据1")
        this.dataUpdate();
    }
    /**页面关闭 */
    public pageClose(): void {
        this.node.active = false;
    }
    /**数据刷新 */
    public dataUpdate(): void {
        var result = window["AD_oppo"].result;
        if (result != null && window["AD_oppo"].chaPingBoo == true) {
            this.currentNode.active = true;
            console.log("展示数据2")
            this.reportAdShow();
            this.title.string = result.title;
            this.desc.string = result.desc;
            console.log("展示数据3")
            // cc.director.emit("关闭插屏", this.node.uuid);
            console.log("展示数据3-1")
            //显示logo
            var remoteUrl = result.icon;
            var imgUrl = result.imgUrlList[0];
            console.log("展示数据3-2")
            var sprite = this.icon.getComponent(cc.Sprite)
            var imgspr = this.img.getComponent(cc.Sprite)
            console.log("展示数据4")
            if (remoteUrl != "") {
                this.icon.active = true;
                cc.loader.load(remoteUrl, (err, texture) => {
                    if (err) {
                        console.log(err);
                        return
                    }
                    var spriteFrame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = spriteFrame;
                });
                // if(this.type == 2){
                //     this.img.active = false;
                // }
            } else {
                this.icon.active = false;
                // if(this.type == 2){
                //     this.img.active = true;
                // }
            }

            console.log("展示数据5")
            //  else
            {
                //  this.iconY.active = false

                var pngStr = ".png";
                var pngBoo = imgUrl.indexOf(pngStr) >= 0;
                var jpgStr = ".jpg";
                var jpbBoo = imgUrl.indexOf(jpgStr) >= 0;
                if (pngBoo || jpbBoo) {
                    var urlString = imgUrl.split("?");
                    cc.assetManager.loadRemote(urlString[0], function (err, texture: any) {
                        if (err) {
                            console.log(err);
                            return
                        }
                        var spriteFramelogo = new cc.SpriteFrame(texture);
                        imgspr.spriteFrame = spriteFramelogo;
                    });
                } else {
                    cc.assetManager.loadRemote(imgUrl, { ext: '.png' }, function (err, texture: any) {
                        if (err) {
                            console.log(err);
                            // return
                        } else {
                            var spriteFramelogo = new cc.SpriteFrame(texture);
                            imgspr.spriteFrame = spriteFramelogo;
                        }
                    });
                }

            }

        } else {
            this.currentNode.active = false;
        }
    }
    reportAdClick() {
        var self = this;
        var result = window["AD_oppo"].result;
        var nativeAd = window["AD_oppo"].nativeAd;
        if (result != null) {
            nativeAd.reportAdClick({
                adId: result.adId.toString()
            });
            window["AD_oppo"].loadData();;

        }
    }
    reportAdShow() {
        if (window["AD_oppo"].reportingBoo == true) return;
        var self = this;
        var result = window["AD_oppo"].result;
        var nativeAd = window["AD_oppo"].nativeAd;
        if (result != null) {
            nativeAd.reportAdShow({
                adId: result.adId.toString()
            });
            window["AD_oppo"].reportingBoo = true;
        }
    }
    // update (dt) {}
    public touchHanler(e: cc.Event, name: string): void {
        switch (name) {
            case "点击":
                if (window["AD"].chanelName != window["AD"].chanelName1) return;
                this.reportAdClick();
                this.node.active = false;
                break;
            case "关闭":
                console.log("关闭插屏")
                if (window["AD"]["couldZDJ"]()) {
                    this.reportAdClick();
                }
                this.node.active = false;
                break;
        }

    }


}

