import React, {useRef, useState} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import SketchCell from "./SketchUtils/SketchCell";

const templateProgram = `(p, s) => {
    const setup = () => {
      p.textSize(15);
      p.latex("x = \\\\sum_{i=1}^{3} sin(\\\\frac{t}{10i})", 8, 8);
    };

    const draw = (t, nextT) => {
      p.background(0);
      plot(t);
    };

    const plot = (t, tail = 100, color = '#F76C5E') => {
      p.plot2D(Math.max(t, t - tail), t, x1, y1_, color, 3);
    }

    const x1 = (t) => {
      // return t;
      let scale = s.width / 10;
      return s.width / 2 + scale * (p.sin(t/10) + p.sin(t/20) + p.sin(t/30));
    }

    const y1_ = (t) => {
      return s.height - y1(t);
    }

    const y1 = (t) => {
      // return t;
      let scale = s.width / 10;
      return s.height / 2 + scale * (p.cos(t / 10) + p.cos(t / 20) + p.cos(t / 30));
    }
    return {setup, draw};
  };
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
      <AceEditor
        style={{width: `${width}px`}}
        // height={`${height}px`}
        mode="jsx"
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        onChange={updateOnChange ? onChange : undefined}
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