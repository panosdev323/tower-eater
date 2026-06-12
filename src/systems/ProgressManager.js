const KEY_LEVEL   = 'te_level';
const KEY_BEST    = 'te_best';
const KEY_ENDLESS = 'te_endless_wave';
const KEY_ENDLESS_BEST = 'te_endless_best';

export const ProgressManager = {
  saveLevel(levelIndex) {
    localStorage.setItem(KEY_LEVEL, String(levelIndex));
  },

  getSavedLevel() {
    const v = localStorage.getItem(KEY_LEVEL);
    return v === null ? 0 : parseInt(v, 10);
  },

  reset() {
    localStorage.removeItem(KEY_LEVEL);
    localStorage.removeItem(KEY_BEST);
    localStorage.removeItem(KEY_ENDLESS);
    localStorage.removeItem(KEY_ENDLESS_BEST);
  },

  updateBest(levelIndex) {
    const current = parseInt(localStorage.getItem(KEY_BEST) ?? '0', 10);
    if (levelIndex > current) {
      localStorage.setItem(KEY_BEST, String(levelIndex));
    }
  },

  getBest() {
    return parseInt(localStorage.getItem(KEY_BEST) ?? '0', 10);
  },

  getEndlessWave() {
    return parseInt(localStorage.getItem(KEY_ENDLESS) ?? '0', 10);
  },

  setEndlessWave(wave) {
    localStorage.setItem(KEY_ENDLESS, String(wave));
  },

  getBestEndlessWave() {
    return parseInt(localStorage.getItem(KEY_ENDLESS_BEST) ?? '0', 10);
  },

  updateBestEndlessWave(wave) {
    const best = this.getBestEndlessWave();
    if (wave > best) localStorage.setItem(KEY_ENDLESS_BEST, String(wave));
  }
};