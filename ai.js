const AI = {
  counter: 0,
  COUNTER_MAX: 4,
  preparedInput: null,
  getInput() {
    if (this.counter == 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          this.counter = this.COUNTER_MAX;
          this.preparedInput = {
            left: true,
            right: false,
            up: false,
            down: false,
          };
          resolve(this.preparedInput);
        }, 100);
      });
    }

    this.counter--;
    return this.preparedInput;
  },

  onGameOver(score) {
    console.log(`Game ended with score ${score}.`);
  }
};