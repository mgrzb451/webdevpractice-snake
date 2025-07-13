// A class that spawns foods and superfoods. It needs access to snake.segments to know where NOT to spawn food.

import { pubSub } from "./pub-sub.js"
import { CELL_COUNT } from "./snake-config.js"

export {Food}

class Food {
  constructor(){
    this.gameboard = document.getElementById("gameboard");
    this.cellTemplate = document.getElementById("cell-template");

     this.superFoodTimeoutId;
  }

  #getRandomPosition() {
    // generate a random row or column number
    const row = Math.floor(Math.random() * CELL_COUNT) + 1;
    const col = Math.floor(Math.random() * CELL_COUNT) + 1;
    // TODO: check if the selected row and column is free of any snakeSegments
    return [row, col]
  }


  spawnFood() {
    const [row, column] = this.#getRandomPosition();
    const cellTemplateMarkup = this.cellTemplate.content.cloneNode(true);
    const foodPickup = cellTemplateMarkup.getElementById("cell")
    foodPickup.classList.add("food");
    foodPickup.style = `grid-area: ${row} / ${column}`;
    this.gameboard.append(foodPickup)
    pubSub.publish("foodSpawned", foodPickup)
  }

  clearFood(foodPickup) {
    foodPickup.remove()
  }

  spawnSuperFood() {
    const superFoodDelay = (Math.ceil(Math.random() * 10) + 5) * 1000;
    console.log(`Super food delay: ${superFoodDelay}`)

    this.superFoodTimeoutId = setTimeout(()=>{
      const [row, column] = this.#getRandomPosition();
      const cellTemplateMarkup = this.cellTemplate.content.cloneNode(true);
      const superFoodPickup = cellTemplateMarkup.getElementById("cell")
      superFoodPickup.classList.add("superfood");
      superFoodPickup.style = `grid-area: ${row} / ${column}`;
      this.gameboard.append(superFoodPickup)
      pubSub.publish("superFoodSpawned", superFoodPickup)
    }, superFoodDelay)
  }

  clearSuperFood(superFoodPickup) {
    superFoodPickup.remove();
    clearTimeout(this.superFoodTimeoutId);
  }
}