

cc.Class({
    extends: cc.Component,

    properties: {
        decorateItem: cc.Prefab,
        sprArr1: [cc.SpriteFrame],
        sprArr2: [cc.SpriteFrame],
        sprArr3: [cc.SpriteFrame],
        sprArr4: [cc.SpriteFrame],


    },

    onLoad() {
        AD.decorateMng = this;
        
        this.chapterIndex = 0;
        this.chapterIndexMax = 0;
        this.angleNow = 45;
        
        this.createFunc();
    },

    start() {

    },
    createFunc() {
        var _item = cc.instantiate(this.decorateItem);
        _item.parent = this.node;
    },

    // update (dt) {},
});
