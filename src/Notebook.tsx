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
import {transitionText} from "./examples/transitionText";

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
  const [codeString, setCodeString] = useState(``);
  const autoUpdate = useRef(false);
  const location = useLocation();
  const history = useHistory();

  const defaultHeight = useRef(Math.floor(resizeFraction * width));
  // useEffect(() => {
  //   defaultHeight.current = parseInt(
  //     localStorage.getItem('splitPos') ?? defaultHeight.current.toString(), 10
  //   );
  // }, []);

  const [sketchHeight, setSketchHeight] = useState(defaultHeight.current);

  const lookup = {
    "new": newSketch,
    "pendulum": doublePendulum,
    "mandelbrot": mandelbrot,
    "text": transitionText,
    "": plotAndParticles,
  };

  function updateProg(prog) {
    let code = lookup[prog.toLowerCase()];
    if (code) {
      return setCodeString(code);
    }
    try {
      code = from_b64(prog);
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
  const editorHeight = height - sketchHeight;

  const updateSize = (size) => {
    // localStorage.setItem('splitPos', size.toString());
    setResizeFraction(size / height);
    setSketchHeight(resizeFraction * height);
  };

  useEffect(() => {
    setSketchHeight(resizeFraction * height);
  }, [height, resizeFraction])

  return (
    <div>
      {codeString && <SplitPane
        split="horizontal"
        defaultSize={sketchHeight}
        onChange={debounce(updateSize, 300)}
        allowResize={true}
      >
        <SketchCell
        cellWidth={width}
        cellHeight={sketchHeight}
        codeString={codeString}
        rate={1}
        loop={true}
        freshState
      />
      {// @ts-ignore
      }<AceEditor
        style={{width: `${width}px`}}
        height={`${height - sketchHeight}px`}
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
      />
      </SplitPane>}
    </div>
  );
}