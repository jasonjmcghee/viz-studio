import React, {useEffect, useRef, useState} from 'react';
import p5 from './p5';
import katex from 'katex';
import './slider.scss'
import './play-button.scss'
import './cell.scss';

export default function SketchCell(
  {
    duration = 500,
    rate = 1,
    width= 710,
    height = 400,
    playButtonSize = 30,
    autoPlay = true,
    loop = false,
  }
) {
  const cellRef = useRef(null);
  const timeSliderRef = useRef(null);

  const sketchState = useRef({
    maxT: duration,
    t: 0,
    count: 100,
  });

  const s = sketchState.current;

  const [shouldPlay, setPlay] = useState(autoPlay);

  const Sketch = (p) => {

    let timeSlider;
    let countSlider;

    p.setup = () => {
      // create canvas
      p.createCanvas(width, height);
      p.textSize(15);
      p.noStroke();

      if (!shouldPlay && (timeSlider && timeSlider.value() === s.t)) {
        p.noLoop();
      }

      // create sliders
      timeSlider = p.createSlider(0, s.maxT, s.t, 0.01);
      timeSlider.style('width', `${width - playButtonSize - 8}px`);
      timeSlider.style('margin-left', `${playButtonSize}px`);
      timeSlider.addClass('e-range');
      timeSlider.parent(timeSliderRef.current);

      // countSlider = p.createSlider(0, 300, s.count, 0.01);
      // countSlider.style('width', '200px');
      // countSlider.addClass('e-range');
      // countSlider.addClass('count-slider');
      //
      // const countSliderContainer = p.createDiv();
      // countSliderContainer.addClass("count-slider-container")
      // countSliderContainer.parent(document.querySelector(".sliders"));
      //
      // const text = p.createSpan("Length");
      // text.parent(countSliderContainer);
      // countSlider.parent(countSliderContainer);

      let tex = p.createSpan();
      tex.style('font-size', '20px');
      tex.position(8, 8);
      katex.render("x = \\sum_{i=1}^{3} sin(\\frac{t}{10i})", tex.elt);
    }

    p.draw = () => {
      if (timeSlider.value() !== s.t) {
        s.t = timeSlider.value();
      }
      // s.count = countSlider.value();
      p.background(0);
      // p.translate(width/2, height/2);
      p.translate(5, -5)
      plot(s.t, s.count);
      if (shouldPlay) {
        s.t = (s.t + rate) % s.maxT;
        timeSlider.value(s.t);
        if (!loop && s.t + rate >= s.maxT) {
          setPlay(false);
        }
      }
    }

    const plot = (t, length, color = '#F76C5E') => {
      p.plot2D(t, length, x1, y1_, color, 3);
    }

    const x1 = (t) => {
      // return t;
      let s = 50;
      return width / 2 + s * (p.sin(t/10) + p.sin(t/20) + p.sin(t/30));
    }

    const y1_ = (t) => {
      return height - y1(t);
    }

    const y1 = (t) => {
      // return t;
      let s = 50;
      return height / 2 + s * (p.cos(t/20) + p.cos(t/20) + p.cos(t/30));
    }
  }

  const myRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5>(null);
  useEffect(() => {
      if (p5Ref.current != null) {
        p5Ref.current.remove();
      }
      p5Ref.current = new p5(Sketch, myRef.current);
    }
  );

  return (
    <div ref={cellRef} className={"cell"}>
      <div className={"sketch"} ref={myRef}/>
      <div ref={timeSliderRef} className={"time-slider"} />
      <button
        className={`play-button${!shouldPlay ? '' : ' paused'}`}
        onClick={() => {setPlay(!shouldPlay); }}
      />
      {/**
        <div className={"info"}>
          Controls:
          <div className={"sliders"}>
          </div>
        </div>
      */}
    </div>
  );
}