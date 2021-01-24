declare namespace Utils{
  type EventListener = (type:string, callback:(evt:MouseEvent | Event) => any,target?:HTMLElement | Window) => void;
  type SetStyle = <T extends HTMLElement>(element:T, style:object)=>T;
  type GetFPS = () => number;
  type ComputeSpeed = (fps:number, slideTime:number, width:number) => number;
  interface UtilsClass{
    addEvent: Common.EventListener;
    removeEvent: Common.EventListener;
    getFPS:GetFPS,
    computeSpeed:ComputeSpeed;
  }
}

declare namespace ContainerUtils{
  type CreateImageMap = <T extends Array<string | HTMLElement>>(images:T) => HTMLElement[];
  type GetSize = (ele:HTMLElement) => { width:number, height: number };
}

interface Container{
    container: HTMLElement;
    imgContainer: HTMLElement;
    processDotContainer: HTMLElement | undefined;
    img:Array<string | HTMLElement>;
}

interface DataClass{
  slideTime: number;
  autoPlay: boolean;
  autoPlayTime: number;
  speed: number;
}

declare namespace Carousel{
  type BtnContainerMap = HTMLElement | undefined;
  type BtnMap = HTMLImageElement | string | undefined;
  type BtnMapItem = [BtnMap,BtnContainerMap]
  interface BtnConfig{
    leftBtnContainer?: HTMLElement;
    rightBtnContainer?: HTMLElement;
    leftBtn?: HTMLImageElement | string;
    rightBtn?: HTMLImageElement | string;
  }

  type Function = () => void;
  type BindProxy = (object:object, callback:(fn:FunctionI) => object, targetChangeCallback:FunctionI) => any;

  interface Config{
    container:HTMLElement; 
    imgContainer:HTMLElement; 
    processDotContainer?:HTMLElement;
    img:Array<string | HTMLElement>;
    btnConfig?:BtnConfigI;
    leftClick:string;
    rightClick:string;
    autoPlay?:boolean;
    autoPlayTime?:number;
    slideTime?:number;
  }
  interface ImgBtn extends HTMLImageElement{
    type?:string;
  }
  type objectKey = {[key:string]:any}
  interface currentImageInit extends objectKey{ index:number }
  interface SizeInfo extends objectKey{ height?:number, width?:number };
}