import React, {useLayoutEffect, useState} from 'react';
import SketchCell from "./SketchUtils/SketchCell";
import './App.css';
import EditorCell from "./Notebook";

function App() {
  // const code = (p, s) => {
  //   const setup = () => {
  //     p.textSize(15);
  //     p.latex("x = \\sum_{i=1}^{3} sin(\\frac{t}{10i})", 8, 8);
  //   };
  //
  //   const draw = (t) => {
  //     p.background(0);
  //     plot(t);
  //   };
  //
  //   const plot = (t, length= 100, color = '#F76C5E') => {
  //     p.plot2D(t, length, x1, y1_, color, 3);
  //   }
  //
  //   const x1 = (t) => {
  //     // return t;
  //     let scale = s.width / 10;
  //     return s.width / 2 + scale * (p.sin(t/10) + p.sin(t/20) + p.sin(t/30));
  //   }
  //
  //   const y1_ = (t) => {
  //     return s.height - y1(t);
  //   }
  //
  //   const y1 = (t) => {
  //     // return t;
  //     let scale = s.width / 10;
  //     return s.height / 2 + scale * (p.cos(t / 10) + p.cos(t / 20) + p.cos(t / 30));
  //   }
  //   return {setup, draw};
  // };

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

  const [width, _] = useWindowSize();

  return (
    <div className="App">
      <header className="App-header">
        {/*<SketchCell*/}
        {/*  height={200}*/}
        {/*  width={200}*/}
        {/*  code={code}*/}
        {/*  rate={2}*/}
        {/*/>*/}
        {width && <EditorCell width={width} updateOnChange={true} />}
      </header>
    </div>
  );
}

export default App;
