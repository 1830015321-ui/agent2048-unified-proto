/* 方案幕 · 城运双方案（对齐线上实测） */
(function () {
const root = document.getElementById('schemeAct');
if (!root) throw new Error('schemeAct missing');
const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];

const OPS = window.CITY_OPS;
if (!OPS) throw new Error('CITY_OPS missing');
const SCHEMES = OPS.schemes.map(s => ({
  id: s.id,
  tab: s.tab,
  agents: s.agents,
  score: s.score,
  matched: s.matched,
  total: s.total,
  title: s.perspective || (s.tab + '：' + s.title),
  shortTitle: s.title,
  meta: s.meta,
  fitReason: s.fitReason,
  evaluation: s.evaluation,
  stages: s.stages.map(st => [
    st.name + (st.bypass ? '（旁路）' : ''),
    st.agentCount != null ? st.agentCount : (st.agents || []).length,
    (st.agents || []).slice(0, 2).map(a => a.name).join(' / ') || null,
    st.out || '—',
    st,
  ]),
}));

const REQ = [];
OPS.schemes.forEach((s, si) => {
  s.stages.forEach(st => {
    const names = (st.agents || []).map(a => a.name).join(' / ');
    const src = st.systemSupplement ? 'g' : 'u';
    REQ.push([
      st.name,
      src,
      st.gap ? null : names,
      '',
      st.out || '—',
      st.bypass ? '旁路脱敏 / 等保' : (st.systemSupplement ? '系统补充 · 流程衔接' : '已匹配入网'),
      st,
    ]);
  });
});

$('#reqRows').innerHTML = REQ.map((r, i) => {
  const st = r[6] || {};
  if (!r[2]) {
    return `<tr class="gapr"><td class="no">${String(i + 1).padStart(2, '0')}</td><td>${r[0]}</td><td><span class="src ${r[1]}">${r[1] === 'u' ? '你提出' : '平台补全'}</span></td><td colspan="3"><span class="tag red">待匹配</span></td></tr>`;
  }
  const tag = st.systemSupplement ? '<span class="tag">系统补充</span> ' : '';
  return `<tr><td class="no">${String(i + 1).padStart(2, '0')}</td><td>${r[0]}</td><td><span class="src ${r[1]}">${r[1] === 'u' ? '你提出' : '平台补全'}</span></td><td class="ag">${tag}${r[2]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`;
}).join('');

const AG = [];
(function () {
  const seen = new Set();
  OPS.schemes.forEach(s => s.stages.forEach(st => (st.agents || []).forEach(a => {
    if (seen.has(a.name)) return;
    seen.add(a.name);
    AG.push([
      a.name,
      `${st.name} · ${a.skill || 'Skill'}`,
      a.skill || '—',
      st.out || '—',
      '政务云',
      a.uiOnly ? '系统补充' : '已测评',
    ]);
  })));
})();

$('#agRows').innerHTML = AG.map(a => `<tr><td class="ag">${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td><td>${a[3]}</td><td>${a[4]}</td><td><span class="tag green">${a[5]} · 已测评</span></td></tr>`).join('');

// 架构：城运中心主链 + 承办支链简化
(function () {
  const col = [70, 250, 450, 650, 850];
  const L = (x, y, t, s, k = '') => `<g><rect x="${x - 86}" y="${y - 30}" width="172" height="60" rx="8" fill="${k === 'c' ? '#F3F1EC' : k === 'o' ? '#FBF4E3' : k === 'g' ? '#F8EDEA' : '#fff'}" stroke="${k === 'o' ? '#EBDAB0' : k === 'c' ? '#D9D5CC' : k === 'g' ? '#E8B4AE' : '#15171C'}" stroke-width="${k ? 1 : 1.3}"/><text x="${x}" y="${y - 4}" text-anchor="middle" font-family="NSans" font-size="12.5" font-weight="500" fill="#15171C">${t}</text><text x="${x}" y="${y + 15}" text-anchor="middle" font-family="NSans" font-size="10.5" fill="#959AA3">${s}</text></g>`;
  const head = (x, t) => `<text x="${x}" y="28" text-anchor="middle" font-family="JBM" font-size="10.5" letter-spacing="2.5" fill="#959AA3">${t}</text>`;
  const arrow = (x1, y1, x2, y2, c, lab) => { const mx = (x1 + x2) / 2; return `<path d="M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2 - 6} ${y2}" fill="none" stroke="${c}" stroke-width="1.4"/><path d="M${x2 - 8} ${y2 - 4}l8 4-8 4" fill="none" stroke="${c}" stroke-width="1.4"/>${lab ? `<text x="${mx}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle" font-family="NSans" font-size="10" fill="#545A66" paint-order="stroke" stroke="#FBFAF7" stroke-width="4">${lab}</text>` : ''}`; };
  let g = head(col[0], '现有系统') + head(col[1], '质检 · 识别') + head(col[2], '证据 · 去重') + head(col[3], '指派 · 督办') + head(col[4], '承办视角');
  g += L(col[0], 110, '视频平台', '约 1.2 万路', 'c') + L(col[0], 250, '工单 / 热线', '城运管服', 'c');
  g += L(col[1], 110, '监控画面质检', '2 Agent') + L(col[1], 250, '违规行为检测', '6 Agent');
  g += L(col[2], 110, '事件证据组装', '3 Agent') + L(col[2], 250, '重复事件清洗', '2 Agent');
  g += L(col[3], 110, '责任部门指派', '2 Agent') + L(col[3], 250, '异常事件预警', '9 Agent');
  g += L(col[4], 110, '任务接收确认', '2 Agent', 'o') + L(col[4], 220, '整改核查 · 督办', '2+4 Agent', 'o') + L(col[4], 330, '违规行为整治', '待匹配', 'g');
  g += L(210, 360, '数据隐私保护', '4 Agent 旁路');
  g += arrow(col[0] + 86, 110, col[1] - 86, 110, '#15171C', '视频流') + arrow(col[0] + 86, 250, col[1] - 86, 250, '#15171C', '工单');
  g += arrow(col[1] + 86, 110, col[2] - 86, 110, '#0D3BE8', '合格点位') + arrow(col[1] + 86, 250, col[2] - 86, 110, '#0D3BE8', '告警');
  g += arrow(col[2] + 86, 110, col[2] + 86, 220, '#0D3BE8', '') + arrow(col[2] + 86, 250, col[3] - 86, 110, '#0D3BE8', '唯一事件');
  g += arrow(col[3] + 86, 110, col[4] - 86, 110, '#A67C25', '派单') + arrow(col[3] + 86, 250, col[4] - 86, 220, '#A67C25', '督办');
  g += `<text x="210" y="400" text-anchor="middle" font-family="NSans" font-size="10.5" fill="#545A66">旁路贯穿展示/导出脱敏</text>`;
  $('#arch').innerHTML = g;
})();

const CL = [
  ['数据与接口', '阶段 1', [['视频平台试点流与点位台账', '第 1 周'], ['工单接口与事件分类规则', '第 1 周'], ['热线 / 巡查工单历史样例', '第 2 周'], ['设施台账 · 经营时段 · 广告审批', '第 2 周']]],
  ['部署环境', '阶段 1', [['政务云授权环境与网络策略', '第 1 周'], ['等保定级结论（二/三级）', '第 2 周'], ['展示导出脱敏策略确认', '第 2 周']]],
  ['人员与组织', '全程', [['城运中心项目对接人', '启动会'], ['承办单位联络人清单', '第 2 周'], ['有权限的行政认定人员', '第 3 周']]],
  ['制度与规则', '阶段 2', [['职责清单与属地目录', '第 2 周'], ['督办时限与退单规则', '第 3 周'], ['试点道路筛选标准', '第 2 周']]],
  ['验收参与', '阶段 3', [['夜间 / 雨天分别测试', '第 6–7 周'], ['误报≤10% · 召回≥90% 口径验收', '第 8 周']]],
];
$('#needCl').innerHTML = CL.map(([h, s, li]) => `<div class="ci"><h4>${h}<span>${s}</span></h4><ul>${li.map(([t, w]) => `<li><i></i><span>${t}</span><em>${w}</em></li>`).join('')}</ul></div>`).join('');

const SV = [
  ['测评组网平台', '方案生成与持续匹配', ['双视角组网方案与覆盖看板', '智能体测评报告与等级查询', '整治类缺口的二期匹配提醒', '匹配进度与方案导出']],
  ['炽光时代项目团队', '一对一顾问 + 实施交付', ['专属顾问全程对接', '启动会、规则确认与排期', '视频/工单联调与试点上线', '等保与脱敏策略落地支持']],
  ['智能体项目方（多厂家）', '各自能力的交付与保障', ['Agent 授权或调用服务', '接口文档与技术支持', '按验收指标调优', '版本升级与故障响应']],
];
$('#svc').innerHTML = SV.map(([h, s, li]) => `<div class="ci"><h4>${h}<small>${s}</small></h4><ul>${li.map((t, i) => `<li><i>${String(i + 1).padStart(2, '0')}</i><span>${t}</span></li>`).join('')}</ul></div>`).join('');

const RA = [['需求确认与启动会', 'C', 'R', 'S'], ['视频 / 工单接口权限', 'R', 'C', 'C'], ['政务云环境与等保', 'R', 'C', 'S'], ['双方案 Agent 联调', 'C', 'R', 'C'], ['识别与去重调优', 'S', 'C', 'R'], ['督办与派单规则', 'C', 'R', 'C'], ['试点测试与反馈', 'R', 'C', 'C'], ['验收', 'R', 'R', 'C'], ['上线后运维', 'S', 'R', 'C']];
const RT = { R: '主', C: '配', S: '知' };
$('#raci').innerHTML = RA.map(([t, ...v]) => `<tr><td>${t}</td>${v.map(x => `<td class="c"><span class="r ${x}">${RT[x]}</span></td>`).join('')}</tr>`).join('');

const GA = [['启动与准备', '启动会 · 资料', 0, 1, ''], ['平台对接', '视频 · 工单 · 热线', .5, 2, 'b'], ['识别联调', '质检 · 五类事件', 1.5, 2, 'b'], ['派单督办配置', '职责清单 · 规则', 3, 1.5, ''], ['试点试运行', '夜间雨天测试', 4.5, 2.5, 'g'], ['验收上线', '按 08 验收', 7, 1, 'gr2']];
$('#gantt').innerHTML = `<div class="gr"><div class="l" style="font:500 10.5px JBM;letter-spacing:.16em;color:var(--ink3)">阶段</div><div class="tl">${Array.from({ length: 9 }, (_, i) => `<span>${i < 8 ? 'W' + (i + 1) : ''}</span>`).join('')}</div></div>` +
  GA.map(([n, s, a, d, c]) => `<div class="gr"><div class="l">${n}<small>${s}</small></div><div class="tl">${Array.from({ length: 9 }, () => '<span></span>').join('')}<div class="bar2 ${c}" style="left:${a / 8 * 100}%;width:${d / 8 * 100}%">${d >= 1 ? d + ' 周' : ''}</div>${n === '验收上线' ? `<div class="ms" style="left:calc(${8 / 8 * 100}% - 7px)"></div>` : ''}</div></div>`).join('');

const AC = [
  ['告警误报占比', '限定试点条件下 ≤ 10%', '夜间/雨天分别统计'],
  ['事件召回率', '≥ 90%', '人工抽检比对'],
  ['派单时效', '高置信且职责明确：首次有效识别→工单接收 ≤ 5 分钟', '系统日志'],
  ['去重效果', '同地点连续告警合并，并与热线/巡查去重', '重复工单对比'],
  ['隐私合规', '展示/导出人脸车牌按需脱敏', '抽样审计'],
  ['行政认定边界', '执法决定由有权限人员完成，系统仅辅助', '流程抽查'],
];
$('#acc').innerHTML = AC.map(([a, b, c], i) => `<tr><td class="no">${String(i + 1).padStart(2, '0')}</td><td>${a}</td><td>${b}</td><td>${c}</td><td><span class="tbd">待双方确认</span></td></tr>`).join('');

const RK = [
  ['视频点位画质不达标', '质检环节通过率低，试点缩小', '先按画质筛选重点道路；补点建议单列', '城运中心 · 炽光'],
  ['工单接口字段不一致', '派单失败或退单升高', '对齐事件分类规则与职责清单后再联调', '炽光 · 客户'],
  ['违规行为整治为系统补充', '承办视角进度 4/5，现场仍需人力协同', '画布已挂 3 个补充 Agent；持续测评补齐', '平台'],
  ['夜间/雨天误报升高', '值班被打扰', '分气象条件调阈值，设灰度阈值', '项目方'],
  ['等保定级未明确', '安全建设范围不清', '启动前确认二/三级并写入方案', '客户'],
];
$('#risk').innerHTML = RK.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td style="white-space:nowrap">${r[3]}</td></tr>`).join('');

// 在概述后插入双方案摘要块（若存在 #s1）
(function injectSchemeTabs() {
  const s1 = $('#s1');
  if (!s1 || $('#schemeTabs')) return;
  const box = document.createElement('div');
  box.id = 'schemeTabs';
  box.className = 'scheme-tabs';
  box.innerHTML = `
    <div class="st-tabs">${SCHEMES.map((s, i) => `<button type="button" class="st-tab ${i === 0 ? 'on' : ''}" data-i="${i}">${s.tab}<small>${s.agents} Agent · ${s.score} 分 · ${s.matched}/${s.total}</small></button>`).join('')}</div>
    <div class="st-body" id="stBody"></div>`;
  const kpi = s1.querySelector('.kpi');
  if (kpi) kpi.after(box);
  else s1.appendChild(box);
  function paint(i) {
    const s = SCHEMES[i];
    box.querySelectorAll('.st-tab').forEach((b, j) => b.classList.toggle('on', j === i));
    $('#stBody').innerHTML = `<h4>${s.title}</h4>
      <p class="st-note">${s.meta || ''}</p>
      <div class="st-flow">${s.stages.map(([n, a, ag, out, st]) => {
        const gap = !!(st && st.gap);
        return `<div class="st-node ${gap ? 'gap' : ''}"><b>${n}</b><span>${gap ? '待匹配' : a + ' Agent'}</span>${ag && !gap ? `<em>${ag}</em>` : ''}<small>${out}</small></div>`;
      }).join('<i>→</i>')}</div>
      ${s.id === 'B' ? '<p class="st-note">违规行为整治：待匹配 Agent；进度口径 4/5 · 13 Agent。</p>' : '<p class="st-note">含旁路：数据隐私保护 4 Agent · 系统补充 1 · 共 26 Agent。</p>'}`;
  }
  box.querySelectorAll('.st-tab').forEach(b => b.onclick = () => paint(+b.dataset.i));
  paint(0);
})();

const secs = $$('.sec[id]'), links = $$('.toc a');
root.addEventListener('scroll', () => { let cur = secs[0] && secs[0].id; secs.forEach(s => { if (s.getBoundingClientRect().top < 160) cur = s.id; }); links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur)); }, { passive: true });
root.dispatchEvent(new Event('scroll'));
const toast = m => { const t = $('#sToast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 2600); };
['#okB', '#ok2'].forEach(s => $(s).onclick = () => toast('已提交确认。顾问将联系你约启动会，双方案项目方已同步（演示）'));
$('#demo').onclick = () => toast('已发起预约演示（演示）');
$('#shareB').onclick = () => { navigator.clipboard?.writeText(location.href); toast('方案链接已复制，同事可查看（演示）'); };

function applyRunState() {
  const run = (window.UX && UX.readRun && UX.readRun()) || {};
  const profile = (window.UX && UX.profile && UX.profile()) || {};
  const prefLabel = run.preferenceLabel || ({ fast: '上线快', cheap: '成本低', local: '政务云' }[run.preference] || '');
  const prefMeta = root.querySelector('[data-pref-meta]') || root.querySelector('.hmeta div:last-child');
  if (prefMeta && prefMeta.querySelector('span') && prefMeta.querySelector('span').textContent.trim() === '偏好') {
    if (prefLabel) {
      prefMeta.hidden = false;
      const b = prefMeta.querySelector('b');
      if (b) b.textContent = prefLabel;
    } else {
      prefMeta.hidden = true;
    }
  }
  const lead = root.querySelector('#s7 .lead');
  if (lead) lead.textContent = prefLabel
    ? `按「${prefLabel}」偏好排期，共 8 周。具体日期在启动会上确认。`
    : '排期共 8 周。具体日期在启动会上确认。';
  const name = profile.name || '邓义';
  const org = run.org || profile.org || '市城市运行管理中心';
  const role = profile.role || '高级运营';
  const sid = run.reqId || profile.accountId || 'REQ-CITY-OPS-0001';
  const hm = root.querySelectorAll('.hmeta div');
  if (hm[0]) hm[0].querySelector('b').textContent = org;
  if (hm[1]) hm[1].querySelector('b').textContent = name + ' · ' + role;
  if (hm[2]) hm[2].querySelector('b').textContent = profile.accountId || 'U · CITY';
  if (hm[3]) hm[3].querySelector('b').textContent = sid;
  const sub = root.querySelector('.head .sub');
  if (sub) sub.textContent = `2 个方案 · 26+13 Agent；城运中心 ${run.coverageA || '7/7'} · 承办 ${run.coverageB || '4/5'}（整治待匹配）`;
}

function bindDemandReportHook() {
  const btn = document.getElementById('viewDemandReport');
  if (!btn || btn._bound) return;
  btn._bound = true;
  btn.onclick = () => {
    const run = (window.UX && UX.readRun && UX.readRun()) || {};
    const caseId = run.caseId || 'city-ops';
    let source = null;
    if (caseId === 'education' && window.EDU_CASE && window.EDU_CASE.demand) {
      source = JSON.parse(JSON.stringify(window.EDU_CASE.demand));
      source.caseId = 'education';
    } else if (window.CITY_OPS) {
      const c = window.CITY_OPS;
      // prefer the live demand-act session if it still holds city-ops
      source = (window.DemandReport && DemandReport.getSession().source && DemandReport.getSession().source.caseId === 'city-ops')
        ? DemandReport.getSession().source
        : null;
    }
    if (window.__demandOpenReport) {
      window.__demandOpenReport({
        includeMatch: true,
        status: 'done',
        source: source || undefined,
        updatedAt: run.updatedAt || (window.DemandReport && DemandReport.DEMO_STAMP),
        confirmedAt: run.confirmedAt || run.updatedAt || (window.DemandReport && DemandReport.DEMO_STAMP),
        matchOutcome: run.matchOutcome,
      });
      return;
    }
    if (window.DemandReport) {
      if (source) DemandReport.setSession({ source, status: 'done', includeMatch: true, updatedAt: run.updatedAt, confirmedAt: run.confirmedAt, matchOutcome: run.matchOutcome });
      DemandReport.openView({ includeMatch: true, status: 'done' });
    }
  };
}

window.__enterSchemeAct = async function (opts) {
  opts = opts || {};
  applyRunState();
  bindDemandReportHook();
  if (window.UX && UX.writeRun) UX.writeRun({ matchDone: true });
  const match = document.getElementById('matchAct');
  if (match) match.classList.add('leaving-to-scheme');
  window.UX && UX.init(4, 'light');
  document.body.classList.add('scheme-live', 'ux-unified');
  if (!opts.instant) await new Promise(r => setTimeout(r, 220));
  root.setAttribute('aria-hidden', 'false');
  root.classList.add('on', 'enter');
  await new Promise(r => setTimeout(r, opts.instant ? 40 : 900));
  root.classList.remove('enter');
  if (match) { match.classList.remove('on', 'enter'); match.setAttribute('aria-hidden', 'true'); }
  const chrome = document.getElementById('ux-chrome');
  if (chrome) chrome.classList.add('with-acts', 'sticky');
};
window.__schemeReady = true;

})();
