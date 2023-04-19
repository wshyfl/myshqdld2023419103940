

cc.Class({
    extends: cc.Component,

    properties: {
        bgmGame: cc.AudioClip,
        bgmMenu: cc.AudioClip,
        bgmGame_shengHua: cc.AudioClip,
        sfxArr: {
            default: [],
            type: [cc.AudioClip]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        AD.audioMng = this;
        this.sfxId = -1;
    },

    start() {
        this.couldPlaySfx = true;
        this.durationPlay = [0, 0, 0, 0, 0, 0, 0];//音效播放间隔

        this.durationCoin = 0;
        this.valume = 0;
        this.audioIndex = -1;
        this.playBGM = false;
        this.bgmType = null;

        this.jinBiIndex = 0;
        this.jinBiDuration = 0.5;
        this.jinBiDurationTemp = 0.5;

        this.playDurationCoin = 0;
        this.playDurationDecorate = 0;
        this.targetValue = 0;
    },

    playSfx(_name, ...index) {

        var _sfxIndex = -1;
        var _isLoop = false;
        var _volume = 1;
        switch (_name) {
            case "弹簧":
                _sfxIndex = 0;
                break;
            case "枪声":
                _sfxIndex = 1;
                break;
            case "npc吃惊":
                _sfxIndex = 2;
                break;
            case "金币":
                if (this.jinBiDurationTemp > 0) {
                    this.jinBiIndex++;
                    if (this.jinBiIndex > 7)
                        this.jinBiIndex = 7;
                }
                else
                    this.jinBiIndex = 0;
                this.jinBiDurationTemp = this.jinBiDuration;
                _sfxIndex = 12 + this.jinBiIndex;
                break;
            case "吃星星":
                _sfxIndex = 3;
                break;
            case "水泡状态":
                if (AD.npcBallNum <= 0) {
                    _sfxIndex = 4;
                    _isLoop = true;
                }
                break;
            case "变成泡泡":
                _sfxIndex = 5;
                break;
            case "踢爆泡泡":
                _sfxIndex = 6;
                break;
            case "跳跃":
                _sfxIndex = 7;
                break;
            case "落水声":
                _sfxIndex = 8;
                break;
            case "击飞":
                _volume = 2;
                _sfxIndex = 9 + Tools.random(0, 2);
                break;
            case "npc害怕":
                _sfxIndex = 20;
                break;
            case "砖块破碎":
                _volume = 2;
                _sfxIndex = 21;
                break;
            case "颤抖":
                _sfxIndex = 22;
                break;
            case "飞入门":
                _volume = 1;
                _sfxIndex = 9;
                break;
            case "水泡破碎":
                _sfxIndex = 23;
                break;
            case "眩晕":
                _sfxIndex = 24;
                break;
            case "蓄力发射":
                _sfxIndex = 25;
                break;
            case "显示星星":
                _sfxIndex = 26;
                break;
            case "暂停":
                _sfxIndex = 27;
                break;
            case "星级":
                _sfxIndex = 28 + index[0];
                break;
            case "金币出现":
                _sfxIndex = 31;
                break;
            case "开宝箱":
                _sfxIndex = 32;
                break;
            case "爆踢":
                _sfxIndex = 33;
                break;
            case "物体出现":
                _sfxIndex = 34;
                break;
            case "开门":
                _sfxIndex = 35;
                break;
            case "关门":
                _sfxIndex = 36;
                break;
            case "门消失":
                _sfxIndex = 37;
                break;
            case "分数滚动":
                _sfxIndex = 38;
                break;
            case "过渡开始":
                _sfxIndex = 39;
                break;
            case "过渡结束":
                _sfxIndex = 40;
                break;
            case "提示音":
                _sfxIndex = 41;
                break;
            case "胜利欢呼":
                _sfxIndex = 42;
                break;
            case "失败":
                _sfxIndex = 43;
                break;
            case "显示隐藏":
                _sfxIndex = 44;
                break;
            case "补充水分":
                _sfxIndex = 45;
                break;
            case "飞币":
                if (this.playDurationCoin > 0)
                    return;
                this.playDurationCoin = 1;
                this.scheduleOnce(() => {
                    this.playDurationCoin = 0;
                }, 0.1)
                _sfxIndex = 46;
                break;
            case "受伤":
                _sfxIndex = 47;
                break;
            case "蓄力":
                _sfxIndex = 48;
                break;
            case "按钮":
                _sfxIndex = 49;
                break;
            case "切换":
                _sfxIndex = 50;
                break;
            case "抽奖":
                _sfxIndex = 51;
                break;
            case "装饰出现":
                if (this.playDurationDecorate > 0)
                    return;
                this.playDurationDecorate = 1;
                this.scheduleOnce(() => {
                    this.playDurationDecorate = 0;
                }, 0.1)
                _sfxIndex = 7;
                break;
            case "秒":
                _sfxIndex = 52;
                break;
            case "go":
                _sfxIndex = 53;
                break;

        }
        if (_sfxIndex != -1) {
            var _id = cc.audioEngine.play(this.sfxArr[_sfxIndex], _isLoop, _volume);

            switch (_name) {
                case "水泡状态":
                    this.idBall = _id;
                    break;
                case "蓄力":
                    this.idXuLi = _id;
                    console.log("蓄力id " + this.idXuLi);
                    break;
            }

            // cc.audioEngine.setFinishCallback(_id, function () {
            //     console.log("音效播放完毕");
            //     cc.director.emit("123木头人音效播放完毕");
            // });

        }
    },
    stopSfx(_name, ...index) {
        switch (_name) {
            case "水泡状态":
                if (AD.npcBallNum <= 0)
                    cc.audioEngine.stop(this.idBall);
                break;
            case "蓄力":
                console.log("蓄力id2** " + this.idXuLi);
                cc.audioEngine.stop(this.idXuLi);
                break;
        }
    },

    playMusic() {
        this.couldPlaySfx = true;
        // if (AD.wuDianRate <= 0 && AD.chanelName1 == "vivo")
        //     return


        AD.npcBallNum = 0
        cc.audioEngine.stop(this.idBall);

        if (cc.director.getScene().name == "gameScene" || cc.director.getScene().name == "gamePVP") {
            this.bgmType = "game";
            this.audioIndex = cc.audioEngine.playMusic(this.bgmGame, true);

        }
        else {
            if (this.bgmType == "menu") return;
            this.bgmType = "menu";
            this.audioIndex = cc.audioEngine.playMusic(this.bgmMenu, true);
        }
        // this.audioIndex = cc.audioEngine.playMusic(this.bgmGame, true);

        console.log("播放背景音乐")
        this.valume = 0;
        this.playBGM = true;
        cc.audioEngine.setVolume(this.audioIndex, this.valume);
    },
    stopMusic(...targetMinValue) {
        this.playBGM = false;
        console.log("停止背景音乐")
        this.couldPlaySfx = false;
        cc.audioEngine.setVolume(this.audioIndex, 0);
        this.targetValue = 0;
        if (targetMinValue[0])
            this.targetMinValue = targetMinValue[0];
    },

    update(dt) {
        if (this.jinBiDurationTemp > 0) {
            this.jinBiDurationTemp -= dt;
        }
        if (this.playBGM) {
            if (this.valume < 0.7) {
                this.valume += dt * 0.3
                if (this.valume >= 0.7)
                    this.valume = 0.7;
                cc.audioEngine.setVolume(this.audioIndex, this.valume);
            }
        }
        else {
            if (this.valume > 0) {
                this.valume -= dt * 0.5;
                if (this.valume < this.targetMinValue) {
                    this.valume = this.targetMinValue;
                    // cc.audioEngine.stopMusic(this.bgmGame);
                    // cc.audioEngine.stopMusic(this.bgmMenu);

                }
                cc.audioEngine.setVolume(this.audioIndex, this.valume);
            }
        }
    },
});
