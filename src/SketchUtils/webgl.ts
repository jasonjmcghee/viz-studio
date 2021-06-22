import p5 from "p5";

export const isWebGL = p5.prototype.isWebGL = function isWebGL() {
  return this._renderer.drawingContext instanceof WebGLRenderingContext;
}