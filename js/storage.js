/* Persistence layer — everything lives in browser localStorage. */
window.AOE_Store = (function () {
  const KEY = 'attacker-of-english:v1';

  const fresh = () => ({
    name: '',
    avatar: 'isagi',     // id from AOE_AVATARS
    egoPoints: 0,
    levels: {},          // id -> { drills: {idx: true}, courseDone, cleared, stars, bestGoals, attempts }
    filters: { category: 'all', status: 'all' },
    showZh: false,       // translation mode: show Chinese under every English sentence
    createdAt: Date.now()
  });

  let state;
  try {
    state = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {});
  } catch (e) {
    state = fresh();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
  }

  function level(id) {
    if (!state.levels[id]) {
      state.levels[id] = { drills: {}, courseDone: false, cleared: false, stars: 0, bestGoals: 0, attempts: 0 };
    }
    return state.levels[id];
  }

  function isUnlocked(id) {
    return id === 1 || !!(state.levels[id - 1] && state.levels[id - 1].cleared);
  }

  function status(id) {
    if (!isUnlocked(id)) return 'locked';
    const l = state.levels[id];
    if (l && l.cleared) return 'cleared';
    if (l && l.courseDone) return 'course';
    return 'new';
  }

  function clearedCount() {
    return Object.values(state.levels).filter(l => l.cleared).length;
  }

  function update(fn) { fn(state); save(); }

  function reset() {
    const { name, avatar } = state;
    state = fresh();
    Object.assign(state, { name, avatar });
    save();
  }

  return {
    get: () => state,
    level, isUnlocked, status, clearedCount, update, save, reset
  };
})();
