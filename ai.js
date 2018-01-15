const AI = {
  getInput() {
    // TODO: Actually implement this.
    return {
      left: true,
      right: false,
      up: false,
      down: false,
    };
  },

  onGameOver(score) {
    console.log(`Game ended with score ${score}.`);
  }
};
