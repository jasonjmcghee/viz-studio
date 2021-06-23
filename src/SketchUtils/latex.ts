import p5 from 'p5';
import katex from 'katex';

export const latex = p5.prototype.latex = function latex(
  string, x = 0, y = 0
) {
  let tex = this.createSpan();
  tex.style('font-size', `${this.textSize()}px`);
  tex.position(x, y);
  katex.render(string, tex.elt);
  return tex;
}

export const text = p5.prototype.text = function text(
  string, x = 0, y = 0,
) {
  return this.latex(`\\text{${string}}`, x, y);
}