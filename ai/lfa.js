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

function indexOfMax(arr) {
  let bestIndex = 0;
  let bestValue = arr[0];

  for (let i = 1; i < arr.length; i++) {
    let value = arr[i];
    if (value > bestValue) {
      bestValue = value;
      bestIndex = i;
    }
  }

  return bestIndex;
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

  getInput({ player, projectiles, enemies, score }) {
    // TODO: Actually change our weights at some point.

    const features = this._createFeatureVector();
    const playerBin = this._getHbin(player.sprite.position.x);
    const actFeatures = this.ACTIONS.map(_ => this._createFeatureVector());
    [projectiles, enemies].forEach(group => {
      group.forEach(sprite => {
        const hbin = this._getHbin(sprite.position.x);
        const vbin = this._getVbin(sprite.position.y);

        if (!(hbin >= 0 && vbin >= 0 &&
              hbin < this.HORIZ_BINS && vbin < this.VERT_BINS)) {
          return;
        }

        actFeatures.forEach((feature, actionIndex) => {
          feature.set([
            playerBin,
            hbin,
            vbin,
            actionIndex
          ], 1.0);
        });
      });
    });

    const actRewards = actFeatures.map(feature => {
      return dotProduct(feature.array, this.weights);
    });

    return this.ACTIONS[indexOfMax(actRewards)];
  }

  onGameStart() {
  }

  onGameOver(score) {

  }
}

AI.constructors['lfa'] = LinearFunctionApproximatorAI;
