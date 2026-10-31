/* Profile avatars — character portraits cropped from the Blue Lock character
 * sheet into assets/avatars/. An unknown saved id falls back to the first one.
 */
window.AOE_AVATARS = (function () {
  const list = [
    ['isagi', '潔世一', 'Isagi'],
    ['bachira', '蜂樂迴', 'Bachira'],
    ['nagi', '凪誠士郎', 'Nagi'],
    ['rin', '糸師凜', 'Rin'],
    ['chigiri', '千切豹馬', 'Chigiri'],
    ['kunigami', '國神錬介', 'Kunigami'],
    ['barou', '馬狼照英', 'Barou'],
    ['kaiser', '米歇爾·凱撒', 'Kaiser']
  ].map(([id, name, en]) => ({
    id, name, en,
    html: () => `<img src="assets/avatars/${id}.jpg" alt="${name}" loading="lazy" decoding="async">`
  }));

  const byId = id => list.find(a => a.id === id) || list[0];
  return { list, byId };
})();
