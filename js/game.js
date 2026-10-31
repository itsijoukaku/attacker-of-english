/* Attacker of English — 3D top-down match (Three.js r128).
 *
 * Moment-to-moment: dribble the ball up the pitch, grab glowing EGO orbs to
 * fill your Flow meter, slip past defenders. When a defender closes in a DUEL
 * starts; in the penalty box a SHOT starts. Both pause the action and hand a
 * question to the app via opts.onEncounter(kind, done). The app calls
 * done(correct) and the game plays out the result.
 */
window.AOE_Game = function (container, opts) {
  const T = window.THREE;
  if (!T) throw new Error('three.js not loaded');

  const HALF_W = 15, HALF_L = 25;
  const BOX_Z = -HALF_L + 12, BOX_X = 9;
  const START = new T.Vector3(0, 0, 19);
  const level = opts.level;

  // ---------- Renderer / scene ----------
  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const scene = new T.Scene();
  scene.background = new T.Color(0x050913);
  scene.fog = new T.Fog(0x050913, 45, 95);
  const camera = new T.PerspectiveCamera(48, 1, 0.1, 200);

  scene.add(new T.HemisphereLight(0xb5d0ff, 0x0b1430, 0.75));
  const sun = new T.DirectionalLight(0xffffff, 0.95);
  sun.position.set(10, 32, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 32, bottom: -32, near: 1, far: 80 });
  scene.add(sun);

  // ---------- Pitch ----------
  function pitchTexture() {
    const S = 20, c = document.createElement('canvas');
    c.width = HALF_W * 2 * S; c.height = HALF_L * 2 * S;
    const g = c.getContext('2d');
    for (let i = 0; i < 10; i++) {
      g.fillStyle = i % 2 ? '#1d6f3a' : '#22803f';
      g.fillRect(0, i * 5 * S, c.width, 5 * S);
    }
    const X = x => (x + HALF_W) * S, Z = z => (z + HALF_L) * S;
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 5;
    g.strokeRect(X(-14.6), Z(-24.6), 29.2 * S, 49.2 * S);
    g.beginPath(); g.moveTo(X(-14.6), Z(0)); g.lineTo(X(14.6), Z(0)); g.stroke();
    g.beginPath(); g.arc(X(0), Z(0), 4.5 * S, 0, Math.PI * 2); g.stroke();
    [-1, 1].forEach(side => {
      const goalZ = side * 24.6, dir = -side;
      g.strokeRect(X(-BOX_X), Math.min(Z(goalZ), Z(goalZ + dir * 12)), BOX_X * 2 * S, 12 * S);
      g.strokeRect(X(-4.5), Math.min(Z(goalZ), Z(goalZ + dir * 4)), 9 * S, 4 * S);
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(X(0), Z(goalZ + dir * 8.5), 5, 0, Math.PI * 2); g.fill();
    });
    g.beginPath(); g.arc(X(0), Z(0), 5, 0, Math.PI * 2); g.fill();
    const tex = new T.CanvasTexture(c);
    tex.encoding = T.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  const pitch = new T.Mesh(
    new T.PlaneGeometry(HALF_W * 2, HALF_L * 2),
    new T.MeshStandardMaterial({ map: pitchTexture(), roughness: 0.95 })
  );
  pitch.rotation.x = -Math.PI / 2;
  pitch.receiveShadow = true;
  scene.add(pitch);

  const floor = new T.Mesh(new T.PlaneGeometry(140, 160), new T.MeshStandardMaterial({ color: 0x0a1226, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.02; floor.receiveShadow = true;
  scene.add(floor);
  const grid = new T.GridHelper(140, 70, 0x1f7bff, 0x13265a);
  grid.position.y = -0.01; grid.material.transparent = true; grid.material.opacity = 0.35;
  scene.add(grid);

  // Facility walls with glowing blue strips — the "Blue Lock" cage.
  const wallMat = new T.MeshStandardMaterial({ color: 0x0c1631, roughness: 0.6, metalness: 0.3 });
  const glowMat = new T.MeshBasicMaterial({ color: 0x1f7bff });
  function wall(w, d, x, z) {
    const m = new T.Mesh(new T.BoxGeometry(w, 2.4, d), wallMat);
    m.position.set(x, 1.2, z); m.castShadow = true; m.receiveShadow = true; scene.add(m);
    const s = new T.Mesh(new T.BoxGeometry(w + 0.02, 0.12, d + 0.02), glowMat);
    s.position.set(x, 2.1, z); scene.add(s);
  }
  wall(0.6, 62, -18.5, 0); wall(0.6, 62, 18.5, 0);
  wall(37.6, 0.6, 0, -30.5); wall(37.6, 0.6, 0, 30.5);

  // Goal
  const white = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  [-3.66, 3.66].forEach(x => {
    const p = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 2.44, 10), white);
    p.position.set(x, 1.22, -HALF_L); p.castShadow = true; scene.add(p);
  });
  const bar = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 7.52, 10), white);
  bar.rotation.z = Math.PI / 2; bar.position.set(0, 2.44, -HALF_L); bar.castShadow = true; scene.add(bar);
  const net = new T.Mesh(
    new T.BoxGeometry(7.32, 2.44, 2, 10, 4, 3),
    new T.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 })
  );
  net.position.set(0, 1.22, -HALF_L - 1); scene.add(net);

  // ---------- Characters ----------
  function makePlayer(shirt, shorts, hair) {
    const g = new T.Group();
    const mat = c => new T.MeshStandardMaterial({ color: c, roughness: 0.6 });
    const skin = mat(0xf1c7a1);
    const add = (geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
    const legs = [-0.18, 0.18].map(x => {
      const pivot = new T.Group(); pivot.position.set(x, 0.85, 0); g.add(pivot);
      const leg = new T.Mesh(new T.CylinderGeometry(0.12, 0.1, 0.8, 8), skin);
      leg.position.y = -0.42; leg.castShadow = true; pivot.add(leg);
      const boot = new T.Mesh(new T.BoxGeometry(0.2, 0.12, 0.34), mat(0x111111));
      boot.position.set(0, -0.82, 0.06); pivot.add(boot);
      return pivot;
    });
    add(new T.CylinderGeometry(0.42, 0.4, 0.34, 12), mat(shorts), 0, 0.92, 0);
    add(new T.CylinderGeometry(0.44, 0.36, 0.78, 12), mat(shirt), 0, 1.45, 0);
    [-0.52, 0.52].forEach(x => add(new T.CylinderGeometry(0.1, 0.09, 0.7, 8), mat(shirt), x, 1.45, 0));
    add(new T.SphereGeometry(0.3, 16, 12), skin, 0, 2.1, 0);
    add(new T.SphereGeometry(0.33, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(hair), 0, 2.13, 0);
    g.userData.legs = legs;
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    return g;
  }
  function animateLegs(m, speed, t) {
    const a = Math.min(speed / 6, 1) * 0.7 * Math.sin(t * 14);
    m.userData.legs[0].rotation.x = a;
    m.userData.legs[1].rotation.x = -a;
  }

  // Striker (you)
  const player = makePlayer(0x1442c9, 0x0b1430, 0x14141c);
  scene.add(player);
  const ringMat = new T.MeshBasicMaterial({ color: 0x00e0ff, transparent: true, opacity: 0.85, side: T.DoubleSide });
  const ring = new T.Mesh(new T.RingGeometry(0.75, 0.95, 40), ringMat);
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; scene.add(ring);
  const aura = new T.Mesh(new T.RingGeometry(1.1, 1.5, 40), new T.MeshBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0, side: T.DoubleSide }));
  aura.rotation.x = -Math.PI / 2; aura.position.y = 0.04; scene.add(aura);

  // Ball
  function ballTexture() {
    const c = document.createElement('canvas'); c.width = 128; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, 128, 64);
    g.fillStyle = '#111';
    [[16, 16], [56, 12], [96, 18], [36, 44], [78, 48], [118, 44]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 8, 0, Math.PI * 2); g.fill(); });
    return new T.CanvasTexture(c);
  }
  const ball = new T.Mesh(new T.SphereGeometry(0.25, 24, 16), new T.MeshStandardMaterial({ map: ballTexture(), roughness: 0.4 }));
  ball.castShadow = true; scene.add(ball);

  // Opponents — kit colour changes per level
  const KITS = [0xf2f2f2, 0xff6b2d, 0x8a2be2, 0x3a3a3a, 0xd0213d, 0x10a37f, 0x111111, 0x7a5c3a, 0xc92a2a, 0xb30000, 0x0b3d91, 0xffd700];
  const kit = KITS[(level - 1) % KITS.length];
  const defenderCount = Math.min(2 + Math.ceil(level / 2), 8);
  const defSpeed = 3.2 + level * 0.22;
  const aggro = 8.5 + level * 0.4;
  const defenders = [];
  for (let i = 0; i < defenderCount; i++) {
    const mesh = makePlayer(kit, 0x222222, 0x3b2a1a);
    const row = i / Math.max(defenderCount - 1, 1);
    const home = new T.Vector3((i % 2 ? 1 : -1) * (1 + ((i * 37) % 7)), 0, -17 + row * 25);
    mesh.position.copy(home);
    scene.add(mesh);
    defenders.push({ mesh, home, stun: 0, speed: defSpeed * (0.9 + ((i * 13) % 5) * 0.05) });
  }

  const keeper = makePlayer(0x39d353, 0x111111, 0x111111);
  keeper.position.set(0, 0, -HALF_L + 0.8);
  keeper.rotation.y = 0;
  scene.add(keeper);

  // EGO orbs
  const orbGeo = new T.SphereGeometry(0.32, 16, 12);
  const haloGeo = new T.SphereGeometry(0.6, 16, 12);
  const orbs = [];
  function placeOrb(o) {
    o.position.set((Math.random() * 2 - 1) * 12, 0.8, -20 + Math.random() * 36);
  }
  for (let i = 0; i < 5; i++) {
    const o = new T.Mesh(orbGeo, new T.MeshBasicMaterial({ color: 0xc6ff3d }));
    o.add(new T.Mesh(haloGeo, new T.MeshBasicMaterial({ color: 0xc6ff3d, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false })));
    placeOrb(o); o.userData.phase = Math.random() * 6; scene.add(o); orbs.push(o);
  }

  // ---------- State ----------
  const pos = START.clone();
  const vel = new T.Vector3();
  const facing = new T.Vector3(0, 0, -1);
  let t = 0, paused = false, frozen = false, boost = false, dash = 0, invuln = 1, drama = 0;
  let cutscene = null; // { time, update(dt, k), done }

  // ---------- Input ----------
  const keys = {};
  const stick = { x: 0, y: 0 };
  const onKey = e => {
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) {
      keys[k] = e.type === 'keydown';
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);

  const joy = opts.joystick, knob = joy && joy.querySelector('.knob');
  let joyId = null;
  function joyMove(e) {
    if (e.pointerId !== joyId) return;
    const r = joy.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const max = r.width / 2 - 14, len = Math.hypot(dx, dy);
    if (len > max) { dx *= max / len; dy *= max / len; }
    stick.x = dx / max; stick.y = dy / max;
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  }
  function joyEnd(e) {
    if (e.pointerId !== joyId) return;
    joyId = null; stick.x = stick.y = 0; knob.style.transform = '';
  }
  const joyStart = e => { joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyMove(e); e.preventDefault(); };
  if (joy) {
    joy.addEventListener('pointerdown', joyStart);
    joy.addEventListener('pointermove', joyMove);
    joy.addEventListener('pointerup', joyEnd);
    joy.addEventListener('pointercancel', joyEnd);
    joy.addEventListener('lostpointercapture', joyEnd);
  }

  function inputVector() {
    let x = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0) + stick.x;
    let z = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0) + stick.y;
    const len = Math.hypot(x, z);
    if (len > 1) { x /= len; z /= len; }
    return { x, z };
  }

  // ---------- Encounters ----------
  function encounter(kind, defender) {
    paused = true;
    vel.set(0, 0, 0);
    opts.onEncounter(kind, correct => {
      if (kind === 'duel') resolveDuel(defender, correct);
      else resolveShot(correct);
    });
  }

  function resolveDuel(d, correct) {
    paused = false;
    if (correct) {
      d.stun = 4;
      dash = 0.7;
      invuln = 1;
      opts.onFx && opts.onFx('突破！');
    } else {
      const away = pos.clone().sub(d.mesh.position).setY(0);
      if (away.lengthSq() < 0.01) away.set(0, 0, 1);
      away.normalize().multiplyScalar(4.5);
      pos.add(away);
      clampPos(pos);
      d.stun = 1.2;
      invuln = 1.8;
      opts.onFx && opts.onFx('被抄截！', true);
    }
  }

  function resolveShot(correct) {
    const from = ball.position.clone();
    const keeperFrom = keeper.position.x;
    const corner = keeperFrom > 0 ? -2.9 : 2.9;
    const target = correct ? new T.Vector3(corner, 1.3, -HALF_L - 1.2) : new T.Vector3(keeperFrom, 1.2, -HALF_L + 1.2);
    const diveTo = correct ? -corner * 0.6 : keeperFrom;
    opts.onFx && opts.onFx(correct ? '進球！！' : '被撲出！', !correct);
    cutscene = {
      time: 0, length: 2.1,
      update(dt, time) {
        const k = Math.min(time / 0.55, 1);
        ball.position.lerpVectors(from, target, k);
        ball.position.y += Math.sin(k * Math.PI) * 1.2;
        ball.rotation.x -= dt * 20;
        keeper.position.x += (diveTo - keeper.position.x) * Math.min(dt * 6, 1);
        keeper.rotation.z = correct ? Math.sign(diveTo || 1) * -Math.min(time * 3, 1.2) : 0;
      },
      done() { keeper.rotation.z = 0; kickoff(); paused = false; }
    };
  }

  function kickoff() {
    pos.copy(START); vel.set(0, 0, 0); facing.set(0, 0, -1);
    defenders.forEach(d => { d.mesh.position.copy(d.home); d.stun = 0; d.mesh.rotation.x = 0; });
    keeper.position.x = 0;
    ball.position.set(pos.x, 0.25, pos.z - 0.7);
    invuln = 1;
  }

  function clampPos(p) {
    p.x = Math.max(-HALF_W + 0.6, Math.min(HALF_W - 0.6, p.x));
    p.z = Math.max(-HALF_L + 0.6, Math.min(HALF_L - 0.6, p.z));
  }

  // ---------- Update ----------
  const tmp = new T.Vector3();
  function update(dt) {
    t += dt;
    drama += ((paused ? 1 : 0) - drama) * Math.min(dt * 5, 1);

    // Orbs bob & spin regardless of pause
    orbs.forEach(o => {
      o.position.y = 0.8 + Math.sin(t * 2.5 + o.userData.phase) * 0.18;
      o.rotation.y += dt;
    });
    ringMat.color.setHex(invuln > 0 && !paused && Math.floor(t * 10) % 2 ? 0xff3d5a : 0x00e0ff);
    aura.material.opacity = boost ? 0.45 + Math.sin(t * 8) * 0.2 : 0;
    aura.scale.setScalar(boost ? 1 + Math.sin(t * 5) * 0.08 : 1);

    if (cutscene) {
      cutscene.time += dt;
      cutscene.update(dt, cutscene.time);
      if (cutscene.time >= cutscene.length) { const c = cutscene; cutscene = null; c.done(); }
      return;
    }
    if (paused || frozen) return;

    invuln = Math.max(0, invuln - dt);
    dash = Math.max(0, dash - dt);

    // Player movement
    const inp = inputVector();
    const maxSpeed = (boost ? 9.5 : 7.5) * (dash > 0 ? 1.6 : 1);
    tmp.set(inp.x * maxSpeed, 0, inp.z * maxSpeed);
    vel.lerp(tmp, 1 - Math.exp(-10 * dt));
    pos.addScaledVector(vel, dt);
    clampPos(pos);
    const speed = Math.hypot(vel.x, vel.z);
    if (speed > 0.3) facing.set(vel.x, 0, vel.z).normalize();
    player.position.copy(pos);
    player.rotation.y = Math.atan2(facing.x, facing.z);
    animateLegs(player, speed, t);
    ring.position.set(pos.x, 0.03, pos.z);
    aura.position.set(pos.x, 0.04, pos.z);

    // Ball sticks to the striker's feet
    const prev = ball.position.clone();
    tmp.copy(pos).addScaledVector(facing, 0.75).setY(0.25);
    ball.position.lerp(tmp, 1 - Math.exp(-18 * dt));
    const moved = ball.position.clone().sub(prev).setY(0);
    const dist = moved.length();
    if (dist > 0.0001) ball.rotateOnWorldAxis(new T.Vector3(moved.z, 0, -moved.x).normalize(), dist / 0.25);

    // Keeper patrols the line, tracking the ball
    const kx = Math.max(-3, Math.min(3, pos.x * 0.35 + Math.sin(t * 1.3) * 1.2));
    keeper.position.x += (kx - keeper.position.x) * Math.min(dt * 3, 1);
    animateLegs(keeper, 3, t);

    // Defenders
    defenders.forEach((d, i) => {
      const m = d.mesh;
      if (d.stun > 0) {
        d.stun -= dt;
        m.rotation.x = d.stun > 1.2 ? Math.max(m.rotation.x - dt * 6, -Math.PI / 2.2) : m.rotation.x * 0.9;
        return;
      }
      m.rotation.x = 0;
      const toPlayer = tmp.copy(pos).sub(m.position).setY(0);
      const dp = toPlayer.length();
      let target, sp;
      if (dp < aggro) {
        // Step into the striker's path toward goal rather than just chasing
        target = pos.clone().addScaledVector(vel, 0.25);
        if (m.position.z < pos.z) target.z -= Math.min(2.5, dp * 0.4);
        sp = d.speed;
      } else {
        target = d.home;
        sp = d.speed * 0.55;
      }
      const dir = target.clone().sub(m.position).setY(0);
      const dl = dir.length();
      if (dl > 0.05) {
        dir.multiplyScalar(1 / dl);
        // Keep defenders from stacking
        defenders.forEach((o, j) => {
          if (j === i) return;
          const away = m.position.clone().sub(o.mesh.position).setY(0);
          const al = away.length();
          if (al < 1.6 && al > 0.001) dir.addScaledVector(away, (1.6 - al) / al);
        });
        dir.normalize();
        m.position.addScaledVector(dir, Math.min(sp * dt, dl));
        m.rotation.y = Math.atan2(dir.x, dir.z);
        animateLegs(m, sp, t + i);
      }
      clampPos(m.position);
      if (!paused && invuln <= 0 && dp < 1.25) encounter('duel', d);
    });
    if (paused) return;

    // Orbs
    orbs.forEach(o => {
      if (o.position.distanceTo(tmp.set(pos.x, 0.8, pos.z)) < 1.1) {
        placeOrb(o);
        opts.onOrb && opts.onOrb();
      }
    });

    // Shooting zone
    if (invuln <= 0 && pos.z < BOX_Z && Math.abs(pos.x) < BOX_X) encounter('shot');
  }

  // ---------- Camera ----------
  const camPos = new T.Vector3(0, 30, 40);
  const look = new T.Vector3();
  function updateCamera(dt) {
    const portrait = camera.aspect < 0.9;
    const z = (1 - drama * 0.35) * (portrait ? 1.35 : 1.1);
    const ahead = portrait ? 7 : 4;
    const target = tmp.set(pos.x * 0.6, 20 * z, pos.z - ahead + 15 * z);
    camPos.lerp(target, 1 - Math.exp(-4 * dt));
    camera.position.copy(camPos);
    look.lerp(new T.Vector3(pos.x * 0.6, 0, pos.z - ahead), 1 - Math.exp(-6 * dt));
    camera.lookAt(look);
  }

  // ---------- Loop / resize ----------
  function resize() {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  kickoff();
  look.set(pos.x, 0, pos.z - 4);
  let raf, last = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    updateCamera(dt);
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  return {
    setBoost(on) { boost = on; },
    freeze(on) { frozen = on; },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      if (joy) {
        joy.removeEventListener('pointerdown', joyStart);
        joy.removeEventListener('pointermove', joyMove);
        joy.removeEventListener('pointerup', joyEnd);
        joy.removeEventListener('pointercancel', joyEnd);
        joy.removeEventListener('lostpointercapture', joyEnd);
        knob.style.transform = '';
      }
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  };
};
