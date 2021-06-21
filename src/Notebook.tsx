import React, {useRef, useState} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import SketchCell from "./SketchUtils/SketchCell";
import {debounce} from "react-ace/lib/editorOptions";

const templateProgram = `s.start = 153;
s.duration = 378 + 5 * 225;
s.rate = 1;
s.frameRate = 60;

let particles = [];
p.setup = () => {
  p.textSize(15);
  p.latex("\\\\text{The curve follows the equation: } x = \\\\sum_{i=1}^{3} sin(\\\\frac{t}{10i})", 8, 8);
  for(let i = 0;i<width/10;i++){
    particles.push(new Particle());
  }
};

p.draw = (t, nextT) => {
  p.background('#0f0f0f');
//   p.translate(-s.width / 2, -s.height / 2);
  plot(t);
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle(t);
    particles[i].joinParticles(particles.slice(i));
  }
};

const plot = (t, tail = 100, color = '#F76C5E') => {
  p.plot2D(Math.max(0, t - tail), t, x1, y1_, color, 3);
};

const x1 = (t) => {
  // return t;
  let scale = s.width / 10;
  return s.width / 2 + scale * (p.sin(t/10) + p.sin(t/20) + p.sin(t/30));
};

const y1_ = (t) => {
  return s.height - y1(t);
};

const y1 = (t) => {
  // return t;
  let scale = s.width / 10;
  return s.height / 2 + scale * (p.cos(t / 10) + p.cos(t / 20) + p.cos(t / 30));
};

class Particle {
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = this.originX = p.random(0,width);
    this.y = this.originY = p.random(0,height);
    this.r = p.random(1,8);
    this.xSpeed = p.random(-2,2);
    this.ySpeed = p.random(-1,1.5);
  }

// creation of a particle.
  createParticle() {
    p.noStroke();
    p.fill('rgba(200,169,169,0.5)');
    p.circle(this.x,this.y,this.r);
  }
  
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
      if(dis<85) {
        p.stroke('rgba(255,255,255,0.04)');
        p.line(this.x,this.y,element.x,element.y);
      }
    });
  }
}
`;

export default function EditorCell({
  width = 700,
  updateOnChange = false,
}) {
  const [codeString, setCodeString] = useState(templateProgram);
  const onChange = (newValue) => {
    setCodeString(newValue);
  };
  const onBlur = (e, editor) => {
    setCodeString(editor.getValue());
  };
  return (
    <div>
      <SketchCell
        width={width}
        height={(4/7) * width}
        codeString={codeString}
        rate={1}
        loop={true}
      />
      {// @ts-ignore
      }<AceEditor
        style={{width: `${width}px`}}
        // height={`${height}px`}
        mode="jsx"
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        onChange={updateOnChange ? debounce(onChange, 300) : undefined}
        onBlur={!updateOnChange ? onBlur : undefined}
        defaultValue={templateProgram}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true
        }}
      />
    </div>
  );
}