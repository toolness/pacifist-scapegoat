var stars;

function setup() {
  createCanvas(600, 800);
  stars = new Stars(200);
}

function draw() {
  background('black');
  stars.draw();
}
