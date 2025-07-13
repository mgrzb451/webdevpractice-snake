import { pubSub } from "./pub-sub.js";
import { DIFFICULTY } from "./snake-config.js";

export {MainView}

class MainView {
  constructor() {
    this.difficultyForm = document.getElementById("difficulty-form");
    this.difficultyForm.addEventListener("submit", this.startGame.bind(this));

    this.startScreen = document.getElementById("start-screen")
    this.gameboard = document.getElementById("gameboard");

    this.currentScoreDisplay = document.getElementById("current-score");
    this.topScoreDisplay = document.getElementById("top-score");


    // listen for key presses and relay the key name
    window.addEventListener("keydown", (event)=>{
      const eventKey = event.key;  
      pubSub.publish("steeringAction", eventKey);
    })
  }

  #readDifficulty(event) {
    event.preventDefault();
    return event.target.elements.difficulty.value;
  }

  startGame(event) {
    event.preventDefault();
    const selectedDifficulty = DIFFICULTY[this.#readDifficulty(event)];

    this.startScreen.classList.add("hidden")
    this.gameboard.classList.remove("hidden")

    pubSub.publish("gameStartRequested", selectedDifficulty);
  }

  incrementCurrentScore(value=1) {
    // add a number corresponding to the pickedup foods' value to the current score display
    let score = Number(this.currentScoreDisplay.textContent);
    score += value;
    this.currentScoreDisplay.textContent = score;
  }

  readCurrentScore() {
    return Number(this.currentScoreDisplay.textContent);
  }

  displayTopScore(topScore) {
    this.topScoreDisplay.textContent = topScore;
  }
}