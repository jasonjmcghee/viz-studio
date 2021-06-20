(this["webpackJsonpviz-studio"]=this["webpackJsonpviz-studio"]||[]).push([[0],{15:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return SketchCell}));var _Users_jason_WebstormProjects_viz_studio_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(3),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(0),react__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__),_p5__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(17),_slider_scss__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(34),_slider_scss__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_slider_scss__WEBPACK_IMPORTED_MODULE_3__),_play_button_scss__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(35),_play_button_scss__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_play_button_scss__WEBPACK_IMPORTED_MODULE_4__),_cell_scss__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(36),_cell_scss__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_cell_scss__WEBPACK_IMPORTED_MODULE_5__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(1),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);function SketchCell(_ref){var _ref$duration=_ref.duration,duration=void 0===_ref$duration?500:_ref$duration,_ref$rate=_ref.rate,rate=void 0===_ref$rate?1:_ref$rate,_ref$width=_ref.width,width=void 0===_ref$width?710:_ref$width,_ref$height=_ref.height,height=void 0===_ref$height?400:_ref$height,_ref$playButtonSize=_ref.playButtonSize,playButtonSize=void 0===_ref$playButtonSize?30:_ref$playButtonSize,_ref$autoPlay=_ref.autoPlay,autoPlay=void 0===_ref$autoPlay||_ref$autoPlay,_ref$loop=_ref.loop,loop=void 0!==_ref$loop&&_ref$loop,_ref$code=_ref.code,code=void 0===_ref$code?function(e,t){return{setup:function(){},draw:function(e){}}}:_ref$code,_ref$codeString=_ref.codeString,codeString=void 0===_ref$codeString?"":_ref$codeString,cellRef=Object(react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),timeSliderRef=Object(react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),sketchState=Object(react__WEBPACK_IMPORTED_MODULE_1__.useRef)({duration:duration,t:0,count:100,width:width,height:height,codeString:codeString}),s=sketchState.current;Object(react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((function(){s.width=width,s.height=height,s.codeString=codeString}),[width,height,s,codeString]);var _useState=Object(react__WEBPACK_IMPORTED_MODULE_1__.useState)(autoPlay),_useState2=Object(_Users_jason_WebstormProjects_viz_studio_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__.a)(_useState,2),shouldPlay=_useState2[0],setPlay=_useState2[1],Sketch=function Sketch(p){var timeSlider,c=s.codeString?function(){try{return eval(s.codeString)(p,s)}catch(e){console.error("Failed to compile.")}}():code(p,s);p.setup=function(){console.log("Call to setup."),p.createCanvas(width,height),p.textSize(15),p.noStroke(),!shouldPlay&&timeSlider&&timeSlider.value()===s.t&&p.noLoop(),(timeSlider=p.createSlider(0,s.duration,s.t,.01)).style("width","".concat(width-playButtonSize-8,"px")),timeSlider.style("margin-left","".concat(playButtonSize,"px")),timeSlider.addClass("e-range"),timeSlider.parent(timeSliderRef.current),c&&c.setup()},p.draw=function(){timeSlider.value()!==s.t&&(s.t=timeSlider.value());var e=shouldPlay?(s.t+rate)%s.duration:s.t;c&&c.draw(s.t,e),shouldPlay&&(s.t=e,timeSlider.value(s.t),!loop&&s.t+rate>=s.duration&&(setPlay(!1),timeSlider.value(0)))}},myRef=Object(react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),p5Ref=Object(react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);return Object(react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((function(){null!=p5Ref.current&&p5Ref.current.remove(),p5Ref.current=new _p5__WEBPACK_IMPORTED_MODULE_2__.a(Sketch,myRef.current)})),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div",{ref:cellRef,className:"cell",children:[Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div",{className:"sketch",ref:myRef}),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div",{ref:timeSliderRef,className:"time-slider"}),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button",{className:"play-button".concat(shouldPlay?" paused":""),onClick:function(){setPlay(!shouldPlay)}})]})}},17:function(e,t,_){"use strict";var r=_(2),n=_.n(r),i=n.a.prototype.plot2D=function(e,t,_,r){var n=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"#F76C5E",i=arguments.length>5&&void 0!==arguments[5]?arguments[5]:3;this.stroke(n),this.strokeWeight(i),this.noFill(),this.beginShape(),this.curveVertex(_(e),r(e));for(var o=0;o<t-1;o++)this.curveVertex(_(e+o),r(e+o));this.curveVertex(_(e+t-1),r(e+t-1)),this.curveVertex(_(e+t-1),r(e+t-1)),this.endShape()},o=_(16),c=_.n(o),s=n.a.prototype.latex=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,_=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=this.createSpan();r.style("font-size","".concat(this.textSize(),"px")),r.position(t,_),c.a.render(e,r.elt)};n.a.prototype.plot2D=i,n.a.prototype.latex=s;t.a=n.a},22:function(e,t,_){},23:function(e,t,_){},34:function(e,t,_){},35:function(e,t,_){},36:function(e,t,_){},38:function(e,t,_){"use strict";_.r(t);var r=_(0),n=_.n(r),i=_(13),o=_.n(i),c=(_(22),_(3)),s=(_(23),_(14)),a=_.n(s),u=(_(31),_(32),_(33),_(15)),l=_(1),d="(p, s) => {\n    const setup = () => {\n      p.textSize(15);\n      p.latex(\"x = \\\\sum_{i=1}^{3} sin(\\\\frac{t}{10i})\", 8, 8);\n    };\n\n    const draw = (t, nextT) => {\n      p.background(0);\n      plot(t);\n    };\n\n    const plot = (t, length= 100, color = '#F76C5E') => {\n      p.plot2D(t, length, x1, y1_, color, 3);\n    }\n\n    const x1 = (t) => {\n      // return t;\n      let scale = s.width / 10;\n      return s.width / 2 + scale * (p.sin(t/10) + p.sin(t/20) + p.sin(t/30));\n    }\n\n    const y1_ = (t) => {\n      return s.height - y1(t);\n    }\n\n    const y1 = (t) => {\n      // return t;\n      let scale = s.width / 10;\n      return s.height / 2 + scale * (p.cos(t / 10) + p.cos(t / 20) + p.cos(t / 30));\n    }\n    return {setup, draw};\n  };\n";function p(e){var t=e.width,_=void 0===t?700:t,n=e.updateOnChange,i=void 0!==n&&n,o=Object(r.useState)(d),s=Object(c.a)(o,2),p=s[0],f=s[1];return Object(l.jsxs)("div",{children:[Object(l.jsx)(u.a,{width:_,height:4/7*_,codeString:p,rate:1,loop:!0}),Object(l.jsx)(a.a,{style:{width:"".concat(_,"px")},mode:"jsx",theme:"monokai",name:"UNIQUE_ID_OF_DIV",onChange:i?function(e){f(e)}:void 0,onBlur:i?void 0:function(e,t){f(t.getValue())},defaultValue:d,editorProps:{$blockScrolling:!0},setOptions:{enableBasicAutocompletion:!0,enableLiveAutocompletion:!0,enableSnippets:!0}})]})}var f=function(){var e=function(){var e=Object(r.useState)([0,0]),t=Object(c.a)(e,2),_=t[0],n=t[1];return Object(r.useLayoutEffect)((function(){function e(){n([window.innerWidth,window.innerHeight])}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),_}(),t=Object(c.a)(e,2),_=t[0];return t[1],Object(l.jsx)("div",{className:"App",children:Object(l.jsx)("header",{className:"App-header",children:_&&Object(l.jsx)(p,{width:_})})})},h=function(e){e&&e instanceof Function&&_.e(3).then(_.bind(null,39)).then((function(t){var _=t.getCLS,r=t.getFID,n=t.getFCP,i=t.getLCP,o=t.getTTFB;_(e),r(e),n(e),i(e),o(e)}))};o.a.render(Object(l.jsx)(n.a.StrictMode,{children:Object(l.jsx)(f,{})}),document.getElementById("root")),h()}},[[38,1,2]]]);
//# sourceMappingURL=main.5b0879ad.chunk.js.map