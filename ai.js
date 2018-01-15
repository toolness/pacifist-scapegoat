const AI = {
  counter: 0,
  COUNTER_MAX: 4,
  preparedInput: null,
  getInput({ player, projectiles, enemies, score }) {
    // TODO: Somehow analyze the game state to produce an action.
    /*
    projectiles.forEach(sprite => {
      if (!type(sprite.position.x) == 'number') {
        throw new Error();
      }
    });

    console.log(
      player.sprite.position.x,
      player.sprite.position.y,
      player.sprite.width,
      player.sprite.height,
      player.sprite.velocity.x,
      player.sprite.velocity.y,
    );
    */

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

  onGameOver(score, reset) {
    console.log(`Game ended with score ${score}.`);
    reset();
  }
};
