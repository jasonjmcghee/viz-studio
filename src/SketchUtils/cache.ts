import p5 from 'p5';

export const cache = p5.prototype.cache = function cache(name, item) {
  if (!this.__state) {
    this.__state = {};
  }
  this.__state[name] = item;
  return this.__state[name];
};