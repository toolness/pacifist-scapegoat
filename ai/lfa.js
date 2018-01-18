class FlattenedArray {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.length = dimensions.reduce((product, d) => d * product, 1);
    this.array = new Array(this.length);
    this.array.fill(0.0);
    this.strides = new Array(dimensions.length);
    this.strides[dimensions.length - 1] = 1;
    for (let i = dimensions.length - 2; i >= 0; i--) {
      this.strides[i] = this.strides[i + 1] * this.dimensions[i + 1];
    }
  }

  getFlattenedIndex(indices) {
    return indices.reduce((total, dim, i) => {
      return total + dim * this.strides[i];
    }, 0);
  }

  set(indices, value) {
    this.array[this.getFlattenedIndex(indices)] = value;
  }
}

function dotProduct(a, b) {
  return a.reduce((total, aVal, i) => {
    return total + aVal * b[i];
  }, 0);
}

function valueAndIndexOfMax(arr) {
  let bestIndex = 0;
  let bestValue = arr[0];

  for (let i = 1; i < arr.length; i++) {
    let value = arr[i];
    if (value > bestValue) {
      bestValue = value;
      bestIndex = i;
    }
  }

  return [bestValue, bestIndex];
}

class LinearFunctionApproximatorAI {
  constructor({ width, height }) {
    Object.assign(this, {
      width, height
    });
    this.HORIZ_BINS = 10;
    this.VERT_BINS = 10;
    this.HORIZ_BIN_SIZE = Math.floor(this.width / this.HORIZ_BINS);
    this.VERT_BIN_SIZE = Math.floor(this.height / this.VERT_BINS);
    this.ACTIONS = [
      {left: true},
      {right: true},
    ];
    this.LEARNING_RATE = 0.1;
    this.FRAMES_PER_ACTION = 8;
    this.EPSILON = 0.05;
    this.weights = this._createFeatureVector().array;
    console.log(`LFA initialized with ${this.weights.length} features.`);
  }

  _createFeatureVector() {
    return new FlattenedArray([
      this.HORIZ_BINS,
      this.HORIZ_BINS,
      this.VERT_BINS,
      this.ACTIONS.length
    ]);
  }

  _getHbin(x) {
    return Math.floor(x / this.HORIZ_BIN_SIZE);
  }

  _getVbin(y) {
    return Math.floor(y / this.VERT_BIN_SIZE);
  }

  _encodeState({ player, projectiles, enemies }) {
    const playerBin = this._getHbin(player.sprite.position.x);
    const hostileBins = [];

    [projectiles, enemies].forEach(group => {
      group.forEach(sprite => {
        const hbin = this._getHbin(sprite.position.x);
        const vbin = this._getVbin(sprite.position.y);

        if (!(hbin >= 0 && vbin >= 0 &&
              hbin < this.HORIZ_BINS && vbin < this.VERT_BINS)) {
          return;
        }

        hostileBins.push([hbin, vbin]);
      });
    });

    return { playerBin, hostileBins };
  }

  _getBestActionInfo(state) {
    const actFeatures = this.ACTIONS.map(_ => this._createFeatureVector());
    state.hostileBins.forEach(([hbin, vbin]) => {
      actFeatures.forEach((feature, actionIndex) => {
        feature.set([
          state.playerBin,
          hbin,
          vbin,
          actionIndex
        ], 1.0);
      });
    });

    const actRewards = actFeatures.map(feature => {
      return dotProduct(feature.array, this.weights);
    });

    let value, index;

    if (random() < this.EPSILON) {
      index = Util.randInt(0, actRewards.length);
      value = actRewards[index];
    } else {
      [value, index] = valueAndIndexOfMax(actRewards);
    }

    return {
      value,
      index,
      featureVector: actFeatures[index],
      action: this.ACTIONS[index],
    };
  }

  _updateWeights(tdError) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += (
        this.LEARNING_RATE *
        tdError *
        this.lastActionInfo.featureVector.array[i]
      );
    }
  }

  getInput({ player, projectiles, enemies, score }) {
    if (this.counter === 0) {
      const state = this._encodeState({
        player, projectiles, enemies
      });
      const actionInfo = this._getBestActionInfo(state);
      const reward = score - this.lastScore;
      this.lastScore = score;

      if (this.lastActionInfo !== null) {
        // This is essentially an implementation of Sarsa(0).
        const tdError = reward + actionInfo.value - this.lastActionInfo.value;
        this._updateWeights(tdError);
      }
      this.lastActionInfo = actionInfo;
      this.counter = this.FRAMES_PER_ACTION;
    } else {
      this.counter--;
    }

    return this.lastActionInfo.action;
  }

  onGameStart() {
    this.lastScore = 0;
    this.lastActionInfo = null;
    this.counter = 0;
  }

  onGameOver(score) {
    // We want losing the game to be a big penalty, so reverse the score.
    const tdError = -score - this.lastActionInfo.value;
    this._updateWeights(tdError);
    console.log(`Game ended with score ${score}.`);
  }
}

AI.constructors['lfa'] = LinearFunctionApproximatorAI;
