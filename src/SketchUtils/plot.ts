import p5 from 'p5';

export const plot2D = p5.prototype.plot2D = function (
  start, end, xFn, yFn, color = '#F76C5E', strokeWeight = 3
) {
  this.stroke(color);
  this.strokeWeight(strokeWeight);
  this.noFill();
  this.beginShape();
  this.curveVertex(xFn(start), yFn(start));
  for (let i = start; i < end - 1; i++) {
    this.curveVertex(xFn(i), yFn(i));
  }
  this.curveVertex(xFn(end - 1), yFn(end - 1));
  this.curveVertex(xFn(end - 1), yFn(end - 1));
  this.endShape();
}