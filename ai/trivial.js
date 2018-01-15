class TrivialAI {
  constructor({ width, height }) {
    Object.assign(this, {
      width, height
    });
    this.COUNTER_MAX = 4;
    this.FAKE_PROCESSING_TIME = 0;
    this.CONSTANT_INPUT = {left: true};
  }

  getInput({ player, projectiles, enemies, score }) {
    if (this.counter == 0) {
      // Simulate some async computation that requires the game to
      // pause while we figure out what key to press.
      return new Promise(resolve => {
        setTimeout(() => {
          this.counter = this.COUNTER_MAX;
          resolve(this.CONSTANT_INPUT);
        }, this.FAKE_PROCESSING_TIME);
      });
    }

    this.counter--;
    return this.CONSTANT_INPUT;
  }

  onGameStart() {
    this.counter = 0;
    this.preparedInput = null;
  }

  onGameOver(score) {
    console.log(`Game ended with score ${score}.`);
  }
}

AI.constructors['trivial'] = TrivialAI;
