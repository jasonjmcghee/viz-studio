import React, {useEffect, useRef, useState} from 'react';
import p5 from './p5';
import './slider.scss'
import './play-button.scss'
import './cell.scss';
declare var MediaRecorder: any;

export default function SketchCell(
  {
    start = 0,
    duration = 30,
    frameRate = 60,
    rate = 1,
    width= 710,
    height = 400,
    playButtonSize = 30,
    autoPlay = true,
    loop = false,
    webgl = false,
    code = (p: p5, s: any) => ({
      setup: () => {},
      draw: (t) => {},
    }),
    codeString = "",
    freshState = false,
  }
) {
  const p5Ref = useRef<p5>(null);

  const showRecordButton = false;
  // const recorderRef = useRef(new Recorder());
  const canvasRef = useRef(null);
  const cellRef = useRef(null);
  const timeSliderRef = useRef(null);
  const saveVideoRef = useRef(null);
  const recorderRef = useRef(null);
  const videoChunks = useRef([]);
  const streamRef = useRef(null);

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
    prevCodeString: codeString,
    frameRate,
    webgl,
    __state: {},
    __once: {},
  });

  const s = sketchState.current;

  useEffect(() => {
    s.start = start;
    s.duration = duration;
    s.rate = rate;
    s.width = width;
    s.height = height;
    s.loop = loop;
    s.autoPlay = autoPlay;
    s.codeString = codeString;
    s.frameRate = frameRate;
    s.webgl = webgl;
    s.__once = s.__once || {};

    if (p5Ref.current) {
      s.__state = p5Ref.current?.__state ?? {};
      s.__once = p5Ref.current?.__once ?? {};
    }
  }, [
    start, duration, rate, width, height, loop, autoPlay, s, codeString, frameRate, webgl, freshState, p5Ref.current?.__state
  ])

  const [shouldPlay, setPlay] = useState(autoPlay);
  const [shouldRecord, setRecord] = useState(false);
  const [isRecording, setRecording] = useState(false);

  const record = () => {
    setRecord(true);
    videoChunks.current = [];
  };

  const stopRecording = () => {
    setRecord(false);
  };

  useEffect(() => {
    if (streamRef.current === null) {
      return;
    }
    if (recorderRef.current == null) {
      // @ts-ignore
      recorderRef.current = new MediaRecorder(streamRef.current, {
        audioBitsPerSecond: 0,
        videoBitsPerSecond: 2500000,
        mimeType: 'video/webm',
      });
      // @ts-ignore
      recorderRef.current.ondataavailable = e => {
        if (e.data.size) {
          console.log("Got chunk", e.data);
          // @ts-ignore
          videoChunks.current.push(e.data);
        }
      };
      // @ts-ignore
      recorderRef.current.onstop = exportVideo;
    }
  }, []);

  function exportVideo(e) {
    var blob = new Blob(videoChunks.current);
    var vid = document.createElement('video');
    vid.id = 'recorded'
    vid.controls = true;
    var source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    source.type = blob.type;
    vid.appendChild(source);
    document.body.appendChild(vid);
    vid.play();
  }

  const Sketch = (p) => {
    p.__state = s.__state;

    let timeSlider;
    let time;
    // let countSlider;
    const execCodeString = (code) => eval(`
      const __vars = {};
      for (let m in p) {
        __vars[m] = p[m];
      }
      ${code}
      const entries = [];
      for (let m in p) {
        if (typeof p[m] === 'function' && !__vars[m]) {
          entries.push([m, p[m]]);
        }
      }
      Object.fromEntries(entries);`
    );

    const c = s.codeString ? (
      (() => {
        try {
          const result = execCodeString(s.codeString);
          s.prevCodeString = s.codeString;
          return result;
        } catch (e) {
          console.error("Failed to compile.", e);
          return execCodeString(s.prevCodeString);
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

    const stop = () => {
      setPlay(false);
      if (isRecording) {
        setRecording(false);
        // @ts-ignore
        recorderRef.current.stop();
      }
      updateTime(0);
    };

    p.preload = () => {
      p.once('katex-font', () => p.loadFont('./resources/KaTeX_Main-Regular.ttf'))
    };

    p.setup = () => {
      p.textFont(p.fromOnce('katex-font'));
      // create canvas
      const canvas = s.webgl
        ? p.createCanvas(width, height, p.WEBGL)
        : p.createCanvas(width, height);
      // streamRef.current = canvas.elt.captureStream(60)
      p.randomSeed(1337);
      p.frameRate(s.frameRate);
      p.textSize(15);
      p.noStroke();

      // if (!shouldPlay && (timeSlider && timeSlider.value() === s.t)) {
      //   p.noLoop();
      // }

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

        try {
          c.setup();
        } catch (e) {
          console.error("Failed to execute setup.", e)
        }
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
      p.textSize(18);
      if (shouldRecord && !isRecording) {
        updateTime(0);
        setRecording(true);
        setPlay(true);
        // @ts-ignore
        recorderRef.current.start(1000);
      } else if (!shouldRecord && isRecording) {
        // @ts-ignore
        recorderRef.current.stop();
        setRecording(false);
      }

      if (timeSlider.value() !== s.t) {
        s.t = timeSlider.value();
        updateTime(s.t);
      }

      let nextT = shouldPlay ? (s.t + s.rate) % s.duration : s.t;
      if (c && c.draw) {
        try {
          c.draw(s.start + s.t, s.start + nextT);
        } catch (e) {
          p.noLoop();
          console.error("Failed to execute draw.", e)
        }
      }

      if (shouldPlay) {
        s.t = nextT;
        updateTime(s.t);
        if (!loop && s.t + s.rate >= s.duration) {
          stop();
        }
      }
    }
  };

  const myRef = useRef<HTMLDivElement>(null);
  const rerender = () => {
    if (myRef.current == null) return;
    if (p5Ref.current != null) {
      p5Ref.current.remove();
    }
    p5Ref.current = new p5(Sketch, myRef.current);
  };
  // const sketchCallback = useCallback(Sketch, [Sketch]);
  useEffect(rerender, [Sketch]);

  return (
    <div ref={cellRef} className={"cell"}>
      {showRecordButton &&
        <button
          ref={saveVideoRef}
          onClick={() => {
            if (isRecording) {
              stopRecording();
            } else {
              record();
            }
          }}
        >{isRecording ? 'Recording...' : 'Record'}</button>
      }
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