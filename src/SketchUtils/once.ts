import p5 from 'p5';

export const once = p5.prototype.once = function once(fn) {
  if (!this.__once) {
    this.__once = {};
  }
  if (!this.__once[fn.toString()]) {
    this.__once[fn.toString()] = fn();
  }
  return this.__once[fn.toString()];
};

export const fromOnce = p5.prototype.fromOnce = function fromOnce(name) {
  return (this.__once || {})[name];
};