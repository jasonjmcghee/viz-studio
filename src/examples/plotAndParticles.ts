export const plotAndParticles = `// Player Settings
s.start = 153;
s.duration = 378 + 5 * 225;
s.rate = 1;
s.frameRate = 60;
s.webgl = false;

// Setup the P5.js Sketch
let particles = [];
p.setup = () => {
  // Convenience functions like \`latex\` are available.
  p.staticText("The curve is defined by:", 16, 16);
  // Demonstrate our system of equations
  p.latex(
    \`\\\\begin{cases}
    \${x1Latex}\\\\\\\\
    \${y1Latex}
    \\\\end{cases}\`,
    16, 48
  );

  // This is where things that don't need to happen each frame should be called.
  for(let i = 0;i<width/10;i++){
    particles.push(new Particle());
  }
};

p.draw = (t, nextT) => {
  // WebGL origin is the center.
  if (p.isWebGL()) {
    p.translate(- p.width / 2, - p.height / 2)
  }
  // Draw the background each frame
  p.background('#0f0f0f');
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
    p.stroke(
        p.lerpColor(
            p.color('#277DA1'),
            p.color('#F76C5E'),
            fraction,
        )
    );
    p.strokeWeight(fraction * 3);
};

// Plot our functions!
const plot = (t, tail = 100) => {
  p.translate(s.width / 2, -s.height / 2.25);
  let start = Math.max(0, t - tail);
  let end = t;
  p.plot2D(start, end, x1, y1, {preVertex:  fadingGradient});
  p.translate(-s.width / 2, s.height / 2.25);
};

// The LATEX for our additive cos function.
const x1Latex = "x = \\\\sum_{i=1}^{3} sin(\\\\frac{t}{10i})";
// The x-location of the tip of the plot at a given time.
const x1 = (t, scale = Math.min(s.width, s.height) / 10) => {
  // Additive sine function
  return scale * (p.sin(t/10) + p.sin(t/20) + p.sin(t/30));
};

// The LATEX for our additive sin function.
const y1Latex = "y = \\\\sum_{i=1}^{3} cos(\\\\frac{t}{10i})";
// The y-location of the tip of the plot at a given time.
const y1 = (t, scale = Math.min(s.width, s.height) / 10) => {
  // Additive cosine function
  const yLoc = scale * (p.cos(t / 10) + p.cos(t / 20) + p.cos(t / 30));
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
    this.x = this.originX = p.random(0,width);
    this.y = this.originY = p.random(0,height);
    this.r = p.random(width / 1000, width / 200);
    this.xSpeed = p.random(-width / 500, width / 500);
    this.ySpeed = p.random(-height / 500, height / 500);
  }

  // Creation of a particle.
  drawParticle() {
    p.noStroke();
    p.fill('rgba(200,169,169,0.5)');
    p.circle(this.x,this.y,this.r);
  }
  
  // Make particles bounce of the sides
  bounce (rawVal, max) {
    const val = p.abs(rawVal);
    let bounces = p.floor(val / max);
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
      let dis = p.dist(this.x,this.y,element.x,element.y);
      if (dis < Math.min(width, height) / 10) {
        p.stroke('rgba(255,255,255,0.04)');
        p.line(this.x,this.y,element.x,element.y);
      }
    });
  }
}
`;