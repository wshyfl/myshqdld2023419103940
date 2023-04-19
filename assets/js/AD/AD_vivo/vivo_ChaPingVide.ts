
const { ccclass, property } = cc._decorator;
/**插屏界面 */
@ccclass
export default class vivo_ChaPingVide extends cc.Component {

    /**当前界面节点 */
    @property({
        type: cc.Node,
        displayName: "当前界面节点"
    }) currentNode: cc.Node = null;
    /*遮罩 */
    @property({
        type: cc.Node,
        displayName: "遮罩"
    }) zheZhao: cc.Node = null;
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
    @property({ displayName: "是banner吗" })
    isBanner = false
    @property({
        type: cc.Integer, displayName: "距离底部高度", visible() {
            return this.isBanner;
        }
    })
    h = 1
    timmerForShow = 0;
    timmerMax = 5;
    onLoad() {
        this.timmerForShow = 0;
        this.schedule(() => {
            this.timmerForShow++;
        }, 1);

        this.currentNode.on(cc.Node.EventType.TOUCH_START,()=>{
            if (window["AD"].chanelName == window["AD"].chanelName1) {
                this.reportAdClick();
                this.pageClose();
            }
        },this);
    }

    start() {
        if (window["AD"].chanelName1 != "vivo") {
            this.node.destroy();
        }


        cc.game.addPersistRootNode(this.node);
        var screenHeight = cc.winSize.height;
        var screenWidth = cc.winSize.width;
        this.node.x = (screenWidth) / 2;
        if (this.isBanner)
            this.node.y = this.h;
        else
            this.node.y = (screenHeight) / 2;
        this.node.group = "UI";

        if (this.isBanner) {
            cc.director.on("vivo_bannerShow", this.pageShow, this); //显示
            cc.director.on("vivo_bannerClose", this.pageClose, this); //关闭
            this.logFunc("banner **** 注册监听");
        }
        else {
            cc.director.on("vivo_ChaPingClose", this.pageClose, this); //关闭
            cc.director.on("vivo_ChaPingShow", this.pageShow, this); //显示
        }
        cc.director.on("vivo_dataShuaXin", this.dataUpdate, this); //刷新

    }



    /**设置位置 */
    public setLocation(_x: number, _y: number): void {
        this.node.x = _x;
        this.node.y = _y;
    }
    /**页面打开 */
    public pageShow(): void {
        this.logFunc("****pageShow");
        if (!this.isBanner) {
            if (window["AD_vivo"].chaPingBoo == false || this.timmerForShow < this.timmerMax) {
                return;
            }
        }
        else {
            this.logFunc("显示banner****pageShow");
        }
        this.timmerForShow = 0;
        this.currentNode.active = true;
        this.zheZhao.active = true;
        // this.currentNode.scale = 0.4;
        // this.currentNode.runAction(cc.scaleTo(0.2,1,1));
        this.dataUpdate();
    }
    /**页面关闭 */
    public pageClose(): void {
        this.currentNode.active = false;
        this.zheZhao.active = false;
        cc.director.emit("nextBxtnShow");
        if (this.isBanner)
            this.logFunc("banner关闭")
    }
    /**数据刷新 */
    public dataUpdate(): void {
        if (this.currentNode.active == false) return;
        var result = window["AD_vivo"].result;
        if (result != null) {
            if (!this.isBanner) {
                this.scheduleOnce(() => {
                    cc.director.emit("vivo_bannerClose");//隐藏banner
                }, 0.05);
                this.currentNode.scale = 0;
                this.zheZhao.opacity = 0;
                cc.tween(this.zheZhao)
                    .to(0.2, { opacity: 150 })
                    .start();
                cc.tween(this.currentNode)
                    .to(0.2, { scale: 1 })
                    .start();
            }

            this.currentNode.active = true;
            this.zheZhao.active = true;
            this.logFunc("展示数据2  ");
            if (!this.isBanner)
                this.logFunc("广告类型是 插屏 坐标是 " + this.node.position);
            else
                this.logFunc("广告类型是 banner 坐标是 " + this.node.position);
            this.reportAdShow()
            this.title.string = result.title;
            this.desc.string = result.desc;

            //显示logo
            var remoteUrl = result.icon;
            var imgUrl = result.imgUrlList[0]
            var sprite = this.icon.getComponent(cc.Sprite)
            var imgspr = this.img.getComponent(cc.Sprite)
            if (remoteUrl != "") {
                this.icon.active = true;
                cc.loader.load(remoteUrl, (err, texture) => {
                    if (err) {
                        this.logFunc(err);
                        return
                    }
                    var spriteFrame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = spriteFrame;
                });

            } else {
                this.icon.active = false;

            }

            //  else
            {


                var pngStr = ".png";
                var pngBoo = imgUrl.indexOf(pngStr) >= 0;
                var jpgStr = ".jpg";
                var jpbBoo = imgUrl.indexOf(jpgStr) >= 0;
                if (pngBoo || jpbBoo) {
                    var urlString = imgUrl.split("?");
                    cc.assetManager.loadRemote(urlString[0], function (err, texture: any) {
                        if (err) {
                            this.logFunc(err);
                            return
                        }
                        var spriteFramelogo = new cc.SpriteFrame(texture);
                        imgspr.spriteFrame = spriteFramelogo;
                    });
                } else {
                    cc.assetManager.loadRemote(imgUrl, { ext: '.png' }, function (err, texture: any) {
                        if (err) {
                            this.logFunc(err);
                            // return
                        } else {
                            var spriteFramelogo = new cc.SpriteFrame(texture);
                            imgspr.spriteFrame = spriteFramelogo;
                        }
                    });
                }

            }

        } else {
            if (this.isBanner)
                this.logFunc("banner原生数据为null ");
            this.currentNode.active = false;
            this.zheZhao.active = false;
        }
    }
    /**下载上报 */
    reportAdClick() {
        if (window["AD_vivo"].reportClick == true) return;

        var self = this;
        var result = window["AD_vivo"].result;
        var nativeAd = window["AD_vivo"].nativeAd;
        if (result != null) {
            nativeAd.reportAdClick({
                adId: result.adId.toString()
            });
            window["AD_vivo"].reportClick = true;
            this.logFunc("下载上报 &&  加载新数据");
            self.pageClose();

            window["AD_vivo"].loadData();
        }
    }
    /**显示上报 */
    reportAdShow() {
        if (window["AD_vivo"].reportShow == true) return;
        var self = this;
        var result = window["AD_vivo"].result;
        var nativeAd = window["AD_vivo"].nativeAd;
        if (result != null) {
            nativeAd.reportAdShow({
                adId: result.adId.toString()
            });
            window["AD_vivo"].reportShow = true;
            this.logFunc("展示上报");
        }


    }
    // update (dt) {}
    public touchHanler(e: cc.Event, name: string): void {
        switch (name) {
            case "点击":
                if (window["AD"].chanelName != window["AD"].chanelName1) return;
                this.reportAdClick();
                this.pageClose();
                break;
            case "关闭":
                this.logFunc("关闭插屏")
                if (window["AD_vivo"]["couldZDJ"]()) {
                    this.reportAdClick();
                }
                this.pageClose();
                break;
        }

    }
    logFunc(obj){
        console.log(obj);
    }
}

