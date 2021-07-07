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
    cellWidth= 710,
    cellHeight = 400,
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
  window['height'] = cellHeight;
  window['width'] = cellWidth;
  const p5Ref = useRef<p5>(null);

  const showRecordButton = false;
  // const recorderRef = useRef(new Recorder());
  const progressRef = useRef(null);
  const cellRef = useRef(null);
  const timeSliderRef = useRef(null);
  const saveVideoRef = useRef(null);
  const recorderRef = useRef(null);
  const videoChunks = useRef([]);
  const streamRef = useRef(null);
  const playButtonRef = useRef(null);

  const sketchState = useRef({
    t: 0,
    start,
    duration,
    rate,
    width: cellWidth,
    height: cellHeight,
    loop,
    autoPlay,
    codeString,
    prevCodeString: '',
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
    s.width = cellWidth;
    s.height = cellHeight;
    s.loop = loop;
    s.autoPlay = autoPlay;
    s.codeString = codeString;
    s.frameRate = frameRate;
    s.webgl = webgl;

    if (p5Ref.current) {
      s.__state = p5Ref.current?.__state ?? { '__playing': autoPlay };
      s.__once = p5Ref.current?.__once ?? {};
    }
  }, [
    start, duration, rate, cellWidth, cellHeight, loop, autoPlay, s,
    codeString, frameRate, webgl, freshState, p5Ref.current?.__state, p5Ref.current?.__once,
  ])

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

  function isPlaying(p) {
    let playState = p?.fromCache('__playing');
    if (playState == null) {
      p.cache('__playing', autoPlay);
      playState = autoPlay;
    }
    return playState;
  }

  function togglePlay(p, setValue: boolean | null = null) {
    const shouldPlay = setValue ?? !isPlaying(p);
    if (playButtonRef.current != null) {
      // @ts-ignore
      playButtonRef.current.className = `play-button${!shouldPlay ? '' : ' paused'}`;
    }
    p?.cache('__playing', shouldPlay);
  }

  const Sketch = (p) => {
    window['p'] = p;

    // p.noDraw = false;
    // p.noLoop = () => {
    //   p.noDraw = true;
    // };

    // const updatePreDraw = ['mouseX', 'mouseY', 'mouseButton', 'mouseIsPressed', 'height', 'width'];
    const fieldsToUpdate: string[] = [];
    const updateLookup = new Set();

    p.__once = s.__once;
    p.__state = s.__state;
    let timeSlider;
    let updateTime;
    let progressHandle;
    let time;
    let sliderWidth;
    // let countSlider;
    // @ts-ignore
    window.__window_funcs = {};

    let p2d = p.P2D;
    // @ts-ignore
    const postActionFunctions = {
      'loadPixels': function () {
        // @ts-ignore
        let p: p5 = this;
        p.loadPixels();
        updateEvents();
      }.bind(p),
      'createCanvas': function (w, h, type = p2d) {
        // @ts-ignore
        let _p: p5 = this;
        _p.createCanvas(w, h, type);
        s.webgl = p.isWebGL();
        const canvas = p._renderer.drawingContext.canvas;
        s.width = canvas.clientWidth;
        s.height = canvas.clientHeight;
        _p.width = canvas.clientWidth;
        _p.height = canvas.clientHeight;
        window['width'] = canvas.clientWidth;
        window['height'] = canvas.clientHeight;
      }.bind(p)
    };
    // @ts-ignore
    window.__postActionFunctions = postActionFunctions;

    // @ts-ignore
    for (let userFn in postActionFunctions) {
      // @ts-ignore
      window[userFn] = postActionFunctions[userFn];
    }

    const execCodeString = (code) => {
      updateLookup.clear();
      for (let m in p) {
        if (!m.startsWith('_') && typeof p[m] !== "function" && code.includes(m)) {
          fieldsToUpdate.push(m);
          updateLookup.add(m);
        }
      }

      const preExecute: string[] = [];
      for (let m in p) {
        if (!m.startsWith('_')) {
          if (typeof p[m] === "function" && !postActionFunctions[m]) {
            preExecute.push(`var ${m} = p.${m}.bind(p);`);
          } else if (typeof p[m] !== "function") {
            preExecute.push(`var ${m} = p.${m};`);
          }
        }
      }

      const codeToExecute = `
      ${preExecute.join('\n')}
      ${code}
      const entries = [];
      for (let m in window) {
        if (typeof window[m] === 'function' && !__window_funcs[m] && !window.__postActionFunctions[m]) {
          entries.push([m, window[m]]);
          p[m] = window[m];
        }
      }
      Object.fromEntries(entries);`;
      if (code) {
        const match = code.match(/createCanvas\((.*)\)/);
        if (match && match.length > 1) {
          const [widthString, heightString] = match[1].split(",");
          p.width = parseInt(widthString);
          p.height = parseInt(heightString);
          s.width = p.width;
          s.height = p.height;
        }
        window['width'] = s.width;
        window['height'] = s.height;
      }
      window['s'] = s;
      let result = eval.call(window['p'], codeToExecute);
      // @ts-ignore
      // window['p'] = undefined;
      return result;
    };

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

    let shouldUpdateEvents = true;

    const updateEvents = () => {
      if (!shouldUpdateEvents) return;
      updateLookup.forEach((m) => {
        // @ts-ignore
        if (window[m] !== p[m]) {
          // @ts-ignore
          window[m] = p[m];
        }
      });
      // shouldUpdateEvents = false;
    };

    const userFunctions = [
      'mousePressed',
      'mouseDragged',
      'mouseMoved',
      'mouseReleased',
      'mouseClicked',
      'mouseWheel',
      'doubleClicked',
      'windowResized',
      'touchStarted',
      'touchMoved',
      'touchEnded',
      'deviceMoved',
      'deviceTurned',
      'deviceShaken',
      'keyPressed',
      'keyReleased',
      'keyTyped',
    ];

    userFunctions.forEach((userFn) => {
      p[userFn] = () => {
        updateEvents();
        if (c && c[userFn]) {
          c[userFn]();
        }
      };
    });

    const preDraw = () => {

    }

    const getFriendlyTime = () => p.floor(s.start + s.t);
    const getFriendlyDuration = () => p.floor(s.start + s.duration);
    const formatTimeAndDuration = () => `${getFriendlyTime()} / ${getFriendlyDuration()}`;

    const stop = (keepTime = false) => {
      togglePlay(p, false);
      if (isRecording) {
        setRecording(false);
        // @ts-ignore
        recorderRef.current.stop();
      }
      if (!keepTime) {
        updateTime(0);
      }
    };

    const loadFont = () => p.once(() => p.loadFont('resources/KaTeX_Main-Regular.ttf'));

    p.preload = () => {
      if (s.webgl) {
        loadFont();
      }

      if (c && c.preload) {
        p.once(c.preload);
      }
    };

    p.setup = () => {
      p.loop();
      // create canvas
      let createCanvas = s.webgl
        ? postActionFunctions['createCanvas'](cellWidth, cellHeight, p.WEBGL)
        : postActionFunctions['createCanvas'](cellWidth, cellHeight);

      // streamRef.current = canvas.elt.captureStream(60)
      p.randomSeed(1337);
      p.frameRate(s.frameRate);
      p.textSize(15);
      p.noStroke();

      function createSlider(sliderWidth, min, max, current, step = 1) {
        timeSlider = p.createDiv();
        timeSlider.attribute("role", "slider")
        timeSlider.attribute("aria-label", "Seek slider")
        timeSlider.attribute("draggable", "true")
        timeSlider.attribute("aria-valuemin", min)
        timeSlider.attribute("aria-valuenow", current)
        timeSlider.style('width', `${sliderWidth}px`);
        timeSlider.style('margin-left', `${playButtonSize}px`);
        timeSlider.addClass('progress-bar');

        progressHandle = p.createSlider(min, max, current, step);
        progressHandle.addClass('progress-handle');
        progressHandle.style('width', `${sliderWidth}px`);
        progressHandle.parent(timeSlider);

        const progress = p.createDiv();
        progress.addClass('progress-fill');
        progress.parent(timeSlider);
        return [
          timeSlider,
          (t) => {
            progress.style('width', `${sliderWidth * (t / max)}px`);
            progressHandle.value(t);
            timeSlider.attribute('aria-valuenow', t);
            time.html(formatTimeAndDuration());
          }
        ];
      }

      [timeSlider, updateTime] = createSlider(cellWidth - playButtonSize - 8,0, s.duration, s.t, 0.01);
      timeSlider.parent(timeSliderRef.current);

      time = p.createSpan();
      time.addClass('seek-time');
      time.parent(timeSliderRef.current);

      updateTime(s.t);

      if (c && c.setup) {
        try {
          c.setup();
        } catch (e) {
          console.error("Failed to execute setup.", e)
        }
      }

      // let height = canvas.height;
      // let width = canvas.width;
      if (s.webgl && typeof p.textFont() !== "object") {
        p.textFont(loadFont());
      }
    }

    p.draw = () => {
      p.textSize(18);
      if (shouldRecord && !isRecording) {
        updateTime(0);
        setRecording(true);
        togglePlay(p,true);
        // @ts-ignore
        recorderRef.current.start(1000);
      } else if (!shouldRecord && isRecording) {
        // @ts-ignore
        recorderRef.current.stop();
        setRecording(false);
      }

      if (progressHandle.value() !== s.t) {
        s.t = progressHandle.value();
        updateTime(s.t);
      }

      let shouldPlay = isPlaying(p);
      let nextT = shouldPlay ? (s.t + s.rate) % s.duration : s.t;
      if (c && c.draw && !p.noDraw) {
        try {
          c.draw(s.start + s.t, s.start + nextT);
        } catch (e) {
          p.noLoop();
          console.error("Failed to execute draw.", e)
        }
      }

      if (shouldPlay && !p.noDraw) {
        s.t = nextT;
        updateTime(s.t);
        if (!loop && s.t + s.rate >= s.duration) {
          stop();
        }
      } else if (shouldPlay && p.noDraw) {
        stop();
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
  useEffect(rerender, [Sketch, cellWidth, cellHeight]);

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
        ref={playButtonRef}
        className={`play-button${!autoPlay ? '' : ' paused'}`}
        onClick={() => {togglePlay(p5Ref.current); }}
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