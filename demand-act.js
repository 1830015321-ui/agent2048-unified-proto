/* 需求幕 · 左整理/流程预览 + 右需求文档与输入（城运 / 教育 / 自定义，根节点 #demandAct） */
(function () {
  const root = document.getElementById('demandAct');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const app = document.getElementById('app');

  const CASE = {
    caseId: 'city-ops',
    chatTitle: '城市运行视频智能识别与工单联动',
    title: '城市运行视频智能识别与工单联动试点',
    org: '市城市运行管理中心',
    industry: '政务与公共服务/城市治理',
    scale: '未填写',
    scene: '城运视频识别',
    reqId: 'REQ-CITY-OPS-0001',
    userText:
      '我们是市城市运行管理中心，服务六个区，现有视频平台接入约一万两千路视频，日均受理城市管理工单约八百件。现在的问题是视频、网格巡查和热线工单相互分散，同一问题容易重复上报；核实位置、查询责任单位和人工派单耗时较长，跨部门问题还会反复退单。处置后主要靠回传照片和人工复核，难以及时发现整改不到位或同一地点反复发生的问题。希望在现有视频和城市运管服平台上，先选择画面质量合格的重点道路试点。识别占道经营、道路抛洒、井盖缺失、路面积水和疑似违规广告，关联视频点位、设施台账、允许经营时段及广告审批信息，形成带时间、地点和现场证据的待核事件。同一地点连续告警要合并，并与热线、巡查工单去重；按事件类型、属地和职责清单推荐承办单位，职责不清或证据不足的转人工确认。处置完成后，系统结合回传材料和可获取的同点位画面辅助核查，无法看清的转现场核查；对超时、退单和重复发生的事件提醒督办。先以限定试点条件下告警误报占比不超过10%、事件召回率不低于90%，以及高置信且职责明确的事件从首次有效识别到工单系统成功接收不超过五分钟为建议目标，夜间和雨天分别测试，不把系统性能等同于部门处置时限。部署在政务云授权环境，对接现有工单接口和事件分类规则。按项目正式定级落实等保建设要求，明确视频授权用途、访问权限和留存期限；对展示、导出中的人脸和车牌按需要脱敏，保留必要的受控核查凭证，行政认定和执法决定由有权限的工作人员完成。',
    summary:
      '在现有视频和城市运管服平台上，针对重点道路试点建设视频智能识别能力，自动发现占道经营、道路抛洒等城市管理事件，关联设施台账与审批信息生成带证据的待核事件，实现告警合并去重、承办单位推荐及处置后辅助核查督办。',
    clarifications: [
      '请确认“按项目正式定级”的具体等保级别（如二级或三级），以便细化安全建设方案。',
      '请确认“画面质量合格的重点道路”具体数量或筛选标准，以评估算力需求和试点规模。',
    ],
    task: {
      name: '重点道路视频事件智能识别与工单联动',
      desc:
        '我们是市城市运行管理中心，服务六个区，现有视频平台接入约一万两千路视频，日均受理城市管理工单约八百件。现在的问题是视频、网格巡查和热线工单相互分散，同一问题容易重复上报；核实位置、查询责任单位和人工派单耗时较长，跨部门问题还会反复退单。处置后主要靠回传照片和人工复核，难以及时发现整改不到位或同一地点反复发生的问题。希望在现有视频和城市运管服平台上，先选择画面质量合格的重点道路试点。识别占道经营、道路抛洒、井盖缺失、路面积水和疑似违规广告，关联视频点位、设施台账、允许经营时段及广告审批信息，形成带时间、地点和现场证据的待核事件。同一地点连续告警要合并，并与热线、巡查工单去重；按事件类型、属地和职责清单推荐承办单位，职责不清或证据不足的转人工确认。处置完成后，系统结合回传材料和可获取的同点位画面辅助核查，无法看清的转现场核查；对超时、退单和重复发生的事件提醒督办。先以限定试点条件下告警误报占比不超过10%、事件召回率不低于90%，以及高置信且职责明确的事件从首次有效识别到工单系统成功接收不超过五分钟为建议目标，夜间和雨天分别测试，不把系统性能等同于部门处置时限。部署在政务云授权环境，对接现有工单接口和事件分类规则。按项目正式定级落实等保建设要求，明确视频授权用途、访问权限和留存期限；对展示、导出中的人脸和车牌按需要脱敏，保留必要的受控核查凭证，行政认定和执法决定由有权限的工作人员完成。',
      users: '城市运行管理中心工作人员；承办单位工作人员',
      expect:
        '形成带时间、地点和现场证据的待核事件；同一地点连续告警合并，并与热线、巡查工单去重；按事件类型、属地和职责清单推荐承办单位；处置完成后结合回传材料和同点位画面辅助核查；对超时、退单和重复发生的事件提醒督办',
      steps:
        '选择画面质量合格的重点道路作为试点范围；识别占道经营、道路抛洒、井盖缺失、路面积水和疑似违规广告；关联视频点位、设施台账、允许经营时段及广告审批信息；执行同一地点连续告警合并及多源工单去重；根据职责清单推荐承办单位，职责不清或证据不足转人工确认；处置后结合回传材料和同点位画面辅助核查，无法看清转现场核查；对超时、退单和重复发生的事件进行提醒督办',
      inputs:
        '重点道路视频流；视频点位信息；设施台账；允许经营时段数据；广告审批信息；热线工单数据；网格巡查工单数据；事件分类规则；职责清单',
      reqs:
        '限定试点条件下告警误报占比不超过10%；事件召回率不低于90%；高置信且职责明确的事件从首次有效识别到工单系统成功接收不超过五分钟；夜间和雨天分别测试；不把系统性能等同于部门处置时限；行政认定和执法决定由有权限的工作人员完成',
    },
  };

  const CITY_SCHEMES = (window.CITY_OPS && window.CITY_OPS.schemes || []).map(s => ({
    id: s.id,
    tab: s.tab,
    agents: s.agents,
    score: s.score,
    matched: s.matched,
    total: s.total,
    title: s.perspective || (s.tab + '：' + s.title),
    line: `已匹配 ${s.matched}/${s.total} 环节 · ${s.agents} 个 Agent`,
    samples: (s.samples || []).slice(0, 3),
    stages: (s.stages || []).map(st => ({
      name: st.name,
      agents: st.agentCount != null ? st.agentCount : (st.agents || []).length,
      gap: !!st.gap,
      sample: (st.agents && st.agents[0] && st.agents[0].name) || '',
      agentNames: (st.agents || []).slice(0, 3).map(a => a.name),
    })),
  }));

  const state = {
    status: 'idle', // idle | working | ready | done
    filled: false,
    busy: false,
    clarAnswers: {},
    flowReady: false,
    flowModel: null,
    flowSel: null,
    flowZoom: 1,
    flowMode: null, // overview | detail
    updatedAt: null,
    confirmedAt: null,
    caseData: null,
    matchArmed: false,
    scanning: false,
  };

  const STATUS_LABEL = {
    idle: '待整理',
    working: '整理中',
    ready: '待确认',
    done: '已确认',
  };

  let orgTimer = null;
  let orgStarted = 0;
  let orgGen = 0;
  let flowAnimGen = 0;
  let flowMotion = { io: null, timers: [], gen: 0 };

  function toast(msg) {
    const el = $('#dmToast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2200);
  }

  function setStatus(st) {
    state.status = st;
    const badge = $('#dmBadge');
    badge.dataset.st = st;
    badge.textContent = STATUS_LABEL[st] || st;
    const ready = st === 'ready' || st === 'done';
    const confirmed = st === 'done';
    const opts = arguments[1] || {};
    if (st !== 'done') { state.matchArmed = false; state.scanning = false; }
    if (opts.armMatch) state.matchArmed = true;
    const armed = confirmed && state.matchArmed;
    const conf = $('#dmConfirm'), match = $('#dmMatch'), view = $('#dmView'), exp = $('#dmExport');
    if (conf) {
      conf.disabled = !ready || confirmed;
      conf.textContent = confirmed ? '已确认' : '确认需求';
      conf.classList.toggle('solid', ready && !confirmed);
      conf.classList.toggle('is-lit', ready && !confirmed);
      conf.classList.toggle('is-done', confirmed);
    }
    if (match) {
      match.disabled = !armed;
      match.textContent = '匹配组网';
      match.classList.toggle('primary', armed);
      match.classList.toggle('pending', !armed);
      if (!armed) match.classList.remove('is-armed');
      if (opts.pulse && armed) {
        match.classList.remove('is-armed');
        void match.offsetWidth;
        match.classList.add('is-armed');
      }
    }
    if (view) view.disabled = !ready;
    if (exp) exp.disabled = !ready;
    const confAll = document.getElementById('dmConfirmAll');
    if (confAll) { confAll.disabled = !ready || confirmed; confAll.textContent = confirmed ? '已确认' : '确认需求'; }
    if (confirmed && !state.confirmedAt) {
      state.confirmedAt = (window.DemandReport && DemandReport.nowStamp()) || '';
    }
    if (state.filled) paintDemandDoc();
  }

  function syncSendEnabled() {
    const v = ($('#dmInput').value || '').trim();
    $('#dmSend').disabled = !v || state.busy;
  }

  function appendMsg(role, html, who) {
    const log = $('#dmLog');
    if (!log) return null;
    log.hidden = false;
    const wrap = document.createElement('div');
    wrap.className = 'dm-msg ' + role;
    wrap.innerHTML = `<span class="who">${who || (role === 'user' ? '你的消息' : '助手')}</span><div class="dm-bubble">${html}</div>`;
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function syncReportSession(extra) {
    if (!window.DemandReport) return;
    const payload = {
      source: state.caseData,
      status: state.status,
      updatedAt: state.updatedAt,
      confirmedAt: state.confirmedAt,
      clarAnswers: state.clarAnswers,
    };
    if (extra) Object.assign(payload, extra);
    DemandReport.setSession(payload);
  }

  function paintDemandDoc() {
    if (!window.DemandReport) return;
    syncReportSession();
    DemandReport.paintPanel();
  }

  function fillPanel(data) {
    state.caseData = data;
    if (!state.updatedAt) state.updatedAt = (window.DemandReport && DemandReport.nowStamp()) || '';
    const set = (sel, v) => { const n = $(sel); if (n) n.textContent = v; };
    set('#dmChatTitle', data.chatTitle);
    set('#dmReqTitle', data.title);
    if ($('#dmPanelEmpty')) $('#dmPanelEmpty').hidden = true;
    if ($('#dmPanelContent')) $('#dmPanelContent').hidden = false;
    state.filled = true;
    paintDemandDoc();
    if (typeof window.__demandOnFilled === 'function') window.__demandOnFilled(data);
  }

  function assistantHtml(data) {
    const items = data.clarifications.map((q, i) => `<li>${q}</li>`).join('');
    return `${escapeHtml(data.summary)}
      <div class="suggest"><b>建议补充（不影响确认需求）</b><ol>${items}</ol></div>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function textOf(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v.text != null) return v.text;
    return String(v);
  }

  function prefersReduce() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function showVizEmpty() {
    if ($('#dmVizEmpty')) $('#dmVizEmpty').hidden = false;
    if ($('#dmOrgCard')) $('#dmOrgCard').hidden = true;
    if ($('#dmFlowView')) $('#dmFlowView').hidden = true;
  }

  function showOrganizeCard() {
    if ($('#dmVizEmpty')) $('#dmVizEmpty').hidden = true;
    if ($('#dmFlowView')) $('#dmFlowView').hidden = true;
    const card = $('#dmOrgCard');
    if (card) card.hidden = false;
    setOrgStep(1);
    startOrgTimer();
  }

  function setOrgStep(step) {
    const items = $$('#dmOrgSteps li');
    items.forEach(li => {
      const n = +li.dataset.step;
      li.classList.remove('is-on', 'is-wait', 'is-done');
      const icon = li.querySelector('i');
      if (n < step) {
        li.classList.add('is-done');
        if (icon) icon.textContent = '✓';
      } else if (n === step) {
        li.classList.add('is-on');
        if (icon) icon.textContent = String(n);
      } else {
        li.classList.add('is-wait');
        if (icon) icon.textContent = String(n);
      }
    });
  }

  function startOrgTimer() {
    stopOrgTimer();
    orgStarted = Date.now();
    const el = $('#dmOrgTimer');
    const tick = () => {
      if (!el) return;
      const sec = Math.max(0, Math.floor((Date.now() - orgStarted) / 1000));
      el.textContent = '已用时 ' + sec + ' 秒';
    };
    tick();
    orgTimer = setInterval(tick, 1000);
  }

  function stopOrgTimer() {
    if (orgTimer) { clearInterval(orgTimer); orgTimer = null; }
  }

  async function playOrganize(opts) {
    opts = opts || {};
    const gen = ++orgGen;
    const instant = !!opts.instant || prefersReduce();
    if (!instant) {
      showOrganizeCard();
      setStatus('working');
      if ($('#dmPanelEmpty')) $('#dmPanelEmpty').hidden = true;
      await wait(3500);
      if (gen !== orgGen) return false;
      setOrgStep(2);
    }
    if (typeof opts.onStep1 === 'function') await opts.onStep1();
    if (gen !== orgGen) return false;
    if (!instant) {
      await wait(4500);
      if (gen !== orgGen) return false;
      setOrgStep(3);
      await wait(2800);
      if (gen !== orgGen) return false;
    }
    stopOrgTimer();
    if (typeof opts.onDone === 'function') await opts.onDone();
    return gen === orgGen;
  }

  function cancelOrganize() {
    orgGen += 1;
    stopOrgTimer();
  }

  /* ---------- flow model builders ---------- */
  function modelFromCity() {
    const pack = window.CITY_OPS || {};
    const schemes = pack.schemes || [];
    return {
      title: pack.title || CASE.title,
      demo: false,
      caseId: 'city-ops',
      perspectives: schemes.map(s => ({
        id: String(s.id || s.tab),
        label: s.tab || s.short || s.title,
        title: s.title || '',
        score: s.score,
        subtitle: s.score != null ? ('业务流程 · ' + s.score + ' 分') : ('业务流程 · ' + (s.total || (s.stages || []).length) + ' 个环节'),
        perspective: s.perspective || ((s.tab || '') + '：' + (s.title || '')),
        fitReason: s.fitReason || '',
        nodes: (s.stages || []).map(st => ({
          id: st.id,
          name: st.name,
          source: st.systemSupplement || st.node_source === 'system' ? 'system' : 'user',
          supplementReason: st.supplement_reason || (st.systemSupplement ? '流程衔接' : null),
          gap: !!st.gap,
          desc: st.out || '',
          outputs: st.out ? [st.out] : [],
        })),
        edges: (s.edges || []).map(e => ({
          source: e.source,
          target: e.target,
          type: e.bypass ? 'bypass' : 'sequential',
        })),
      })),
    };
  }

  function modelFromEdu(demand) {
    const perspectives = [];
    (demand.tasks || []).forEach((task, ti) => {
      const plans = (task.business_dag && task.business_dag.plans) || [];
      plans.forEach(p => {
        const short = (p.perspective && String(p.perspective).split('：')[0]) || ((p.audience || '使用对象') + '视角');
        perspectives.push({
          id: (task.id || ('t' + ti)) + ':' + (p.plan_id || p.audience || ti),
          taskId: task.id,
          taskName: task.name,
          taskIndex: ti,
          audience: p.audience,
          label: short,
          score: p.score,
          subtitle: p.score != null ? ('业务流程 · ' + p.score + ' 分') : '业务流程',
          perspective: p.perspective || (short + '：' + (task.name || '')),
          fitReason: p.fit_reason || p.fitReason || '',
          nodes: ((p.dag && p.dag.nodes) || []).map(n => ({
            id: n.id,
            name: n.display_name || n.name || n.id,
            source: n.node_source === 'system' || (n.description && n.description.origin === 'INFERRED') ? 'system' : 'user',
            supplementReason: n.supplement_reason || null,
            desc: textOf(n.description),
            outputs: n.outputs || [],
          })),
          edges: ((p.dag && p.dag.edges) || []).map(e => ({
            source: e.source,
            target: e.target,
            type: e.type || 'sequential',
          })),
        });
      });
    });
    return {
      title: demand.title || demand.chatTitle || '教育需求',
      demo: false,
      caseId: 'education',
      perspectives,
    };
  }

  function modelFromCustom(data) {
    const desc = (data && data.task && data.task.desc) || '';
    return {
      title: (data && data.title) || '整理中的需求（演示）',
      demo: true,
      caseId: 'custom',
      perspectives: [{
        id: 'custom',
        label: '需求发起人视角',
        subtitle: '业务流程 · 演示',
        perspective: '需求发起人视角：按描述整理的演示流程',
        fitReason: '根据你刚刚输入的描述生成一条演示业务流程，便于核对环节是否完整。完整字段与真实环节请填入城运或教育案例。',
        nodes: [
          { id: 'n1', name: '描述需求', source: 'user', desc: desc.slice(0, 80) },
          { id: 'n2', name: '理解与结构化整理', source: 'system', supplementReason: '流程衔接' },
          { id: 'n3', name: '关键事项拆解', source: 'user' },
          { id: 'n4', name: '使用对象确认', source: 'user' },
          { id: 'n5', name: '业务流程预览', source: 'system', supplementReason: '流程衔接' },
        ],
        edges: [
          { source: 'n1', target: 'n2' },
          { source: 'n2', target: 'n3' },
          { source: 'n3', target: 'n4' },
          { source: 'n3', target: 'n5' },
          { source: 'n4', target: 'n5' },
        ],
      }],
    };
  }

  function buildFlowModel(demandOrData) {
    const d = demandOrData || state.caseData;
    if (!d) return null;
    const id = d.caseId;
    if (id === 'city-ops') return modelFromCity();
    if (id === 'education') return modelFromEdu(d);
    if (id === 'custom') return modelFromCustom(d);
    if (d.tasks && d.tasks.some(t => t.business_dag && t.business_dag.plans && t.business_dag.plans.length)) {
      return modelFromEdu(d);
    }
    if (d.task && (id === 'city-ops' || (d.scene && String(d.scene).indexOf('城运') >= 0))) return modelFromCity();
    return modelFromCustom(d);
  }

  function layoutFlow(nodes, edges) {
    const ids = nodes.map(n => n.id);
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
    const order = Object.fromEntries(ids.map((id, i) => [id, i]));
    const forward = (edges || []).filter(e => e.type !== 'feedback');
    const hasFeedback = (edges || []).some(e => e.type === 'feedback');
    const ins = Object.fromEntries(ids.map(id => [id, []]));
    const outs = Object.fromEntries(ids.map(id => [id, []]));
    const outEdges = Object.fromEntries(ids.map(id => [id, []]));
    forward.forEach(e => {
      if (outs[e.source]) outs[e.source].push(e.target);
      if (ins[e.target]) ins[e.target].push(e.source);
      if (outEdges[e.source]) outEdges[e.source].push(e);
    });

    const indeg = Object.fromEntries(ids.map(id => [id, (ins[id] || []).length]));
    const rank = Object.fromEntries(ids.map(id => [id, 0]));
    const q = ids.filter(id => indeg[id] === 0);
    const seen = new Set(q);
    let guard = 0;
    while (q.length && guard++ < 200) {
      const u = q.shift();
      (outs[u] || []).forEach(v => {
        rank[v] = Math.max(rank[v] || 0, (rank[u] || 0) + 1);
        indeg[v]--;
        if (indeg[v] === 0 && !seen.has(v)) { seen.add(v); q.push(v); }
      });
    }

    const downMemo = {};
    function downwardLen(id) {
      if (downMemo[id] != null) return downMemo[id];
      downMemo[id] = 1;
      const kids = outs[id] || [];
      if (kids.length) downMemo[id] = 1 + Math.max(0, ...kids.map(downwardLen));
      return downMemo[id];
    }

    const pathMemo = {};
    function bestPath(id) {
      if (pathMemo[id]) return pathMemo[id];
      let best = [id];
      let bestScore = 1;
      (outs[id] || []).forEach(v => {
        const rest = bestPath(v);
        const p = [id].concat(rest);
        const userN = p.filter(x => nodeById[x] && nodeById[x].source !== 'system').length;
        const score = p.length * 100 + userN;
        if (score > bestScore || (score === bestScore && (order[p[1]] || 0) < (order[best[1]] || 0))) {
          best = p;
          bestScore = score;
        }
      });
      return (pathMemo[id] = best);
    }

    const roots = ids.filter(id => (ins[id] || []).length === 0);
    let spinePath = [];
    let spineScore = -1;
    (roots.length ? roots : ids.slice(0, 1)).forEach(r => {
      const p = bestPath(r);
      const userN = p.filter(x => nodeById[x] && nodeById[x].source !== 'system').length;
      const score = p.length * 100 + userN;
      if (score > spineScore) { spinePath = p; spineScore = score; }
    });
    const spine = new Set(spinePath);

    function isBypassOnlySource(id) {
      if ((ins[id] || []).length) return false;
      const es = outEdges[id] || [];
      return es.length > 0 && es.every(e => e.type === 'bypass');
    }

    const row = Object.fromEntries(ids.map(id => [id, rank[id] || 0]));
    ids.forEach(id => {
      if (spine.has(id) || !isBypassOnlySource(id)) return;
      const targets = (outs[id] || []).map(v => row[v] || 0);
      if (!targets.length) return;
      row[id] = Math.max(0, Math.min(...targets) - 1);
    });

    const rows = {};
    ids.forEach(id => { (rows[row[id]] ||= []).push(id); });
    Object.keys(rows).forEach(r => {
      rows[r].sort((a, b) => (order[a] || 0) - (order[b] || 0));
    });

    function parentKey(id) {
      return (ins[id] || []).slice().sort().join(',');
    }
    function sameParents(list) {
      if (!list.length) return true;
      const k = parentKey(list[0]);
      return list.every(id => parentKey(id) === k);
    }
    function placeSides(lead, others) {
      col[lead] = 0;
      const rest = others.slice().sort((a, b) => {
        const sa = (nodeById[a] && nodeById[a].source === 'system') ? 0 : 1;
        const sb = (nodeById[b] && nodeById[b].source === 'system') ? 0 : 1;
        return sa - sb || (order[a] || 0) - (order[b] || 0);
      });
      let left = -1, right = 1;
      rest.forEach((id, i) => {
        const sys = nodeById[id] && nodeById[id].source === 'system';
        if (sys || i % 2 === 0) col[id] = left--;
        else col[id] = right++;
      });
    }

    const col = {};
    Object.keys(rows).map(Number).sort((a, b) => a - b).forEach(r => {
      const list = rows[r];
      if (list.length === 1) {
        col[list[0]] = 0;
        return;
      }
      const lens = list.map(id => downwardLen(id));
      const maxL = Math.max(...lens);
      const leaders = list.filter(id => downwardLen(id) === maxL);
      const uniqueLeader = leaders.length === 1 && maxL > 1;
      const spineOnes = list.filter(id => spine.has(id));
      const forkSpread = sameParents(list) && !uniqueLeader;
      if (forkSpread) {
        const mid = (list.length - 1) / 2;
        list.forEach((id, i) => { col[id] = i - mid; });
        return;
      }
      const lead = uniqueLeader ? leaders[0] : (spineOnes[0] || list[0]);
      placeSides(lead, list.filter(id => id !== lead));
    });

    const CARD_W = 240, CARD_H = 88, GAP_X = 64, GAP_Y = 56;
    const PAD_X = hasFeedback ? 72 : 56;
    const PAD_Y = 28, PAD_BOT = 44;
    const colVals = ids.map(id => col[id] || 0);
    const rowVals = ids.map(id => row[id] || 0);
    const minCol = Math.min(0, ...colVals);
    const maxCol = Math.max(0, ...colVals);
    const minRow = Math.min(0, ...rowVals);
    const maxRow = Math.max(0, ...rowVals);
    const SLOT = CARD_W + GAP_X;
    const width = PAD_X * 2 + (maxCol - minCol) * SLOT + CARD_W;
    const height = PAD_Y + PAD_BOT + (maxRow - minRow + 1) * CARD_H + Math.max(0, maxRow - minRow) * GAP_Y;
    const pos = {};
    ids.forEach(id => {
      pos[id] = {
        x: PAD_X + ((col[id] || 0) - minCol) * SLOT,
        y: PAD_Y + ((row[id] || 0) - minRow) * (CARD_H + GAP_Y),
        w: CARD_W,
        h: CARD_H,
      };
    });
    return { pos, width, height, cardW: CARD_W, cardH: CARD_H, row, col, spine };
  }

  function cardHitsVertical(pos, x, y1, y2, ignore) {
    const lo = Math.min(y1, y2), hi = Math.max(y1, y2);
    const pad = 6;
    for (const id in pos) {
      if (ignore && ignore[id]) continue;
      const p = pos[id];
      if (x >= p.x - pad && x <= p.x + p.w + pad) {
        if (lo < p.y + p.h + pad && hi > p.y - pad) return true;
      }
    }
    return false;
  }

  function cubic(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
    return `M ${roundPt(x1)} ${roundPt(y1)} C ${roundPt(cx1)} ${roundPt(cy1)}, ${roundPt(cx2)} ${roundPt(cy2)}, ${roundPt(x2)} ${roundPt(y2)}`;
  }

  function roundPt(n) {
    return Math.round(n * 10) / 10;
  }

  function gapBandClear(pos, x1, x2, y1, y2, ignore) {
    const loX = Math.min(x1, x2), hiX = Math.max(x1, x2);
    const loY = Math.min(y1, y2), hiY = Math.max(y1, y2);
    for (const id in pos) {
      if (ignore && ignore[id]) continue;
      const p = pos[id];
      const overlapX = Math.min(hiX, p.x + p.w) - Math.max(loX, p.x);
      const overlapY = Math.min(hiY, p.y + p.h) - Math.max(loY, p.y);
      if (overlapX > 0 && overlapY > 8) return false;
    }
    return true;
  }

  function pathDownInto(x1, y1, x2, y2) {
    const dy = Math.max(18, (y2 - y1) / 2);
    return cubic(x1, y1, x1, y1 + dy, x2, y2 - dy, x2, y2);
  }

  function pathDownThenIn(ax, y1, bx, y2) {
    const ap = Math.min(48, Math.max(16, (y2 - y1) / 3));
    return `M ${roundPt(ax)} ${roundPt(y1)} C ${roundPt(ax)} ${roundPt(y1 + ap)}, ${roundPt(ax)} ${roundPt(y2 - ap - 6)}, ${roundPt((ax + bx) / 2)} ${roundPt(y2 - ap + 4)} C ${roundPt(bx)} ${roundPt(y2 - 14)}, ${roundPt(bx)} ${roundPt(y2 - 8)}, ${roundPt(bx)} ${roundPt(y2)}`;
  }

  function arrowPath(a, b, pos, srcId, tgtId) {
    const ignore = {};
    if (srcId) ignore[srcId] = true;
    if (tgtId) ignore[tgtId] = true;
    const acx = a.x + a.w / 2;
    const bcx = b.x + b.w / 2;
    const y1 = a.y + a.h;
    const y2 = b.y;
    const dx = bcx - acx;
    const down = b.y >= a.y + a.h - 4;
    const aligned = Math.abs(dx) < 10;

    if (down && aligned && !cardHitsVertical(pos, acx, y1, y2, ignore)) {
      return { d: pathDownInto(acx, y1, bcx, y2), kind: 'down' };
    }

    if (down) {
      if (!aligned && gapBandClear(pos, acx, bcx, y1, y2, ignore)) {
        return { d: pathDownInto(acx, y1, bcx, y2), kind: 'down-offset' };
      }
      if (!aligned && !cardHitsVertical(pos, acx, y1, y2, ignore)) {
        return { d: pathDownThenIn(acx, y1, bcx, y2), kind: 'down-then-in' };
      }
      if (!aligned && !cardHitsVertical(pos, bcx, y1, y2, ignore)) {
        const ap = 16;
        return {
          d: `M ${roundPt(acx)} ${roundPt(y1)} C ${roundPt(acx)} ${roundPt(y1 + ap)}, ${roundPt(bcx)} ${roundPt(y1 + ap)}, ${roundPt(bcx)} ${roundPt(y1 + ap + 10)} C ${roundPt(bcx)} ${roundPt((y1 + y2) / 2)}, ${roundPt(bcx)} ${roundPt(y2 - 16)}, ${roundPt(bcx)} ${roundPt(y2)}`,
          kind: 'across-then-down',
        };
      }
      const rightX = Math.max(a.x + a.w, b.x + b.w) + 28;
      const leftX = Math.min(a.x, b.x) - 28;
      const preferRight = dx >= 0;
      const tryX = preferRight ? rightX : leftX;
      const altX = preferRight ? leftX : rightX;
      const sideX = !cardHitsVertical(pos, tryX, y1, y2, ignore) ? tryX : altX;
      const midY = (y1 + y2) / 2;
      const dy = 16;
      return {
        d: `M ${roundPt(acx)} ${roundPt(y1)} C ${roundPt(acx)} ${roundPt(y1 + dy)}, ${roundPt(sideX)} ${roundPt(y1 + dy)}, ${roundPt(sideX)} ${roundPt(y1 + dy + 8)} C ${roundPt(sideX)} ${roundPt(midY)}, ${roundPt(sideX)} ${roundPt(midY)}, ${roundPt(sideX)} ${roundPt(y2 - dy - 8)} C ${roundPt(sideX)} ${roundPt(y2 - dy)}, ${roundPt(bcx)} ${roundPt(y2 - dy)}, ${roundPt(bcx)} ${roundPt(y2)}`,
        kind: 'around',
      };
    }

    const ay = a.y + a.h / 2;
    const by = b.y + b.h / 2;
    if (Math.abs(ay - by) < Math.max(a.h, b.h) * 0.85) {
      const fromRight = acx <= bcx;
      const x1 = fromRight ? a.x + a.w : a.x;
      const x2 = fromRight ? b.x : b.x + b.w;
      const mid = Math.max(24, Math.abs(x2 - x1) / 2);
      const c1x = x1 + (fromRight ? mid : -mid);
      const c2x = x2 + (fromRight ? -mid : mid);
      return { d: cubic(x1, ay, c1x, ay, c2x, by, x2, by), kind: 'side' };
    }

    return { d: pathDownInto(acx, y1, bcx, y2), kind: 'fallback' };
  }

  function feedbackPath(a, b, layout, pos) {
    const midY1 = a.y + a.h / 2;
    const midY2 = b.y + b.h / 2;
    const right = {
      sideX: Math.max(a.x + a.w, b.x + b.w) + 36,
      x1: a.x + a.w,
      x2: b.x + b.w,
    };
    const left = {
      sideX: Math.min(a.x, b.x) - 36,
      x1: a.x,
      x2: b.x,
    };
    const srcCenter = a.x + a.w / 2;
    const ordered = srcCenter >= layout.width / 2 ? [right, left] : [left, right];
    const clear = (x) => x >= 12 && x <= layout.width - 12 && !cardHitsVertical(pos || {}, x, midY1, midY2, {});
    const pick = ordered.find(c => clear(c.sideX)) || ordered[0];
    const sideX = Math.max(12, Math.min(layout.width - 12, pick.sideX));
    return { d: cubic(pick.x1, midY1, sideX, midY1, sideX, midY2, pick.x2, midY2), kind: 'feedback' };
  }


  function perspectiveGroups(model) {
    const groups = [];
    const seen = new Map();
    (model.perspectives || []).forEach(p => {
      const key = p.taskName || '';
      if (!seen.has(key)) {
        const g = { title: key, taskIndex: p.taskIndex, items: [] };
        seen.set(key, g);
        groups.push(g);
      }
      seen.get(key).items.push(p);
    });
    return groups;
  }

  function planHeadline(plan) {
    if (plan.title) return plan.title;
    const p = plan.perspective || '';
    const i = p.indexOf('：');
    if (i >= 0 && i < p.length - 1) return p.slice(i + 1).trim();
    return '';
  }

  function planExcerpt(plan, max) {
    max = max || 88;
    const text = String(plan.fitReason || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    if (text.length <= max) return text;
    return text.slice(0, max - 1) + '…';
  }

  function cardSubtitle(plan) {
    if (plan.score != null) return '业务流程 · ' + plan.score + ' 分';
    return plan.subtitle || '业务流程';
  }

  function miniPreviewHtml(plan) {
    const nodes = plan.nodes || [];
    const shown = nodes.slice(0, 4);
    const more = nodes.length - shown.length;
    const parts = shown.map(n => {
      const cls = n.source === 'system' ? ' is-sys' : '';
      return `<span class="dm-fv-mini-node${cls}">${escapeHtml(n.name)}</span>`;
    });
    if (more > 0) parts.push(`<em class="dm-fv-mini-more">+${more}</em>`);
    return `<div class="dm-fv-mini is-vert" aria-hidden="true">${parts.join('<i></i>')}</div>`;
  }


  function activateFlowView(model) {
    state.flowModel = model;
    state.flowReady = true;
    if ($('#dmVizEmpty')) $('#dmVizEmpty').hidden = true;
    if ($('#dmOrgCard')) $('#dmOrgCard').hidden = true;
    const view = $('#dmFlowView');
    if (view) view.hidden = false;
    return view;
  }

  function overviewCardHtml(p, animate, index, wasSelected) {
    const headline = planHeadline(p);
    const excerpt = planExcerpt(p);
    const showHeadline = headline && headline !== p.label;
    const n = (p.nodes || []).length;
    return `<button type="button" class="dm-fv-card${animate ? ' is-enter' : ''}${wasSelected ? ' was-sel' : ''}" data-id="${escapeHtml(p.id)}" style="--i:${index}">
      <div class="dm-fv-card-label">${escapeHtml(p.label)}</div>
      <div class="dm-fv-card-sub">${escapeHtml(cardSubtitle(p))}</div>
      ${showHeadline ? `<div class="dm-fv-card-title">${escapeHtml(headline)}</div>` : ''}
      ${excerpt ? `<p class="dm-fv-card-reason">${escapeHtml(excerpt)}</p>` : ''}
      <div class="dm-fv-card-meta">共 ${n} 个环节</div>
      ${miniPreviewHtml(p)}
    </button>`;
  }

  function bindOverviewCards(view) {
    if (!view) return;
    view.querySelectorAll('.dm-fv-card').forEach(card => {
      card.onclick = () => openPerspective(card.dataset.id, { fromCard: card });
      card.addEventListener('animationend', ev => {
        if (ev.target === card) card.classList.remove('is-enter');
      });
    });
  }

  function paintOverview(model, opts) {
    opts = opts || {};
    stopFlowMotion();
    const view = $('#dmFlowView');
    if (!view) return;
    state.flowMode = 'overview';
    const groups = perspectiveGroups(model);
    const animate = !opts.quiet && !prefersReduce();
    const fromId = opts.fromId || state.flowSel;
    const groupsHtml = groups.map((g, gi) => {
      const head = g.title && groups.length > 1
        ? `<div class="dm-fv-ogroup-hd"><span>任务 ${String((g.taskIndex != null ? g.taskIndex + 1 : gi + 1)).padStart(2, '0')}</span>${escapeHtml(g.title)}</div>`
        : '';
      const cards = g.items.map((p, i) => overviewCardHtml(p, animate, gi * 4 + i, p.id === fromId)).join('');
      return `<div class="dm-fv-ogroup">${head}<div class="dm-fv-cards" data-count="${g.items.length}">${cards}</div></div>`;
    }).join('');
    view.classList.remove('is-opening-detail', 'is-leaving-detail');
    view.innerHTML = `
      <header class="dm-fv-top">
        <h2>${escapeHtml(model.title || '')}</h2>
        ${model.demo ? '<span class="dm-fv-demo">演示</span>' : ''}
      </header>
      <div class="dm-fv-overview${animate ? ' is-enter' : ''}" id="dmFvOverview">
        ${groupsHtml}
      </div>`;
    bindOverviewCards(view);
  }

  function switcherHtml(model, selId) {
    const groups = perspectiveGroups(model);
    const multiTask = groups.length > 1 && groups.some(g => g.title);
    return `<div class="dm-fv-switch-track">` + groups.map(g => {
      const lab = (multiTask && g.title)
        ? `<span class="dm-fv-switch-g" title="${escapeHtml(g.title)}">${escapeHtml(g.title)}</span>`
        : '';
      const btns = g.items.map(p => `
        <button type="button" class="dm-fv-chip${p.id === selId ? ' on' : ''}" data-id="${escapeHtml(p.id)}" aria-current="${p.id === selId ? 'true' : 'false'}">
          <b>${escapeHtml(p.label)}</b>
          <span>${escapeHtml(cardSubtitle(p))} · ${(p.nodes || []).length} 环节</span>
        </button>`).join('');
      return `<div class="dm-fv-switch-gwrap">${lab}${btns}</div>`;
    }).join('') + `</div>`;
  }

  function syncSwitcher(selId) {
    const sw = $('#dmFvSwitch');
    if (!sw) return;
    sw.querySelectorAll('button[data-id]').forEach(b => {
      const on = b.dataset.id === selId;
      b.classList.toggle('on', on);
      b.setAttribute('aria-current', on ? 'true' : 'false');
    });
  }

  function bindDetailChrome(model) {
    const back = $('#dmFvBack');
    if (back) back.onclick = () => backToOverview();
    const sw = $('#dmFvSwitch');
    if (sw) {
      sw.querySelectorAll('button[data-id]').forEach(btn => {
        btn.onclick = () => openPerspective(btn.dataset.id, { keepZoom: true });
      });
    }
  }

  function paintDetail(model, opts) {
    opts = opts || {};
    const view = $('#dmFlowView');
    if (!view) return;
    const multi = model.perspectives.length > 1;
    const selId = opts.selectId || state.flowSel || model.perspectives[0].id;
    const plan = model.perspectives.find(p => p.id === selId) || model.perspectives[0];
    state.flowMode = 'detail';
    state.flowSel = plan.id;
    const shellReady = !!(view.querySelector('#dmFvMain') && view.querySelector('.dm-fv-body.is-detail'));
    if (shellReady && (opts.quiet || opts.swapOnly)) {
      syncSwitcher(plan.id);
      if (!opts.keepZoom) state.flowZoom = 1;
      paintFlowCanvas(plan, { keepZoom: !!opts.keepZoom, animate: false });
      return;
    }
    const enter = !!opts.enter && !opts.quiet && !prefersReduce();
    view.classList.remove('is-opening-detail', 'is-leaving-detail');
    view.innerHTML = `
      <header class="dm-fv-top">
        ${multi ? '<button type="button" class="dm-fv-back" id="dmFvBack"><span aria-hidden="true">←</span>全部视角</button>' : ''}
        <h2>${escapeHtml(model.title || '')}</h2>
        ${model.demo ? '<span class="dm-fv-demo">演示</span>' : ''}
      </header>
      ${multi ? `<nav class="dm-fv-switch" id="dmFvSwitch" aria-label="切换视角">${switcherHtml(model, plan.id)}</nav>` : ''}
      <div class="dm-fv-body is-detail">
        <div class="dm-fv-main${enter ? ' is-enter' : ''}" id="dmFvMain"></div>
      </div>`;
    bindDetailChrome(model);
    const mainEl = $('#dmFvMain');
    if (mainEl && enter) {
      mainEl.addEventListener('animationend', ev => {
        if (ev.target === mainEl) mainEl.classList.remove('is-enter');
      });
    }
    if (!opts.keepZoom) state.flowZoom = 1;
    paintFlowCanvas(plan, {
      keepZoom: !!opts.keepZoom,
      animate: enter || (!opts.quiet && !prefersReduce()),
    });
  }

  async function switchDetailTo(id, opts) {
    opts = opts || {};
    const model = state.flowModel;
    if (!model) return;
    const plan = model.perspectives.find(p => p.id === id);
    if (!plan) return;
    const gen = ++flowAnimGen;
    const prevId = state.flowSel;
    const ids = model.perspectives.map(p => p.id);
    const dir = ids.indexOf(id) >= ids.indexOf(prevId) ? 1 : -1;
    state.flowSel = plan.id;
    state.flowMode = 'detail';
    syncSwitcher(plan.id);
    const main = $('#dmFvMain');
    const reduce = prefersReduce() || !!opts.quiet;
    if (!main) {
      paintDetail(model, { selectId: id, keepZoom: !!opts.keepZoom, enter: true });
      return;
    }
    const clearSwap = () => {
      main.style.opacity = '';
      main.style.transform = '';
      main.style.transition = '';
    };
    if (!reduce) {
      main.classList.remove('is-enter');
      main.style.transition = 'opacity .18s ease, transform .18s ease';
      main.style.opacity = '0';
      main.style.transform = dir > 0 ? 'translateX(-14px)' : 'translateX(14px)';
      await wait(180);
      if (gen !== flowAnimGen) return;
    }
    if (!opts.keepZoom) state.flowZoom = 1;
    paintFlowCanvas(plan, { keepZoom: !!opts.keepZoom, animate: !reduce });
    if (!reduce && main) {
      main.style.transition = 'none';
      main.style.opacity = '0';
      main.style.transform = dir > 0 ? 'translateX(14px)' : 'translateX(-14px)';
      main.getBoundingClientRect();
      main.style.transition = 'opacity .28s ease, transform .28s ease';
      main.style.opacity = '1';
      main.style.transform = 'none';
      const done = ev => {
        if (ev && ev.target !== main) return;
        if (gen !== flowAnimGen) return;
        main.removeEventListener('transitionend', done);
        clearSwap();
      };
      main.addEventListener('transitionend', done);
      wait(360).then(() => done());
    } else if (main) {
      clearSwap();
    }
  }

  function openPerspective(id, opts) {
    opts = opts || {};
    const model = state.flowModel;
    if (!model) return;
    const plan = model.perspectives.find(p => p.id === id);
    if (!plan) return;
    const fromOverview = state.flowMode === 'overview';
    const alreadyDetail = state.flowMode === 'detail';
    if (alreadyDetail && state.flowSel === id && !opts.force) return;
    if (alreadyDetail && $('#dmFvMain') && (model.perspectives.length === 1 || $('#dmFvSwitch'))) {
      switchDetailTo(id, opts);
      return;
    }
    const run = () => {
      state.flowSel = id;
      if (!opts.keepZoom) state.flowZoom = 1;
      paintDetail(model, { selectId: id, enter: true, keepZoom: !!opts.keepZoom });
    };
    if (fromOverview && !prefersReduce()) {
      const gen = ++flowAnimGen;
      const view = $('#dmFlowView');
      const card = opts.fromCard || (view && [...view.querySelectorAll('.dm-fv-card')].find(c => c.dataset.id === id));
      if (view) view.classList.add('is-opening-detail');
      if (view) {
        view.querySelectorAll('.dm-fv-card').forEach(c => {
          c.classList.toggle('is-opening', c === card);
          c.classList.toggle('is-dismiss', c !== card);
        });
      }
      wait(220).then(() => {
        if (gen !== flowAnimGen) return;
        run();
      });
      return;
    }
    run();
  }

  function backToOverview() {
    const model = state.flowModel;
    if (!model || model.perspectives.length < 2) return;
    const gen = ++flowAnimGen;
    const view = $('#dmFlowView');
    if (!prefersReduce() && view) {
      view.classList.add('is-leaving-detail');
      wait(200).then(() => {
        if (gen !== flowAnimGen) return;
        view.classList.remove('is-leaving-detail');
        paintOverview(model, { fromId: state.flowSel });
      });
      return;
    }
    paintOverview(model, { quiet: true, fromId: state.flowSel });
  }

  function paintFlowView(model, opts) {
    opts = opts || {};
    const view = activateFlowView(model);
    if (!view || !model || !model.perspectives || !model.perspectives.length) return;
    const multi = model.perspectives.length > 1;
    let mode = opts.mode;
    if (!mode) {
      if (!multi) mode = 'detail';
      else if (opts.openDetail) mode = 'detail';
      else mode = 'overview';
    }
    if (!multi) mode = 'detail';
    if (mode === 'overview') paintOverview(model, opts);
    else {
      let selId = opts.selectId || state.flowSel;
      if (!model.perspectives.some(p => p.id === selId)) selId = model.perspectives[0].id;
      paintDetail(model, Object.assign({}, opts, { selectId: selId }));
    }
  }

  function stopFlowMotion() {
    if (flowMotion.io) {
      try { flowMotion.io.disconnect(); } catch (e) {}
      flowMotion.io = null;
    }
    (flowMotion.timers || []).forEach(t => clearTimeout(t));
    flowMotion.timers = [];
    flowMotion.gen += 1;
  }

  function animateCanvasEntrance(main, layout) {
    if (!main || prefersReduce()) return;
    const nodeEls = [...main.querySelectorAll('.dm-fv-node')];
    nodeEls.sort((a, b) => {
      const ra = +(a.dataset.row || 0);
      const rb = +(b.dataset.row || 0);
      if (ra !== rb) return ra - rb;
      const la = +(a.dataset.late || 0);
      const lb = +(b.dataset.late || 0);
      if (la !== lb) return la - lb;
      return 0;
    });
    nodeEls.forEach((el, i) => {
      el.classList.add('is-enter');
      el.style.setProperty('--i', String(i));
      el.addEventListener('animationend', ev => {
        if (ev.target === el) el.classList.remove('is-enter');
      });
    });
    const paths = [...main.querySelectorAll('.dm-fv-svg path.dm-fv-edge')];
    paths.sort((a, b) => {
      const ra = +(a.dataset.row || 0);
      const rb = +(b.dataset.row || 0);
      if (ra !== rb) return ra - rb;
      const la = +(a.dataset.late || 0);
      const lb = +(b.dataset.late || 0);
      return la - lb;
    });
    paths.forEach((path, i) => {
      const late = +(path.dataset.late || 0);
      const row = +(path.dataset.row || 0);
      if (path.classList.contains('is-dashed') || path.getAttribute('stroke-dasharray')) {
        path.classList.add('is-edge-fade');
        path.style.animationDelay = (220 + row * 50 + late * 140 + i * 20) + 'ms';
        return;
      }
      let len = 0;
      try { len = path.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      const marker = path.getAttribute('marker-end');
      if (marker) path.removeAttribute('marker-end');
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.style.transition = 'none';
      path.getBoundingClientRect();
      const delay = 80 + row * 70 + late * 140;
      path.style.transition = 'stroke-dashoffset .4s ' + delay + 'ms ease-out';
      path.style.strokeDashoffset = '0';
      const restore = () => {
        if (marker) path.setAttribute('marker-end', marker);
        path.style.transition = '';
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
      };
      const t = setTimeout(restore, delay + 440);
      flowMotion.timers.push(t);
    });
  }

  function startLivingFlow(main) {
    if (!main || prefersReduce()) return;
    const svg = main.querySelector('.dm-fv-svg');
    if (!svg) return;
    svg.querySelectorAll('.dm-fv-pulse').forEach((path, i) => {
      let len = 0;
      try { len = path.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      const row = +(path.dataset.row || i);
      const mark = 12;
      path.style.setProperty('--travel', String(-(len + mark)));
      path.style.strokeDasharray = mark + ' ' + len;
      path.style.strokeDashoffset = '0';
      const dur = Math.max(1.8, Math.min(3.2, 1.2 + len / 80));
      path.style.animation = 'dmFvTravel ' + dur + 's linear infinite';
      path.style.animationDelay = (row * 0.42) + 's';
      path.classList.add('is-live');
    });
  }

  function bindScrollReveal(wrap) {
    if (!wrap || prefersReduce()) return;
    if (flowMotion.io) return;
    const wr = wrap.getBoundingClientRect();
    if (wr.height < 24) {
      const t = setTimeout(() => {
        if (!flowMotion.io) bindScrollReveal(wrap);
      }, 80);
      flowMotion.timers.push(t);
      return;
    }
    const nodes = [...wrap.querySelectorAll('.dm-fv-node')];
    nodes.forEach(n => {
      const r = n.getBoundingClientRect();
      if (r.top > wr.bottom - 28) n.classList.add('is-ahead');
    });
    if (!nodes.some(n => n.classList.contains('is-ahead'))) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('is-inview');
      });
    }, { root: wrap, threshold: 0.28, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(n => { if (n.classList.contains('is-ahead')) io.observe(n); });
    flowMotion.io = io;
  }

  function playCanvasMotion(main, layout, opts) {
    opts = opts || {};
    const gen = flowMotion.gen;
    if (prefersReduce()) return;
    const wrap = main && main.querySelector('#dmFvCanvasWrap');
    if (opts.animate) {
      requestAnimationFrame(() => {
        if (gen !== flowMotion.gen) return;
        bindScrollReveal(wrap);
        animateCanvasEntrance(main, layout);
        const t = setTimeout(() => {
          if (gen !== flowMotion.gen) return;
          startLivingFlow(main);
        }, 920);
        flowMotion.timers.push(t);
      });
    } else {
      startLivingFlow(main);
      requestAnimationFrame(() => bindScrollReveal(wrap));
    }
  }

  function paintFlowCanvas(plan, opts) {
    const main = $('#dmFvMain');
    if (!main || !plan) return;
    opts = opts || {};
    stopFlowMotion();
    const nodes = plan.nodes || [];
    const edges = plan.edges || [];
    const layout = layoutFlow(nodes, edges);
    if (!opts.keepZoom) state.flowZoom = 1;
    const score = (plan.score != null)
      ? `<div class="dm-fv-score">流程评分 ${escapeHtml(String(plan.score))} 分</div>`
      : '';

    const nodeHtml = nodes.map(n => {
      const p = layout.pos[n.id];
      if (!p) return '';
      const isSys = n.source === 'system';
      const tag = isSys
        ? ('系统补充 · ' + (n.supplementReason || '流程衔接'))
        : '来自你的需求';
      const gap = n.gap ? ' is-gap' : '';
      const cls = isSys ? 'is-sys' : 'is-user';
      const r = (layout.row && layout.row[n.id]) || 0;
      return `<article class="dm-fv-node ${cls}${gap}" data-id="${escapeHtml(n.id)}" data-row="${r}" data-late="${isSys ? 1 : 0}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px">
        <div class="nm">${escapeHtml(n.name)}</div>
        <div class="tag">${escapeHtml(n.gap ? '待匹配' : tag)}</div>
      </article>`;
    }).join('');

    const edgeDraw = edges.map((e, ei) => {
      const a = layout.pos[e.source], b = layout.pos[e.target];
      if (!a || !b) return null;
      const fb = e.type === 'feedback';
      const info = fb ? feedbackPath(a, b, layout, layout.pos) : arrowPath(a, b, layout.pos, e.source, e.target);
      const color = fb ? 'rgba(166,124,37,.85)' : 'rgba(13,59,232,.5)';
      const dash = fb ? 'stroke-dasharray="5 4"' : '';
      const marker = fb ? 'url(#dmFvMarkGold)' : 'url(#dmFvMark)';
      const late = (fb || e.type === 'bypass') ? 1 : 0;
      const row = Math.max(
        (layout.row && layout.row[e.source]) || 0,
        (layout.row && layout.row[e.target]) || 0
      );
      const srcRow = (layout.row && layout.row[e.source]) || 0;
      const mainPulse = !fb && e.type !== 'bypass';
      const edge = `<path class="dm-fv-edge${fb ? ' is-dashed' : ''}" data-row="${srcRow}" data-late="${late}" d="${info.d}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${dash} marker-end="${marker}"/>`;
      const pulse = mainPulse
        ? `<path class="dm-fv-pulse" data-row="${srcRow}" d="${info.d}" fill="none"/>`
        : '';
      return { row: srcRow, late, edge, pulse };
    }).filter(Boolean);

    const paths = edgeDraw.map(x => x.edge).join('');
    const pulses = edgeDraw.map(x => x.pulse).join('');

    main.innerHTML = `
      <div class="dm-fv-hd">
        <div>
          <h3>${escapeHtml(plan.perspective || plan.label || '')}</h3>
          <p>${escapeHtml(plan.fitReason || '')}</p>
        </div>
        ${score}
      </div>
      <div class="dm-fv-toolbar">
        <span class="cnt">共 ${nodes.length} 个环节</span>
        <div class="dm-fv-zoom">
          <button type="button" id="dmFvZoomOut" aria-label="缩小">−</button>
          <span class="pct" id="dmFvZoomPct">100%</span>
          <button type="button" id="dmFvZoomIn" aria-label="放大">+</button>
          <button type="button" id="dmFvFit">适应</button>
        </div>
      </div>
      <div class="dm-fv-canvas-wrap" id="dmFvCanvasWrap">
        <div class="dm-fv-stage" id="dmFvStage" style="width:${layout.width}px;height:${layout.height}px">
          <svg class="dm-fv-svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">
            <defs>
              <marker id="dmFvMark" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="rgba(13,59,232,.55)"/>
              </marker>
              <marker id="dmFvMarkGold" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="rgba(166,124,37,.85)"/>
              </marker>
            </defs>
            ${paths}
            ${pulses}
          </svg>
          ${nodeHtml}
          <div class="dm-fv-pop" id="dmFvPop" hidden></div>
        </div>
      </div>`;

    const wrap = $('#dmFvCanvasWrap');
    const stage = $('#dmFvStage');
    const pctEl = $('#dmFvZoomPct');
    const applyZoom = () => {
      const z = state.flowZoom;
      let spacer = wrap && wrap.querySelector('.dm-fv-spacer');
      if (wrap && stage && !spacer) {
        spacer = document.createElement('div');
        spacer.className = 'dm-fv-spacer';
        wrap.insertBefore(spacer, stage);
        spacer.appendChild(stage);
      }
      if (stage) {
        stage.style.transform = 'scale(' + z + ')';
        stage.style.transformOrigin = '0 0';
        stage.style.position = 'absolute';
        stage.style.left = '0';
        stage.style.top = '0';
      }
      if (spacer) {
        spacer.style.width = Math.ceil(layout.width * z) + 'px';
        spacer.style.height = Math.ceil(layout.height * z) + 'px';
      }
      if (pctEl) pctEl.textContent = Math.round(z * 100) + '%';
    };
    applyZoom();

    const zoomTo = z => {
      state.flowZoom = Math.max(0.4, Math.min(1.6, Math.round(z * 20) / 20));
      applyZoom();
    };
    const fit = () => {
      if (!wrap) return;
      const cw = wrap.clientWidth - 8;
      const ch = wrap.clientHeight - 8;
      if (cw <= 0 || ch <= 0) { zoomTo(1); return; }
      const z = Math.min(1, cw / layout.width, ch / layout.height);
      zoomTo(Math.max(0.4, z));
    };
    const zOut = $('#dmFvZoomOut');
    const zIn = $('#dmFvZoomIn');
    const zFit = $('#dmFvFit');
    if (zOut) zOut.onclick = () => zoomTo(state.flowZoom - 0.1);
    if (zIn) zIn.onclick = () => zoomTo(state.flowZoom + 0.1);
    if (zFit) zFit.onclick = fit;

    const pop = $('#dmFvPop');
    main.querySelectorAll('.dm-fv-node').forEach(nodeEl => {
      nodeEl.onclick = () => {
        const n = nodes.find(x => x.id === nodeEl.dataset.id);
        if (!n || !pop) return;
        const desc = n.desc || '';
        const out = (n.outputs || []).join('；');
        if (!desc && !out) { pop.hidden = true; return; }
        pop.hidden = false;
        pop.innerHTML = `<b>${escapeHtml(n.name)}</b>
          ${desc ? `<div>${escapeHtml(desc)}</div>` : ''}
          ${out ? `<div class="out">产出 · ${escapeHtml(out)}</div>` : ''}
          <button type="button">关闭</button>`;
        const p = layout.pos[n.id];
        const popW = 240;
        let left = p ? p.x + p.w + 8 : 12;
        let top = Math.max(8, p ? p.y : 12);
        if (left + popW > layout.width) left = Math.max(8, (p ? p.x : 12) - popW - 8);
        if (p && top + 140 > layout.height) top = Math.max(8, p.y - 8);
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';
        pop.querySelector('button').onclick = ev => { ev.stopPropagation(); pop.hidden = true; };
      };
    });

    playCanvasMotion(main, layout, { animate: !!opts.animate });
  }


  function showProcess(model) {
    if (!model) return;
    flowAnimGen += 1;
    state.flowMode = null;
    state.flowSel = null;
    state.flowZoom = 1;
    paintFlowView(model, {
      mode: (model.perspectives && model.perspectives.length > 1) ? 'overview' : 'detail',
      enter: true,
    });
    if (state.filled) paintDemandDoc();
  }

  async function runOrganize(text) {
    if (state.busy) return;
    const content = (text || '').trim();
    if (!content) return;
    state.busy = true;
    syncSendEnabled();
    $('#dmInput').value = '';
    syncSendEnabled();

    appendMsg('user', escapeHtml(content));
    if ($('#dmPanelEmpty')) $('#dmPanelEmpty').hidden = true;

    const isEdu = content.includes('一所中学') || content.includes('薄弱知识点') || content.includes('分层练习');
    if (isEdu && window.ChecklistProto && ChecklistProto.bootEducationDemand) {
      state.busy = false;
      syncSendEnabled();
      window.ChecklistProto.bootEducationDemand({ autoSend: true });
      return;
    }

    const isCase = content.includes('市城市运行管理中心') || content.includes('一万两千路');
    const data = isCase ? CASE : {
      ...CASE,
      chatTitle: '自定义需求',
      title: '整理中的需求（演示）',
      org: ((window.UX && UX.profile() || {}).org) || '未填写',
      industry: '未填写',
      summary: '已根据你的描述生成初步需求摘要（演示）。完整字段演示请使用城运案例。',
      clarifications: [
        '请补充组织所属行业，便于匹配同类方案。',
        '请补充期望的上线范围或试点规模。',
      ],
      task: {
        name: '用户描述需求整理',
        desc: content,
        users: '需求发起人及相关业务人员',
        expect: '形成可确认的结构化需求，并进入匹配组网。',
        steps: '描述需求；平台整理；确认；匹配组网',
        inputs: '用户自然语言描述',
        reqs: '演示环境不调用真实后端',
      },
      scene: '自定义需求',
      caseId: 'custom',
    };
    state.caseData = isCase ? CASE : data;
    state.flowReady = false;

    const ok = await playOrganize({
      onStep1: async () => {
        if (isCase && $('#dmChatTitle')) $('#dmChatTitle').textContent = CASE.chatTitle;
        appendMsg('bot', assistantHtml(state.caseData));
        fillPanel(state.caseData);
      },
      onDone: async () => {
        const model = isCase ? modelFromCity() : modelFromCustom(state.caseData);
        showProcess(model);
        setStatus('ready');
      },
    });
    state.busy = false;
    syncSendEnabled();
    if (!ok) return;
  }

  function fillCaseIntoInput(autoSend) {
    $('#dmInput').value = CASE.userText;
    syncSendEnabled();
    $('#dmInput').focus();
    if (autoSend) runOrganize(CASE.userText);
  }

  function openReport(opts) {
    opts = opts || {};
    syncReportSession(opts);
    if (window.DemandReport) DemandReport.openView(opts);
  }

  function exportReport(opts) {
    syncReportSession(opts || {});
    if (window.DemandReport) DemandReport.download(opts || {});
    else toast('已导出演示报告（HTML）');
  }

  function appendMatchProgressCard(done) {
    const exist = root.querySelector('.dm-match-card');
    if (exist) exist.remove();
    const schemes = CITY_SCHEMES;
    const html = `<div class="dm-match-card">
      <div class="hd">${done ? '匹配已完成' : '正在匹配'} · 1 个任务 · 2 个方案</div>
      <div class="task">任务一：${escapeHtml(CASE.task.name)}</div>
      ${schemes.map(s => `<div class="row"><b>${escapeHtml(s.tab)}</b><span>${escapeHtml(s.title.split('：')[1] || s.title)}</span><em>${escapeHtml(s.line)}</em></div>`).join('')}
    </div>`;
    appendMsg('bot', html, '匹配进度');
  }

  window.__demandRefreshMatch = function () {
    // 左栏在提需求阶段展示业务流程预览；匹配结果走组网幕
  };

  function writeRunForMatch() {
    const d = state.caseData || CASE;
    if (!(window.UX && UX.writeRun)) return;
    UX.writeRun({
      reqId: d.reqId || CASE.reqId,
      caseId: d.caseId || 'city-ops',
      scene: d.scene || '城运视频识别',
      title: d.title,
      chatTitle: d.chatTitle,
      org: d.org,
      industry: d.industry,
      scale: d.scale,
      summary: d.summary,
      taskName: (d.task && d.task.name) || d.taskName,
      needCount: (d.tasks && d.tasks.length) || 1,
      demandStatus: 'confirmed',
      clarAnswers: { ...state.clarAnswers },
      fromDemand: true,
      updatedAt: state.updatedAt,
      confirmedAt: state.confirmedAt,
    });
  }

  root.addEventListener('click', e => {
    const more = e.target.closest('.dm-more');
    if (!more || !root.contains(more)) return;
    const p = document.getElementById(more.dataset.target);
    if (!p) return;
    const open = p.classList.toggle('open');
    more.textContent = open ? '收起' : '展开';
  });

  function bindUseCase() {
    const btn = $('#dmUseCase');
    if (btn) btn.onclick = () => fillCaseIntoInput(true);
  }

  if ($('#dmFillCase')) $('#dmFillCase').onclick = () => fillCaseIntoInput(false);
  bindUseCase();
  $('#dmSend').onclick = () => runOrganize($('#dmInput').value);
  $('#dmInput').addEventListener('input', syncSendEnabled);
  $('#dmInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!$('#dmSend').disabled) runOrganize($('#dmInput').value);
    }
  });
  function prefersReduce() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function armMatch(pulse) {
    state.matchArmed = true;
    state.scanning = false;
    setStatus('done', { armMatch: true, pulse: !!pulse });
    toast('已核对，可以匹配组网');
  }

  async function playConfirmScan() {
    const viz = $('#dmViz');
    const gen = ++flowAnimGen;
    state.scanning = true;
    if (!viz || prefersReduce()) return;

    let layer = $('#dmConfirmScan');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'dmConfirmScan';
      layer.className = 'dm-scan';
      layer.innerHTML = '<i class="dm-scan-veil"></i><i class="dm-scan-beam"></i><i class="dm-scan-line"></i><b class="dm-scan-ok">业务流程已核对</b>';
      layer.setAttribute('aria-hidden', 'true');
      viz.appendChild(layer);
    }
    layer.classList.remove('on', 'is-ok');
    void layer.offsetWidth;
    layer.classList.add('on');

    const scroller = $('#dmFvCanvasWrap') || $('#dmFvOverview');
    const targets = $$('.dm-fv-node, .dm-fv-card');
    const dur = targets.length ? Math.max(1600, Math.min(2400, 420 + targets.length * 180)) : 1800;

    const highlight = (async () => {
      if (!targets.length) return;
      const step = dur / targets.length;
      for (let i = 0; i < targets.length; i++) {
        if (gen !== flowAnimGen) return;
        const n = targets[i];
        n.classList.add('is-scanning');
        await wait(step);
        if (gen !== flowAnimGen) return;
        n.classList.remove('is-scanning');
        n.classList.add('is-scanned');
      }
    })();

    const scroll = (async () => {
      if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 8) {
        await wait(dur);
        return;
      }
      const start = scroller.scrollTop;
      const end = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const t0 = performance.now();
      await new Promise(resolve => {
        const tick = now => {
          if (gen !== flowAnimGen) { resolve(); return; }
          const p = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          scroller.scrollTop = start + (end - start) * e;
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    })();

    await Promise.all([highlight, scroll]);
    if (gen !== flowAnimGen) return;
    layer.classList.add('is-ok');
    await wait(prefersReduce() ? 0 : 720);
    if (gen !== flowAnimGen) return;
    layer.classList.remove('on', 'is-ok');
  }

  $('#dmGuide').onclick = () => toast('演示：在右侧描述或填入案例 → 左侧整理并生成流程 → 确认需求，再点匹配组网');

  async function confirmDemandOnly() {
    if (state.status !== 'ready' || state.scanning) return;
    setStatus('done');
    toast('正在核对业务流程');
    try { await playConfirmScan(); }
    finally {
      if (state.status === 'done' && !state.matchArmed) armMatch(true);
    }
  }

  // 捕获阶段先处理「确认需求」，阻止后续脚本把它当成开始组网并翻页
  document.addEventListener('click', e => {
    const btn = e.target && e.target.closest && e.target.closest('#dmConfirm');
    if (!btn || !root.contains(btn)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (btn.disabled) return;
    confirmDemandOnly();
  }, true);

  $('#dmMatch').onclick = () => {
    if (state.status !== 'done' || !state.matchArmed) return;
    writeRunForMatch();
    appendMatchProgressCard(false);
    if (window.UX && UX.goMatch) UX.goMatch();
    else if (window.__enterMatchAct) window.__enterMatchAct();
  };
  $('#dmView').onclick = () => openReport();
  $('#dmExport').onclick = () => exportReport();
  if ($('#dmDrawerClose')) $('#dmDrawerClose').onclick = () => { if ($('#dmDrawer')) $('#dmDrawer').hidden = true; };
  if ($('#dmDrawerMask')) $('#dmDrawerMask').onclick = () => { if ($('#dmDrawer')) $('#dmDrawer').hidden = true; };

  (function enableSplit() {
    const split = $('#dmSplit');
    const viz = $('#dmViz');
    if (!split || !viz) return;
    let dragging = false;
    split.addEventListener('pointerdown', e => {
      dragging = true;
      split.classList.add('dragging');
      split.setPointerCapture(e.pointerId);
    });
    split.addEventListener('pointermove', e => {
      if (!dragging) return;
      const shell = root.querySelector('.dm-shell').getBoundingClientRect();
      const x = e.clientX - shell.left;
      const pct = Math.min(70, Math.max(48, (x / shell.width) * 100));
      viz.style.flex = `0 0 ${pct}%`;
      viz.style.width = pct + '%';
    });
    const end = () => { dragging = false; split.classList.remove('dragging'); };
    split.addEventListener('pointerup', end);
    split.addEventListener('pointercancel', end);
  })();

  const PANEL_EMPTY_HTML = `<b>在这里描述你的需求</b>
      <p>平台会整理成结构化需求文档，左侧同步理解需求并生成业务流程。演示可一键填入案例。</p>
      <div class="dm-case-row">
        <button type="button" class="dm-case" id="dmUseCase">使用城运案例</button>
      </div>`;

  function resetUI() {
    cancelOrganize();
    state.status = 'idle';
    state.filled = false;
    state.busy = false;
    state.clarAnswers = {};
    state.caseData = null;
    state.updatedAt = null;
    state.confirmedAt = null;
    state.flowReady = false;
    state.flowModel = null;
    state.flowSel = null;
    state.flowZoom = 1;
    state.flowMode = null;
    flowAnimGen += 1;
    stopFlowMotion();
    const log = $('#dmLog');
    if (log) { log.innerHTML = ''; log.hidden = true; }
    if ($('#dmChatTitle')) $('#dmChatTitle').textContent = '新对话';
    if ($('#dmReqTitle')) $('#dmReqTitle').textContent = '未命名需求';
    const empty = $('#dmPanelEmpty');
    if (empty) {
      empty.hidden = false;
      empty.innerHTML = PANEL_EMPTY_HTML;
      bindUseCase();
    }
    if ($('#dmPanelContent')) $('#dmPanelContent').hidden = true;
    if ($('#dmInput')) $('#dmInput').value = '';
    if ($('#dmDrawer')) $('#dmDrawer').hidden = true;
    if (window.DemandReport) DemandReport.resetSession();
    showVizEmpty();
    const timer = $('#dmOrgTimer');
    if (timer) timer.textContent = '已用时 0 秒';
    setOrgStep(1);
    setStatus('idle');
    syncSendEnabled();
    if (window.__demandChecklistReset) window.__demandChecklistReset();
    if (window.ChecklistProto && ChecklistProto.ensureDemandHooks) ChecklistProto.ensureDemandHooks();
  }

  let entered = false;
  window.__enterDemandAct = async function (opts) {
    opts = opts || {};
    if (entered && !opts.force) {
      root.classList.add('on');
      if (app) app.classList.add('demand-mode');
      window.UX && UX.init(2, 'light');
      return;
    }
    if (opts.force) resetUI();
    entered = true;
    const after = document.getElementById('after');
    if (after) after.classList.add('leaving');
    window.UX && UX.init(2, 'light');
    if (!opts.instant) await wait(180);
    if (app) {
      app.classList.add('demand-mode');
      app.classList.remove('enrich-mode', 'match-mode');
    }
    document.body.classList.add('demand-live');
    document.body.classList.remove('enrich-live', 'match-live', 'scheme-live');
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('on', 'enter');
    root.classList.remove('leaving-to-enrich', 'leaving');
    try { document.getElementById('scroll').style.height = '0'; } catch (e) {}
    await wait(opts.instant ? 50 : 1100);
    root.classList.remove('enter');
    window.__demandRefreshMatch && window.__demandRefreshMatch();
  };

  window.__demandRunCase = function (opts) {
    opts = opts || {};
    fillCaseIntoInput(!!opts.autoSend);
  };

  window.__demandPlayOrganize = function (opts) {
    state.busy = true;
    syncSendEnabled();
    state.flowReady = false;
    return playOrganize(opts).then(ok => {
      state.busy = false;
      syncSendEnabled();
      return ok;
    });
  };

  window.__demandShowProcess = function (modelOrDemand) {
    const model = modelOrDemand && modelOrDemand.perspectives
      ? modelOrDemand
      : buildFlowModel(modelOrDemand);
    if (!model) return;
    const view = $('#dmFlowView');
    const already = state.flowReady && view && !view.hidden && state.flowMode;
    if (already) {
      state.flowModel = model;
      const still = (model.perspectives || []).some(p => p.id === state.flowSel);
      if (state.flowMode === 'detail' && still) {
        /* keep current detail; avoid flashing when right-side task cards re-render */
      } else if (state.flowMode === 'overview') {
        /* keep overview as-is */
      } else {
        paintFlowView(model, { mode: 'overview', quiet: true });
      }
    } else {
      showProcess(model);
    }
    if (state.status === 'working' || state.status === 'idle') setStatus('ready');
  };

  window.__demandSelectPerspective = function (taskId, audience) {
    if (!state.flowReady || !state.flowModel) return;
    const hit = (state.flowModel.perspectives || []).find(p =>
      (taskId && p.taskId === taskId && (!audience || p.audience === audience)) ||
      (audience && p.audience === audience && (!taskId || p.taskId === taskId))
    );
    if (hit) openPerspective(hit.id, { keepZoom: state.flowMode === 'detail' });
  };

  window.__demandJumpFlow = function (kind, opts) {
    opts = opts || {};
    if (kind === 'education' && window.ChecklistProto && ChecklistProto.bootEducationDemand) {
      window.ChecklistProto.bootEducationDemand({ autoSend: true, instant: true });
      return;
    }
    state.caseData = CASE;
    state.flowReady = true;
    const stamp = opts.stamp || (window.DemandReport && DemandReport.DEMO_STAMP) || (window.DemandReport && DemandReport.nowStamp());
    if (!state.updatedAt) state.updatedAt = stamp;
    appendMsg('user', escapeHtml(CASE.userText));
    appendMsg('bot', assistantHtml(CASE));
    fillPanel(CASE);
    showProcess(modelFromCity());
    if (opts.confirmed) {
      state.confirmedAt = opts.stamp || stamp;
      setStatus('done', { armMatch: true });
    } else {
      setStatus('ready');
    }
    state.busy = false;
    syncSendEnabled();
    if (opts.includeMatch && window.DemandReport) {
      DemandReport.setSession({ includeMatch: true, status: state.status, confirmedAt: state.confirmedAt, updatedAt: state.updatedAt, source: CASE });
    }
    if (opts.openReport) openReport({ includeMatch: !!opts.includeMatch, status: state.status, updatedAt: state.updatedAt, confirmedAt: state.confirmedAt, source: CASE });
  };

  window.__demandAdoptSource = function (data, status) {
    if (!data) return;
    state.caseData = data;
    state.filled = true;
    if (!state.updatedAt) state.updatedAt = (window.DemandReport && DemandReport.nowStamp()) || '';
    if (data.caseId === 'education' && !state.confirmedAt && status === 'done') {
      state.confirmedAt = (window.DemandReport && DemandReport.nowStamp()) || '';
    }
    if (status) setStatus(status, status === 'done' ? { armMatch: true } : {});
    else paintDemandDoc();
  };
  window.__demandGetClarAnswers = function () { return state.clarAnswers; };
  window.__demandGetFlowModel = function () { return state.flowModel; };
  window.__demandToast = toast;
  window.__demandSetStatus = setStatus;
  window.__demandOpenReport = openReport;
  window.__demandExportReport = exportReport;
  window.__demandPaintDoc = paintDemandDoc;
  window.__demandOnClarified = function (i, sample) {
    state.clarAnswers[i] = sample;
  };
  window.__demandCitySource = function () { return CASE; };
  window.__demandReady = true;
  setStatus('idle');
  syncSendEnabled();
})();
