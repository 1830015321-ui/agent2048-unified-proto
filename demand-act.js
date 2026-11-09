/* 需求幕 · 左对话 + 右需求栏（城运案例脚本驱动，根节点 #demandAct） */
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
  };

  const STATUS_LABEL = {
    idle: '待整理',
    working: '整理中',
    ready: '待确认',
    done: '已确认',
  };

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
    const conf=$('#dmConfirm'), match=$('#dmMatch'), view=$('#dmView'), exp=$('#dmExport');
    if (conf) { conf.disabled = !ready || confirmed; conf.textContent = confirmed ? '已确认' : '确认需求并开始组网'; }
    if (match) match.disabled = !confirmed;
    if (view) view.disabled = !ready;
    if (exp) exp.disabled = !ready;
    const confAll=document.getElementById('dmConfirmAll');
    if (confAll) { confAll.disabled = !ready || confirmed; confAll.textContent = confirmed ? '已确认，进入组网' : '确认需求并开始组网'; }
  }

  function syncSendEnabled() {
    const v = ($('#dmInput').value || '').trim();
    $('#dmSend').disabled = !v || state.busy;
  }

  function appendMsg(role, html, who) {
    const empty = $('#dmEmpty');
    if (empty) empty.remove();
    const wrap = document.createElement('div');
    wrap.className = 'dm-msg ' + role;
    wrap.innerHTML = `<span class="who">${who || (role === 'user' ? '你的消息' : '助手')}</span><div class="dm-bubble">${html}</div>`;
    $('#dmLog').appendChild(wrap);
    $('#dmLog').scrollTop = $('#dmLog').scrollHeight;
    return wrap;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'dm-typing';
    el.id = 'dmTyping';
    el.innerHTML = '<i></i><i></i><i></i><span>整理中</span>';
    $('#dmLog').appendChild(el);
    $('#dmLog').scrollTop = $('#dmLog').scrollHeight;
    return el;
  }

  function fillPanel(data) {
    const set = (sel, v) => { const n = $(sel); if (n) n.textContent = v; };
    set('#dmChatTitle', data.chatTitle);
    set('#dmReqTitle', data.title);
    set('#dmOrg', data.org);
    set('#dmIndustry', data.industry);
    set('#dmScale', data.scale);
    set('#dmSummary', data.summary);
    set('#dmTaskName', data.task.name);
    set('#dmTaskDesc', data.task.desc);
    set('#dmTaskUsers', data.task.users);
    set('#dmTaskExpect', data.task.expect);
    set('#dmTaskSteps', data.task.steps);
    set('#dmTaskInputs', data.task.inputs);
    set('#dmTaskReqs', data.task.reqs);

    const ul = $('#dmClarify');
    if (ul) {
      ul.innerHTML = data.clarifications.map((q, i) => `
      <li data-i="${i}">
        <p class="q">${i + 1}. ${q}</p>
        <p class="ans" id="dmAns${i}"></p>
        <button type="button" class="dm-btn-mini" data-i="${i}">提交模拟作答</button>
      </li>`).join('');
      ul.querySelectorAll('.dm-btn-mini').forEach(btn => {
        btn.onclick = () => {
          const i = +btn.dataset.i;
          const sample = i === 0
            ? '按项目正式定级为三级等保，安全建设按三级落实。'
            : '先选画面质量合格的重点道路约 80 条作为试点，其余按画质与流量筛选。';
          state.clarAnswers[i] = sample;
          const li = btn.closest('li');
          li.classList.add('answered');
          li.querySelector('.ans').textContent = '已补充：' + sample;
          toast('已记录澄清作答（演示）');
        };
      });
    }

    if ($('#dmPanelEmpty')) $('#dmPanelEmpty').hidden = true;
    if ($('#dmPanelContent')) $('#dmPanelContent').hidden = false;
    state.filled = true;
    paintFlowPlaceholder(false);
    if (typeof window.__demandOnFilled === 'function') window.__demandOnFilled(data);

    // reset clamps
    $$('.dm-field p.clamp').forEach(p => p.classList.remove('open'));
    $$('.dm-more').forEach(b => { b.textContent = '展开'; });
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

  async function runOrganize(text) {
    if (state.busy) return;
    const content = (text || '').trim();
    if (!content) return;
    state.busy = true;
    syncSendEnabled();
    $('#dmInput').value = '';
    syncSendEnabled();

    appendMsg('user', escapeHtml(content));
    setStatus('working');
    const typing = showTyping();
    await wait(900);
    typing.remove();

    const isEdu = content.includes('一所中学') || content.includes('薄弱知识点') || content.includes('分层练习');
    if (isEdu && window.ChecklistProto && ChecklistProto.bootEducationDemand) {
      state.busy = false; syncSendEnabled();
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
    // keep exact case when case text used
    state.caseData = isCase ? CASE : data;

    if (isCase) $('#dmChatTitle').textContent = CASE.chatTitle;
    appendMsg('bot', assistantHtml(state.caseData));
    fillPanel(state.caseData);
    setStatus('ready');
    state.busy = false;
    syncSendEnabled();
  }

  function fillCaseIntoInput(autoSend) {
    $('#dmInput').value = CASE.userText;
    syncSendEnabled();
    $('#dmInput').focus();
    if (autoSend) runOrganize(CASE.userText);
  }

  function openDrawer() {
    const d = state.caseData || CASE;
    $('#dmDrawerTitle').textContent = d.title + ' · v1';
    $('#dmDrawerBody').innerHTML = `
      <p><b>状态</b>：${STATUS_LABEL[state.status]}</p>
      <h4>01 组织信息</h4>
      <p>${escapeHtml(d.org)} · ${escapeHtml(d.industry)} · 规模 ${escapeHtml(d.scale)}</p>
      <h4>02 需求概述</h4>
      <p>${escapeHtml(d.summary)}</p>
      <h4>03 任务场景</h4>
      <p><b>${escapeHtml(d.task.name)}</b></p>
      <p>${escapeHtml(d.task.expect)}</p>
      <h4>04 建议澄清</h4>
      <ol>${d.clarifications.map((q, i) => `<li>${escapeHtml(q)}${state.clarAnswers[i] ? '<br><em>作答：' + escapeHtml(state.clarAnswers[i]) + '</em>' : ''}</li>`).join('')}</ol>
      <p style="margin-top:18px;color:#9A9EA6">演示报告抽屉 · 正式版可跳转导出页</p>`;
    $('#dmDrawer').hidden = false;
  }


  function paintFlowPlaceholder(confirmed) {
    const empty = $('#dmFlowEmpty');
    const body = $('#dmFlowBody');
    const meta = $('#dmFlowMeta');
    if (!empty || !body) return;
    const run = (window.UX && UX.readRun && UX.readRun()) || {};
    if (run.matchDone && (run.schemes || CITY_SCHEMES)) {
      paintFlowFromRun(run);
      return;
    }
    if (confirmed) {
      empty.hidden = true;
      body.hidden = false;
      body.innerHTML = `<div class="dm-flow-pending">
        <b>业务流程占位</b>
        <p>任务：重点道路视频事件智能识别与工单联动</p>
        <p>匹配组网后将回填：城运中心视角 7/7·26 Agent / 承办单位视角 4/5·13 Agent</p>
      </div>`;
      if (meta) meta.textContent = '待匹配';
    } else {
      empty.hidden = false;
      body.hidden = true;
      body.innerHTML = '';
      if (meta) meta.textContent = '确认后匹配';
    }
  }

  function paintFlowFromRun(run) {
    const empty = $('#dmFlowEmpty');
    const body = $('#dmFlowBody');
    const meta = $('#dmFlowMeta');
    if (!body) return;
    const schemes = run.schemes && run.schemes.length ? run.schemes : CITY_SCHEMES;
    if (empty) empty.hidden = true;
    body.hidden = false;
    if (meta) meta.textContent = '匹配已完成 · 2 方案';
    body.innerHTML = `<div class="dm-flow-done">
      <div class="dm-flow-hd">匹配已完成 · 1 个任务 · 2 个方案</div>
      <div class="dm-flow-task">任务一：${escapeHtml(run.taskName || CASE.task.name)}</div>
      ${schemes.map(s => {
        const line = s.line || (`已匹配 ${s.matched}/${s.total} 环节 · ${s.agents} 个 Agent`);
        const stages = (s.stages || []).map(st => {
          const n = typeof st === 'string' ? st : st.name;
          const gap = st && st.gap;
          const ag = st && st.agents != null ? st.agents : '';
          const samples = (st.agentNames || (st.sample ? [st.sample] : [])).slice(0, 2);
          const sampleTxt = samples.length ? ` · ${samples.join(' / ')}` : '';
          return `<li class="${gap ? 'gap' : ''}">${escapeHtml(n)}${gap ? ' · 待匹配' : (ag !== '' ? ' · ' + ag + 'A' : '')}${escapeHtml(sampleTxt)}</li>`;
        }).join('');
        const samples = (s.samples || []).join(' / ');
        return `<div class="dm-sch">
          <b>${escapeHtml(s.tab || s.title || s.id)}</b>
          <p>${escapeHtml(line)}${samples ? ' · 例：' + escapeHtml(samples) : ''}</p>
          ${stages ? `<ul>${stages}</ul>` : ''}
        </div>`;
      }).join('')}
      <p class="dm-flow-sum">合计 26+13 Agent · 整治待匹配（进度 4/5）</p>
    </div>`;
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
    const run = (window.UX && UX.readRun && UX.readRun()) || {};
    if (run.matchDone) {
      paintFlowFromRun(run);
      if (!root.querySelector('.dm-match-card')) appendMatchProgressCard(true);
    } else if (state.status === 'done') {
      paintFlowPlaceholder(true);
    }
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
      taskName: d.task.name,
      needCount: 1,
      demandStatus: 'confirmed',
      clarAnswers: { ...state.clarAnswers },
      fromDemand: true,
    });
  }

  // expand/collapse long fields
  root.addEventListener('click', e => {
    const more = e.target.closest('.dm-more');
    if (!more || !root.contains(more)) return;
    const p = document.getElementById(more.dataset.target);
    if (!p) return;
    const open = p.classList.toggle('open');
    more.textContent = open ? '收起' : '展开';
  });

  $('#dmFillCase').onclick = () => fillCaseIntoInput(false);
  $('#dmUseCase').onclick = () => fillCaseIntoInput(true);
  $('#dmSend').onclick = () => runOrganize($('#dmInput').value);
  $('#dmInput').addEventListener('input', syncSendEnabled);
  $('#dmInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!$('#dmSend').disabled) runOrganize($('#dmInput').value);
    }
  });
  $('#dmGuide').onclick = () => toast('演示：填入案例 → 发送 → 确认需求 → 匹配组网');
  $('#dmConfirm').onclick = () => {
    if (state.status !== 'ready') return;
    setStatus('done');
    paintFlowPlaceholder(true);
    toast('需求已确认');
  };
  $('#dmMatch').onclick = () => {
    if (state.status !== 'done') return;
    writeRunForMatch();
    appendMatchProgressCard(false);
    paintFlowPlaceholder(true);
    if (window.UX && UX.goEnrich) UX.goEnrich();
    else if (window.__enterEnrichAct) window.__enterEnrichAct();
  };
  $('#dmView').onclick = openDrawer;
  $('#dmExport').onclick = () => toast('已导出演示报告（HTML）');
  $('#dmDrawerClose').onclick = () => { $('#dmDrawer').hidden = true; };
  $('#dmDrawerMask').onclick = () => { $('#dmDrawer').hidden = true; };

  // resizable split
  (function enableSplit() {
    const split = $('#dmSplit');
    const chat = $('#dmChat');
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
      const pct = Math.min(62, Math.max(34, (x / shell.width) * 100));
      chat.style.flex = `0 0 ${pct}%`;
      chat.style.width = pct + '%';
    });
    const end = () => { dragging = false; split.classList.remove('dragging'); };
    split.addEventListener('pointerup', end);
    split.addEventListener('pointercancel', end);
  })();

  function resetUI() {
    state.status = 'idle';
    state.filled = false;
    state.busy = false;
    state.clarAnswers = {};
    state.caseData = null;
    $('#dmLog').innerHTML = `<div class="dm-empty" id="dmEmpty">
      <b>先在左侧描述你的需求</b>
      <p>平台会整理成结构化需求，供你确认后匹配组网。演示可一键填入城运案例。</p>
      <button type="button" class="dm-case" id="dmUseCase">使用城运案例</button>
    </div>`;
    $('#dmUseCase').onclick = () => fillCaseIntoInput(true);
    $('#dmChatTitle').textContent = '新对话';
    $('#dmReqTitle').textContent = '未命名需求';
    $('#dmPanelEmpty').hidden = false;
    $('#dmPanelContent').hidden = true;
    $('#dmInput').value = '';
    $('#dmDrawer').hidden = true;
    setStatus('idle');
    syncSendEnabled();
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
    try { document.getElementById('scroll').style.height = '0'; } catch {}
    await wait(opts.instant ? 50 : 1100);
    root.classList.remove('enter');
    window.__demandRefreshMatch && window.__demandRefreshMatch();
  };

  window.__demandRunCase = function (opts) {
    opts = opts || {};
    fillCaseIntoInput(!!opts.autoSend);
  };
  window.__demandReady = true;
  setStatus('idle');
  syncSendEnabled();
})();
