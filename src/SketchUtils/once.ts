import p5 from 'p5';

export const once = p5.prototype.once = function once(name, fn) {
  if (!this.__once) {
    this.__once = {};
  }
  if (!this.__once[name]) {
    this.__once[name] = fn();
  }
};

export const fromOnce = p5.prototype.fromOnce = function fromOnce(name) {
  return (this.__once || {})[name];
};