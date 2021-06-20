import p5 from 'p5';
import katex from 'katex';

export const latex = p5.prototype.latex = function latex(
  text, x = 0, y = 0
) {
  let tex = this.createSpan();
  tex.style('font-size', `${this.textSize()}px`);
  tex.position(x, y);
  katex.render(text, tex.elt);
}