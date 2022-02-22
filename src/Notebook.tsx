import React, {useEffect, useRef, useState} from "react";
import { useLocation, useHistory } from 'react-router-dom';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import SketchCell from "./SketchUtils/SketchCell";
import {debounce} from "react-ace/lib/editorOptions";
import SplitPane from "react-split-pane";
import './Notebook.scss';
import {plotAndParticles} from "./examples/plotAndParticles";
import {doublePendulum} from "./examples/doublePendulum";
import {mandelbrot} from "./examples/mandelbrot";
import {newSketch} from "./examples/newSketch";

function to_b64( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}

function from_b64( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}

function hashCode(string){
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const character = string.charCodeAt(i);
    hash = ((hash<<5)-hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export default function EditorCell({
  height,
  width = 700,
  updateOnChange = false,
}) {
  const [freshState, setFreshState] = useState(false);
  const [resizeFraction, setResizeFraction] = useState(4/7);
  const [showEditor, setShowEditor] = useState(height > 400);

  const isVerticalSplit = width > 1000;
  const [codeString, setCodeString] = useState(``);
  const autoUpdate = useRef(false);
  const location = useLocation();
  const history = useHistory();
  const dimSize = isVerticalSplit ? width : height;
  const ratio = showEditor ? resizeFraction : 1;

  const defaultSize = useRef(Math.floor(ratio * dimSize));
  // useEffect(() => {
  //   defaultHeight.current = parseInt(
  //     localStorage.getItem('splitPos') ?? defaultHeight.current.toString(), 10
  //   );
  // }, []);

  const [sketchSize, setSketchSize] = useState(defaultSize.current);

  function updateProg(prog) {
    if (!prog.length) {
      setCodeString(plotAndParticles);
      return;
    }
    if (prog.toLowerCase() === "new") {
      setCodeString(newSketch);
      return;
    }
    if (prog.toLowerCase() === "pendulum") {
      setCodeString(doublePendulum);
      return;
    }
    if (prog.toLowerCase() === "mandelbrot") {
      setCodeString(mandelbrot);
      return;
    }
    try {
      const code = from_b64(prog);
      setCodeString(code);
    } catch (e) {
      console.error("Unable to parse program, falling back to template.");
      location.hash = "";
      setCodeString(plotAndParticles);
    }
  }

  useEffect(() => {
    updateProg(location.pathname.substr(1));
    history.listen((loc) => {
      if (autoUpdate.current) return;
      setFreshState(true);
      updateProg(loc.pathname.substr(1));
      setFreshState(false);
    });
  }, []);

  const onChange = (newValue) => {
    if (hashCode(codeString) !== hashCode(newValue)) {
      setCodeString(newValue);
      // const title = `${document.title} - Updated`;
      autoUpdate.current = true;
      const prog = to_b64(newValue);
      history.push(prog);
      updateProg(prog)
      autoUpdate.current = false;
    }
  };

  const onBlur = (e, editor) => onChange(editor.getValue());

  const updateSize = (size) => {
    // localStorage.setItem('splitPos', size.toString());
    setResizeFraction(size / dimSize);
    setSketchSize(resizeFraction * dimSize);
  };

  useEffect(() => {
    setSketchSize(resizeFraction * dimSize);
  }, [dimSize, resizeFraction]);

  const sketchHeight = isVerticalSplit ? height : ratio * height;
  const sketchWidth = isVerticalSplit ? ratio * width : width;
  const editorHeight = isVerticalSplit ? height : height - sketchHeight;
  const editorWidth = isVerticalSplit ? width - sketchWidth : width;

  return (
    <div>
      {codeString && <SplitPane
        split={isVerticalSplit ? 'vertical' : 'horizontal'}
        size={(isVerticalSplit ? sketchWidth : sketchHeight)}
        onChange={debounce(updateSize, 300)}
        allowResize={true}
        onResizerDoubleClick={() => setShowEditor(!showEditor)}
      >
        <SketchCell
        width={sketchWidth}
        height={sketchHeight}
        codeString={codeString}
        rate={1}
        loop={true}
        freshState
      />
      {// @ts-ignore
      }{showEditor && <AceEditor
        style={{width: `${editorWidth}px`}}
        height={`${editorHeight}px`}
        mode="jsx"
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        onChange={updateOnChange ? debounce(onChange, 300) : undefined}
        onBlur={!updateOnChange ? onBlur : undefined}
        value={codeString}
        defaultValue={codeString}
        editorProps={{$blockScrolling: true}}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          tabSize: 2,
          printMargin: false,
        }}
      />}
      </SplitPane>}
    </div>
  );
}