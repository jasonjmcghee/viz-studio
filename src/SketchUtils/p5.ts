import p5 from 'p5';
import {plot2D} from "./plot";
import {latex} from "./latex";
import {isWebGL} from "./webgl";

p5.prototype.plot2D = plot2D;
p5.prototype.latex = latex;
p5.prototype.isWebGL = isWebGL;

export default p5;
