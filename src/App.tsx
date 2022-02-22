import React, {useLayoutEffect, useState} from 'react';
import SketchCell from "./SketchUtils/SketchCell";
import './App.css';
import EditorCell from "./Notebook";

function App() {
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const [width, height] = useWindowSize();

  return (
    <div className="App">
      <header className="App-header">
        {width && <EditorCell height={height} width={width} updateOnChange={true} />}
      </header>
    </div>
  );
}

export default App;
