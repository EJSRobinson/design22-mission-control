class interfaceSingleton {
  constructor() {
    setInterval(() => {
      console.log(Date.now());
    }, 1000);
  }
}
export default class telemetryInterface {
  constructor() {
    throw new Error('Use Singleton.getInstance()');
  }
  static getInstance() {
    if (!this.Singleton) {
      this.Singleton = new interfaceSingleton();
    }
    return this.Singleton;
  }
}

telemetryInterface.getInstance();
setTimeout(() => {
  telemetryInterface.getInstance();
}, 500);
setTimeout(() => {
  telemetryInterface.getInstance();
}, 750);
