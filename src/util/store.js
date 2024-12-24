// store.js

class Store {
  constructor() {
    (this.state = {}), (this.listeners = {});
  }

  getState(key) {
    return key ? this.state[key] : this.state;
  }

  setState(key, value) {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify(key);
    }
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  unsubscribe(key, callback) {
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key].filter((cb) => cb !== callback);
    }
  }

  notify(key) {
    if (this.listeners[key]) {
      this.listeners[key].forEach((cb) => {
        cb(this.state[key]);
      });
    }
  }

  resetState() {
    this.state = {};
  }
}

const store = new Store();
export default store;
