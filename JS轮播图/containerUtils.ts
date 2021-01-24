
abstract class ContainerUtils{
  protected abstract createImageMap<T extends Array<string | HTMLElement>>(images:T):HTMLElement[];
  protected abstract getSize(ele:HTMLElement):{ width:number, height: number };
}