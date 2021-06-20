import React, {useEffect, useRef, useState} from 'react';
import p5 from './p5';
import './slider.scss'
import './play-button.scss'
import './cell.scss';

export default function SketchCell(
  {
    start = 0,
    duration = 500,
    rate = 1,
    width= 710,
    height = 400,
    playButtonSize = 30,
    autoPlay = true,
    loop = false,
    code = (p: p5, s: any) => ({
      setup: () => {},
      draw: (t) => {},
    }),
    codeString = "",
  }
) {
  const cellRef = useRef(null);
  const timeSliderRef = useRef(null);

  const sketchState = useRef({
    t: 0,
    start,
    duration,
    rate,
    width,
    height,
    loop,
    autoPlay,
    codeString,
  });

  const s = sketchState.current;

  useEffect(() => {
    s.start = start;
    s.duration = duration;
    s.rate = rate;
    s.width = width;
    s.height = height;
    s.loop = loop
    s.autoPlay = autoPlay
    s.codeString = codeString;
  }, [start, duration, rate, width, height, loop, autoPlay, s, codeString])

  const [shouldPlay, setPlay] = useState(autoPlay);

  const Sketch = (p) => {

    let timeSlider;
    let time;
    // let countSlider;
    const c = s.codeString ? (
      (() => {
        try {
          return eval(s.codeString)(p, s)
        } catch (e) {
          console.error("Failed to compile.")
        }
      })()
    ): code(p, s);

    const getFriendlyTime = () => p.floor(s.start + s.t);
    const getFriendlyDuration = () => p.floor(s.start + s.duration);
    const formatTimeAndDuration = () => `${getFriendlyTime()} / ${getFriendlyDuration()}`;

    const updateTime = (t) => {
      timeSlider.value(t);
      time.html(formatTimeAndDuration());
    };

    p.setup = () => {
      // create canvas
      p.createCanvas(width, height);
      p.textSize(15);
      p.noStroke();

      if (!shouldPlay && (timeSlider && timeSlider.value() === s.t)) {
        p.noLoop();
      }

      // create sliders
      timeSlider = p.createSlider(0, s.duration, s.t, 0.01);
      timeSlider.style('width', `${width - playButtonSize - 8}px`);
      timeSlider.style('margin-left', `${playButtonSize}px`);
      timeSlider.addClass('e-range');
      timeSlider.parent(timeSliderRef.current);

      time = p.createSpan(formatTimeAndDuration());
      time.addClass('seek-time');
      time.parent(timeSliderRef.current);

      if (c && c.setup) {
        c.setup();
      }

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
    }

    p.draw = () => {
      if (timeSlider.value() !== s.t) {
        s.t = timeSlider.value();
        updateTime(s.t);
      }

      let nextT = shouldPlay ? (s.t + s.rate) % s.duration : s.t;
      if (c && c.draw) {
        c.draw(s.start + s.t, s.start + nextT);
      }

      if (shouldPlay) {
        s.t = nextT;
        updateTime(s.t);
        if (!loop && s.t + s.rate >= s.duration) {
          setPlay(false);
          updateTime(0);
        }
      }
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
      <div ref={timeSliderRef} className={"time-slider"}/>
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