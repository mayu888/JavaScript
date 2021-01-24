"use strict";
class Data extends Container {
    constructor(config) {
        super(config);
        this.config = config;
        const { slideTime = 1500, autoPlay = false, autoPlayTime = 3000, } = config;
        this.slideTime = slideTime;
        this.autoPlay = autoPlay;
        this.FPS = utils.getFPS(); // 帧数，默认60
        this.autoPlayTime = autoPlayTime / (1000 / this.FPS);
        this.cuteTime = this.autoPlayTime;
        this.speed = utils.computeSpeed(this.FPS, this.slideTime, this.WIDTH);
    }
}
