
class Container extends ContainerUtils implements Container{
  public container: HTMLElement;
  public imgContainer: HTMLElement;
  public processDotContainer: HTMLElement | undefined;
  public img:Array<string | HTMLElement>;
  protected bannerCache: HTMLElement[];
  protected btnCache: Array<HTMLElement | undefined>;
  protected dotCache:HTMLElement[] | undefined;
  protected WIDTH:number;
  protected HEIGHT:number;
  constructor(public readonly config:Carousel.Config){
    super()
    const {
      container,
      imgContainer,
      processDotContainer,
      img,
      btnConfig,
    } = config;
    this.container = container;
    this.imgContainer = imgContainer;
    this.processDotContainer = processDotContainer;
    this.img = img;
    this.bannerCache = this.createImageMap(img);
    this.btnCache = this.handleBtnConfig(btnConfig);
    this.dotCache = this.appendDot();
    this.appendImage();
    const  { width, height } = this.getSize(this.imgContainer);
    this.WIDTH = width;
    this.HEIGHT = height;
  }

    // 抽象类方法：创建图片map
  protected createImageMap<T extends Array<string | HTMLElement>>(images:T):HTMLElement[]{
    return images.map((item:HTMLElement | string)=>{
      if(typeof(item) === 'string'){
        const img:HTMLImageElement = new Image();
        img.src = item;
        return img;
      }
      return item;
    })
  }

  // 抽象类方法：定义获取容器尺寸的方法
  protected getSize(ele:HTMLElement){
    return  { width: ele.clientWidth, height:ele.clientHeight }
  }

  protected handleBtnConfig(btnConfig:Carousel.BtnConfig) {
    const { leftBtnContainer, rightBtnContainer, leftBtn, rightBtn } = btnConfig;
    const map:Map<Carousel.BtnMap,Carousel.BtnContainerMap> = new Map([
      [leftBtn,leftBtnContainer],
      [rightBtn,rightBtnContainer]
    ]);
    return [...map.entries()].map((item:Carousel.BtnMapItem,index:number)=>{
      const [key,value] = item;
      if(key && value){
        let img:Carousel.ImgBtn;
        if(typeof(key) === 'string'){
          img = new Image();
          img.src = key;
        }else{
          img = key;
        }
        // utils.addEvent('click',this.handleBtnClick.bind(this), img)
        const className :string = index === 0 ? "left" : "right";
        img.setAttribute("class", className);
        img.type = className;
        value.appendChild(img)
      }
      return value;
    })
  }

  protected appendImage(currentImage:number = 0):void{
    this.imgContainer.appendChild(this.bannerCache[currentImage]);
  }

  private appendDot() {
    if(!this.processDotContainer) return;
    const fragment:DocumentFragment = document.createDocumentFragment();
    const dotCache = this.bannerCache.map((_, index:number) => {
      const dot:HTMLLIElement = document.createElement("li");
      dot.setAttribute("class", "process_dot");
      fragment.appendChild(dot);
      return dot;
    });
    this.processDotContainer.appendChild(fragment);
    return dotCache;
  }
}