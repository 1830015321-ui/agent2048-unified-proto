/* 完善信息 · 组网前同页幕（城运默认） */
(function () {
  const root = document.getElementById('enrichAct');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const CITY_DEFAULT = {
    scale: '城市级多点',
    systems: ['视频平台', '工单系统', '热线'],
    deploy: '政务云',
    duty: '城运中心值班',
    cameras: '约 1.2 万路试点',
    note: '部署在政务云授权环境；对接工单接口与事件分类；人脸车牌按需脱敏。',
  };

  const state = {
    scale: '城市级多点',
    systems: ['视频平台', '工单系统', '热线'],
    deploy: '政务云',
    duty: '城运中心值班',
    cameras: '约 1.2 万路试点',
    note: '',
  };

  /* —— 旁白（SpeechSynthesis，不依赖外网音频） —— */
  const NARRATION =
    '组网前，再告诉平台一点关键上下文。先选现场规模和摄像头数量，再勾选已有系统和部署倾向。这些会用来收窄候选智能体。选完后点右下角，开始组网。';

  let utter = null;
  let voiceReady = false;
  let autoTried = false;
  let everPlayed = false;

  function listenBtn() { return $('#eListen'); }

  function setListenUI(mode) {
    const btn = listenBtn();
    if (!btn) return;
    const lab = btn.querySelector('.listen-lab');
    btn.classList.remove('playing', 'paused', 'done', 'need-tap');
    if (mode === 'playing') {
      btn.classList.add('playing');
      if (lab) lab.textContent = '暂停';
      btn.setAttribute('aria-label', '暂停旁白');
    } else if (mode === 'paused') {
      btn.classList.add('paused');
      if (lab) lab.textContent = '继续';
      btn.setAttribute('aria-label', '继续旁白');
    } else if (mode === 'done') {
      btn.classList.add('done');
      if (lab) lab.textContent = '重听';
      btn.setAttribute('aria-label', '重听说明');
    } else {
      // idle
      if (lab) lab.textContent = '收听说明';
      btn.setAttribute('aria-label', '收听说明');
      if (!everPlayed) btn.classList.add('need-tap');
    }
  }

  function pickZhVoice() {
    if (!window.speechSynthesis) return null;
    const voices = speechSynthesis.getVoices() || [];
    const prefer = [
      v => /zh-CN/i.test(v.lang) && /female|婷|Xiaoxiao|Xiaoyi| Huihui|Yaoyao|Google.*中文/i.test(v.name),
      v => /zh-CN/i.test(v.lang),
      v => /^zh\b/i.test(v.lang) || /chinese|中文|普通话|国语/i.test(v.name + v.lang),
    ];
    for (const fn of prefer) {
      const hit = voices.find(fn);
      if (hit) return hit;
    }
    return null;
  }

  function warmVoices() {
    if (!window.speechSynthesis) return;
    const list = speechSynthesis.getVoices();
    if (list && list.length) { voiceReady = true; return; }
    speechSynthesis.addEventListener('voiceschanged', () => { voiceReady = true; }, { once: true });
  }
  warmVoices();

  function stopNarration() {
    if (!window.speechSynthesis) return;
    try { speechSynthesis.cancel(); } catch (e) {}
    try { speechSynthesis.resume(); } catch (e) {}
    utter = null;
    if (everPlayed) setListenUI('done');
    else setListenUI('idle');
  }

  function speakNarration(opts) {
    opts = opts || {};
    if (!window.speechSynthesis) {
      setListenUI('idle');
      return false;
    }
    stopNarrationHard();
    const u = new SpeechSynthesisUtterance(NARRATION);
    u.lang = 'zh-CN';
    u.rate = 1.02;
    u.pitch = 1;
    u.volume = 1;
    const v = pickZhVoice();
    if (v) u.voice = v;
    u.onstart = () => { everPlayed = true; setListenUI('playing'); };
    u.onend = () => { utter = null; setListenUI('done'); };
    u.onerror = () => {
      utter = null;
      if (!everPlayed) setListenUI('idle');
      else setListenUI('done');
    };
    utter = u;
    try {
      speechSynthesis.speak(u);
      // Chrome 偶发卡住：轻推一下
      if (speechSynthesis.paused) speechSynthesis.resume();
      // 若浏览器拦截自动播（无用户手势），短时检测是否真正开始
      if (opts.fromAuto) {
        setTimeout(() => {
          if (!everPlayed && (!speechSynthesis.speaking || speechSynthesis.pending && !speechSynthesis.speaking)) {
            // 仍可能在排队；再等一会
            setTimeout(() => {
              if (!everPlayed) {
                try { speechSynthesis.cancel(); } catch (e) {}
                utter = null;
                setListenUI('idle'); // need-tap 提示
              }
            }, 700);
          }
        }, 450);
      }
      return true;
    } catch (e) {
      setListenUI('idle');
      return false;
    }
  }

  function stopNarrationHard() {
    if (!window.speechSynthesis) return;
    try { speechSynthesis.cancel(); } catch (e) {}
    utter = null;
  }

  function toggleNarration() {
    if (!window.speechSynthesis) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      try { speechSynthesis.pause(); } catch (e) {}
      // 部分浏览器 pause 无效 → 当作停止并标暂停态不成立时直接重播按钮
      setTimeout(() => {
        if (speechSynthesis.paused) setListenUI('paused');
        else {
          // pause 不被支持：取消，下次点重听
          stopNarrationHard();
          setListenUI('done');
        }
      }, 40);
      return;
    }
    if (speechSynthesis.paused) {
      try { speechSynthesis.resume(); } catch (e) {}
      setListenUI('playing');
      return;
    }
    speakNarration({ fromAuto: false });
  }

  function applyDefaultsForCase() {
    const run = (window.UX && UX.readRun && UX.readRun()) || {};
    const isCity = !run.caseId || run.caseId === 'city-ops' || (run.scene || '').indexOf('城运') >= 0;
    if (!isCity) return;
    Object.assign(state, {
      scale: CITY_DEFAULT.scale,
      systems: [...CITY_DEFAULT.systems],
      deploy: CITY_DEFAULT.deploy,
      duty: CITY_DEFAULT.duty,
      cameras: CITY_DEFAULT.cameras,
      note: state.note || CITY_DEFAULT.note,
    });
    // sync chips / select
    $$('.chip').forEach(b => {
      const g = b.dataset.g;
      if (g === 'systems') b.classList.toggle('on', state.systems.indexOf(b.dataset.v) >= 0);
      else if (g) b.classList.toggle('on', state[g] === b.dataset.v);
    });
    const cam = $('#eCam');
    if (cam) {
      const opts = [...cam.options].map(o => o.value || o.textContent);
      if (opts.indexOf(state.cameras) >= 0) cam.value = state.cameras;
      else {
        // ensure option exists
        let found = [...cam.options].find(o => o.textContent === state.cameras);
        if (!found) {
          const o = document.createElement('option');
          o.textContent = state.cameras;
          o.selected = true;
          cam.appendChild(o);
        }
        cam.value = state.cameras;
      }
    }
    if ($('#eNote') && !$('#eNote').value) $('#eNote').value = state.note;
  }

  function toggleChip(group, el, multi) {
    if (multi) {
      el.classList.toggle('on');
      state[group] = $$(`[data-g="${group}"].on`).map(b => b.dataset.v);
    } else {
      $$(`[data-g="${group}"]`).forEach(b => b.classList.toggle('on', b === el));
      state[group] = el.dataset.v;
    }
    renderSum();
  }

  function renderSum() {
    const p = (window.UX && UX.profile && UX.profile()) || {};
    const name = p.name || '你';
    const sys = (state.systems || []).join('、') || '未选';
    $('#eSum').innerHTML = `<b>${name}</b> 的匹配上下文：${state.scale} · ${state.cameras} 摄像头 · 已有 ${sys} · 部署倾向「${state.deploy}」· 值守「${state.duty}」。${state.note ? '补充：' + state.note : '平台将据此收窄候选智能体。'}`;
    $('#eGo').disabled = !(state.scale && state.deploy && (state.systems || []).length);
  }

  $$('.chip').forEach(b => {
    b.onclick = () => toggleChip(b.dataset.g, b, b.dataset.multi === '1');
  });
  $('#eNote').oninput = () => { state.note = $('#eNote').value.trim(); renderSum(); };
  $('#eCam').onchange = () => { state.cameras = $('#eCam').value; renderSum(); };

  const btnListen = listenBtn();
  if (btnListen) {
    btnListen.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNarration();
    };
  }

  $('#eBack').onclick = () => {
    stopNarrationHard();
    setListenUI(everPlayed ? 'done' : 'idle');
    root.classList.add('leaving');
    const demand = document.getElementById('demandAct');
    const app = document.getElementById('app');
    if (app) { app.classList.remove('enrich-mode'); app.classList.add('demand-mode'); }
    if (demand) {
      demand.classList.remove('leaving-to-enrich');
      demand.classList.add('on');
      demand.setAttribute('aria-hidden', 'false');
      if (window.__demandRefreshMatch) window.__demandRefreshMatch();
    }
    window.UX && UX.init(2, 'light');
    setTimeout(() => {
      root.classList.remove('on', 'enter', 'leaving');
      root.setAttribute('aria-hidden', 'true');
    }, 500);
  };

  $('#eGo').onclick = () => {
    stopNarrationHard();
    setListenUI(everPlayed ? 'done' : 'idle');
    if (window.UX && UX.writeRun) {
      const seed = state.deploy.indexOf('政务云') >= 0 || state.deploy.indexOf('本地') >= 0
        ? 'local'
        : state.deploy.indexOf('成本') >= 0 ? 'cheap' : 'fast';
      UX.writeRun({
        enrich: { ...state, systems: [...(state.systems || [])] },
        deployHint: state.deploy,
        preferenceSeed: seed,
        caseId: ((window.UX.readRun && UX.readRun()) || {}).caseId || 'city-ops',
      });
    }
    window.UX ? UX.goMatch() : (location.href = 'step3-匹配组网.html');
  };

  // 其它路径把 enrich 标成 leaving / 关掉时，停掉旁白
  let enrichWasOn = false;
  new MutationObserver(() => {
    const on = root.classList.contains('on');
    const leaving = root.classList.contains('leaving');
    if (leaving || (enrichWasOn && !on)) {
      stopNarrationHard();
      if (everPlayed) setListenUI('done');
      else setListenUI('idle');
    }
    enrichWasOn = on && !leaving;
  }).observe(root, { attributes: true, attributeFilter: ['class'] });

  window.__enterEnrichAct = async function (opts) {
    opts = opts || {};
    stopNarrationHard();
    everPlayed = false;
    autoTried = false;
    setListenUI('idle');
    const app = document.getElementById('app');
    const demand = document.getElementById('demandAct');
    if (demand) demand.classList.add('leaving-to-enrich');
    window.UX && UX.init(3, 'light');
    if (app) {
      app.classList.add('enrich-mode');
      app.classList.remove('demand-mode', 'match-mode');
    }
    document.body.classList.add('enrich-live');
    applyDefaultsForCase();
    if (!opts.instant) await wait(220);
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('on', 'enter');
    root.classList.remove('leaving');
    renderSum();
    await wait(opts.instant ? 40 : 950);
    root.classList.remove('enter');
    if (demand) {
      demand.classList.remove('on', 'enter');
      demand.setAttribute('aria-hidden', 'true');
    }
    // 进幕自动播；若被拦截，按钮保留「点这里听」
    if (!autoTried) {
      autoTried = true;
      // 等音色就绪一小会儿
      if (!voiceReady) {
        warmVoices();
        await wait(180);
      }
      speakNarration({ fromAuto: true });
    }
  };

  window.__enrichStopVoice = stopNarrationHard;
  window.__enrichReady = true;
  applyDefaultsForCase();
  renderSum();
  setListenUI('idle');
})();
