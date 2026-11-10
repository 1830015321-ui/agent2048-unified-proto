/* 组网幕 · 城运双方案（对齐 acc.agent2048 实测） */
(function () {
const W = 1440, H = 900, CX = 720, CY = 470, END = 40;
const root = document.getElementById('matchAct');
if (!root) throw new Error('matchAct missing');
const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
const cv = $('#mCv'), ctx = cv.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u, seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = u => u >= 1 ? 1 : 1 - Math.pow(2, -10 * u), eio = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function glow(x, y, r, c, a) { if (a <= 0 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }

const CITY = (window.CITY_OPS && window.CITY_OPS.schemes) ? window.CITY_OPS : null;
if (!CITY) throw new Error('CITY_OPS missing — load city-ops-data.js first');
const SCHEMES = CITY.schemes;
const AGENT_MODAL = CITY.agentModal || {};

function stageSample(st) {
  const a = (st.agents && st.agents[0]) || null;
  return a ? a.name : '';
}
function stageRole(st) {
  const a = (st.agents && st.agents[0]) || null;
  return a ? (a.skill || '') : '';
}

// 右侧清单 = 方案 A 7 环节（旁路隐私标 g）
const NEEDS = SCHEMES[0].stages.map(s => [s.name, s.bypass ? 1 : 0, s]);
NEEDS.forEach((n, i) => n.ang = i / NEEDS.length * Math.PI * 2 + .3);

const R = rng(2048), N = 3000, ST = [];
for (let i = 0; i < N; i++) {
  const arm = i % 3, r = 60 + Math.pow(R(), .62) * 560, a = arm * 2.094 + r * .0105 + (R() - .5) * .55, th = (R() + R() + R() - 1.5) * 26 * (1 - r / 700);
  ST.push({ x: Math.cos(a) * r, y: th, z: Math.sin(a) * r, a: Math.atan2(Math.sin(a), Math.cos(a)), r, s: .4 + .6 * R(), ph: R() * 6.28 });
}
const near = (ang, i) => { const d = Math.abs(((ST[i].a - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI); return d < .17 && ST[i].r > 150; };
const LIT = ST.map((_, i) => NEEDS.findIndex(n => near(n.ang, i)));

// 组网节点 = 方案 A 环节（隐私旁路 late）
const NODES = SCHEMES[0].stages.map((st, i) => {
  const pos = [
    [-340, -80, -70], [-80, -160, 40], [-40, 130, -50], [250, -40, 30],
    [290, 150, -40], [60, 30, 120], [-280, 200, 90],
  ][i] || [0, 0, 0];
  return {
    id: st.id,
    name: st.name,
    role: `${st.agentCount} Agent · ${st.out}`,
    p: pos,
    cov: [i],
    ring: i,
    stage: st,
    late: st.bypass ? 1 : 0,
    bypass: st.bypass ? 1 : 0,
  };
});
const EDGE_TIMES = [27.2, 27.7, 28.2, 28.7, 29.2, 32.0];
const EDGES = (SCHEMES[0].edges || []).map((e, i) => [e.source, e.target, EDGE_TIMES[i] || 28, e.data || '']);
const CONF = [29.8, 31.8]; // 承办视角系统补充闪现

const RING = Array.from({ length: 18 }, (_, k) => {
  const pool = ST.map((_, i) => i).filter(i => LIT[i] >= 0);
  return { src: pool[Math.floor(rng(k + 5)() * pool.length)] || 0, ang: k / 18 * Math.PI * 2, out: k >= 7 && k % 2 === 0 ? (k % 4 ? '能力不符' : '测评未达标') : null, real: k < 7 ? k : -1, id: '#' + (2100 + k * 37) };
});
const PH = [['需求入场', 0], ['检索技能库', 2.5], ['查找候选技能', 8], ['匹配候选智能体', 15.5], ['按使用对象组网', 26], ['生成方案', 35.5]];
const LOGS = [
  [.4, '已确认需求 · 城运视频识别 · 1 个任务'],
  [3, '检索 2,898 个智能体 · 7,111 项技能'],
  [8.4, '按城运中心 7 环节分头召回'],
  [13.5, '召回候选 186 个'],
  [16.5, '核验身份与测评等级'],
  [19.4, '保留双视角候选 · 筛掉能力不符项'],
  [21, '等待你的偏好…'],
  [27, '方案 A 城运中心视角：环节逐个入网'],
  [29.9, '方案 B：违规行为整治 · 系统补充 3 Agent'],
  [31.9, '旁路接入 · 数据隐私保护（脱敏）'],
  [35.6, '匹配完成 · A 7/7·26 Agent / B 4/5·13 Agent'],
  [37.6, '双方案已生成 · 共 26+13 Agent · 画布口径'],
];
let t = 0, last = 0, speed = 1, pref = null, schemeTab = 'A', wrote = false;
const PREF_LABEL = { fast: '上线快', cheap: '成本低', local: '政务云' };
const ui = $('#mUi'), mk = (cls, html) => { const e = document.createElement('div'); e.className = 'lab ' + cls; e.innerHTML = html; ui.appendChild(e); return e; };
const put = (e, x, y, a, sc = 1, ax = -50, ay = -50) => { e.style.opacity = clamp(a); e.style.visibility = a > .01 ? 'visible' : 'hidden'; e.style.transform = `translate(${x}px,${y}px) translate(${ax}%,${ay}%) scale(${sc})`; };

// header city-ops
(function syncHd() {
  const run = (window.UX && UX.readRun && UX.readRun()) || {};
  const p = (window.UX && UX.profile && UX.profile()) || {};
  const hd = $('.hd small');
  if (hd) hd.textContent = `${run.reqId || CITY.reqId} · ${p.name || '邓义'} · ${CITY.task}`;
})();

$('#mPhs').innerHTML = PH.map(([n]) => `<div class="ph"><i></i><b>${n}</b></div>`).join('');
$('#mNds').innerHTML = NEEDS.map(([n, g]) => `<div class="nd ${g ? 'g' : ''}"><i></i><span>${n}</span><small></small></div>`).join('');
const beamEls = NEEDS.map(([n, g]) => mk('beam' + (g ? ' g' : ''), n));
const whyEls = RING.map(r => mk('why', r.out || ''));
const nodeEls = {}; NODES.forEach(n => { const e = mk('node', ''); e.dataset.id = n.id; nodeEls[n.id] = e; });
const conflict = mk('conflict', '系统补充 · 承办视角整治环节');

function fillNode(n) {
  const tag = pref === 'local' && (n.id === 'n7' || n.id === 'n1') ? '适配政务云' : pref === 'cheap' && n.id === 'n4' ? '按量计费' : pref === 'fast' && n.id === 'n2' ? '现成可用' : '';
  const st = n.stage || {};
  const ags = (st.agents || []).slice(0, 2);
  const chips = ags.map(a => `<em class="ag" data-ag="${a.name}">${a.name}</em>`).join('');
  nodeEls[n.id].innerHTML = `<small>${n.late ? '旁路入网' : '入网 · ' + n.id.toUpperCase()}</small><b>${n.name}</b><span>${n.role}</span><div class="cv">${(n.cov || []).map(c => `<em>${NEEDS[c][0]}</em>`).join('')}${chips}</div>${tag ? `<span class="tg">${tag}</span>` : ''}`;
}
NODES.forEach(fillNode);
$$('#mAsk button').forEach(b => b.onclick = () => choose(b.dataset.v));
function choose(v, auto) {
  if (pref) return;
  pref = v;
  $$('#mAsk button').forEach(b => b.classList.toggle('sel', b.dataset.v === v));
  const label = PREF_LABEL[v] || v;
  LOGS.push([t + .1, `偏好：${label}${auto ? '（默认）' : ''}`]);
  LOGS.sort((a, b) => a[0] - b[0]);
  NODES.forEach(fillNode);
  if (window.UX && UX.writeRun) UX.writeRun({ preference: v, preferenceLabel: label });
}

function cam() {
  const raw = t * .09 + .4, sway = .32 * Math.sin((t - 24) * .45), net = eio(seg(t, 24, 27.5)), fl = eio(seg(t, 34.5, 37.5));
  const yaw = lerp(lerp(raw, sway, net), 0, fl);
  return { yaw, pitch: lerp(lerp(.42, .32, seg(t, 8, 16)), 0, fl), dist: lerp(1500, 1050, eio(seg(t, 2, 9))) - eio(seg(t, 24, 28)) * 120 };
}
let C = cam();
function proj(x, y, z) { const cy = Math.cos(C.yaw), sy = Math.sin(C.yaw), x1 = x * cy - z * sy, z1 = x * sy + z * cy, cp = Math.cos(C.pitch), sp = Math.sin(C.pitch), y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = 900 / (z2 + C.dist); return [CX + x1 * f * 1.08, CY + y2 * f * 1.08, f, z2]; }
function ringW(r, tt) { const k = eo(seg(tt, 15.5, 18.5)), s = ST[r.src] || ST[0], a = r.ang + tt * .05; return [lerp(s.x, Math.cos(a) * 250, k), lerp(s.y, 0, k), lerp(s.z, Math.sin(a) * 250, k)]; }
function nodeW(n) { const r = RING[n.ring] || RING[0], from = ringW(r, Math.min(t, 26)), k = eo(seg(t, n.late ? 31.6 : 26.2, n.late ? 32.8 : 27.6)), fl = eio(seg(t, 34.5, 37.5));
  return [lerp(from[0], n.p[0], k), lerp(from[1], n.p[1], k), lerp(from[2], n.p[2] * (1 - fl), k)]; }

function schemesSummary() {
  return SCHEMES.map(s => ({
    id: s.id, tab: s.tab, title: s.title, agents: s.agents, score: s.score,
    matched: s.matched, total: s.total, desc: s.fitReason || s.desc || '',
    line: `已匹配 ${s.matched}/${s.total} 环节 · ${s.agents} 个 Agent`,
    meta: s.meta, evaluation: s.evaluation,
    stages: s.stages.map(x => ({
      name: x.name,
      agents: x.agentCount != null ? x.agentCount : (x.agents || []).length,
      agentNames: (x.agents || []).map(a => a.name || a),
      gap: !!x.gap, bypass: !!x.bypass, out: x.out,
      sample: (x.agents && x.agents[0] && x.agents[0].name) || '',
      systemSupplement: !!x.systemSupplement,
    })),
  }));
}

function writeMatchDone() {
  if (!(window.UX && UX.writeRun) || wrote) return;
  wrote = true;
  UX.writeRun({
    caseId: CITY.caseId,
    reqId: CITY.reqId,
    taskName: CITY.task,
    title: CITY.title,
    scene: '城运视频识别',
    matchDone: true,
    coverage: 11,
    coverageTotal: 12,
    coverageA: '7/7',
    coverageB: '4/5',
    agentsA: 26,
    agentsB: 13,
    agentsTotal: CITY.agentsTotal || 39,
    skillsTotal: CITY.skillsTotal || 36,
    schemes: schemesSummary(),
    preference: pref,
    preferenceLabel: PREF_LABEL[pref] || pref,
  });
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderResultPanel() {
  const panel = $('#mResult');
  if (!panel) return;
  const sch = SCHEMES.find(s => s.id === schemeTab) || SCHEMES[0];
  const tabs = SCHEMES.map(s =>
    `<button type="button" class="mrtab ${s.id === schemeTab ? 'on' : ''}" data-sid="${s.id}">${esc(s.tab)}<small>${s.agents} Agent · ${s.score} 分 · ${s.matched}/${s.total}</small></button>`
  ).join('');
  const dims = (sch.evaluation && sch.evaluation.dimensions) || [];
  const scoreHtml = dims.length ? `<details class="mrscore" open>
      <summary>流程评分 <em>${sch.score} 分 · 四维均 5/5</em></summary>
      <ul>${dims.map(d => `<li><b>${esc(d.label)}</b><span>${d.score}/5</span>${esc(d.reason)}</li>`).join('')}</ul>
    </details>` : '';
  const stages = sch.stages || [];
  const flowParts = [];
  stages.forEach((st, i) => {
    const gap = st.gap ? ' gap' : (st.bypass ? ' bypass' : '');
    const cnt = st.agentCount != null ? st.agentCount : (st.agents || []).length;
    const agLabel = st.gap ? '待匹配' : `${cnt} Agent`;
    let chips = (st.agents || []).map(a => {
      const nm = a.name || a;
      const sk = a.skill ? ` data-role="${esc(a.skill)}"` : '';
      return `<button type="button" class="mrag" data-ag="${esc(nm)}"${sk}>${esc(nm)}</button>`;
    }).join('');
    if (st.gap && !chips) chips = '<em class="mrag gapag">待匹配 Agent</em>';
    flowParts.push(`<div class="mrnode${gap}" data-stage="${esc(st.name)}"><b>${esc(st.name)}</b><span>${agLabel}</span>${st.out ? `<em class="mrout">产出 · ${esc(st.out)}</em>` : ''}<div class="mrags">${chips}</div></div>`);
    if (i < stages.length - 1) {
      const edge = (sch.edges || []).find(e => e.source === st.id && e.target === stages[i + 1].id);
      const lab = (edge && edge.data) || st.out || '→';
      flowParts.push(`<span class="mredge">${esc(lab)}</span>`);
    }
  });
  panel.innerHTML = `
    <div class="mrhd"><b>匹配已完成 · 1 个任务 · 2 个方案</b><small>${esc(CITY.task)}</small></div>
    <div class="mrcov">城运中心 <b>7/7 · 26 Agent</b>　/　承办单位 <b>4/5 · 13 Agent</b>　·　合计 26+13 Agent</div>
    <div class="mrtabs">${tabs}</div>
    <div class="mrbody">
      <p class="mrdesc">${esc(sch.fitReason || sch.desc || '')}</p>
      <div class="mrmeta">${esc(sch.meta || '')}</div>
      ${scoreHtml}
      <div class="mrflow">${flowParts.join('')}</div>
      ${sch.id === 'B' ? '<p class="mrgapnote" style="color:var(--gold)">违规行为整治：待匹配 Agent（画布红缺 · 进度卡 4/5）。</p>' : '<p class="mrgapnote">旁路：数据隐私保护 → 事件证据组装（脱敏规则与权限控制）。</p>'}
    </div>`;
  panel.querySelectorAll('.mrtab').forEach(b => b.onclick = e => { e.stopPropagation(); schemeTab = b.dataset.sid; renderResultPanel(); });
  panel.querySelectorAll('.mrag').forEach(el => {
    el.onclick = e => {
      e.stopPropagation();
      openAgentPop(el, el.dataset.ag, el.dataset.role || '');
    };
  });
}

function toast(msg) {
  let el = $('#mToast');
  if (!el) { el = document.createElement('div'); el.id = 'mToast'; ui.appendChild(el); }
  el.textContent = msg; el.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('on'), 2200);
}

function findAgent(name) {
  if (AGENT_MODAL[name]) return { modal: AGENT_MODAL[name], skill: '' };
  for (const s of SCHEMES) for (const st of s.stages) for (const a of (st.agents || [])) {
    if (a.name === name) return { modal: AGENT_MODAL[name], agent: a, stage: st, scheme: s };
  }
  return { agent: { name }, modal: null };
}

function openAgentPop(el, name, role) {
  const info = findAgent(name);
  const m = info.modal;
  const a = $('#app').getBoundingClientRect(), s = a.width / W;
  const r = el.getBoundingClientRect();
  const x = (r.left - a.left) / s, y = (r.top - a.top) / s;
  if (m) {
    popRich(x, y, {
      kind: 'Agent',
      name: m.name,
      title: m.title || (m.name + ' · Agent 能力画像'),
      desc: m.intro,
      status: `${m.status} / ${m.mvp}`,
      meta: [`项目ID ${m.projectId}`, `项目方 ${m.owner}`, m.stage || ''],
      skills: m.skills || [],
      out: false,
    });
  } else {
    const ag = info.agent || { name };
    const st = info.stage;
    const desc = (ag.skillDesc || role || ag.skill || '') +
      (st ? `。归属「${info.scheme.tab}」· 环节「${st.name}」` : '') +
      '。已通过平台测评（演示）。';
    popRich(x, y, {
      kind: 'Agent',
      name: ag.name || name,
      desc,
      status: ag.uiOnly ? '系统补充' : '已入网',
      meta: ag.projectId ? [`项目ID ${ag.projectId}`] : [],
      skills: ag.skills || (ag.skill ? [ag.skill] : []),
      out: false,
    });
  }
}

function popRich(x, y, opt) {
  const p = $('#mPop');
  $('#mPk').textContent = opt.kind || 'Agent';
  $('#mPn').textContent = opt.title || ((opt.name ? opt.name + ' · Agent 能力画像' : '') || '');
  $('#mPd').textContent = opt.desc || '';
  $('#mPs').textContent = opt.status || '';
  $('#mPs').className = 'st' + (opt.out ? ' out' : '');
  const meta = $('#mPmeta');
  if (meta) meta.innerHTML = (opt.meta || []).filter(Boolean).map(t => `<i class="on">${esc(t)}</i>`).join('');
  const sk = $('#mPskills');
  if (sk) sk.innerHTML = (opt.skills || []).map(t => `<i>${esc(t)}</i>`).join('');
  p.style.display = 'block';
  p.style.left = Math.min(x + 18, W - 360) + 'px';
  p.style.top = Math.min(Math.max(y - 10, 80), H - 280) + 'px';
}

function pop(x, y, k, n, d, s, out) {
  popRich(x, y, { kind: k, name: n, desc: d, status: s, out: !!out, meta: [], skills: [] });
}

function render() {
  C = cam(); ctx.fillStyle = '#05060A'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
  const galA = seg(t, 2.2, 4.5) * (1 - .62 * seg(t, 24, 28)) * (1 - .5 * seg(t, 34.5, 37));
  const wave = t > 3 && t < 7 ? eo(seg(t, 3, 6.5)) * 700 : -1;
  for (let i = 0; i < N; i++) {
    const s = ST[i], [x, y, f, z] = proj(s.x, s.y, s.z); if (z < -C.dist + 50) continue;
    let a = galA * (.25 + .45 * s.s) * (.65 + .35 * Math.sin(t * 1.3 + s.ph)) * clamp(f * 1.1), col = '210,222,255';
    if (wave > 0) a += Math.exp(-Math.abs(s.r - wave) / 26) * .8 * galA;
    const b = LIT[i]; if (b >= 0) { const on = seg(t, 8.6 + b * .6, 9.3 + b * .6) * (1 - seg(t, 22, 26)); if (on > .05) { a += on * .7; col = NEEDS[b][1] ? '226,181,90' : '110,150,255'; } }
    if (a < .02) continue; const r = (.5 + 1.3 * s.s) * f; ctx.fillStyle = `rgba(${col},${clamp(a)})`; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  const o = proj(0, 0, 0), coreA = seg(t, 1.6, 3) * (1 - .7 * seg(t, 26, 29));
  glow(o[0], o[1], 220 * o[2], '60,100,255', .45 * coreA); glow(o[0], o[1], 60 * o[2], '255,255,255', .9 * coreA);
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = `rgba(190,205,255,${(.5 - k * .13) * coreA})`; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.ellipse(o[0], o[1], (46 + k * 16) * o[2] * 1.2, (46 + k * 16) * o[2] * .42, t * (.5 + k * .3) + k, 0, Math.PI * 2); ctx.stroke(); }
  NEEDS.forEach((n, k) => { const u = seg(t, .6 + k * .12, 1.8 + k * .12); if (u <= 0 || u >= 1) return; const x = lerp(1150, o[0], eio(u)), y = lerp(150 + k * 37, o[1], eio(u)); glow(x, y, 18, n[1] ? '226,181,90' : '110,150,255', .9 * (1 - u * .4)); });
  NEEDS.forEach((n, k) => { const g = eo(seg(t, 8.4 + k * .6, 9.4 + k * .6)), a = g * (1 - seg(t, 21, 24)); if (a <= 0) { put(beamEls[k], 0, 0, 0); return; }
    const L = 200 + 300 * g, e = proj(Math.cos(n.ang) * L, 0, Math.sin(n.ang) * L), col = n[1] ? '226,181,90' : '110,150,255';
    const gr = ctx.createLinearGradient(o[0], o[1], e[0], e[1]); gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(1, `rgba(${col},${.7 * a})`); ctx.strokeStyle = gr; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
    put(beamEls[k], e[0], e[1] - 14, a, clamp(e[2] * 1.1, .7, 1.1)); });
  RING.forEach((r, k) => { const ap = seg(t, 15.5 + k * .05, 16.1 + k * .05); if (ap <= 0 || (r.real >= 0 && t > 26)) { whyEls[k].style.opacity = 0; r.al = 0; return; }
    const out = r.out ? seg(t, 18.6 + (k % 5) * .3, 19.2 + (k % 5) * .3) : 0, fade = r.real < 0 && !r.out ? 1 - seg(t, 26, 27.5) : 1, a = ap * (1 - out * .85) * fade * (1 - seg(t, 34, 35));
    const [x, y, f] = proj(...ringW(r, t)), ver = seg(t, 16.4 + k * .14, 16.8 + k * .14), col = r.out && out > .3 ? '255,107,94' : ver > .5 ? '226,181,90' : '110,150,255';
    glow(x, y, 26 * f, col, .55 * a); ctx.fillStyle = `rgba(235,240,255,${a})`; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); const sz = 5 * f; ctx.fillRect(-sz, -sz, 2 * sz, 2 * sz); ctx.restore();
    if (t < 26) { ctx.strokeStyle = `rgba(${col},${.16 * a})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(x, y); ctx.stroke(); }
    put(whyEls[k], x, y + 20, r.out ? Math.min(seg(t, 18.8 + (k % 5) * .3, 19.2 + (k % 5) * .3), 1 - seg(t, 22, 23)) : 0, 1, -50, 0); r.sx = x; r.sy = y; r.al = a; });
  const P = {}; NODES.forEach(n => P[n.id] = proj(...nodeW(n)));
  EDGES.forEach(([a, b, t0], k) => { const g = eo(seg(t, t0, t0 + .9)); if (g <= 0) return;
    const A = P[a], B = P[b]; if (!A || !B) return; const bad = a === 'n5' && b === 'n6' && t > CONF[0] && t < CONF[1];
    const col = bad ? '255,107,94' : '120,150,255', ex = lerp(A[0], B[0], g), ey = lerp(A[1], B[1], g);
    ctx.strokeStyle = `rgba(${col},${bad ? .5 + .4 * Math.sin(t * 30) : .55})`; ctx.lineWidth = 1.6 * Math.min(A[2], B[2]) * 1.1; ctx.setLineDash(bad ? [6, 6] : []); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
    if (t > t0 + .9 && !bad) for (let q = 0; q < 2; q++) { const u = ((t - t0) * .6 + q * .5 + k * .17) % 1; glow(lerp(A[0], B[0], u), lerp(A[1], B[1], u), 12, q ? '226,181,90' : '235,240,255', .9); } });
  NODES.forEach(n => { const [x, y, f] = P[n.id], a = seg(t, n.late ? 31.6 : 26.2, n.late ? 32.2 : 26.8); glow(x, y, 50 * f, '77,123,255', .35 * a); });
  ctx.globalCompositeOperation = 'source-over';
  NODES.map(n => [n, P[n.id]]).sort((a, b) => b[1][3] - a[1][3]).forEach(([n, [x, y, f]], z) => { const e = nodeEls[n.id]; e.style.zIndex = 10 + z; put(e, x, y, seg(t, n.late ? 31.6 : 26.2, n.late ? 32.2 : 26.8), clamp(f * 1.12, .78, 1.15)); });
  { const A = P.n5, B = P.n6; put(conflict, (A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 10, Math.min(seg(t, CONF[0], CONF[0] + .3), 1 - seg(t, CONF[1] - .2, CONF[1] + .2))); }
  { const k = eio(seg(t, .1, 1.4)), sh = $('#mSheet'); if (sh) { sh.style.opacity = 1 - seg(t, .9, 1.6); sh.style.transform = `scale(${1 - .95 * k})`; sh.style.display = t > 1.7 ? 'none' : 'block'; } }
  const covered = new Set(); NODES.forEach((n, i) => { const tt = n.late ? 32.8 : 27.6 + i * .45; if (t > tt) n.cov.forEach(c => covered.add(c)); });
  $$('.nd').forEach((e, k) => { e.classList.toggle('in', t > .5 + k * .1); e.classList.toggle('match', t > 9 + k * .6 && !covered.has(k)); e.classList.toggle('cov', covered.has(k));
    e.querySelector('small').textContent = covered.has(k) ? '已覆盖' : ''; });
  // 覆盖口径：动画中显示 A 环节，收束后显示双方案
  if (t >= 35.5) $('#mCov').innerHTML = `11<em>/12</em>`;
  else $('#mCov').innerHTML = `${covered.size}<em> / 7</em>`;
  const libA = $('#mNA'), libS = $('#mNS'), libSnap = $('#mSnap');
  if (libA) libA.innerHTML = '2,898 <em>个智能体</em>';
  if (libS) libS.textContent = '7,111 项技能';
  if (libSnap) libSnap.textContent = '2026-11-10 数据快照';
  $$('.ph').forEach((e, k) => { const a = PH[k][1], b = PH[k + 1] ? PH[k + 1][1] : 99; e.classList.toggle('on', t >= a && t < b); e.classList.toggle('done', t >= b); });
  $('#mLog').innerHTML = LOGS.filter(l => l[0] <= t).slice(-3).map(l => `<div><b>00:${String(Math.floor(l[0])).padStart(2, '0')}</b>${l[1]}</div>`).join('');
  $('#mClk').textContent = `00:${String(Math.floor(t)).padStart(2, '0')}`;
  const askOn = t > 20.5 && t < 26.6; $('#mAsk').classList.toggle('on', askOn); $('#mAskBar').style.width = seg(t, 20.5, 26.5) * 100 + '%';
  const slogan = $('#mSlogan');
  if (slogan) slogan.style.opacity = (askOn || t >= 36.5) ? 0 : 1;
  if (t > 26.5 && !pref) { const r = (window.UX && UX.readRun && UX.readRun()) || {}; choose(r.preferenceSeed || r.preference || 'local', true); }

  const settled = t >= 38 && covered.size >= 7;
  const doneEl = $('#mDone'), ctaEl = $('#mCta'), resultEl = $('#mResult');
  if (t >= 36.5) {
    if (resultEl) {
      resultEl.classList.add('ready');
      resultEl.style.opacity = seg(t, 36.5, 37.4);
      resultEl.style.pointerEvents = 'auto';
      if (!resultEl.dataset.built) { resultEl.dataset.built = '1'; renderResultPanel(); }
    }
  } else if (resultEl) {
    resultEl.classList.remove('ready'); resultEl.style.opacity = 0; resultEl.style.pointerEvents = 'none'; resultEl.dataset.built = '';
  }
  if (settled) {
    doneEl.classList.add('ready'); ctaEl.classList.add('ready');
    doneEl.style.opacity = seg(t, 37, 37.8);
    ctaEl.style.opacity = seg(t, 38, 38.8);
    ctaEl.style.pointerEvents = 'auto';
    writeMatchDone();
  } else {
    doneEl.classList.remove('ready'); ctaEl.classList.remove('ready');
    doneEl.style.opacity = 0; ctaEl.style.opacity = 0; ctaEl.style.pointerEvents = 'none';
  }
}

$('#mPop .x').onclick = () => $('#mPop').style.display = 'none';
const mPview = $('#mPview'), mPcontact = $('#mPcontact');
if (mPview) mPview.onclick = e => { e.stopPropagation(); toast('演示：已打开 Agent 详情（不跳外链）'); };
if (mPcontact) mPcontact.onclick = e => { e.stopPropagation(); toast('演示：已通知联系项目方'); };

ui.addEventListener('click', e => {
  const ag = e.target.closest('.ag');
  if (ag) { openAgentPop(ag, ag.dataset.ag, ''); return; }
  const el = e.target.closest('.node'); if (!el) return;
  const n = NODES.find(x => x.id === el.dataset.id), a = $('#app').getBoundingClientRect(), s = a.width / W, r = el.getBoundingClientRect();
  const st = n.stage || {};
  const names = (st.agents || []).map(x => x.name).join('、') || '—';
  pop((r.right - a.left) / s, (r.top - a.top) / s, n.late ? '旁路环节' : '已入网环节', n.name,
    `${n.role}。产出：${st.out || '—'}。Agent：${names}。`, '已入网');
});
cv.addEventListener('click', e => {
  const a = $('#app').getBoundingClientRect(), s = a.width / W, x = (e.clientX - a.left) / s, y = (e.clientY - a.top) / s;
  const r = RING.find(r => r.al > .2 && Math.hypot(r.sx - x, r.sy - y) < 18); if (!r) { $('#mPop').style.display = 'none'; return; }
  if (r.real >= 0 && NODES[r.real]) { const n = NODES[r.real]; pop(x, y, '候选智能体', n.name, n.role + '。身份核验通过，等待组网。', '候选中'); }
  else pop(x, y, '候选 ' + r.id, '候选 Agent ' + r.id, r.out ? '能力与需求不完全匹配，本轮未入选。' : '核验通过，作为备选保留。', r.out ? '未入选 · ' + r.out : '备选', !!r.out);
});
cv.style.cursor = 'pointer';
$('#mX2').onclick = () => { speed = speed === 1 ? 2 : 1; $('#mX2').textContent = speed === 1 ? '×2 速' : '×1 速'; };
const LOGS0 = LOGS.slice();
$('#mRp').onclick = () => {
  t = 0; pref = null; wrote = false; schemeTab = 'A';
  LOGS.splice(0, LOGS.length, ...LOGS0);
  NODES.forEach(fillNode);
  $$('#mAsk button').forEach(b => b.classList.remove('sel'));
  const resultEl = $('#mResult'); if (resultEl) { resultEl.dataset.built = ''; resultEl.innerHTML = ''; }
};
function loop(now) { const dt = last ? (now - last) / 1000 : 0; last = now; if (t < END) t = Math.min(END, t + dt * speed); render(); requestAnimationFrame(loop); }

window.__matchReady = true;
window.__matchSeek = function (tt) {
  t = Math.max(0, Math.min(END, +tt || 0));
  const r = (window.UX && UX.readRun && UX.readRun()) || {};
  if (r.preference && !pref) {
    pref = r.preference;
    $$('#mAsk button').forEach(b => b.classList.toggle('sel', b.dataset.v === pref));
    NODES.forEach(fillNode);
  }
  if (t > 26.5 && !pref) { choose(r.preferenceSeed || r.preference || 'local', true); }
  if (t >= 36.5) { const resultEl = $('#mResult'); if (resultEl) { resultEl.dataset.built = ''; } }
  render();
};

let looping = false;
function startLoop() {
  if (looping) return;
  looping = true;
  last = 0;
  requestAnimationFrame(loop);
}
function resetMatch() {
  t = 0; pref = null; last = 0; wrote = false; schemeTab = 'A';
  LOGS.splice(0, LOGS.length, ...LOGS0);
  NODES.forEach(fillNode);
  $$('#mAsk button').forEach(b => b.classList.remove('sel'));
  $('#mDone').classList.remove('ready');
  $('#mCta').classList.remove('ready');
  $('#mDone').style.opacity = 0; $('#mCta').style.opacity = 0;
  const resultEl = $('#mResult'); if (resultEl) { resultEl.classList.remove('ready'); resultEl.style.opacity = 0; resultEl.dataset.built = ''; resultEl.innerHTML = ''; }
  const run = (window.UX && UX.readRun && UX.readRun()) || {};
  const p = (window.UX && UX.profile && UX.profile()) || {};
  const hd = $('.hd small');
  if (hd) hd.textContent = `${run.reqId || CITY.reqId} · ${p.name || '邓义'} · ${CITY.task}`;
  const doneSmall = $('#mDone .s small');
  if (doneSmall) doneSmall.textContent = `签发给 ${p.name || '邓义'} · ${run.reqId || CITY.reqId}`;
}
window.__enterMatchAct = async function (opts) {
  opts = opts || {};
  const app = document.getElementById('app');
  const demand = document.getElementById('demandAct');
  if (demand) demand.classList.add('leaving');
  window.UX && UX.init(4, 'dark');
  if (app) { app.classList.add('match-mode'); app.classList.remove('demand-mode', 'enrich-mode'); }
  const enrich = document.getElementById('enrichAct');
  if (enrich) { enrich.classList.add('leaving'); enrich.classList.remove('on'); enrich.setAttribute('aria-hidden', 'true'); }
  document.body.classList.add('match-live');
  if (!opts.instant) await new Promise(r => setTimeout(r, 280));
  resetMatch();
  root.setAttribute('aria-hidden', 'false');
  root.classList.add('on', 'enter');
  root.classList.remove('leaving');
  startLoop();
  await new Promise(r => setTimeout(r, opts.instant ? 40 : 1000));
  root.classList.remove('enter');
  if (demand) { demand.classList.remove('on', 'enter', 'leaving'); demand.setAttribute('aria-hidden', 'true'); }
};
$('#mCta').onclick = () => { if (!$('#mCta').classList.contains('ready')) return; window.UX ? UX.goScheme() : (location.href = 'step4-组网方案.html'); };

})();
