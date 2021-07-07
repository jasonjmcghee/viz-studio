import p5 from 'p5';

export const drawPoints = p5.prototype.drawPoints = function(points) {
  this.beginShape(this.POINTS);
  for (let i = 0; i < points.length; i++) {
    this.vertex(points[i].x, points[i].y);
  }
  this.endShape();
}

export const smoothDrawPoints = p5.prototype.smoothDrawPoints = function (points, onlyPoints = false) {
  this.beginShape();
  let {x, y} = points[0];
  this.curveVertex(x, y);
  this.endShape();

  if (points.length > 1) {
    let [start, end] = [1, points.length - 1];
    for (let i = start; i <= end; i++) {
      let lastX = points[i - 1].x, lastY = points[i - 1].y;
      x = points[i].x;
      y = points[i].y;
      onlyPoints ? this.beginShape(this.POINTS) : this.beginShape();
      this.curveVertex(lastX, lastY);
      this.curveVertex(lastX, lastY);
      this.curveVertex(x, y);
      this.curveVertex(x, y);
      this.endShape();
    }
  }
  x = points[points.length - 1].x;
  y = points[points.length - 1].y;
  this.beginShape();
  this.curveVertex(x, y);
  this.curveVertex(x, y);
  this.endShape();
}

export const plot2D = p5.prototype.plot2D = function (
  start, end, xFn, yFn, {
    strokeWeight = 3, preVertex = (fraction, value) => {}} = {}
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

export const lerpPoints = p5.prototype.lerpPoints = function(pointsA, pointsB, amount, {
  sampleFactor = 1,
} = {})
  : {x: Number, y: Number, alpha: Number}[] {
  const aLonger = pointsA.length > pointsB.length;
  const longer = this.max([pointsA.length, pointsB.length]);
  const compensate = this.min([pointsA.length, pointsB.length]) / longer;
  const points: {x: Number, y: Number, alpha: Number}[] = [];
  const sample = Math.floor(1 / sampleFactor);
  for (let j = 0; j < longer; j+=sample) {
    const a = aLonger ? pointsA[j] : pointsA[this.floor(j * compensate)];
    const b = aLonger ? pointsB[this.floor(j * compensate)] : pointsB[j];
    points.push({
      x: this.lerp(a.x, b.x, amount),
      y: this.lerp(a.y, b.y, amount),
      alpha: (a.alpha ?? 1) * (b.alpha ?? 1),
    });
  }
  return points;
}

export const lerpPointsOverTime = p5.prototype.lerpPointsOverTime = function(pointsA, pointsB, duration) {
  const morphs: {x: Number, y: Number, alpha: Number}[][] = [];
  const frac = 1 / duration;
  for (let i = 0; i <= duration; i++) {
    morphs.push(this.lerpPoints(pointsA, pointsB, frac));
  }
  return morphs;
}