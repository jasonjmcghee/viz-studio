export const doublePendulum = `// Adapted (look, feel, and parameterized by time) from:
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/093-double-pendulum.html
let size;
let r1;
let r2;
let m1;
let m2;
let g;
let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;
let frames = [];

s.duration = 1000;

const calculateFrames = () => {
  let a1 = PI / 2;
  let a2 = PI / 2;
  let a1_v = 0;
  let a2_v = 0;
  cx = width / 2;
  cy = height / 4;
  
  frames = [];
  for (var i = 0; i <= s.duration; i++) {
    let num1 = -g * (2 * m1 + m2) * sin(a1);
    let num2 = -m2 * g * sin(a1 - 2 * a2);
    let num3 = -2 * sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;
  
    num1 = 2 * sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;
  
    let x1 = r1 * sin(a1);
    let y1 = r1 * cos(a1);
  
    let x2 = x1 + r2 * sin(a2);
    let y2 = y1 + r2 * cos(a2);
    
    frames.push({x1, x2, y1, y2, px2, py2});
    
    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;
  
    px2 = x2;
    py2 = y2;
  }
};

let sliderR1, sliderR2, sliderM1, sliderM2;
let txt;

function setup() {
  size = Math.min(height, width);
  r1 = size / 7;
  r2 = r1;
  m1 = r1 / 7;
  m2 = m1;
  g = size / 500;
  staticText("Radius 1", 10, 10);
  staticText("Radius 2", 10, 30);
  staticText("Mass 1", 10, 50);
  staticText("Mass 2", 10, 70);
  sliderR1 = cachedSlider('sliderR1', 10, 200, r1).position(90, 10);
  sliderR2 = cachedSlider('sliderR2', 10, 200, r2).position(90, 30);
  sliderM1 = cachedSlider('sliderM1', 2, 100, m1).position(90, 50);
  sliderM2 = cachedSlider('sliderM2', 2, 100, m2).position(90, 70);
  
  calculateFrames();
}

function draw (t) {
  background(0);

  if (r1 != sliderR1.value() || r2 != sliderR2.value() || m1 != sliderM1.value() || m2 != sliderM2.value()) {
    r1 = sliderR1.value();
    r2 = sliderR2.value();
    m1 = sliderM1.value();
    m2 = sliderM2.value();
    calculateFrames();
  }

  const fadingGradient = (_, value, minVal = 0.2, length = s.duration / 5) => {
    let fraction = Math.max(minVal, 1 - ((t-value) / length));
    stroke(
        lerpColor(
            color('#277DA1'),
            color('#F76C5E'),
            fraction,
        )
    );
    strokeWeight(fraction * 3);
  };
  
  const {x1, x2, y1, y2, px2, py2} = frames[floor(t)];
  
  translate(cx, cy);
  stroke('white');
  strokeWeight(2);

  line(0, 0, x1, y1);
  fill(0);
  ellipse(x1, y1, m1, m1);

  line(x1, y1, x2, y2);
  fill(0);
  ellipse(x2, y2, m2, m2);
  
  if (t >= 1) {
    plot2D(1, floor(t), (i) => frames[i].x2, (i) => frames[i].y2, {strokeWeight: 2, preVertex: fadingGradient})
  }
}
`;