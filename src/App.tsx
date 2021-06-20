import React from 'react';
import SketchCell from "./SketchUtils/SketchCell";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<input */}
        {/*  type="range" min="0" max="100" value="100" step="1" */}
        {/*  onInput={(e) => e.target.}*/}
        {/*/>*/}
        <SketchCell
          key={0}
          rate={2}
        />
        <SketchCell
          key={1}
          rate={1}
        />
      </header>
    </div>
  );
}

export default App;
