

class Utils implements Utils.UtilsClass{
  public readonly addEvent:Utils.EventListener = (type, callback, target = window):void => {
    return target.addEventListener(type, callback);
  }

  public readonly removeEvent:Utils.EventListener = (type, callback, target = window):void => {
    return target.removeEventListener(type, callback);
  };

  public readonly setStyle:Utils.SetStyle = (element, style = {}) => {
    Object.assign(element.style, style);
    return element;
  };

  public readonly computeSpeed:Utils.ComputeSpeed = (fps,slideTime,width) => {
    const rCount:number = 1000 / fps;
    return width / (slideTime / rCount);
  }

  public readonly getFPS:Utils.GetFPS = () => {
    let now:number = Date.now();
    let lastNow:number = Date.now();
    let count:number = 0;
    let countTotal:number = 0;
    let fps:number = 60;
    const countArr:number[] = [];
    
    let computeFrame:null | number = null;
    const compute = ():void => {
      now = Date.now();
      count++;
      computeFrame = requestAnimationFrame(compute);
      if (now - lastNow >= 1000) {
        lastNow = Date.now();
        const length:number = countArr.push(count);
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
  }

}
const utils:Utils.UtilsClass = new Utils();