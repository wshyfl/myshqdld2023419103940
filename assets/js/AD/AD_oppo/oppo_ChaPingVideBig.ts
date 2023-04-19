
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

    chaPingSecond = 0;
    onLoad() {
        console.log("显示原生插屏  00000");
        if (window["AD"].chanelName != window["AD"].chanelName1 || window["AD"].chanelName1 != "oppo" ) {
            this.node.destroy();
            return;
        }
        console.log("显示原生插屏  1111");

        cc.game.addPersistRootNode(this.node);

        this.currentNode.active = false;
        this.node.scale = 0;
        this.title.node.active = true;
        this.desc.node.active = true; this.title.node.scale = this.desc.node.scale = 0;
    }
    chaPingShow() {
        this.chaPingSecond = 5;
        setTimeout(() => {
            this.chaPingSecond = 0;
        }, 5000)
    }
    start() {
        cc.director.on("oppo_ChaPingShuaXin", this.dataUpdate, this); //刷新
        cc.director.on("显示原生大插屏", () => {
            console.log("显示原生插屏  " + window["AD_oppo"].result)
            console.log("显示原生插屏  2222");
            if (window["AD_oppo"].result != null) {

                console.log("显示原生插屏  3333");
                this.dataUpdate();
                this.scheduleOnce(() => {
                    this.node.scale = 1;
                }, 1)
            }
        }, this);

        //广告点击
        this.img.on(cc.Node.EventType.TOUCH_START, () => {
            this.reportAdClick();
            this.currentNode.active = false;
        }, this);

    }
    onEnable() {

        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;
    }

    /**数据刷新 */
    public dataUpdate(): void {
        console.log("插屏时间 " + this.chaPingSecond)
        if (this.chaPingSecond > 0) {
            this.currentNode.active = false;
            this.node.scale = 0;
            return;
        }
        var result = window["AD_oppo"].result;
        if (result != null && window["AD_oppo"].chaPingBoo == true) {
            this.currentNode.active = true;
            this.reportAdShow();
            this.title.string = result.title;
            this.desc.string = result.desc;
            //显示logo
            var remoteUrl = result.icon;
            var imgUrl = result.imgUrlList[0];
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
            console.log("广告展示 上报成功")
        }
    }
    // update (dt) {}
    public touchHanler(e: cc.Event, name: string): void {
        switch (name) {
            case "点击":
                if (window["AD"].chanelName != window["AD"].chanelName1) return;
                this.reportAdClick();
                this.currentNode.active = false
               this.chaPingShow();//插屏倒计时间隔
                break;
            case "关闭":
                console.log("关闭插屏")
                if (window["AD"]["couldZDJ"]()) {
                    this.reportAdClick();
                }
                this.currentNode.active = false;
                this.node.scale = 0;
                this.chaPingShow();//插屏倒计时间隔
                break;
        }

    }


}

