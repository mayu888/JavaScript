"use strict";
/*
  * configs 传入的配置
  * Container 轮播图的容器
  * img 轮播图图片  src或者具体元素
  * bannerCache 轮播图片缓存的map
  * btnCache 左右切换按钮缓存的map
  * leftClick 左轮播按钮
  * rightClick 右轮播按钮
  * autoPlay 是否自动轮播
  * slideTime 滑动过程的时间
  * autoPlayTime 每隔多久轮播一次
  *
  *
*/
class Carousel extends Data {
    constructor(config) {
        super(config);
        this.config = config;
        this.configs = config;
        const currentImageInit = { index: 0 };
        this.currentImage = Carousel.bindProxy(currentImageInit, this.currentImageChange, this.currentImageChangeCallback.bind(this));
        this.autoPlaying = false; //当前是否正在自动轮播
        this.isPlaying = false; //当前是否正在轮播
        this.direction = '';
        // utils.addEvent("resize", this.getSize.bind(this));
        this.animation();
        this.autoPlayEvent();
        this.addMouseEvent();
        this.addEvent();
        this.carousel = [];
    }
    addEvent() {
        this.btnCache.forEach(ele => {
            utils.addEvent('click', this.handleBtnClick.bind(this), ele);
        });
        this.dotCache?.forEach((dot, index) => {
            if (index === this.currentImage.index) {
                dot.setAttribute("active", 'true');
            }
            utils.addEvent("click", this.handleDotClick.bind(this, index), dot);
        });
    }
    autoPlayEvent() {
        if (this.autoPlay) {
            this.autoPlaying = true;
        }
    }
    addMouseEvent() {
        if (this.autoPlay && this.carousel) {
            utils.addEvent("mouseenter", this.handleMouse.bind(this), this.carousel);
            utils.addEvent("mouseleave", this.handleMouse.bind(this), this.carousel);
        }
    }
    handleMouse(e) {
        if (e.type === "mouseenter") {
            this.autoPlaying = false;
        }
        if (e.type === "mouseleave") {
            this.autoPlaying = true;
        }
    }
    appendImage(currentImage = 0) {
        this.imgContainer.appendChild(this.bannerCache[currentImage]);
    }
    currentImageChange(callback) {
        return {
            get: (target, key) => {
                return target[key];
            },
            set: (target, key, value) => {
                const change = Reflect.set(target, key, value);
                callback && callback();
                return change;
            },
        };
    }
    handleDotClick(index, e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.isPlaying)
            return;
        if (index > this.currentImage.index) {
            this.direction = "right";
        }
        if (index < this.currentImage.index) {
            this.direction = "left";
        }
        this.currentImage.index = index;
    }
    currentImageChangeCallback() {
        const type = this.direction;
        this.imgContainer.style.width = this.WIDTH * 2 + "px";
        if (type === "left") {
            this.imgContainer.insertBefore(this.bannerCache[this.currentImage.index], this.imgContainer.firstElementChild);
            this.imgContainer.style.left = -this.WIDTH + "px";
        }
        else {
            this.appendImage(this.currentImage.index);
        }
        const index = this.currentImage.index;
        this.dotCache && this.dotCache.forEach((dot, dotIndex) => {
            if (index === dotIndex) {
                return dot.setAttribute("active", 'true');
            }
            dot.setAttribute("active", 'false');
        });
        this.isPlaying = true;
    }
    handleBtnClick(e) {
        if (this.isPlaying)
            return;
        e.preventDefault();
        e.stopPropagation();
        const { type = 'left' } = e.target;
        let currentImage;
        this.direction = type;
        if (type === "left") {
            currentImage = this.currentImage.index - 1;
            if (currentImage < 0) {
                currentImage = this.bannerCache.length - 1;
            }
            this.currentImage.index = currentImage;
            return;
        }
        if (type === "right") {
            currentImage = this.currentImage.index + 1;
            if (currentImage >= this.bannerCache.length) {
                currentImage = 0;
            }
            this.currentImage.index = currentImage;
            return;
        }
    }
    carouselPlaying() {
        if (!this.isPlaying)
            return;
        const direction = this.direction;
        const imgContainer = this.imgContainer;
        const speed = this.speed;
        if (direction === "left") {
            imgContainer.style.left = imgContainer.offsetLeft + speed + "px";
            if (imgContainer.offsetLeft >= 0) {
                this.isPlaying = false;
                imgContainer.lastElementChild && imgContainer.lastElementChild.remove();
                imgContainer.style.left = "0px";
            }
        }
        else if (direction === "right") {
            imgContainer.style.left = imgContainer.offsetLeft - speed + "px";
            if (imgContainer.offsetLeft <= -this.WIDTH) {
                this.isPlaying = false;
                imgContainer.firstElementChild && imgContainer.firstElementChild.remove();
                imgContainer.style.left = "0px";
            }
        }
    }
    handleAutoPlay() {
        if (!this.autoPlaying)
            return;
        this.cuteTime--;
        if (this.cuteTime > 0)
            return;
        this.cuteTime = this.autoPlayTime;
        const evt = new MouseEvent("click");
        this.btnCache[1] && this.btnCache[1].dispatchEvent(evt);
    }
    animation() {
        requestAnimationFrame(this.animation.bind(this));
        this.carouselPlaying();
        this.handleAutoPlay();
    }
}
Carousel.bindProxy = (object, callback, targetChangeCallback) => {
    const proxy = new Proxy(object, callback(targetChangeCallback));
    return proxy;
};
// new Banner(config);
