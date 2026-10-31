/* Attacker of English — app shell: routing, views, course, match flow. */
(function () {
  const { LEVELS, CATEGORIES, STATUSES } = window.AOE_DATA;
  const Store = window.AOE_Store;
  const $ = s => document.querySelector(s);
  const DRILLS = 3;
  const GOALS_NEEDED = 3;
  const MAX_HEARTS = 3;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const blanks = s => esc(s).replace(/___/g, '<span class="blank">_____</span>');
  const bold = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const starsHtml = n => '★'.repeat(n) + `<span class="off">${'★'.repeat(3 - n)}</span>`;
  const levelById = id => LEVELS.find(l => l.id === id);
  const CAT_ZH = { present: '現在式', past: '過去式', future: '未來式' };

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) document.body.classList.add('touch');

  // ---------- Translation mode ----------
  // An English sentence (already HTML) with its Chinese translation underneath.
  // The global 中譯 toggle shows/hides every translation; the 譯 button flips one.
  function sentenceHtml(enHtml, zh, cls) {
    return `<div class="sentence">
      <div class="sentence-row"><p class="${cls || 'en'}">${enHtml}</p><button class="tr-btn" type="button" aria-label="顯示／隱藏翻譯">譯</button></div>
      <p class="tr" lang="zh-Hant">${esc(zh)}</p>
    </div>`;
  }

  function applyZh() {
    const on = !!Store.get().showZh;
    document.body.classList.toggle('zh-on', on);
    document.querySelectorAll('[data-zh-toggle]').forEach(b => b.setAttribute('aria-pressed', on));
    document.querySelectorAll('.tr[data-force]').forEach(t => t.removeAttribute('data-force'));
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-zh-toggle]')) {
      Store.update(s => { s.showZh = !s.showZh; });
      return applyZh();
    }
    const btn = e.target.closest('.tr-btn');
    if (btn) {
      const tr = btn.closest('.sentence').querySelector('.tr');
      const visible = getComputedStyle(tr).display !== 'none';
      tr.dataset.force = visible ? 'hide' : 'show';
    }
  });

  // ---------- Router ----------
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function show(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
    window.scrollTo(0, 0);
  }
  function route() {
    if (match && !location.hash.startsWith('#/match/')) endGame();
    closeDialog();
    applyZh();
    if (!Store.get().name) return show('view-welcome');
    const [, view, arg] = location.hash.split('/');
    const id = parseInt(arg, 10);
    if (view === 'course' && levelById(id) && Store.isUnlocked(id)) return renderCourse(id);
    if (view === 'match' && levelById(id) && Store.isUnlocked(id)) {
      if (!Store.level(id).courseDone) return go(`#/course/${id}`);
      return startMatch(id);
    }
    renderHome();
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]');
    if (nav) go('#/' + nav.dataset.nav);
  });

  // ---------- Welcome ----------
  $('#welcome-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#striker-name').value.trim();
    if (!name) return;
    Store.update(s => { s.name = name; });
    go('#/home');
  });

  // ---------- Home ----------
  const RANK_TITLES = ['未排名的利己主義者', '新星前鋒', '新星前鋒', '新星前鋒', '選拔倖存者', '選拔倖存者', '選拔倖存者',
    '新英雄', '新英雄', '新英雄', 'U-20 王牌', 'U-20 王牌', '世界第一前鋒'];

  function renderHome() {
    show('view-home');
    const s = Store.get();
    const cleared = Store.clearedCount();
    const stars = LEVELS.reduce((n, l) => n + (s.levels[l.id] ? s.levels[l.id].stars : 0), 0);
    $('#profile-name').textContent = s.name;
    $('#profile-title').textContent = RANK_TITLES[cleared];
    $('#rank-num').textContent = '#' + Math.max(1, 300 - cleared * 25);
    $('#stat-cleared').textContent = cleared;
    $('#stat-stars').textContent = stars;
    $('#stat-ego').textContent = s.egoPoints.toLocaleString();
    $('#progress-bar').style.width = (cleared / LEVELS.length * 100) + '%';

    const f = s.filters;
    const statusOf = l => Store.status(l.id);
    const catCount = c => LEVELS.filter(l => (c === 'all' || l.category === c) && (f.status === 'all' || statusOf(l) === f.status)).length;
    const stCount = st => LEVELS.filter(l => (st === 'all' || statusOf(l) === st) && (f.category === 'all' || l.category === f.category)).length;
    const chips = (list, current, count, key) => list.map(c =>
      `<button class="chip" data-filter="${key}" data-value="${c.id}" aria-pressed="${current === c.id}">${c.label}<span class="count">${count(c.id)}</span></button>`).join('');
    $('#filter-category').innerHTML = chips(CATEGORIES, f.category, catCount, 'category');
    $('#filter-status').innerHTML = chips(STATUSES, f.status, stCount, 'status');

    const visible = LEVELS.filter(l => (f.category === 'all' || l.category === f.category) && (f.status === 'all' || statusOf(l) === f.status));
    $('#empty-state').hidden = visible.length > 0;
    $('#level-grid').innerHTML = visible.map(l => {
      const st = statusOf(l), lv = s.levels[l.id] || {};
      const label = { locked: '未解鎖', new: '開始課程', course: '可挑戰', cleared: '已通關' }[st];
      const drills = Object.keys(lv.drills || {}).length;
      return `<button class="level-card ${st === 'locked' ? 'locked' : ''}" data-level="${l.id}" data-num="${l.id}" ${st === 'locked' ? 'aria-disabled="true"' : ''}>
        <div class="top"><span class="cat-tag cat-${l.category}">${CAT_ZH[l.category]}</span><span class="stars">${starsHtml(lv.stars || 0)}</span></div>
        <h3>${esc(l.zh.tense)}</h3>
        <div class="en-name">${esc(l.tense)}</div>
        <div class="stage">第 ${l.id} 關 · ${esc(l.zh.stage)} vs ${esc(l.zh.opponent)}</div>
        <div class="steps" title="課程 ${drills}/${DRILLS} · 挑戰"><span class="${lv.courseDone ? 'on' : ''}"></span><span class="${lv.cleared ? 'on' : ''}"></span></div>
        <span class="status-pill ${st}">${label}</span>
      </button>`;
    }).join('');
  }

  $('#view-home').addEventListener('click', e => {
    const chip = e.target.closest('[data-filter]');
    if (chip) {
      Store.update(s => { s.filters[chip.dataset.filter] = chip.dataset.value; });
      return renderHome();
    }
    const card = e.target.closest('[data-level]');
    if (card) {
      const id = +card.dataset.level;
      if (!Store.isUnlocked(id)) {
        card.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 260 });
        return;
      }
      go(`#/course/${id}`);
    }
  });

  // ---------- Settings ----------
  $('#btn-settings').addEventListener('click', () => {
    openDialog(`
      <h2>設定</h2>
      <p>所有進度都儲存在此瀏覽器中（localStorage）。</p>
      <label class="muted" for="set-name" style="font-size:13px">前鋒名稱</label>
      <div class="welcome-form"><div class="row"><input id="set-name" maxlength="18" value="${esc(Store.get().name)}"></div></div>
      <div class="setting-row">
        <span>中文翻譯模式<small class="muted">在每個英文句子下方顯示中譯</small></span>
        <button class="zh-toggle" data-zh-toggle aria-pressed="${!!Store.get().showZh}"><span class="dot"></span>中譯</button>
      </div>
      <div class="actions">
        <button class="btn btn-primary" id="set-save">儲存</button>
        <button class="btn btn-ghost" id="set-reset">重設進度</button>
      </div>`);
    $('#set-save').onclick = () => {
      const n = $('#set-name').value.trim();
      if (n) Store.update(s => { s.name = n; });
      closeDialog(); renderHome();
    };
    $('#set-reset').onclick = e => {
      if (e.target.dataset.armed) { Store.reset(); closeDialog(); renderHome(); return; }
      e.target.dataset.armed = '1';
      e.target.textContent = '再按一次以清除所有進度';
      e.target.style.color = 'var(--red)';
    };
  });

  // ---------- Course ----------
  function renderCourse(id) {
    show('view-course');
    const L = levelById(id), Z = L.zh;
    const lv = Store.level(id);
    $('#course-topbar').textContent = `第 ${id} 關 · ${Z.tense}`;
    const drills = L.questions.slice(0, DRILLS);
    $('#course-body').innerHTML = `
      <div class="course-hero">
        <div class="lv">第 ${id} 關 · ${CAT_ZH[L.category]}</div>
        <h1>${esc(Z.tense)}</h1>
        <div class="en-title">${esc(L.tense)}</div>
        <div class="stage">${esc(Z.stage)} — 下一個對手：<b>${esc(Z.opponent)}</b></div>
        <div class="coach"><div class="avatar">E</div><div><div class="who">繪心教練</div><p>${esc(Z.story)}</p></div></div>
      </div>
      <div class="section"><h2><span class="n">1</span>公式</h2>
        <div class="formula-grid">
          <div class="formula pos"><div class="k">肯定句</div><div class="v">${esc(L.formula.positive)}</div></div>
          <div class="formula neg"><div class="k">否定句</div><div class="v">${esc(L.formula.negative)}</div></div>
          <div class="formula que"><div class="k">疑問句</div><div class="v">${esc(L.formula.question)}</div></div>
        </div>
      </div>
      <div class="section"><h2><span class="n">2</span>使用時機</h2>
        <ul class="uses">${Z.uses.map(u => `<li>${esc(u)}</li>`).join('')}</ul>
        <div class="signal-label">關鍵字</div>
        <div class="signal-chips">${L.signals.map(sg => `<span>${esc(sg)}</span>`).join('')}</div>
      </div>
      <div class="section"><h2><span class="n">3</span>球場例句</h2>
        <div class="examples">${L.examples.map((x, i) => `<div class="example">${sentenceHtml(bold(x), Z.examples[i])}</div>`).join('')}</div>
      </div>
      <div class="section"><h2><span class="n">4</span>熱身練習</h2>
        ${drills.map((q, i) => drillHtml(q, i, lv.drills[i])).join('')}
      </div>
      <div class="course-cta">
        <p id="cta-text"></p>
        <button class="btn btn-neon" id="cta-btn">進入挑戰 ⚽</button>
      </div>`;
    updateCta(id);

    $('#course-body').querySelectorAll('.drill').forEach(el => {
      el.addEventListener('click', e => {
        const b = e.target.closest('.opt');
        if (!b || b.disabled) return;
        const i = +el.dataset.i, q = drills[i];
        const why = el.querySelector('.why');
        if (b.dataset.v === q.opts[0]) {
          b.classList.add('correct');
          el.querySelectorAll('.opt').forEach(o => { o.disabled = true; });
          el.classList.add('done');
          why.textContent = '✓ ' + q.why;
          Store.update(() => {
            lv.drills[i] = true;
            if (Object.keys(lv.drills).length >= DRILLS) lv.courseDone = true;
          });
          updateCta(id);
        } else {
          b.classList.add('wrong'); b.disabled = true;
          why.textContent = '✗ 不太對——看看關鍵字，再試一次。';
        }
      });
    });
    $('#cta-btn').addEventListener('click', () => go(`#/match/${id}`));
  }

  function drillHtml(q, i, done) {
    const opts = done ? q.opts : shuffle(q.opts);
    return `<div class="drill ${done ? 'done' : ''}" data-i="${i}">
      ${sentenceHtml(`${i + 1}. ${blanks(q.text)}`, q.zh, 'dq')}
      <div class="options">${opts.map(o => `<button class="opt ${done && o === q.opts[0] ? 'correct' : ''}" data-v="${esc(o)}" ${done ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      <p class="why">${done ? '✓ ' + esc(q.why) : ''}</p>
    </div>`;
  }

  function updateCta(id) {
    const lv = Store.level(id);
    const n = Object.keys(lv.drills).length;
    $('#cta-btn').disabled = !lv.courseDone;
    $('#cta-text').innerHTML = lv.cleared
      ? `已通關 <span class="stars">${starsHtml(lv.stars)}</span>——再挑戰一次刷新紀錄吧。`
      : lv.courseDone ? '課程完成！贏下比賽就能解鎖下一關。'
        : `完成熱身練習即可解鎖挑戰（${n}/${DRILLS}）。`;
  }

  // ---------- Match ----------
  let game = null, match = null;

  function buildDeck(id) {
    const tag = l => l.questions.map(q => ({ ...q, tense: l.zh.tense }));
    const own = tag(levelById(id));
    const review = LEVELS.filter(l => l.id < id).flatMap(tag);
    // Mostly the current tense, with a few review questions from earlier levels mixed in.
    return shuffle(own.concat(shuffle(review).slice(0, Math.min(4, Math.floor(id / 2) + 1))));
  }

  function startMatch(id) {
    endGame();
    show('view-match');
    const L = levelById(id);
    match = { id, hearts: MAX_HEARTS, goals: 0, flow: 0, ego: 0, asked: 0, correct: 0, deck: buildDeck(id), over: false };
    $('#hud-level').textContent = `LV ${id} · ${L.zh.tense}`;
    $('#hud-need').textContent = GOALS_NEEDED;
    $('#nogl').hidden = true;
    const hint = $('#match-hint');
    hint.style.opacity = 1;
    setTimeout(() => { hint.style.opacity = 0; }, 6000);
    updateHud();
    try {
      game = window.AOE_Game($('#stage'), {
        level: id,
        joystick: $('#joystick'),
        onEncounter: askQuestion,
        onOrb() {
          if (!match) return;
          match.ego += 25;
          match.flow = Math.min(100, match.flow + 34);
          if (match.flow >= 100) { game.setBoost(true); flash('心流！'); }
          updateHud();
        },
        onFx: (text, bad) => flash(text, bad)
      });
    } catch (err) {
      console.error(err);
      $('#nogl').hidden = false;
    }
    Store.update(() => { Store.level(id).attempts++; });
  }

  function endGame() {
    if (game) { game.destroy(); game = null; }
    stopTimer();
    $('#question-modal').hidden = true;
    match = null;
  }

  function updateHud() {
    if (!match) return;
    $('#hud-hearts').innerHTML = '♥'.repeat(match.hearts) + `<span class="off">${'♥'.repeat(MAX_HEARTS - match.hearts)}</span>`;
    $('#hud-goals').textContent = match.goals;
    $('#hud-flow').style.width = match.flow + '%';
    $('#hud-flow').parentElement.classList.toggle('full', match.flow >= 100);
  }

  let flashTimer;
  function flash(text, bad) {
    const el = $('#flash');
    el.textContent = text;
    el.classList.remove('show', 'bad');
    void el.offsetWidth;
    el.classList.add('show');
    el.classList.toggle('bad', !!bad);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.classList.remove('show'), 1300);
  }

  // Question modal
  let timerRaf = null, keyHandler = null;
  function stopTimer() {
    cancelAnimationFrame(timerRaf);
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }

  function askQuestion(kind, done) {
    if (!match) return;
    if (!match.deck.length) match.deck = buildDeck(match.id);
    const q = match.deck.pop();
    const useFlow = match.flow >= 100;
    let opts = shuffle(q.opts);
    if (useFlow) opts = shuffle([q.opts[0], shuffle(q.opts.slice(1))[0]]);

    const modal = $('#question-modal');
    const kindEl = $('#qm-kind');
    kindEl.textContent = kind === 'shot' ? '射門！' : '對決！';
    kindEl.classList.toggle('shoot', kind === 'shot');
    $('#qm-tense').innerHTML = esc(q.tense) + (useFlow ? '<br><span style="color:var(--neon)">心流：二選一</span>' : '');
    $('#qm-sentence').innerHTML = sentenceHtml(blanks(q.text), q.zh, 'qm-text');
    const fb = $('#qm-feedback');
    fb.textContent = kind === 'shot' ? '選出正確的時態，騙過門將！' : '選出正確的時態，突破防守！';
    fb.className = 'qm-feedback';
    const box = $('#qm-options');
    box.innerHTML = opts.map((o, i) => `<button class="opt" data-v="${esc(o)}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join('');
    applyZh();
    modal.hidden = false;

    let answered = false;
    const limit = Math.max(12, 22 - match.id * 0.8) * 1000;
    const started = performance.now();
    const bar = $('#qm-timer');
    const tick = now => {
      const k = 1 - (now - started) / limit;
      bar.style.transform = `scaleX(${Math.max(0, k)})`;
      if (k <= 0) return answer(null);
      timerRaf = requestAnimationFrame(tick);
    };
    timerRaf = requestAnimationFrame(tick);

    function answer(btn) {
      if (answered || !match) return;
      answered = true;
      stopTimer();
      const correct = !!btn && btn.dataset.v === q.opts[0];
      box.querySelectorAll('.opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.v === q.opts[0]) b.classList.add('correct');
      });
      if (btn && !correct) btn.classList.add('wrong');
      fb.textContent = (correct ? '✓ ' : btn ? '✗ ' : '⏱ 時間到！') + q.why;
      fb.className = 'qm-feedback ' + (correct ? 'good' : 'bad');

      match.asked++;
      if (correct) { match.correct++; match.ego += kind === 'shot' ? 150 : 60; }
      if (useFlow) { match.flow = 0; game && game.setBoost(false); }
      if (kind === 'shot' && correct) match.goals++;
      if (!correct) match.hearts--;

      setTimeout(() => {
        modal.hidden = true;
        if (!match) return;
        updateHud();
        done(correct);
        if (match.goals >= GOALS_NEEDED || match.hearts <= 0) {
          match.over = true;
          setTimeout(() => finishMatch(match.goals >= GOALS_NEEDED), kind === 'shot' ? 2000 : 900);
          if (kind !== 'shot') game && game.freeze(true);
        }
      }, correct ? 900 : 2200);
    }

    box.onclick = e => { const b = e.target.closest('.opt'); if (b) answer(b); };
    keyHandler = e => {
      if (e.key.toLowerCase() === 't') {
        Store.update(s => { s.showZh = !s.showZh; });
        return applyZh();
      }
      const n = parseInt(e.key, 10);
      const b = box.querySelectorAll('.opt')[n - 1];
      if (b) answer(b);
    };
    window.addEventListener('keydown', keyHandler);
  }

  function finishMatch(won) {
    if (!match) return;
    const m = match, id = m.id, L = levelById(id);
    game && game.freeze(true);
    const stars = won ? Math.max(1, m.hearts) : 0;
    const acc = m.asked ? Math.round(m.correct / m.asked * 100) : 0;
    const gained = m.ego + stars * 100;
    let firstClear = false;
    Store.update(s => {
      const lv = Store.level(id);
      if (won && !lv.cleared) firstClear = true;
      if (won) lv.cleared = true;
      lv.stars = Math.max(lv.stars, stars);
      lv.bestGoals = Math.max(lv.bestGoals, m.goals);
      s.egoPoints += gained;
    });
    const last = id === LEVELS.length;
    const next = levelById(id + 1);
    const title = won ? (last ? '世界第一！' : '勝利！') : '淘汰';
    const msg = won
      ? (last
        ? `${esc(Store.get().name)}，你征服了全部 12 種時態。藍色監獄誕生了第一名的前鋒！`
        : `你擊敗了${esc(L.zh.opponent)}。` + (firstClear && next ? `<b>第 ${next.id} 關：${esc(next.zh.tense)}</b> 已解鎖。` : ''))
      : '這次你的「自我」還不夠強。複習課程，變得更強再回來吧。';
    openDialog(`
      <h2 class="${won ? 'win' : 'lose'}">${title}</h2>
      <div class="big-stars">${starsHtml(stars)}</div>
      <p>${msg}</p>
      <div class="result-stats">
        <div><b>${m.goals}/${GOALS_NEEDED}</b><span>進球</span></div>
        <div><b>${acc}%</b><span>正確率</span></div>
        <div><b>+${gained}</b><span>自我點數</span></div>
      </div>
      <div class="actions">
        ${won && next ? `<button class="btn btn-neon" data-go="#/course/${next.id}">下一關 →</button>` : ''}
        ${!won ? `<button class="btn btn-primary" data-go="#/match/${id}">再試一次</button><button class="btn" data-go="#/course/${id}">複習課程</button>` : `<button class="btn" data-go="#/match/${id}">再玩一次</button>`}
        <button class="btn btn-ghost" data-go="#/home">地圖</button>
      </div>`);
  }

  $('#btn-quit').addEventListener('click', () => {
    if (!match || match.over) return go('#/home');
    game && game.freeze(true);
    openDialog(`
      <h2>離開比賽？</h2>
      <p>這場比賽的進度將不會保存。</p>
      <div class="actions">
        <button class="btn btn-primary" id="stay">繼續比賽</button>
        <button class="btn btn-ghost" data-go="#/home">離開</button>
      </div>`);
    $('#stay').onclick = () => { closeDialog(); game && game.freeze(false); };
  });

  // ---------- Dialog ----------
  function openDialog(html) {
    $('#dialog-card').innerHTML = html;
    $('#dialog').hidden = false;
  }
  function closeDialog() { $('#dialog').hidden = true; }
  $('#dialog').addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (b) {
      closeDialog();
      go(b.dataset.go);
    }
  });

  route();
})();
