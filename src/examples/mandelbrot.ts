export const mandelbrot = `s.start = 940;
s.duration = 2200 - s.start;
s.webgl = true;

// the 'varying's are shared between both vertex & fragment shaders
let varying = 'precision highp float; varying vec2 vPos;';

// the vertex shader is called for each vertex
let vs =
  varying +
  'attribute vec3 aPosition;' +
  'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';

// the fragment shader is called for each pixel
let fs =
  varying +
  'uniform vec2 p;' +
  'uniform float r;' +
  'const int I = 500;' +
  'void main() {' +
  '  vec2 c = p + vPos * r, z = c;' +
  '  float n = 0.0;' +
  '  for (int i = I; i > 0; i --) {' +
  '    if(z.x*z.x+z.y*z.y > 4.0) {' +
  '      n = float(i)/float(I);' +
  '      break;' +
  '    }' +
  '    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;' +
  '  }' +
  '  gl_FragColor = vec4(0.5-cos(n*12.0)/1.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);' +
  '}';

let mandel;
p.setup = () => {
  p.staticText("Mandelbrot", 8, 8);

  
  mandel = p.createShader(vs, fs);
  p.shader(mandel);
  p.noStroke();

  // 'p' is the center point of the Mandelbrot image
  mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
};

p.draw = (t, nextT) => {
  p.background(0);
  p.translate(-s.width / 2, -s.height / 2);
    mandel.setUniform('r', 1.5 * p.exp(-6.5 * (1 + p.sin(t / 200))));
      p.quad(-1, -1, 1, -1, 1, 1, -1, 1);
};`;