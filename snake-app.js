import { pubSub } from "./pub-sub.js"
import { Controller } from "./controller.js"
import { Model } from "./model.js"
import { MainView } from "./main-view.js"
import { Snake } from "./snake.js"
import { Food } from "./food.js"

const model = new Model();
const mainView = new MainView();
const snake = new Snake();
const food = new Food();
const controller = new Controller(model, mainView, snake, food);

controller.createSubscriptions();
pubSub.publish("pageReady", undefined);

