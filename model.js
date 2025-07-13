import {pubSub} from "./pub-sub.js"

export {Model}

class Model {
  constructor() {
    // Initialize the top score as 0
    this.topScore = 0;
    // If there is a saved top score update its value
    this.getTopScore();
  }

  getTopScore() {
    // read top score from local storage
    const storedTopScore = localStorage.getItem("topScore");
    if (storedTopScore) {
      this.topScore = Number(localStorage.getItem("topScore"))
    }
  }

  updateTopScore(score) {
    if (score > this.topScore) {
      localStorage.setItem("topScore", score);
    }
  }
}

