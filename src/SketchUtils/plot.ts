import p5 from 'p5';

p5.prototype.plot2D = function (start, end, xFn, yFn, color = '#F76C5E', strokeWeight = 3) {
  this.stroke(color);
  this.strokeWeight(strokeWeight);
  this.noFill();
  this.beginShape();
  this.curveVertex(xFn(start), yFn(start));
  for (let i = 0; i < end - 1; i++) {
    this.curveVertex(xFn(start + i), yFn(start + i));
  }
  this.curveVertex(xFn(start + end - 1), yFn(start + end - 1));
  this.curveVertex(xFn(start + end - 1), yFn(start + end - 1));
  this.endShape();
}

export const plot2D = p5.prototype.plot2D;