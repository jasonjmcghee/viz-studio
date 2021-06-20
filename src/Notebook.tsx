import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"

function EditorCell() {}

export default function Notebook() {
  const onChange = (newValue) => {

  };
  return (
    <AceEditor
      mode="jsx"
      theme="github"
      name="UNIQUE_ID_OF_DIV"
      onChange={onChange}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
      }}
    />

  );
}