
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AD.bgPreMng = this;
        this.chapterIndex = parseInt(globalData.levelNow / 10);
        for (var i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = (this.chapterIndex == i);
        }
        this.items = this.node.children[this.chapterIndex].children;
        for(var i=0;i<this.items.length;i++)
        this.items[i].active=false;
        this.itemsNum = this.items.length;
        this.moveRate = 0.7;//1 相对镜头静止 0 和前景一样的速度(相对前景静止)
    },

    start() {

    },
    reset(_mapWidth) {
        console.log("当前地图宽度是 " + _mapWidth)
        this.widthNow = 0;
        this.widthSum = _mapWidth;

        for (var i = 0; i < 4; i++) {
            this.createItem();
        }

        this.func = () => {
            this.createItem();
            if (this.widthNow >= this.widthSum * this.moveRate)
                this.unschedule(this.func);
        }

        this.schedule(this.func, 0.1)
    },
    createItem() {
        var _item = cc.instantiate(this.items[Tools.random(0, this.itemsNum - 1)]);
        _item.parent = this.node;
        _item.active = true
        var _scaleX = Tools.random(0, 1);
        if (_scaleX == 0)
            _scaleX = -1;
        _item.scaleX = _scaleX;
        _item.y = 0;
        _item.anchorY = 0;
        _item.x = this.widthNow;
        this.widthNow += _item.width + Tools.random(50, 300);

    },

    update(dt) {
        this.node.x = AD.gameScene.camera.x * this.moveRate;
        this.node.y = AD.gameScene.camera.y * this.moveRate - 360;
    },
});
