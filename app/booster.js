

class Booster {
  constructor(multiplier, cost, timer){
    this.activated = false;
    this.available = true;
    this.multiplier = multiplier;
    this.cost = cost;
    this.timer = timer;
  }

}
module.exports = Booster;
