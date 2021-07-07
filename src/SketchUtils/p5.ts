import p5 from 'p5';
import {plot2D} from "./plot";
import {latex, staticText} from "./latex";
import {isWebGL} from "./webgl";
import {cache, clearCache, fromCache, removeFromCache} from "./cache";
import {cachedSlider} from "./cachedSlider";
import {fromOnce, once} from "./once";

p5.prototype.plot2D = plot2D;
p5.prototype.latex = latex;
p5.prototype.staticText = staticText;
p5.prototype.isWebGL = isWebGL;
p5.prototype.cache = cache;
p5.prototype.fromCache = fromCache;
p5.prototype.removeFromCache = removeFromCache;
p5.prototype.clearCache = clearCache;
p5.prototype.cachedSlider = cachedSlider;
p5.prototype.once = once;
p5.prototype.fromOnce = fromOnce;

export default p5;
