/* 融合原型 · 统一顶栏（注册→提需求→完善→组网→方案） */
(function () {
  const STEPS = [
    { id: 1, label: '注册', file: 'step1-领证.html' },
    { id: 2, label: '提需求', file: 'step2-补全.html' },
    { id: 3, label: '完善', file: 'step1-领证.html' },
    { id: 4, label: '组网', file: 'step3-匹配组网.html' },
    { id: 5, label: '方案', file: 'step4-组网方案.html' },
  ];

  function readProfile() {
    try { return JSON.parse(sessionStorage.getItem('si_profile') || 'null'); } catch { return null; }
  }
  function writeProfile(p) {
    sessionStorage.setItem('si_profile', JSON.stringify(p));
  }
  function readRun() {
    try { return JSON.parse(sessionStorage.getItem('si_run') || '{}'); } catch { return {}; }
  }
  function writeRun(partial) {
    const next = Object.assign({}, readRun(), partial || {}, { updatedAt: Date.now() });
    sessionStorage.setItem('si_run', JSON.stringify(next));
    return next;
  }
  function chipSub(p) {
    if (!p) return '未注册';
    const bits = [p.org, p.role].filter(Boolean);
    return bits.length ? bits.join(' · ') : (p.accountId || '已注册');
  }

  function ensureChrome(step, theme) {
    let el = document.getElementById('ux-chrome');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ux-chrome';
      el.innerHTML = `
        <div class="ux-brand"><img src="mark.png" alt="">测评组网系统<small>SKILL INDEX</small></div>
        <div class="ux-rail" id="ux-rail"></div>
        <div class="ux-chip" id="ux-chip"><span class="ux-si">·</span><div><b id="ux-chip-name">—</b><span id="ux-chip-no">—</span></div></div>`;
      const host = document.getElementById('app') || document.body;
      if (document.body.classList.contains('scheme-live') || (step === 5 && document.getElementById('schemeAct'))) {
        document.body.appendChild(el);
        el.classList.add('sticky');
      } else {
        host.appendChild(el);
        if (!document.getElementById('app')) el.classList.add('sticky');
      }
      const rail = el.querySelector('#ux-rail');
      rail.innerHTML = STEPS.map((s, i) =>
        `<span class="s" data-step="${s.id}"><i>0${s.id}</i>${s.label}</span>${i < STEPS.length - 1 ? '<span class="sep">→</span>' : ''}`
      ).join('');
    } else if (step === 5 && el.parentElement !== document.body && document.getElementById('schemeAct')) {
      document.body.appendChild(el);
    }
    el.className = '';
    el.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    if (step === 1 && !(readProfile() || {}).registered) el.classList.add('pre');
    if (step === 5) el.classList.add('with-acts', 'sticky');

    el.querySelectorAll('.ux-rail .s').forEach(n => {
      const id = +n.dataset.step;
      n.classList.toggle('on', id === step);
      n.classList.toggle('done', id < step);
    });

    const p = readProfile();
    const chip = el.querySelector('#ux-chip');
    if (p?.registered || p?.issued) {
      chip.classList.add('on');
      el.querySelector('#ux-chip-name').textContent = p.name || '陈思远';
      el.querySelector('#ux-chip-no').textContent = chipSub(p);
      el.classList.remove('pre');
    } else {
      chip.classList.remove('on');
    }
    return el;
  }


  function clearSession() {
    try { sessionStorage.removeItem('si_profile'); } catch (e) {}
    try { sessionStorage.removeItem('si_run'); } catch (e) {}
  }
  function resetAndRestart() {
    clearSession();
    // hard navigation to clean entry — no ?demo / hash
    const clean = new URL('step1-领证.html', location.href);
    clean.search = '';
    clean.hash = '';
    const same =
      location.pathname.endsWith('step1-领证.html') &&
      !location.search &&
      !location.hash;
    if (same) location.reload();
    else location.replace(clean.pathname + clean.search + clean.hash);
  }
  function wireFullChainEntry() {
    const qs = new URLSearchParams(location.search);
    const demo = qs.get('demo');
    const links = document.querySelectorAll('a[data-restart], a[href="?"], .demo a');
    links.forEach(a => {
      const lab = (a.textContent || '').trim();
      if (lab.includes('重新开始') || a.hasAttribute('data-restart')) {
        a.setAttribute('href', 'step1-领证.html');
        a.setAttribute('data-restart', '1');
        a.onclick = function (e) {
          e.preventDefault();
          resetAndRestart();
        };
      }
    });
    if (demo) {
      document.querySelectorAll('.demo').forEach(bar => {
        if (bar.dataset.demoHint === '1') return;
        bar.dataset.demoHint = '1';
        bar.classList.add('demo-shortcut');
        const tip = document.createElement('span');
        tip.className = 'demo-tip';
        tip.textContent = '演示快捷，刷新会停在这幕 · 点「重新开始」走全链路';
        const restart = bar.querySelector('a[data-restart]');
        if (restart) bar.insertBefore(tip, restart);
        else bar.appendChild(tip);
        if (!bar.querySelector('a[data-restart]')) {
          const a = document.createElement('a');
          a.href = 'step1-领证.html';
          a.setAttribute('data-restart', '1');
          a.textContent = '↻ 重新开始';
          a.onclick = function (e) { e.preventDefault(); resetAndRestart(); };
          bar.appendChild(a);
        }
      });
      // 全局条：完善/组网等全屏幕会盖住页脚 .demo
      if (!document.getElementById('fullchainBar')) {
        const bar = document.createElement('div');
        bar.id = 'fullchainBar';
        bar.innerHTML = '<span class="demo-tip">演示快捷 <code>?' + demo + '</code>，刷新会停在这幕</span>' +
          '<a href="step1-领证.html" data-restart="1">↻ 重新开始 · 全链路</a>' +
          '<a href="index.html">融合入口</a>';
        document.body.appendChild(bar);
        const a = bar.querySelector('a[data-restart]');
        a.onclick = function (e) { e.preventDefault(); resetAndRestart(); };
      }
    }
  }

  window.UX = {
    clearSession,
    resetAndRestart,
    wireFullChainEntry,
    init(step, theme) {
      document.documentElement.classList.add('ux-unified');
      const dark = step === 1 || step === 4;
      ensureChrome(step, theme || (dark ? 'dark' : 'light'));
      // footer 「重新开始」清状态回开场；demo 参数时加醒目提示
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireFullChainEntry);
      } else {
        wireFullChainEntry();
      }
      // late overlays may inject .demo after init
      setTimeout(wireFullChainEntry, 0);
      setTimeout(wireFullChainEntry, 600);
    },
    setRegistered(profile) {
      const accountId = profile.accountId || ('U · ' + String(Math.floor(Math.random() * 9000 + 1000)));
      writeProfile({
        registered: true, issued: true, // issued kept for older demos
        name: profile.name, org: profile.org, role: profile.role,
        accountId, sid: accountId,
      });
      ensureChrome(1, 'dark');
    },
    // back-compat
    setIssued(profile) { this.setRegistered(profile); },
    profile: readProfile,
    writeProfile,
    readRun,
    writeRun,
    goDemand() {
      const p = readProfile() || { name: '陈思远' };
      if (!p.registered && !p.issued) {
        writeProfile({ ...p, registered: true, issued: true, name: p.name || '陈思远', org: p.org || '', role: p.role || '', accountId: p.accountId || 'U · 0712' });
      }
      if (typeof window.__enterDemandAct === 'function') { window.__enterDemandAct(); return; }
      location.href = 'step2-补全.html';
    },
    goEnrich() {
      writeRun({ fromDemand: true, reqId: (readRun().reqId) || 'REQ-CITY-OPS-0001', caseId: (readRun().caseId) || 'city-ops', scene: (readRun().scene) || '城运视频识别' });
      if (typeof window.__enterEnrichAct === 'function') { window.__enterEnrichAct(); return; }
      // fallback: skip to match
      this.goMatch();
    },
    goMatch() {
      writeRun({ fromEnrich: true, reqId: (readRun().reqId) || 'REQ-CITY-OPS-0001', caseId: (readRun().caseId) || 'city-ops', scene: (readRun().scene) || '城运视频识别' });
      if (typeof window.__enterMatchAct === 'function') { window.__enterMatchAct(); return; }
      location.href = 'step3-匹配组网.html';
    },
    goScheme() {
      const run = readRun();
      if (!run.preference && !run.preferenceLabel) {
        const seed = run.preferenceSeed || 'fast';
        writeRun({ preference: seed, preferenceLabel: ({ fast: '上线快', cheap: '成本低', local: '政务云' })[seed] || '政务云' });
      }
      if (typeof window.__enterSchemeAct === 'function') { window.__enterSchemeAct(); return; }
      location.href = 'step4-组网方案.html';
    },
    goWorkbench() {
      if (window.ChecklistProto && ChecklistProto.showWorkbench) ChecklistProto.showWorkbench();
      else location.href = 'step1-领证.html?demo=workbench';
    },
    goDemandAgain() {
      if (typeof window.__enterDemandAct === 'function' && document.getElementById('demandAct')) {
        document.body.classList.remove('scheme-live', 'match-live', 'enrich-live');
        ['schemeAct', 'matchAct', 'enrichAct'].forEach(id => {
          const n = document.getElementById(id);
          if (n) { n.classList.remove('on', 'enter', 'leaving', 'leaving-to-scheme'); n.setAttribute('aria-hidden', 'true'); }
        });
        const app = document.getElementById('app');
        if (app) { app.style.opacity = ''; app.classList.remove('match-mode', 'enrich-mode'); app.classList.add('demand-mode'); }
        window.__enterDemandAct({ force: true });
        return;
      }
      location.href = 'step2-补全.html';
    },
  };
})();
