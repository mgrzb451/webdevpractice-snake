export {pubSub}

class PubSub {
  constructor() {
    this.events = {}
  }

  subscribe(eventName, callBackFunction) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callBackFunction);
  }

  publish(eventName, eventData) {
    if (this.events[eventName]) {
      for (let callBackFunction of this.events[eventName]) {
        callBackFunction(eventData);
      }
    }
    else {
      throw new Error(`Event ${eventName} not found in pubSub.events`)
    }
  }
}

const pubSub = new PubSub();

