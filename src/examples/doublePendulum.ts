export const doublePendulum = `// Adapted (look, feel, and parameterized by time) from:
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/093-double-pendulum.html

let size = Math.min(height, width);

let r1 = size / 6;
let r2 = r1;
let m1 = r1 / 7;
let m2 = m1;
let a1 = 0;
let a2 = 0;
let a1_v = 0;
let a2_v = 0;
let g = size / 500;

let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;
let frames = [];

s.duration = 1000;

p.setup = () => {
  a1 = p.PI / 2;
  a2 = p.PI / 2;
  cx = p.width / 2;
  cy = p.height / 4;
  
  frames = [];
  for (var i = 0; i < s.duration; i++) {
    let num1 = -g * (2 * m1 + m2) * p.sin(a1);
    let num2 = -m2 * g * p.sin(a1 - 2 * a2);
    let num3 = -2 * p.sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * p.cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;
  
    num1 = 2 * p.sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * p.cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * p.cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;
  
    let x1 = r1 * p.sin(a1);
    let y1 = r1 * p.cos(a1);
  
    let x2 = x1 + r2 * p.sin(a2);
    let y2 = y1 + r2 * p.cos(a2);
    
    frames.push({x1, x2, y1, y2, px2, py2});
    
    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;
  
    px2 = x2;
    py2 = y2;
  }
}

p.draw = (t) => {
  const fadingGradient = (_, value, minVal = 0.2, length = s.duration / 5) => {
    let fraction = Math.max(minVal, 1 - ((t-value) / length));
    p.stroke(
        p.lerpColor(
            p.color('#277DA1'),
            p.color('#F76C5E'),
            fraction,
        )
    );
    p.strokeWeight(fraction * 3);
};
  
  const {x1, x2, y1, y2, px2, py2} = frames[p.floor(t)];
  
  p.background(0);
  
  p.translate(cx, cy);
  p.stroke('white');
  p.strokeWeight(2);

  p.line(0, 0, x1, y1);
  p.fill(0);
  p.ellipse(x1, y1, m1, m1);

  p.line(x1, y1, x2, y2);
  p.fill(0);
  p.ellipse(x2, y2, m2, m2);
  
  if (t >= 1) {
    p.plot2D(1, p.floor(t), (i) => frames[i].x2, (i) => frames[i].y2, {strokeWeight: 2, preVertex: fadingGradient})
  }
}
`;