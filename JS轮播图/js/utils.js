"use strict";
class Utils {
    constructor() {
        this.addEvent = (type, callback, target = window) => {
            return target.addEventListener(type, callback);
        };
        this.removeEvent = (type, callback, target = window) => {
            return target.removeEventListener(type, callback);
        };
        this.setStyle = (element, style = {}) => {
            Object.assign(element.style, style);
            return element;
        };
        this.computeSpeed = (fps, slideTime, width) => {
            const rCount = 1000 / fps;
            return width / (slideTime / rCount);
        };
        this.getFPS = () => {
            let now = Date.now();
            let lastNow = Date.now();
            let count = 0;
            let countTotal = 0;
            let fps = 60;
            const countArr = [];
            let computeFrame = null;
            const compute = () => {
                now = Date.now();
                count++;
                computeFrame = requestAnimationFrame(compute);
                if (now - lastNow >= 1000) {
                    lastNow = Date.now();
                    const length = countArr.push(count);
                    countTotal = countTotal + count;
                    count = 0;
                    if (length === 3) {
                        fps = Math.round(countTotal / 3);
                        cancelAnimationFrame(computeFrame);
                    }
                }
            };
            compute();
            return fps;
        };
    }
}
const utils = new Utils();
