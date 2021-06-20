import p5 from 'p5';
import {plot2D} from "./plot";
import {latex} from "./latex";

p5.prototype.plot2D = plot2D;
p5.prototype.latex = latex;

export default p5;
