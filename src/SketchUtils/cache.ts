import p5 from 'p5';

export const cache = p5.prototype.cache = function cache(name, item) {
  if (!this.__state) {
    this.__state = {};
  }
  this.__state[name] = item;
  return this.__state[name];
};

export const fromCache = p5.prototype.fromCache = function fromCache(name) {
  return this.__state[name];
};

export const removeFromCache = p5.prototype.removeFromCache = function removeFromCache(name) {
  delete this.__state[name];
};

export const clearCache = p5.prototype.clearCache = function clearCache(name) {
  this.__state = {};
};