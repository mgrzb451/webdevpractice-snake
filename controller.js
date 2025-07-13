import { pubSub } from "./pub-sub.js";

export {Controller}

class Controller {
  constructor(model, mainView, snake, food) {
    this.model = model;
    this.mainView = mainView;
    this.snake = snake;
    this.food = food;
  }

  createSubscriptions() {
    pubSub.subscribe("gameStartRequested", (snakeSpeed)=>{
      this.snake.initSnake(snakeSpeed);
      this.food.spawnFood()
      this.food.spawnSuperFood()
    })

    pubSub.subscribe("steeringAction", (keyName)=>{
      this.snake.handleDirectionChange(keyName);
    })

    pubSub.subscribe("foodSpawned", (foodPickup)=>{
      // NOTE on using pubSub to not only call methods but also directly updating class attributes
      this.snake.foodPickup = foodPickup;
    })

    pubSub.subscribe("superFoodSpawned", (superFoodPickup)=>{
      this.snake.superFoodPickup = superFoodPickup;
    })

    pubSub.subscribe("foodPickedUp", (foodPickup)=>{
      this.food.clearFood(foodPickup);
      this.mainView.incrementCurrentScore();
      this.food.spawnFood();
    })

    pubSub.subscribe("superFoodPickedUp", (superFoodPickup)=>{
      this.food.clearSuperFood(superFoodPickup);
      this.mainView.incrementCurrentScore(2);
      this.food.spawnSuperFood();
    })

    pubSub.subscribe("gameOver", ()=>{
      // read the current score, update and display top score if lower
      const score = this.mainView.readCurrentScore();
      this.model.updateTopScore(score)
      const topScore = this.model.topScore;
      this.mainView.displayTopScore(topScore);

      // show an alert with score and refresh the page going back to main screen
      window.alert(`Game over! Your score: ${score}`);
      window.location.reload();
    })

    pubSub.subscribe("pageReady", ()=>{
      const topScore = this.model.topScore;
      this.mainView.displayTopScore(topScore);
    })
  }
}