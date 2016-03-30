function TitleText(timer, pInst) {
  pInst = pInst || window;

  this.pInst = pInst;
  this.timer = timer;
  this.reset();
}

TitleText.prototype = {
  TEXT_SIZE: 24,
  START_X: 100,
  START_Y: 100,
  FRAMES_PER_CHAR: 2,
  reset: function() {
    this.finalText = '';
    this.currentLines = [''];

    return this;
  },
  write: function(text) {
    this.finalText = text;

    return this.timer.finiteInterval(
      this.FRAMES_PER_CHAR,
      this.finalText.length,
      function(i) {
        var char = this.finalText[i];

        if (char === '\n') {
          this.currentLines.push('');
        } else {
          this.currentLines[this.currentLines.length-1] += char;
        }
      }.bind(this)
    );
  },
  draw: function() {
    var pInst = this.pInst;

    pInst.textSize(this.TEXT_SIZE);
    this.currentLines.forEach(function(line, i) {
      pInst.text(line, this.START_X, this.START_Y + (i * this.TEXT_SIZE));
    }, this);
  }
};
