function getKeyInput(pInst = window) {
  return {
    left: pInst.keyDown(pInst.LEFT_ARROW) || pInst.keyDown('a'),
    right: pInst.keyDown(pInst.RIGHT_ARROW) || pInst.keyDown('d'),
    up: pInst.keyDown(pInst.UP_ARROW) || pInst.keyDown('w'),
    down: pInst.keyDown(pInst.DOWN_ARROW) || pInst.keyDown('s'),
  };
}
