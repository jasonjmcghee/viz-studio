export const plotAndParticles = `// Player Settings
s.start = 153;
s.duration = 378 + 5 * 225;
s.rate = 1;
s.frameRate = 60;
s.webgl = false;

// Setup the P5.js Sketch
let particles = [];
function setup() {
  // Convenience functions like \`latex\` are available.
  staticText("The curve is defined by:", 16, 16);
  // Demonstrate our system of equations
  latex(
    \`\\\\begin{cases}
    \${x1Latex}\\\\\\\\
    \${y1Latex}
    \\\\end{cases}\`,
    16, 48
  );

  // This is where things that don't need to happen each frame should be called.
  for(let i = 0; i < width / 10; i++){
    particles.push(new Particle());
  }
};

function draw (t, nextT) {
  // WebGL origin is the center.
  if (isWebGL()) {
    translate(- width / 2, - height / 2)
  }
  // Draw the background each frame
  background('#0f0f0f');
  // Plot our function based on the current time.
  plot(t);
  
  // Update our particles
  for(let i = 0;i<particles.length;i++) {
    // Draw particles
    particles[i].drawParticle();
    // Move them according to the current time
    particles[i].moveParticle(t);
    // Draw connecting lines
    particles[i].joinParticles(particles.slice(i));
  }
};

// Change the color and stroke according to fraction of drawn plot.
const fadingGradient = (fraction, _) => {
    stroke(
        lerpColor(
            color('#277DA1'),
            color('#F76C5E'),
            fraction,
        )
    );
    strokeWeight(fraction * 3);
};

// Plot our functions!
const plot = (t, tail = 100) => {
  translate(s.width / 2, -s.height / 2.25);
  let start = Math.max(0, t - tail);
  let end = t;
  plot2D(start, end, x1, y1, {preVertex:  fadingGradient});
  translate(-s.width / 2, s.height / 2.25);
};

// The LATEX for our additive cos function.
const x1Latex = "x = \\\\sum_{i=1}^{3} sin(\\\\frac{t}{10i})";
// The x-location of the tip of the plot at a given time.
const x1 = (t, scale = Math.min(s.width, s.height) / 10) => {
  // Additive sine function
  return scale * (sin(t / 10) + sin(t / 20) + sin(t / 30));
};

// The LATEX for our additive sin function.
const y1Latex = "y = \\\\sum_{i=1}^{3} cos(\\\\frac{t}{10i})";
// The y-location of the tip of the plot at a given time.
const y1 = (t, scale = Math.min(s.width, s.height) / 10) => {
  // Additive cosine function
  const yLoc = scale * (cos(t / 10) + cos(t / 20) + cos(t / 30));
  // Flip the axis so we're drawing from the bottom left.
  return s.height - yLoc;
};

// Adapted "Simulated Particles" from p5.js docs
// Should be functionally identical, but is parametrized by \`t\`.
// https://p5js.org/examples/simulate-particles.html
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = this.originX = random(0,width);
    this.y = this.originY = random(0,height);
    this.r = random(width / 1000, width / 200);
    this.xSpeed = random(-width / 500, width / 500);
    this.ySpeed = random(-height / 500, height / 500);
  }

  // Creation of a particle.
  drawParticle() {
    noStroke();
    fill('rgba(200,169,169,0.5)');
    circle(this.x,this.y,this.r);
  }
  
  // Make particles bounce of the sides
  bounce (rawVal, max) {
    const val = abs(rawVal);
    let bounces = floor(val / max);
    let remainder = val % max;
    if (bounces % 2 == 1) {
        remainder = (max - remainder);
    }
    return remainder;
  }

  // setting the particle in motion.
  moveParticle(t) {
    this.x = this.bounce(this.originX + this.xSpeed * t, width);
    this.y = this.bounce(this.originY + this.ySpeed * t, height);
  }

  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if (dis < Math.min(width, height) / 10) {
        stroke('rgba(255,255,255,0.04)');
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}
`;