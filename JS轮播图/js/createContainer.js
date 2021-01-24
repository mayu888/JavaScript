"use strict";
class Container extends ContainerUtils {
    constructor(config) {
        super();
        this.config = config;
        const { container, imgContainer, processDotContainer, img, btnConfig, } = config;
        this.container = container;
        this.imgContainer = imgContainer;
        this.processDotContainer = processDotContainer;
        this.img = img;
        this.bannerCache = this.createImageMap(img);
        this.btnCache = this.handleBtnConfig(btnConfig);
        this.dotCache = this.appendDot();
        this.appendImage();
        const { width, height } = this.getSize(this.imgContainer);
        this.WIDTH = width;
        this.HEIGHT = height;
    }
    // 抽象类方法：创建图片map
    createImageMap(images) {
        return images.map((item) => {
            if (typeof (item) === 'string') {
                const img = new Image();
                img.src = item;
                return img;
            }
            return item;
        });
    }
    // 抽象类方法：定义获取容器尺寸的方法
    getSize(ele) {
        return { width: ele.clientWidth, height: ele.clientHeight };
    }
    handleBtnConfig(btnConfig) {
        const { leftBtnContainer, rightBtnContainer, leftBtn, rightBtn } = btnConfig;
        const map = new Map([
            [leftBtn, leftBtnContainer],
            [rightBtn, rightBtnContainer]
        ]);
        return [...map.entries()].map((item, index) => {
            const [key, value] = item;
            if (key && value) {
                let img;
                if (typeof (key) === 'string') {
                    img = new Image();
                    img.src = key;
                }
                else {
                    img = key;
                }
                // utils.addEvent('click',this.handleBtnClick.bind(this), img)
                const className = index === 0 ? "left" : "right";
                img.setAttribute("class", className);
                img.type = className;
                value.appendChild(img);
            }
            return value;
        });
    }
    appendImage(currentImage = 0) {
        this.imgContainer.appendChild(this.bannerCache[currentImage]);
    }
    appendDot() {
        if (!this.processDotContainer)
            return;
        const fragment = document.createDocumentFragment();
        const dotCache = this.bannerCache.map((_, index) => {
            const dot = document.createElement("li");
            dot.setAttribute("class", "process_dot");
            fragment.appendChild(dot);
            return dot;
        });
        this.processDotContainer.appendChild(fragment);
        return dotCache;
    }
}
