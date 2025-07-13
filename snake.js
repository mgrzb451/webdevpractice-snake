import { pubSub } from "./pub-sub.js";
import { CELL_COUNT } from "./snake-config.js";
export { Snake }

class Snake {
  constructor() {
    // 2D list storing all cells 
    this.cells = [];

    // HTML section - container for the cells
    this.gameboard = document.getElementById("gameboard")
    // HTML template of a single empty cell
    this.cellTemplate = document.getElementById("cell-template")
    
    // array holding snake segment divs
    this.snakeSegments = [];

    this.lastKeyName;
    this.direction = [1, 0];

    this.lossCondition = false;
    this.foodPickup;
    this.superFoodPickup;
  }
  
  #addSnakeSegment(row=15, column=15) {
    // Function to add new <div> segments from the template to the snake and to the snakeSegments array
    const cellTemplateMarkup = this.cellTemplate.content.cloneNode(true);
    const snakeSegment = cellTemplateMarkup.getElementById("cell")
    snakeSegment.classList.add("snake");
    // starting position for the snake head
    snakeSegment.style = `grid-area: ${row} / ${column}`
    this.snakeSegments.push(snakeSegment)
  }

  #growSnake() {
  // Function to add new <div> segments from the template to the snake and to the snakeSegments array
  const cellTemplateMarkup = this.cellTemplate.content.cloneNode(true);
  const snakeSegment = cellTemplateMarkup.getElementById("cell")
  snakeSegment.classList.add("snake");
  
  // position for the new segment.
  // We're adding a new segment behind the last segment taking into account the current snake direction
  const row = Number(this.snakeSegments.at(-1).style.gridRow);
  const column = Number(this.snakeSegments.at(-1).style.gridColumn);
  snakeSegment.style = `grid-area: ${row - this.direction[0]} / ${column - this.direction[1]}`
  this.snakeSegments.push(snakeSegment)
}

  #drawSnake(segment) {
    // add the segment div to the HTML
    this.gameboard.append(segment);
  }

  #stepSnake(segment, previousRow, previousColumn) {
    const row = Number(segment.style["grid-row-start"])
    const column = Number(segment.style["grid-column-start"])
    
    if (previousRow && previousColumn) {
      // Moving the body to the position of the previous segment
      segment.style = `grid-area: ${previousRow} / ${previousColumn}`;
    }
    else {
      // moving the head. There's no previous row or column
      segment.style = `grid-area: ${row + this.direction[0]} / ${column + this.direction[1]}`;
    }
    return [row, column];
  }

  initSnake(snakeSpeed) {
    // draw the initial head of the snake
    this.#addSnakeSegment();

    const moveSnakeId = setInterval(()=>{

      // Check if any of the loss conditions have been met and stop the function and cancel the interval
      // publish the game over event
      if (this.lossCondition) {
        clearInterval(moveSnakeId)
        pubSub.publish("gameOver")
        return
      }

      // every snakeSpeed ms loop through the segments array update the position on the grid and redraw the snake
      let previousRow = null;
      let previousColumn = null;
      for (let i=0; i<this.snakeSegments.length; i+=1) {
        const segment = this.snakeSegments[i];  
        if (i===0) {
          // Considering the Head segment
          this.#checkWallCollision();
          this.#drawSnake(segment);
          [previousRow, previousColumn] = this.#stepSnake(segment, previousRow, previousColumn);
          this.#checkFoodCollision(this.foodPickup);
          if (this.superFoodPickup) {
            this.#checkSuperFoodCollision(this.superFoodPickup);
          }
        }
        else {
          // consider the rest of the snake
          this.#checkSelfCollision(segment);
          this.#drawSnake(segment);
          [previousRow, previousColumn] = this.#stepSnake(segment, previousRow, previousColumn);
        }
      }
    }, snakeSpeed);
  }

  handleDirectionChange(keyName) {
    if (keyName === "ArrowUp" && this.lastKeyName !== "ArrowDown") {
        this.lastKeyName = "ArrowUp"
        this.direction = [-1, 0];
      }
      else if (keyName === "ArrowDown" && this.lastKeyName !== "ArrowUp") {
        this.lastKeyName = "ArrowDown"
        this.direction = [1, 0];
      }
      else if (keyName === "ArrowLeft" && this.lastKeyName !== "ArrowRight") {
        this.lastKeyName = "ArrowLeft"
        this.direction = [0, -1];
      }
      else if (keyName === "ArrowRight" && this.lastKeyName !== "ArrowLeft") {
        this.lastKeyName = "ArrowRight"
        this.direction = [0, 1];
      }
  }

  #checkWallCollision() {
    // Check for collision with wall
    const sneakHead = this.snakeSegments[0];
    const sneakHeadRow = Number(sneakHead.style.gridRow);
    const sneakHeadColumn = Number(sneakHead.style.gridColumn);
    if (sneakHeadRow < 1 || sneakHeadRow > CELL_COUNT) {
      this.lossCondition = true;
    } else if (sneakHeadColumn < 1 || sneakHeadColumn > CELL_COUNT) {
      this.lossCondition = true;
    }
  }

  #checkSelfCollision(segment) {
    const segmentRow = Number(segment.style.gridRow);
    const segmentColumn = Number(segment.style.gridColumn);
    const sneakHeadRow = Number(this.snakeSegments[0].style.gridRow);
    const sneakHeadColumn = Number(this.snakeSegments[0].style.gridColumn);
    
    if (segmentRow === sneakHeadRow && segmentColumn === sneakHeadColumn) {
      this.lossCondition = true;
    }
  }

  #checkFoodCollision(foodPickup) {
    const foodRow = Number(foodPickup.style["grid-row-start"])
    const foodColumn = Number(foodPickup.style["grid-column-start"])

    const sneakHead = this.snakeSegments[0];
    const sneakHeadRow = Number(sneakHead.style.gridRow);
    const sneakHeadColumn = Number(sneakHead.style.gridColumn);
    
    // regular food
    if (sneakHeadRow === foodRow && sneakHeadColumn === foodColumn) {
      // grow snake
      this.#growSnake();
      pubSub.publish("foodPickedUp", foodPickup);
    }
  }

  #checkSuperFoodCollision(superFoodPickup) {
    const superFoodRow = Number(superFoodPickup.style["grid-row-start"])
    const superFoodColumn = Number(superFoodPickup.style["grid-column-start"])

    const sneakHead = this.snakeSegments[0];
    const sneakHeadRow = Number(sneakHead.style.gridRow);
    const sneakHeadColumn = Number(sneakHead.style.gridColumn);
    
    if (sneakHeadRow === superFoodRow && sneakHeadColumn === superFoodColumn) {
      this.#growSnake();
      pubSub.publish("superFoodPickedUp", superFoodPickup);
    }
  }
}