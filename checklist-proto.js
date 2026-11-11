/* 清单补全层 · Prototype 模拟（非真实后端） */
(function () {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const CAROUSEL = (window.EDU_CASE && window.EDU_CASE.carousel) || [
    { title: '让智能，因连接而生', sub: '打破单一能力边界，让多元智能体协同创造更大价值。' },
    { title: '从理解需求，到连接能力', sub: '以真实业务需求为起点，构建更贴合目标的智能协作网络。' },
    { title: '智能不止于个体，更在于协同', sub: '让不同能力相互连接、彼此补充，共同完成复杂任务。' },
    { title: '让合适的能力，出现在合适的位置', sub: '围绕业务流程寻找适配的智能体能力，构建更合理的协作组合。' },
    { title: '不追求更多，而追求更合适', sub: '在满足业务需求的前提下，减少不必要的能力重复，让智能协作更加精简高效。' },
  ];

  function seedHistory() {
    try {
      const raw = localStorage.getItem('si_history');
      if (raw) return JSON.parse(raw);
    } catch {}
    const seeds = [
      {
        id: 'hist-city',
        caseId: 'city-ops',
        title: '城市运行视频智能识别与工单联动试点',
        updatedAt: Date.now() - 86400000 * 2,
        status: 'partial',
        statusLabel: '部分匹配',
        summary: '城运双视角 · A 7/7·26 Agent / B 4/5·13 Agent · 整治待匹配',
        reqId: 'REQ-CITY-OPS-0001',
      },
      {
        id: 'hist-edu',
        caseId: 'education',
        title: '中学智能教学与个性化学习协作方案',
        updatedAt: Date.now() - 86400000,
        status: 'success',
        statusLabel: '组网成功',
        summary: '2 任务 · 5 使用对象视角 · 教育样例',
        reqId: 'REQ-EDU-0001',
        matchOutcome: 'success',
      },
      {
        id: 'hist-edu-partial',
        caseId: 'education',
        title: '中学智能教学（部分匹配演示）',
        updatedAt: Date.now() - 3600000 * 8,
        status: 'partial',
        statusLabel: '部分匹配',
        summary: '教育样例 · 主观题批改 / 家庭辅导未匹配',
        reqId: 'REQ-EDU-PARTIAL',
        matchOutcome: 'partial',
      },
      {
        id: 'hist-edu-fail',
        caseId: 'education',
        title: '中学智能教学（组网失败演示）',
        updatedAt: Date.now() - 3600000 * 3,
        status: 'fail',
        statusLabel: '组网失败',
        summary: '教育样例 · 无可用能力组合',
        reqId: 'REQ-EDU-FAIL',
        matchOutcome: 'fail',
      },
    ];
    localStorage.setItem('si_history', JSON.stringify(seeds));
    return seeds;
  }

  function saveHistoryItem(item) {
    const list = seedHistory().filter(x => x.id !== item.id);
    list.unshift(item);
    localStorage.setItem('si_history', JSON.stringify(list.slice(0, 20)));
  }

  function ensureLayers() {
    if (!document.getElementById('loginAct')) {
      const login = document.createElement('div');
      login.id = 'loginAct';
      login.innerHTML = `
        <div class="lp" role="dialog" aria-modal="true" aria-labelledby="lgTitle">
          <div class="lg-mark"><img src="mark.png" alt=""><b>测评组网系统<small>SKILL INDEX</small></b></div>
          <div class="kick" id="lgKick">SIGN IN</div>
          <h2 id="lgTitle">登录你的账号</h2>
          <p class="sub" id="lgSub">继续未完成的需求与组网</p>
          <div class="f" id="lgEmailWrap"><label for="lgEmail">邮箱</label><input id="lgEmail" type="email" placeholder="name@organization.com" autocomplete="username"></div>
          <div class="f" id="lgNameWrap" hidden><label for="lgName">姓名</label><input id="lgName" placeholder="例：邓义" value="邓义" autocomplete="name"></div>
          <div class="f" id="lgOrgWrap" hidden><label for="lgOrg">所在机构</label><input id="lgOrg" placeholder="例：某市教育局 / 某中学"></div>
          <div class="f" id="lgRoleWrap" hidden><label for="lgRole">岗位</label><input id="lgRole" placeholder="例：信息化负责人"></div>
          <button class="sign" id="lgSubmit">登录</button>
          <p class="switch" id="lgSwitch">还没有账号？<button type="button" id="lgGoReg">注册</button></p>
          <button type="button" class="back" id="lgBack">返回开场</button>
        </div>`;
      document.body.appendChild(login);
    }
    if (!document.getElementById('workbenchAct')) {
      const wb = document.createElement('div');
      wb.id = 'workbenchAct';
      wb.innerHTML = `
        <div class="wb">
          <div class="wb-hd">
            <div>
              <h2>工作台</h2>
              <p class="sub">历史需求与组网结果（种子：城运 + 教育成功/部分/失败）</p>
            </div>
            <div class="wb-acts">
              <button type="button" id="wbNew">＋ 新建需求</button>
              <button type="button" class="primary" id="wbEdu">填入教育案例</button>
              <button type="button" id="wbCity">填入城运案例</button>
            </div>
          </div>
          <div class="wb-list" id="wbList"></div>
        </div>`;
      document.body.appendChild(wb);
    }
  }

  let loginArriving = false;

  function showLogin(mode) {
    ensureLayers();
    const el = document.getElementById('loginAct');
    const wb = document.getElementById('workbenchAct');
    if (wb) wb.classList.remove('on');
    setLoginMode(mode || 'login');
    if (el.classList.contains('on') || loginArriving) return;
    loginArriving = true;
    const issue = document.getElementById('issue');
    if (issue) issue.classList.remove('on');
    const reveal = () => {
      const welcome = document.getElementById('welcome');
      if (welcome) welcome.classList.add('login-up');
      requestAnimationFrame(() => {
        el.classList.add('on');
        loginArriving = false;
        const focusId = el.dataset.mode === 'register' ? 'lgName' : 'lgEmail';
        const focusEl = document.getElementById(focusId);
        if (focusEl) setTimeout(() => focusEl.focus(), 40);
      });
    };
    const go = window.__arriveWelcome
      ? window.__arriveWelcome()
      : Promise.resolve();
    Promise.resolve(go).then(() => new Promise(r => setTimeout(r, 280))).then(reveal).catch(() => {
      reveal();
    });
  }

  function hideLogin() {
    const el = document.getElementById('loginAct');
    if (el) el.classList.remove('on');
    const welcome = document.getElementById('welcome');
    if (welcome) welcome.classList.remove('login-up');
    if (window.__unlockOpeningScroll) window.__unlockOpeningScroll();
  }

  function setLoginMode(mode) {
    const login = document.getElementById('loginAct');
    const reg = mode === 'register';
    const kick = document.getElementById('lgKick');
    if (kick) kick.textContent = reg ? 'CREATE ACCOUNT' : 'SIGN IN';
    document.getElementById('lgTitle').textContent = reg ? '创建你的账号' : '登录你的账号';
    document.getElementById('lgSub').textContent = reg
      ? '填写基本信息，便于更准确地匹配智能体'
      : '继续未完成的需求与组网';
    document.getElementById('lgEmailWrap').hidden = !!reg;
    document.getElementById('lgNameWrap').hidden = !reg;
    document.getElementById('lgOrgWrap').hidden = !reg;
    document.getElementById('lgRoleWrap').hidden = !reg;
    document.getElementById('lgSubmit').textContent = reg ? '注册并开始' : '登录';
    const sw = document.getElementById('lgSwitch');
    if (sw) sw.innerHTML = reg
      ? '已有账号？<button type="button" id="lgGoLogin">登录</button>'
      : '还没有账号？<button type="button" id="lgGoReg">注册</button>';
    const goReg = document.getElementById('lgGoReg');
    const goLogin = document.getElementById('lgGoLogin');
    if (goReg) goReg.onclick = () => setLoginMode('register');
    if (goLogin) goLogin.onclick = () => setLoginMode('login');
    login.dataset.mode = mode;
    const focusId = reg ? 'lgName' : 'lgEmail';
    const focusEl = document.getElementById(focusId);
    if (focusEl) setTimeout(() => focusEl.focus(), 40);
  }

  function renderWorkbench() {
    ensureLayers();
    const list = seedHistory();
    const host = document.getElementById('wbList');
    host.innerHTML = list.map(it => {
      const d = new Date(it.updatedAt);
      const when = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}（上海时区）`;
      return `<article class="wb-card" data-id="${esc(it.id)}">
        <b>${esc(it.title)}</b>
        <span>${esc(it.summary || '')}</span>
        <span>${esc(it.reqId || '')} · ${when}</span>
        <em class="${esc(it.status || 'draft')}">${esc(it.statusLabel || it.status || '草稿')}</em>
      </article>`;
    }).join('');
    host.querySelectorAll('.wb-card').forEach(card => {
      card.onclick = () => openHistory(card.dataset.id);
    });
  }

  function showWorkbench() {
    ensureLayers();
    hideLogin();
    renderWorkbench();
    document.getElementById('workbenchAct').classList.add('on');
    // leave narrative layers
    ['boot','invite','welcome','after','issue','share'].forEach(id => {
      const n = document.getElementById(id); if (n) n.classList.remove('on');
    });
    window.UX && UX.init(2, 'dark');
    const chip = document.querySelector('#ux-chrome .ux-wb');
    if (chip) chip.classList.add('on');
  }

  function hideWorkbench() {
    const el = document.getElementById('workbenchAct');
    if (el) el.classList.remove('on');
  }

  async function openHistory(id) {
    const item = seedHistory().find(x => x.id === id);
    if (!item) return;
    hideWorkbench();
    if (window.UX && UX.writeRun) {
      UX.writeRun({
        caseId: item.caseId,
        reqId: item.reqId,
        scene: item.caseId === 'education' ? '中学智能教学' : '城运视频识别',
        title: item.title,
        matchOutcome: item.matchOutcome || (item.status === 'success' ? 'success' : item.status === 'fail' ? 'fail' : 'partial'),
        fromHistory: true,
        historyId: item.id,
      });
    }
    if (item.caseId === 'education') {
      await bootEducationDemand({ autoConfirm: true, outcome: item.matchOutcome || 'success', skipToMatch: true });
    } else {
      // city ops history → demand then match result
      if (window.__enterDemandAct) await window.__enterDemandAct({ instant: true, force: true });
      if (window.__demandRunCase) window.__demandRunCase({ autoSend: true });
      await wait(1200);
      // confirm + jump match result
      const confirm = document.getElementById('dmConfirmAll') || document.getElementById('dmConfirm');
      if (confirm && !confirm.disabled) confirm.click();
      await wait(200);
      if (window.UX && UX.writeRun) UX.writeRun({ matchOutcome: 'partial', caseId: 'city-ops' });
      if (window.UX && UX.goMatch) UX.goMatch();
      else if (window.__enterMatchAct) window.__enterMatchAct({ instant: true, jumpResult: true });
    }
  }

  /* ========== Demand: multi-task + DAG ========== */
  const demandState = {
    caseId: null,
    demand: null,
    audienceByTask: {},
    confirmed: false,
    regenCount: 0,
  };

  function textOf(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v.text != null) return v.text;
    return String(v);
  }

  function layoutDag(nodes, edges) {
    // simple layered layout by longest-path from sources; feedback ignored for rank
    const ids = nodes.map(n => n.id);
    const forward = edges.filter(e => e.type !== 'feedback');
    const indeg = Object.fromEntries(ids.map(id => [id, 0]));
    const outs = Object.fromEntries(ids.map(id => [id, []]));
    forward.forEach(e => { if (indeg[e.target] != null) indeg[e.target]++; if (outs[e.source]) outs[e.source].push(e.target); });
    const rank = Object.fromEntries(ids.map(id => [id, 0]));
    const q = ids.filter(id => indeg[id] === 0);
    const seen = new Set(q);
    while (q.length) {
      const u = q.shift();
      (outs[u] || []).forEach(v => {
        rank[v] = Math.max(rank[v], rank[u] + 1);
        indeg[v]--;
        if (indeg[v] === 0 && !seen.has(v)) { seen.add(v); q.push(v); }
      });
    }
    const cols = {};
    ids.forEach(id => { (cols[rank[id]] ||= []).push(id); });
    const pos = {};
    const W = 640, H = 200, padX = 40, padY = 28;
    const maxRank = Math.max(0, ...Object.keys(cols).map(Number));
    Object.keys(cols).forEach(r => {
      const list = cols[r];
      list.forEach((id, i) => {
        const x = padX + (maxRank === 0 ? W / 2 : (+r / maxRank) * (W - padX * 2));
        const y = padY + (list.length === 1 ? H / 2 : (i / (list.length - 1)) * (H - padY * 2));
        pos[id] = { x, y };
      });
    });
    return pos;
  }

  function drawDag(canvas, plan, onNode) {
    const nodes = (plan && plan.dag && plan.dag.nodes) || [];
    const edges = (plan && plan.dag && plan.dag.edges) || [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth || 640;
    const cssH = 220;
    canvas.width = cssW * dpr; canvas.height = cssH * dpr;
    canvas.style.height = cssH + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    const pos = layoutDag(nodes, edges);
    // scale positions to canvas width
    Object.keys(pos).forEach(id => { pos[id].x = pos[id].x * (cssW / 640); });

    edges.forEach(e => {
      const a = pos[e.source], b = pos[e.target];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x + 46, a.y);
      const mx = (a.x + b.x) / 2;
      ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x - 46, b.y);
      ctx.strokeStyle = e.type === 'feedback' ? 'rgba(226,181,90,.85)' : 'rgba(21,67,242,.55)';
      ctx.lineWidth = e.type === 'feedback' ? 1.5 : 1.75;
      if (e.type === 'feedback') ctx.setLineDash([5, 4]); else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);
      // arrow
      ctx.beginPath();
      ctx.moveTo(b.x - 46, b.y);
      ctx.lineTo(b.x - 54, b.y - 4);
      ctx.lineTo(b.x - 54, b.y + 4);
      ctx.closePath();
      ctx.fillStyle = e.type === 'feedback' ? 'rgba(226,181,90,.85)' : 'rgba(21,67,242,.55)';
      ctx.fill();
    });

    const hit = [];
    nodes.forEach(n => {
      const p = pos[n.id]; if (!p) return;
      const w = 92, h = 36;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'rgba(15,23,42,.16)';
      ctx.lineWidth = 1;
      roundRect(ctx, p.x - w / 2, p.y - h / 2, w, h, 8);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111827';
      ctx.font = '500 11px NSans, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = n.display_name || n.name || n.id;
      ctx.fillText(truncate(label, 8), p.x, p.y);
      hit.push({ id: n.id, node: n, x: p.x - w / 2, y: p.y - h / 2, w, h });
    });

    canvas._hit = hit;
    canvas.onclick = ev => {
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      const found = (canvas._hit || []).find(h => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
      if (found && onNode) onNode(found.node);
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function truncate(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function getPlan(task, audience) {
    const plans = (task.business_dag && task.business_dag.plans) || [];
    return plans.find(p => p.audience === audience) || plans[0] || null;
  }

  function renderTaskCards(host, demand) {
    const tasks = demand.tasks || [];
    host.innerHTML = tasks.map((task, idx) => {
      const planAuds = ((task.business_dag && task.business_dag.plans) || []).map(p => p.audience).filter(Boolean);
      const users = planAuds.length ? planAuds : (task.target_users || []).map(textOf);
      const aud = demandState.audienceByTask[task.id] || users[0] || '';
      const expect = (task.expected_results || []).map(textOf).join('；');
      const dep = (task.depends_on || []).length ? `depends_on: ${(task.depends_on || []).join(', ')}` : '';
      return `<article class="dm-task-card" data-tid="${esc(task.id)}">
        <div class="dm-task-hd">
          <span class="dm-task-idx">任务 ${String(idx + 1).padStart(2, '0')}</span>
          <span class="dm-task-name">${esc(task.name)}</span>
          <span class="dm-dep">${esc(dep)}</span>
        </div>
        <div class="dm-task-body">
          <div class="dm-aud" data-tid="${esc(task.id)}">
            ${users.map(u => `<button type="button" data-aud="${esc(u)}" class="${u === aud ? 'on' : ''}">${esc(u)}</button>`).join('')}
          </div>
          <p class="dm-expect"><b>预期成果</b> · ${esc(expect)}</p>
          <details class="dm-fold"><summary>任务描述（默认折叠）</summary><p>${esc(textOf(task.description))}</p></details>
          <details class="dm-fold"><summary>业务输入（默认折叠）</summary><p>${esc((task.business_inputs || []).map(textOf).join('；'))}</p></details>
          <div class="dm-dag" data-tid="${esc(task.id)}">
            <div class="dm-dag-meta"><span>business_dag · ${esc(aud)} 视角</span><span>按 edges 绘制 · 反馈边虚线</span></div>
            <canvas class="dm-dag-canvas" width="640" height="220"></canvas>
            <div class="dm-node-pop" hidden></div>
          </div>
        </div>
      </article>`;
    }).join('');

    host.querySelectorAll('.dm-aud button').forEach(btn => {
      btn.onclick = () => {
        const tid = btn.parentElement.dataset.tid;
        const aud = btn.dataset.aud;
        demandState.audienceByTask[tid] = aud;
        renderTaskCards(host, demand);
        if (window.__demandSelectPerspective) window.__demandSelectPerspective(tid, aud);
      };
    });

    tasks.forEach(task => {
      const planAuds = ((task.business_dag && task.business_dag.plans) || []).map(p => p.audience).filter(Boolean);
      const users = planAuds.length ? planAuds : (task.target_users || []).map(textOf);
      const aud = demandState.audienceByTask[task.id] || users[0];
      const plan = getPlan(task, aud);
      const wrap = host.querySelector(`.dm-dag[data-tid="${task.id}"]`);
      if (!wrap || !plan) return;
      const canvas = wrap.querySelector('canvas');
      const pop = wrap.querySelector('.dm-node-pop');
      drawDag(canvas, plan, node => {
        pop.hidden = false;
        pop.innerHTML = `<b>${esc(node.display_name || node.name)}</b>
          <div>${esc(textOf(node.description))}</div>
          <div class="out">产出 · ${esc((node.outputs || []).join('；'))}</div>
          <button type="button">关闭</button>`;
        pop.querySelector('button').onclick = () => { pop.hidden = true; };
      });
    });
    const fv = document.getElementById('dmFlowView');
    if (fv && !fv.hidden && window.__demandShowProcess) window.__demandShowProcess(demand);
  }

  function ensureDemoExtras() {
    let extras = document.getElementById('dmDemoExtras');
    if (extras) return extras;
    const tools = document.querySelector('#demandAct .dm-composer .dm-tools');
    if (!tools) return null;
    extras = document.createElement('div');
    extras.id = 'dmDemoExtras';
    extras.hidden = true;
    extras.innerHTML = `<span class="dm-demo-lab">组网结果演示入口：</span>
      <button type="button" data-out="success">成功</button>
      <button type="button" data-out="partial">部分匹配</button>
      <button type="button" data-out="fail">失败</button>`;
    tools.parentElement.appendChild(extras);
    extras.querySelectorAll('button[data-out]').forEach(b => {
      b.onclick = async () => {
        if (window.UX && UX.writeRun) UX.writeRun({ matchOutcome: b.dataset.out, caseId: demandState.caseId || 'education' });
        await confirmAndNetwork(b.dataset.out);
      };
    });
    return extras;
  }

  function ensureDemandHooks() {
    const panel = document.getElementById('dmPanelContent');
    if (!panel) return;
    ensureDemoExtras();
    // dual case buttons in the right-side empty / composer
    if (!document.getElementById('dmUseEdu')) {
      const host = document.getElementById('dmUseCase');
      if (host) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dm-case edu';
        b.id = 'dmUseEdu';
        b.textContent = '使用教育案例';
        (host.parentElement || host).appendChild(b);
        const city = document.getElementById('dmUseCase');
        if (city) city.onclick = () => window.__demandRunCase && window.__demandRunCase({ autoSend: true });
        b.onclick = () => bootEducationDemand({ autoSend: true });
      }
    }
    const tools = document.querySelector('#demandAct .dm-tools');
    if (tools && !document.getElementById('dmFillEdu')) {
      const b1 = document.getElementById('dmFillCase');
      if (b1) b1.textContent = '填入城运案例';
      const b2 = document.createElement('button');
      b2.type = 'button'; b2.className = 'dm-tool accent'; b2.id = 'dmFillEdu'; b2.textContent = '填入教育案例';
      tools.appendChild(b2);
      b2.onclick = () => bootEducationDemand({ autoSend: false });
    }

  }

  function applyDemandToPanel(demand) {
    ensureDemandHooks();
    demandState.demand = demand;
    demandState.caseId = demand.caseId || 'education';
    (demand.tasks || []).forEach(t => {
      if (!demandState.audienceByTask[t.id]) {
        const planAuds = ((t.business_dag && t.business_dag.plans) || []).map(p => p.audience).filter(Boolean);
        demandState.audienceByTask[t.id] = planAuds[0] || textOf((t.target_users || [])[0]) || '';
      }
    });
    const title = demand.title || textOf(demand.summary);
    const set = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
    set('dmChatTitle', demand.chatTitle || title);
    set('dmReqTitle', title);
    const empty = document.getElementById('dmPanelEmpty');
    const content = document.getElementById('dmPanelContent');
    if (empty) empty.hidden = true;
    if (content) content.hidden = false;

    if (window.__demandAdoptSource) {
      window.__demandAdoptSource(demand, demandState.confirmed ? 'done' : 'ready');
    } else if (window.DemandReport) {
      DemandReport.setSession({
        source: demand,
        status: demandState.confirmed ? 'done' : 'ready',
        updatedAt: DemandReport.getSession().updatedAt || DemandReport.nowStamp(),
      });
      DemandReport.paintPanel();
      const view = document.getElementById('dmView');
      const exp = document.getElementById('dmExport');
      if (view) view.disabled = false;
      if (exp) exp.disabled = false;
    }
    const extras = ensureDemoExtras();
    if (extras) extras.hidden = demandState.caseId !== 'education';
    const m = document.getElementById('dmMatch');
    if (m) { m.disabled = !demandState.confirmed; m.textContent = '匹配组网'; }
  }

  async function bootEducationDemand(opts) {
    opts = opts || {};
    const pack = window.EDU_CASE;
    if (!pack) return;
    hideWorkbench();
    if (window.__enterDemandAct) await window.__enterDemandAct({ instant: !!opts.instant || !!opts.skipToMatch, force: true });
    ensureDemandHooks();
    const demand = JSON.parse(JSON.stringify(pack.demand));
    demand.caseId = 'education';
    demand.reqId = demand.reqId || 'REQ-EDU-0001';
    demand.org = textOf(demand.customer.name);
    demand.industry = textOf(demand.customer.industry);
    demand.scale = '未填写';
    demand.chatTitle = demand.chatTitle || demand.title;
    demandState.confirmed = false;
    demandState.regenCount = 0;
    demandState.audienceByTask = {};

    if (opts.autoSend === false) {
      const input = document.getElementById('dmInput');
      if (input) { input.value = demand.userText; input.dispatchEvent(new Event('input')); }
      return;
    }

    const instant = !!(opts.instant || opts.skipToMatch);

    const paintChatAndDoc = async () => {
      const log = document.getElementById('dmLog');
      if (log) {
        log.hidden = false;
        log.innerHTML = '';
        const u = document.createElement('div');
        u.className = 'dm-msg user';
        u.innerHTML = `<span class="who">你的消息</span><div class="dm-bubble">${esc(demand.userText)}</div>`;
        log.appendChild(u);
        const b = document.createElement('div');
        b.className = 'dm-msg bot';
        b.innerHTML = `<span class="who">助手</span><div class="dm-bubble">${esc(textOf(demand.summary))}
          <div class="suggest"><b>已解析为 2 个任务 · 5 个使用对象视角</b>
          <ol><li>学情分析与个性化学习建议（教师、学生）</li>
          <li>分层练习资源准备与家校协同（教师、学生、家长）</li></ol></div></div>`;
        log.appendChild(b);
      }
      applyDemandToPanel(demand);
      if (window.UX && UX.writeRun) {
        UX.writeRun({
          caseId: 'education',
          reqId: demand.reqId,
          scene: '中学智能教学',
          title: demand.title,
          chatTitle: demand.chatTitle,
          taskName: (demand.tasks[0] || {}).name,
          needCount: (demand.tasks || []).length,
          matchOutcome: opts.outcome || 'success',
        });
      }
    };

    const paintFlow = async () => {
      if (window.__demandShowProcess) window.__demandShowProcess(demand);
    };

    if (window.__demandPlayOrganize) {
      await window.__demandPlayOrganize({ instant, onStep1: paintChatAndDoc, onDone: paintFlow });
    } else {
      await paintChatAndDoc();
      await paintFlow();
    }

    if (opts.autoConfirm || opts.skipToMatch) {
      await wait(opts.instant ? 80 : 300);
      await confirmAndNetwork(opts.outcome || 'success', { skipEnrich: true, jumpResult: !!opts.skipToMatch });
    }
  }

  async function confirmAndNetwork(outcome, opts) {
    opts = opts || {};
    const demand = demandState.demand;
    if (!demand) return;
    demandState.confirmed = true;
    const stamp = (window.DemandReport && DemandReport.nowStamp()) || '';
    if (window.DemandReport) {
      DemandReport.setSession({ source: demand, status: 'done', confirmedAt: stamp, updatedAt: DemandReport.getSession().updatedAt || stamp });
      DemandReport.paintPanel();
    }
    if (window.__demandSetStatus) window.__demandSetStatus('done', { armMatch: true });
    const badge = document.getElementById('dmBadge');
    if (badge) { badge.dataset.st = 'done'; badge.textContent = '已确认'; }
    const c1 = document.getElementById('dmConfirm');
    const c2 = document.getElementById('dmConfirmAll');
    if (c1) { c1.disabled = true; c1.textContent = '已确认'; }
    if (c2) { c2.disabled = true; c2.textContent = '已确认，进入组网'; }
    const m = document.getElementById('dmMatch');
    if (m) m.disabled = false;

    const out = outcome || ((window.UX && UX.readRun && UX.readRun().matchOutcome) || (demandState.caseId === 'education' ? 'success' : 'partial'));
    if (window.UX && UX.writeRun) {
      const run = {
        caseId: demand.caseId || demandState.caseId,
        reqId: demand.reqId,
        scene: demand.scene || (demandState.caseId === 'education' ? '中学智能教学' : '城运视频识别'),
        title: demand.title,
        demandStatus: 'confirmed',
        matchOutcome: out,
        fromDemand: true,
        needCount: (demand.tasks || []).length || 1,
        taskName: (demand.tasks && demand.tasks[0] && demand.tasks[0].name) || demand.taskName,
      };
      if (demand.org) run.org = demand.org;
      if (demand.industry) run.industry = demand.industry;
      if (demand.scale) run.scale = demand.scale;
      if (demand.chatTitle) run.chatTitle = demand.chatTitle;
      if (demand.systems) run.systems = demand.systems;
      if (stamp) { run.confirmedAt = stamp; run.updatedAt = (window.DemandReport && DemandReport.getSession().updatedAt) || stamp; }
      UX.writeRun(run);
    }
    saveHistoryItem({
      id: 'hist-' + (demand.caseId || 'run') + '-' + Date.now(),
      caseId: demand.caseId || demandState.caseId,
      title: demand.title,
      updatedAt: Date.now(),
      status: out === 'success' ? 'success' : out === 'fail' ? 'fail' : 'partial',
      statusLabel: out === 'success' ? '组网成功' : out === 'fail' ? '组网失败' : '部分匹配',
      summary: demandState.caseId === 'education' ? '教育样例 · 确认后组网' : '城运样例 · 确认后组网',
      reqId: demand.reqId,
      matchOutcome: out,
    });

    // 确认流程后直接组网（城运 / 教育均不再经过完善信息）
    if (window.UX && UX.goMatch) UX.goMatch();
    else if (window.__enterMatchAct) window.__enterMatchAct({ jumpResult: !!opts.jumpResult });
  }

  /* ========== Match: carousel + outcomes ========== */
  function ensureMatchExtras() {
    const root = document.getElementById('matchAct');
    if (!root) return;
    if (!document.getElementById('mCarousel')) {
      const c = document.createElement('div');
      c.id = 'mCarousel';
      c.innerHTML = `<b></b><span></span>`;
      root.appendChild(c);
    }
    if (!document.getElementById('mOutcomeBanner')) {
      const b = document.createElement('div');
      b.id = 'mOutcomeBanner';
      b.innerHTML = `<strong></strong><span></span>`;
      root.appendChild(b);
    }
  }

  let carouselTimer = null, carouselIdx = 0;
  function startCarousel() {
    ensureMatchExtras();
    const el = document.getElementById('mCarousel');
    if (!el) return;
    el.classList.add('on');
    const tick = () => {
      const item = CAROUSEL[carouselIdx % CAROUSEL.length];
      el.querySelector('b').textContent = item.title;
      el.querySelector('span').textContent = item.sub;
      carouselIdx++;
    };
    tick();
    clearInterval(carouselTimer);
    carouselTimer = setInterval(tick, 3200);
  }
  function stopCarousel() {
    clearInterval(carouselTimer);
    const el = document.getElementById('mCarousel');
    if (el) el.classList.remove('on');
  }

  function paintEducationResult(panel, outcomeKey) {
    const pack = window.EDU_CASE && window.EDU_CASE.match;
    if (!pack) return;
    const data = pack[outcomeKey] || pack.success;
    const banner = document.getElementById('mOutcomeBanner');
    if (banner) {
      banner.className = 'on ' + data.outcome;
      banner.querySelector('strong').textContent = data.statusLabel;
      banner.querySelector('span').textContent = data.outcome === 'fail'
        ? (data.failReason || '')
        : `已匹配 ${data.matched}/${data.total} · ${data.agents} Agent` + (data.score != null ? ` · 评分 ${data.score}` : '');
    }
    if (data.outcome === 'fail') {
      panel.innerHTML = `<div class="mrhd"><b>组网失败</b><small>Prototype 模拟 · 无虚构百分比进度</small></div>
        <div class="mroutcome-fail">${esc(data.failReason)}</div>
        <p class="mrgapnote">可返回需求修改后重新确认组网，或从工作台打开「部分匹配 / 成功」种子记录。</p>`;
      return;
    }
    let html = `<div class="mrhd"><b>${esc(data.statusLabel)}</b><small>教育样例 · ${esc(data.matched)}/${esc(data.total)} 环节 · ${esc(data.agents)} Agent</small></div>`;
    if (data.score != null) html += `<div class="mrcov">组网评分 <b>${data.score}</b></div>`;
    (data.tasks || []).forEach(task => {
      html += `<div class="mrmeta" style="margin-top:12px">${esc(task.name)}</div>`;
      const auds = Object.keys(task.audiences || {});
      html += `<div class="mrtabs">${auds.map((a, i) => `<button type="button" class="mrtab ${i === 0 ? 'on' : ''}" data-task="${esc(task.taskId)}" data-aud="${esc(a)}">${esc(a)}<small>${task.audiences[a].matched}/${task.audiences[a].total}</small></button>`).join('')}</div>`;
      html += `<div class="mraud-body" data-task="${esc(task.taskId)}">${renderAudBody(task.audiences[auds[0]])}</div>`;
    });
    panel.innerHTML = html;
    panel.querySelectorAll('.mrtab').forEach(tab => {
      tab.onclick = e => {
        e.stopPropagation();
        const taskId = tab.dataset.task, aud = tab.dataset.aud;
        const task = (data.tasks || []).find(t => t.taskId === taskId);
        if (!task) return;
        panel.querySelectorAll(`.mrtab[data-task="${taskId}"]`).forEach(t => t.classList.toggle('on', t === tab));
        const body = panel.querySelector(`.mraud-body[data-task="${taskId}"]`);
        if (body) body.innerHTML = renderAudBody(task.audiences[aud]);
      };
    });
  }

  function renderAudBody(aud) {
    if (!aud) return '';
    const nodes = aud.nodes || [];
    return `<div class="mrflow">${nodes.map((n, i) => {
      const gap = n.status === 'unmatched';
      const ag = (n.agents || [])[0];
      return `${i ? '<span class="mrarr">→</span>' : ''}
        <div class="mrnode ${gap ? 'gap' : ''}">
          <b>${esc(n.display_name)}</b>
          <span>${gap ? '待匹配' : esc(ag && ag.name || '已匹配')}</span>
          ${ag && ag.skill ? `<em class="sk">Skill · ${esc(ag.skill)}</em>` : ''}
          ${gap && n.unmatched_reason ? `<em class="why">${esc(n.unmatched_reason)}</em>` : ''}
          ${!gap && n.outputs ? `<em>${esc((n.outputs || []).join('；'))}</em>` : ''}
        </div>`;
    }).join('')}</div>
    <p class="mrcov" style="margin-top:8px">视角匹配 ${aud.matched}/${aud.total}${aud.score != null ? ' · 评分 ' + aud.score : ''} · ${aud.agents || 0} Agent</p>`;
  }

  function patchMatchEnter() {
    const prev = window.__enterMatchAct;
    if (!prev || prev._checklistPatched) return;
    const wrapped = async function (opts) {
      opts = opts || {};
      ensureMatchExtras();
      const run = (window.UX && UX.readRun && UX.readRun()) || {};
      const outcome = opts.outcome || run.matchOutcome || 'success';
      const isEdu = (run.caseId === 'education') || opts.education;
      startCarousel();
      const ret = await prev.call(this, opts);
      // After enter, observe result panel / done state
      const watch = setInterval(() => {
        const result = document.getElementById('mResult');
        const done = document.getElementById('mDone');
        const ready = (result && result.classList.contains('ready')) || (done && getComputedStyle(done).opacity > 0.2) || opts.jumpResult || opts.instant;
        if (!ready && !opts.jumpResult) return;
        // stop carousel once result showing
        if (result && (result.classList.contains('ready') || opts.jumpResult || isEdu)) {
          stopCarousel();
          clearInterval(watch);
          if (isEdu) {
            result.classList.add('ready');
            result.style.opacity = 1;
            paintEducationResult(result, outcome);
            if (done) { done.style.opacity = 1; done.style.pointerEvents = 'auto'; }
            const cta = document.getElementById('mCta');
            if (cta && outcome !== 'fail') { cta.style.opacity = 1; cta.style.pointerEvents = 'auto'; }
            const banner = document.getElementById('mOutcomeBanner');
            if (banner) banner.classList.add('on');
          } else {
            // city: still show outcome banner for partial
            const banner = document.getElementById('mOutcomeBanner');
            if (banner) {
              banner.className = 'on partial';
              banner.querySelector('strong').textContent = '部分匹配';
              banner.querySelector('span').textContent = '城运双方案 · B 视角整治环节待匹配';
            }
          }
        }
      }, 400);
      // safety stop carousel at ~36s equivalent: if jumpResult, stop sooner
      if (opts.jumpResult || opts.instant) {
        await wait(600);
        stopCarousel();
        const result = document.getElementById('mResult');
        if (result && isEdu) {
          result.classList.add('ready');
          result.style.opacity = 1;
          paintEducationResult(result, outcome);
        }
      } else {
        setTimeout(stopCarousel, 38000);
      }
      return ret;
    };
    wrapped._checklistPatched = true;
    window.__enterMatchAct = wrapped;
  }

  function patchDemandConfirm() {
    // 确认需求只在需求幕内核对并扫流程；匹配组网才进入组网
    document.addEventListener('click', e => {
      const t = e.target && (e.target.id ? e.target : e.target.closest && e.target.closest('button'));
      const id = t && t.id;
      if (id === 'dmMatch' && demandState.demand) {
        e.preventDefault();
        e.stopPropagation();
        confirmAndNetwork((window.UX && UX.readRun && UX.readRun().matchOutcome) || undefined);
      }
    }, true);
  }

  function patchChrome() {
    const boost = () => {
      const chrome = document.getElementById('ux-chrome');
      if (!chrome || chrome.querySelector('.ux-wb')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ux-wb';
      btn.textContent = '工作台';
      btn.onclick = () => showWorkbench();
      const chip = chrome.querySelector('#ux-chip');
      if (chip) chrome.insertBefore(btn, chip);
      else chrome.appendChild(btn);
      const p = window.UX && UX.profile && UX.profile();
      if (p && (p.registered || p.issued)) btn.classList.add('on');
    };
    boost();
    setInterval(boost, 1500);
  }

  function wireLogin() {
    ensureLayers();
    const login = document.getElementById('loginAct');
    login.addEventListener('click', e => { if (e.target === login) hideLogin(); });
    document.getElementById('lgBack').onclick = () => { hideLogin(); };
    const goReg = document.getElementById('lgGoReg');
    if (goReg) goReg.onclick = () => setLoginMode('register');
    document.getElementById('lgSubmit').onclick = () => {
      const mode = login.dataset.mode || 'login';
      const email = (document.getElementById('lgEmail').value || '').trim();
      const nameFromEmail = email.includes('@') ? email.split('@')[0] : '';
      const name = (document.getElementById('lgName').value || nameFromEmail || '邓义').trim();
      const org = (document.getElementById('lgOrg').value || '').trim();
      const role = (document.getElementById('lgRole').value || '').trim();
      if (window.UX && UX.setRegistered) {
        UX.setRegistered({ name, email, org: org || (mode === 'login' ? '已登录用户' : ''), role: role || (mode === 'login' ? '成员' : '') });
      }
      hideLogin();
      if (mode === 'register') {
        // go demand
        if (window.__enterDemandAct) window.__enterDemandAct({ force: true });
        else if (window.UX && UX.goDemand) UX.goDemand();
      } else {
        showWorkbench();
      }
      const chip = document.querySelector('#ux-chrome .ux-wb');
      if (chip) chip.classList.add('on');
    };
    document.getElementById('wbNew').onclick = () => {
      hideWorkbench();
      if (window.__enterDemandAct) window.__enterDemandAct({ force: true });
    };
    document.getElementById('wbEdu').onclick = () => bootEducationDemand({ autoSend: true });
    document.getElementById('wbCity').onclick = () => {
      hideWorkbench();
      if (window.__enterDemandAct) window.__enterDemandAct({ force: true });
      setTimeout(() => window.__demandRunCase && window.__demandRunCase({ autoSend: true }), 400);
    };
  }

  function enhanceWelcomeCTA() {
    const open = document.getElementById('open');
    if (open && !open._checklist) {
      open._checklist = true;
      open.innerHTML = `登录 / 注册，开始使用<small>已有用户进工作台</small>`;
      open.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        showLogin('login');
      };
    }
    // also add secondary on after screen
    const after = document.getElementById('after');
    if (after && !document.getElementById('goWorkbench')) {
      const wrap = after.querySelector('.next');
      if (wrap) {
        const b = document.createElement('button');
        b.className = 'btn2'; b.id = 'goWorkbench'; b.textContent = '进入工作台';
        b.onclick = () => showWorkbench();
        wrap.insertBefore(b, wrap.firstChild);
      }
    }
  }

  function applyQueryShortcuts() {
    const q = new URLSearchParams(location.search);
    const demo = q.get('demo');
    if (demo === 'workbench') setTimeout(() => {
      if (window.UX && UX.setRegistered) UX.setRegistered({ name: '邓义', org: '演示机构', role: '产品' });
      showWorkbench();
    }, 200);
    if (demo === 'login' || demo === 'register') {
      const go = () => showLogin(demo === 'register' ? 'register' : 'login');
      const waitReady = () => {
        if (window.__ready) setTimeout(go, 240);
        else {
          let n = 0;
          const t = setInterval(() => {
            n += 1;
            if (window.__ready || n > 40) { clearInterval(t); go(); }
          }, 80);
        }
      };
      waitReady();
    }
    if (demo === 'edu') setTimeout(() => bootEducationDemand({ autoSend: true }), 500);
    if (demo === 'edu-match') setTimeout(() => bootEducationDemand({ autoConfirm: true, outcome: q.get('out') || 'success', skipToMatch: true, instant: true }), 300);
    if (demo === 'edu-partial') setTimeout(() => bootEducationDemand({ autoConfirm: true, outcome: 'partial', skipToMatch: true, instant: true }), 300);
    if (demo === 'edu-fail') setTimeout(() => bootEducationDemand({ autoConfirm: true, outcome: 'fail', skipToMatch: true, instant: true }), 300);
  }

  function boot() {
    seedHistory();
    ensureLayers();
    wireLogin();
    patchChrome();
    enhanceWelcomeCTA();
    ensureDemandHooks();
    patchDemandConfirm();
    patchMatchEnter();
    applyQueryShortcuts();
    window.__demandOnFilled = function (data) {
      if (!data) return;
      // city-ops single-task → normalize into tasks[] shape for cards when possible
      if (data.caseId === 'city-ops' || (data.task && data.task.name)) {
        demandState.caseId = data.caseId || 'city-ops';
        demandState.demand = {
          caseId: demandState.caseId,
          reqId: data.reqId,
          title: data.title,
          chatTitle: data.chatTitle,
          scene: data.scene,
          org: data.org,
          industry: data.industry,
          scale: data.scale,
          summary: data.summary,
          customer: { name: { text: data.org }, industry: { text: data.industry } },
          tasks: [{
            id: 'wf-city',
            name: data.task.name,
            description: { text: data.task.desc },
            target_users: String(data.task.users || '').split('；').filter(Boolean).map(t => ({ text: t.trim() })),
            expected_results: String(data.task.expect || '').split('；').filter(Boolean).map(t => ({ text: t.trim() })),
            business_inputs: String(data.task.inputs || '').split('；').filter(Boolean).map(t => ({ text: t.trim() })),
            business_dag: { version: 'business-dag.v2', status: 'READY', plans: (window.CITY_OPS && window.CITY_OPS.schemes || []).map(s => ({
              plan_id: s.id,
              audience: s.tab || s.title,
              perspective: s.perspective || s.title,
              dag: {
                nodes: (s.stages || []).map(st => ({ id: st.id, name: st.name, display_name: st.name, description: { text: st.out || '' }, outputs: st.out ? [st.out] : [] })),
                edges: (s.edges || []).map(e => ({ source: e.source, target: e.target, type: 'sequential', data: e.data || '' })),
              }
            })) },
          }],
          clarifications: { suggested: (data.clarifications || []).map(t => ({ text: t })) },
          userText: data.userText,
        };
        // 右侧文档已由 demand-act / DemandReport 绘制，这里只保留结构化 demand 供确认组网
      }
    };
    window.__demandChecklistReset = function () {
      demandState.caseId = null;
      demandState.demand = null;
      demandState.audienceByTask = {};
      demandState.confirmed = false;
      demandState.regenCount = 0;
    };
    window.ChecklistProto = {
      showLogin, showWorkbench, bootEducationDemand, confirmAndNetwork, seedHistory,
      ensureDemandHooks,
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
