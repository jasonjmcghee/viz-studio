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

export const staticText = p5.prototype.staticText = function staticText(
  string, x = 0, y = 0,
) {
  return this.latex(`\\text{${string}}`, x, y);
}

export const textPoints = p5.prototype.textPoints = function textPoints(
  string, {
    x = 0,
    y = 0,
    fontSize = 100,
    sampleFactor = 0.1,
    simplifyThreshold = 0,
  } = {}) {
  const font = this.textFont();
  const result = string.split().map((char) =>
    font.textToPoints(char, x, y, fontSize, {
      sampleFactor,
      simplifyThreshold,
    })
  ).flat();
  result.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    return 0;
  });
  return result;
}