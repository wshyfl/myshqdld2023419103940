

cc.Class({
    extends: cc.Component,

    properties: {
        player: [cc.Node]
    },

    // onLoad () {},

    start() {
        AD.playerMngPVP = this;
        for (var i = 0; i < 6; i++)
         {
            this.player[i].position =
            AD.mapMng.revivePosArr[i];
            this.player[i].getComponent("playerPVP").reset(i);
         }
    },

    // update (dt) {},
});
