import p5 from 'p5';
import {plot2D} from "./plot";
import {latex} from "./latex";
import {isWebGL} from "./webgl";
import {cache} from "./cache";
import {cachedSlider} from "./cachedSlider";

p5.prototype.plot2D = plot2D;
p5.prototype.latex = latex;
p5.prototype.isWebGL = isWebGL;
p5.prototype.cache = cache;
p5.prototype.cachedSlider = cachedSlider;

export default p5;
