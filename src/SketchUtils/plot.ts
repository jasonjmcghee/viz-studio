import p5 from 'p5';

export const plot2D = p5.prototype.plot2D = function (
  start, end, xFn, yFn, {strokeWeight = 3, preVertex = (fraction, value) => {}} = {}
) {
  this.strokeWeight(strokeWeight);
  this.noFill();
  this.beginShape();
  preVertex(0, start);
  let x = xFn(start), y = yFn(start);
  this.curveVertex(x, y);
  this.endShape();
  const partial = 1 / (end - start);
  for (let i = start; i <= end; i++) {
    this.beginShape();
    preVertex((i - start) * partial, i);
    let lastX = xFn(i - 1), lastY = yFn(i - 1);
    this.curveVertex(lastX, lastY);
    this.curveVertex(lastX, lastY);
    let x = xFn(i), y = yFn(i);
    this.curveVertex(x, y);
    this.curveVertex(x, y);
    this.endShape();
  }
  this.beginShape();
  preVertex(1, end);
  x = xFn(end);
  y = yFn(end);
  this.curveVertex(x, y);
  this.curveVertex(x, y);
  this.endShape();
  this.strokeWeight(1);
}