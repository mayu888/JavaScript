

class InitState{
  constructor() {
    this.MoneyData = [];
    this.FireDate = [];
    this.MoveFireData = [];
    this.WallData = [];
    this.Player = null;
  }

  saveData = (store,value) => {
    store.push(value);
  }

}


function runGame(template, contentClassName) {
  if (!template || !contentClassName) return;
  const content = document.querySelector(contentClassName);
  content.innerHTML = "";
  
}