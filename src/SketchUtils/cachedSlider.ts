import p5 from 'p5';

export const cachedSlider = p5.prototype.cachedSlider = function cachedSlider(name, min, max, defaultValue) {
  if (!this.__state) {
    this.__state = {};
  }
  const slider = this.createSlider(min, max, this.fromCache(name)?.value() ?? defaultValue);
  slider.addClass("e-range");
  slider.style('width', '80px');
  slider.style('margin-top', '8px');
  slider.style('background', 'blue');
  return this.cache(name, slider);
};