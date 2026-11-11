/* 用户需求报告 · 官方字段格式（右侧文档 / 查看 / 导出） */
(function () {
  const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const DEMO_STAMP = '2026.11.11 13:00';
  const ENGINE = '业务工作流 V3.0';

  const session = {
    source: null,
    status: 'idle',
    updatedAt: null,
    confirmedAt: null,
    clarAnswers: {},
    includeMatch: false,
    matchOutcome: null,
    onClarify: null,
  };

  function textOf(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v.text != null) return String(v.text);
    return String(v);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function formatStamp(input) {
    if (input == null || input === '') return '';
    if (typeof input === 'string' && /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/.test(input)) return input;
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function nowStamp() { return formatStamp(new Date()); }

  function taskLabel(i) {
    const n = i + 1;
    if (n <= 10) return '任务' + CN_NUM[n];
    return '任务' + n;
  }

  /* 只按分号、换行拆列表；顿号多在同一条目内枚举，不拆开。 */
  function splitList(v) {
    if (v == null || v === '') return [];
    if (Array.isArray(v)) {
      const out = [];
      v.forEach(item => {
        const t = textOf(item).trim();
        if (t) out.push(t);
      });
      return out;
    }
    return String(textOf(v))
      .split(/[；;\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function statusText(st) {
    if (st === 'done' || st === '已确认') return '已确认';
    if (st === 'ready' || st === '待确认') return '待确认';
    if (st === 'working' || st === '整理中') return '整理中';
    return '整理中';
  }

  function statusKey(st) {
    const t = statusText(st);
    if (t === '已确认') return 'done';
    if (t === '待确认') return 'ready';
    return 'working';
  }

  function readRun() {
    try { return (window.UX && UX.readRun && UX.readRun()) || {}; }
    catch (e) { return {}; }
  }

  function demoName() {
    try { return new URLSearchParams(location.search).get('demo') || ''; }
    catch (e) { return ''; }
  }

  function shouldIncludeMatch(explicit) {
    if (explicit === true) return true;
    if (explicit === false) return false;
    if (session.includeMatch) return true;
    const run = readRun();
    if (run.matchDone) return true;
    const d = demoName();
    return d === 'report' || d === 'scheme' || d === 'edu-match' || d === 'edu-partial' || d === 'edu-fail';
  }

  function matchPackFor(caseId, outcome) {
    if (caseId === 'city-ops' && window.CITY_OPS) return { kind: 'city', data: window.CITY_OPS };
    if (caseId === 'education' && window.EDU_CASE && window.EDU_CASE.match) {
      const pack = window.EDU_CASE.match;
      const key = outcome || (readRun().matchOutcome) || 'success';
      return { kind: 'edu', data: pack[key] || pack.success, outcome: pack[key] ? key : 'success' };
    }
    return null;
  }

  function uniquePush(map, list, agent) {
    if (!agent || !agent.name) return;
    const key = agent.name;
    if (!map[key]) {
      map[key] = {
        name: agent.name,
        intro: agent.intro || agent.description || '',
        org: agent.org || agent.vendor || agent.project || '',
        projectId: agent.projectId || '',
        skills: [],
      };
      list.push(map[key]);
    }
    const rec = map[key];
    const skills = Array.isArray(agent.skills) && agent.skills.length
      ? agent.skills
      : (agent.skill ? [agent.skill] : []);
    skills.forEach(s => {
      const t = textOf(s).trim();
      if (t && rec.skills.indexOf(t) < 0) rec.skills.push(t);
    });
  }

  function hasText(v) {
    return !!(v && String(v).trim());
  }

  function cityWorkflow(taskId, matched) {
    const pack = window.CITY_OPS;
    if (!pack || !pack.schemes) return null;
    const schemes = pack.schemes;
    const agentMap = {};
    const agents = [];
    const perspectives = schemes.map(s => {
      const stages = (s.stages || []).map(st => {
        const list = st.agents || [];
        list.forEach(a => uniquePush(agentMap, agents, a));
        return {
          name: st.name,
          gap: !!st.gap,
          agentNames: matched ? list.map(a => a.name).filter(Boolean) : [],
        };
      });
      const row = {
        title: s.perspective || ((s.tab || '') + '：' + (s.title || '')),
        total: s.total != null ? s.total : stages.length,
        stages,
      };
      if (matched) row.matched = s.matched != null ? s.matched : stages.filter(x => !x.gap).length;
      return row;
    });
    const flow = {
      matched: !!matched,
      schemeCount: perspectives.length,
      engine: ENGINE,
      perspectives,
    };
    if (matched) {
      flow.agentCount = agents.length;
      const sk = new Set();
      agents.forEach(a => (a.skills || []).forEach(s => sk.add(s)));
      flow.skillCount = sk.size;
      flow.agents = agents;
    }
    return flow;
  }

  function eduTaskWorkflow(task, matchTask, matched) {
    const plans = (task.business_dag && task.business_dag.plans) || [];
    const agentMap = {};
    const agents = [];
    const perspectives = plans.map(p => {
      const aud = (matched && matchTask && matchTask.audiences) ? matchTask.audiences[p.audience] : null;
      const nodes = (p.dag && p.dag.nodes) || [];
      const stages = nodes.map(n => {
        const hit = aud && (aud.nodes || []).find(x => x.id === n.id || x.display_name === (n.display_name || n.name));
        const list = (hit && hit.agents) || [];
        if (matched) list.forEach(a => uniquePush(agentMap, agents, a));
        return {
          name: n.display_name || n.name || n.id,
          gap: !!(hit && (hit.status === 'unmatched' || hit.gap || !(hit.agents && hit.agents.length))),
          agentNames: matched ? list.map(a => a.name).filter(Boolean) : [],
        };
      });
      const row = {
        title: p.perspective || ((p.audience || '') + '视角'),
        total: aud && aud.total != null ? aud.total : stages.length,
        stages,
      };
      if (matched && aud) row.matched = aud.matched;
      return row;
    });
    const flow = {
      matched: !!matched,
      schemeCount: perspectives.length,
      engine: ENGINE,
      perspectives,
    };
    if (matched) {
      flow.agentCount = agents.length;
      const sk = new Set();
      agents.forEach(a => (a.skills || []).forEach(s => sk.add(s)));
      flow.skillCount = sk.size;
      flow.agents = agents;
    }
    return flow;
  }

  function flowModelWorkflow(model, taskId) {
    if (!model || !model.perspectives) return null;
    let pers = model.perspectives;
    if (taskId) {
      const scoped = pers.filter(p => p.taskId === taskId);
      if (scoped.length) pers = scoped;
    }
    if (!pers.length) return null;
    return {
      matched: false,
      schemeCount: pers.length,
      engine: ENGINE,
      perspectives: pers.map(p => ({
        title: p.perspective || ((p.label || '') + (p.title ? '：' + p.title : '')),
        total: (p.nodes || []).length,
        stages: (p.nodes || []).map(n => ({
          name: n.name || n.display_name || n.id,
          gap: !!n.gap,
          agentNames: [],
        })),
      })),
    };
  }

  function customWorkflow(data) {
    const model = data && data._flowModel;
    if (model) return flowModelWorkflow(model);
    return {
      matched: false,
      schemeCount: 1,
      engine: ENGINE,
      perspectives: [{
        title: '需求发起人视角：按描述整理的演示流程',
        total: 5,
        stages: [
          { name: '描述需求', agentNames: [] },
          { name: '理解与结构化整理', agentNames: [] },
          { name: '关键事项拆解', agentNames: [] },
          { name: '使用对象确认', agentNames: [] },
          { name: '业务流程预览', agentNames: [] },
        ],
      }],
    };
  }

  function getFlowModel(source) {
    if (window.__demandGetFlowModel) {
      const m = window.__demandGetFlowModel();
      if (m) return m;
    }
    return source && source._flowModel ? source._flowModel : null;
  }

  function collectClarifications(source, answers) {
    const raw = source.clarifications;
    let list = [];
    if (Array.isArray(raw)) list = raw.map(textOf);
    else if (raw && Array.isArray(raw.suggested)) list = raw.suggested.map(textOf);
    else if (raw && Array.isArray(raw.required)) list = raw.required.map(textOf);
    return list.filter(Boolean).map((text, i) => ({
      text,
      answer: answers && answers[i] ? String(answers[i]) : '',
    }));
  }

  function cityTasks(source, matched) {
    const task = source.task || {};
    const flow = matched
      ? cityWorkflow(task.id || 'wf-city', true)
      : (flowModelWorkflow(getFlowModel(source)) || cityWorkflow(task.id || 'wf-city', false));
    if (flow) flow.matched = !!matched;
    if (!matched && flow) {
      delete flow.agentCount;
      delete flow.skillCount;
      delete flow.agents;
      (flow.perspectives || []).forEach(p => {
        delete p.matched;
        (p.stages || []).forEach(s => { s.agentNames = []; });
      });
    }
    return [{
      id: task.id || 'wf-city',
      name: task.name || source.title || '',
      desc: task.desc || '',
      users: splitList(task.users),
      expect: splitList(task.expect),
      steps: splitList(task.steps),
      inputs: splitList(task.inputs),
      reqs: splitList(task.reqs),
      missing: { steps: false, reqs: false },
      workflow: flow,
    }];
  }

  function eduTasks(demand, matched, outcome) {
    const pack = matchPackFor('education', outcome);
    const matchData = pack && pack.data;
    return (demand.tasks || []).map((task, i) => {
      const matchTask = matchData && (matchData.tasks || []).find(t => t.taskId === task.id || t.name === task.name);
      const steps = splitList(task.key_steps || task.critical_steps || task.steps);
      const reqs = splitList(task.key_requirements || task.critical_requirements || task.requirements || task.reqs);
      const hasSteps = steps.length > 0;
      const hasReqs = reqs.length > 0;
      return {
        id: task.id || ('wf' + (i + 1)),
        name: task.name || '',
        desc: textOf(task.description),
        users: splitList(task.target_users),
        expect: splitList(task.expected_results),
        steps: hasSteps ? steps : [],
        inputs: splitList(task.business_inputs),
        reqs: hasReqs ? reqs : [],
        missing: { steps: !hasSteps, reqs: !hasReqs },
        workflow: eduTaskWorkflow(task, matchTask, matched) || flowModelWorkflow(getFlowModel(demand), task.id),
      };
    });
  }

  function customTasks(source) {
    const task = source.task || {};
    return [{
      id: 'wf-custom',
      name: task.name || source.title || '用户描述需求整理',
      desc: task.desc || '',
      users: splitList(task.users),
      expect: splitList(task.expect),
      steps: splitList(task.steps),
      inputs: splitList(task.inputs),
      reqs: splitList(task.reqs),
      missing: { steps: !splitList(task.steps).length, reqs: !splitList(task.reqs).length },
      workflow: customWorkflow(source),
    }];
  }

  function build(opts) {
    opts = opts || {};
    let source = opts.source || session.source;
    const hintedId = opts.caseId || (source && source.caseId) || (readRun().caseId) || '';
    if (!source) {
      if (hintedId === 'education' && window.EDU_CASE && window.EDU_CASE.demand) {
        source = window.EDU_CASE.demand;
        source.caseId = source.caseId || 'education';
      } else if (window.__demandCitySource) {
        source = window.__demandCitySource();
      }
    }
    if (!source) return null;
    const caseId = opts.caseId || source.caseId || hintedId || 'custom';
    const status = opts.status || session.status || 'ready';
    const includeMatch = shouldIncludeMatch(opts.includeMatch);
    const outcome = opts.matchOutcome || session.matchOutcome || (readRun().matchOutcome) || null;
    const answers = opts.clarAnswers || session.clarAnswers || {};
    const updatedAt = formatStamp(opts.updatedAt || session.updatedAt) || nowStamp();
    const confirmedAt = statusText(status) === '已确认'
      ? (formatStamp(opts.confirmedAt || session.confirmedAt) || updatedAt)
      : '';

    let org = source.org || textOf(source.customer && source.customer.name) || '';
    let industry = source.industry || textOf(source.customer && source.customer.industry) || '';
    let scale = source.scale;
    if (scale == null && source.customer) {
      scale = source.customer.organization_size == null ? '未填写' : textOf(source.customer.organization_size);
    }
    if (!scale) scale = '未填写';
    const summary = textOf(source.summary);

    let tasks;
    if (caseId === 'city-ops' || (source.task && !source.tasks)) {
      tasks = cityTasks(source, includeMatch && caseId === 'city-ops');
      if (caseId !== 'city-ops' && caseId !== 'education') tasks = customTasks(source);
    } else if (caseId === 'education' || (source.tasks && source.tasks.length)) {
      tasks = eduTasks(source, includeMatch && caseId === 'education', outcome);
    } else {
      tasks = customTasks(source);
    }

    return {
      caseId,
      title: source.title || source.chatTitle || '未命名需求',
      version: 'V1',
      status: statusText(status),
      statusKey: statusKey(status),
      updatedAt,
      confirmedAt,
      org: org || '未填写',
      industry: industry || '未填写',
      scale: scale || '未填写',
      summary: summary || '未填写',
      tasks,
      clarifications: collectClarifications(source, answers),
    };
  }

  function listHtml(items, ordered) {
    if (!items || !items.length) return '';
    const tag = ordered ? 'ol' : 'ul';
    const cls = ordered ? 'rpt-steps' : 'rpt-list';
    return '<' + tag + ' class="' + cls + '">' + items.map(it => '<li>' + escapeHtml(it) + '</li>').join('') + '</' + tag + '>';
  }

  function fieldBlock(title, inner) {
    if (!inner) return '';
    return '<div class="rpt-field"><h4>' + title + '</h4>' + inner + '</div>';
  }

  function workflowCounts(flow) {
    if (!flow) return '';
    const n = flow.schemeCount != null ? flow.schemeCount : (flow.perspectives || []).length;
    if (flow.matched) {
      return '共 <b>' + n + '</b> 个方案 · ' + (flow.agentCount || 0) + ' 个 Agent · ' + (flow.skillCount || 0) + ' 个 Skill';
    }
    const stages = (flow.perspectives || []).reduce((s, p) => s + ((p.stages || []).length), 0);
    return '已生成 ' + n + ' 个视角 · 共 ' + stages + ' 个环节';
  }

  function workflowHtml(flow, mode) {
    if (!flow || !(flow.perspectives || []).length) {
      return '<div class="rpt-flow"><header><h4>业务流程</h4></header><p class="rpt-empty">流程生成后将显示在这里。</p></div>';
    }
    const pers = (flow.perspectives || []).map(p => {
      const matchLine = (flow.matched && p.matched != null)
        ? '<p class="rpt-flow-match">已匹配 ' + p.matched + '/' + (p.total != null ? p.total : (p.stages || []).length) + ' 个环节</p>'
        : '';
      const stages = (p.stages || []).map(st => {
        if (flow.matched) {
          const names = (st.agentNames || []).length
            ? st.agentNames.map(escapeHtml).join('、')
            : '<span class="rpt-gap">待匹配</span>';
          return '<li><strong>' + escapeHtml(st.name) + '</strong>：' + names + '</li>';
        }
        return '<li><strong>' + escapeHtml(st.name) + '</strong></li>';
      }).join('');
      return '<div class="rpt-persp"><h5>' + escapeHtml(p.title) + '</h5>' + matchLine + '<ol class="rpt-stages">' + stages + '</ol></div>';
    }).join('');

    let table = '';
    if (flow.matched && flow.agents && flow.agents.length) {
      const hasIntro = flow.agents.some(a => hasText(a.intro));
      const hasOrg = flow.agents.some(a => hasText(a.org));
      const rows = flow.agents.map(a => {
        const org = hasText(a.org) ? '<span class="rpt-ag-org">项目方：' + escapeHtml(a.org) + '</span>' : '';
        const skills = (a.skills || []).length ? escapeHtml(a.skills.join('、')) : '';
        return '<tr>' +
          '<td class="rpt-ag-name"><strong>' + escapeHtml(a.name) + '</strong>' + org + '</td>' +
          (hasIntro ? '<td>' + (hasText(a.intro) ? escapeHtml(a.intro) : '') + '</td>' : '') +
          '<td>' + skills + '</td>' +
          '<td class="rpt-ops"><button type="button" class="rpt-op" data-act="view" data-name="' + escapeHtml(a.name) + '">查看</button>' +
          '<button type="button" class="rpt-op" data-act="contact" data-name="' + escapeHtml(a.name) + '">联系</button></td>' +
          '</tr>';
      }).join('');
      table = '<div class="rpt-agents"><h4>Agent 清单（' + flow.agents.length + '）</h4>' +
        '<div class="rpt-table-wrap"><table class="rpt-table"><thead><tr>' +
        '<th>Agent</th>' + (hasIntro ? '<th>Agent 简介</th>' : '') + '<th>Skill 清单</th><th>操作</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    }

    return '<div class="rpt-flow">' +
      '<header><h4>业务流程</h4><span class="rpt-flow-counts">' + workflowCounts(flow) + '</span>' +
      '<span class="rpt-flow-engine">' + escapeHtml(flow.engine || ENGINE) + '</span></header>' +
      pers + table +
      '</div>';
  }

  function taskHtml(task, index, mode) {
    const i = index + 1;
    return '<article class="rpt-task" id="task-' + i + '" data-task-id="' + escapeHtml(task.id || '') + '">' +
      '<header class="rpt-task-hd"><span class="rpt-eyebrow">TASK SCENARIO / ' + pad(i) + '</span>' +
      '<h3>' + escapeHtml(taskLabel(index) + '：' + (task.name || '')) + '</h3></header>' +
      fieldBlock('任务描述', hasText(task.desc) ? '<p class="rpt-prose">' + escapeHtml(task.desc) + '</p>' : '') +
      fieldBlock('使用对象', listHtml(task.users, false)) +
      fieldBlock('预期结果', listHtml(task.expect, false)) +
      fieldBlock('关键步骤', listHtml(task.steps, true)) +
      fieldBlock('业务输入', listHtml(task.inputs, false)) +
      fieldBlock('关键要求', listHtml(task.reqs, false)) +
      workflowHtml(task.workflow, mode) +
      '</article>';
  }

  function questionsHtml(report, mode) {
    const qs = report.clarifications || [];
    if (!qs.length) return '';
    const items = qs.map((q, i) => {
          const ans = q.answer
            ? '<p class="rpt-ans">已补充：' + escapeHtml(q.answer) + '</p>'
            : (mode === 'panel' ? '<button type="button" class="dm-btn-mini rpt-clarify-btn" data-i="' + i + '">提交模拟作答</button>' : '');
          return '<li data-i="' + i + '"><p class="q">' + (i + 1) + '. ' + escapeHtml(q.text) + '</p>' + ans + '</li>';
        }).join('');
    return '<section class="rpt-sec rpt-questions" id="questions">' +
      '<header class="rpt-sec-hd"><span class="rpt-sec-no">02</span><div><p class="rpt-eyebrow">TO BE CLARIFIED</p><h2>待澄清事项</h2></div></header>' +
      '<div class="rpt-field"><h4>建议澄清</h4><ol class="rpt-steps rpt-clarify">' + items + '</ol></div></section>';
  }

  function openingHtml(report) {
    return '<div class="rpt-overview">' +
      '<div class="rpt-field"><h4>组织名称</h4><p class="rpt-prose">' + escapeHtml(report.org) + '</p></div>' +
      '<div class="rpt-field"><h4>所属行业</h4><p class="rpt-prose">' + escapeHtml(report.industry) + '</p></div>' +
      '<div class="rpt-field"><h4>组织规模</h4><p class="rpt-prose">' + escapeHtml(report.scale) + '</p></div>' +
      '<div class="rpt-field rpt-summary"><h4>需求概述</h4><p class="rpt-prose">' + escapeHtml(report.summary) + '</p></div>' +
      '</div>';
  }

  function metaHtml(report, compact) {
    const conf = report.confirmedAt ? '<span class="rpt-meta-item">确认于 ' + escapeHtml(report.confirmedAt) + '</span>' : '';
    return '<div class="rpt-meta">' +
      '<span class="rpt-status" data-st="' + escapeHtml(report.statusKey) + '">' + escapeHtml(report.status) + '</span>' +
      '<span class="rpt-meta-item">' + escapeHtml(report.version) + '</span>' +
      '<span class="rpt-meta-item">更新于 ' + escapeHtml(report.updatedAt) + '</span>' +
      conf +
      '</div>';
  }

  function documentBody(report, mode) {
    const n = (report.tasks || []).length;
    const tasks = (report.tasks || []).map((t, i) => taskHtml(t, i, mode)).join('');
    return openingHtml(report) +
      '<section class="rpt-sec rpt-tasks" id="tasks">' +
      '<header class="rpt-sec-hd"><span class="rpt-sec-no">01</span><div><p class="rpt-eyebrow">THE TASKS</p><h2>任务场景（' + n + '个）</h2></div></header>' +
      '<div class="rpt-task-list">' + tasks + '</div></section>' +
      questionsHtml(report, mode);
  }

  function panelHtml(report) {
    return '<div class="rpt-panel-doc">' +
      '<div class="rpt-doc-kicker">用户需求报告</div>' +
      metaHtml(report, true) +
      documentBody(report, 'panel') +
      '</div>';
  }

  function viewHtml(report) {
    const n = (report.tasks || []).length;
    return '<article class="rpt-view-doc">' +
      '<header class="rpt-hero">' +
      '<div class="rpt-brand"><img src="mark.png" alt=""><span>测评组网系统</span><b>用户需求报告</b></div>' +
      metaHtml(report, false) +
      '<h1>' + escapeHtml(report.title) + '</h1>' +
      '</header>' +
      '<div class="rpt-layout">' +
      '<nav class="rpt-toc" aria-label="章节导航"><div class="rpt-toc-t">目录</div>' +
      '<a href="#tasks"><span>01</span>任务场景（' + n + '个）</a>' +
      ((report.clarifications || []).length ? '<a href="#questions"><span>02</span>待澄清事项</a>' : '') +
      '</nav>' +
      '<div class="rpt-view-body">' + documentBody(report, 'view') + '</div>' +
      '</div></article>';
  }

  function exportStyles() {
    return 'body{margin:0;background:#F3F1EC;color:#15171C;font:16px/1.75 "PingFang SC","Microsoft YaHei",NSans,sans-serif;}' +
      '.rpt-view-doc{max-width:1080px;margin:0 auto;padding:36px 32px 80px}' +
      '.rpt-brand{display:flex;align-items:center;gap:10px;font:500 12px/1 "PingFang SC",sans-serif;letter-spacing:.08em;color:#5B606B}' +
      '.rpt-brand img{width:22px;height:22px;object-fit:contain}' +
      '.rpt-brand b{font:600 15px/1 "PingFang SC",sans-serif;color:#15171C;letter-spacing:.12em;margin-left:8px}' +
      '.rpt-meta{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:18px 0 16px;font:500 12.5px/1.4 "PingFang SC",sans-serif;color:#5B606B}' +
      '.rpt-status{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;border:1px solid #E3E0D8}' +
      '.rpt-status[data-st="done"]{color:#1F7A4D;background:#E8F6EE;border-color:#BFE5CF}' +
      '.rpt-status[data-st="ready"]{color:#0D3BE8;background:#EEF2FF;border-color:#C9D4FF}' +
      '.rpt-status[data-st="working"]{color:#A67C25;background:#FBF4E3;border-color:#EBDAB0}' +
      'h1{margin:0 0 28px;font:600 32px/1.3 "Songti SC","Noto Serif SC",serif;letter-spacing:.04em}' +
      '.rpt-layout{display:grid;grid-template-columns:180px 1fr;gap:36px;align-items:start}' +
      '.rpt-toc{position:sticky;top:24px;font:500 13px/1.6 "PingFang SC",sans-serif}' +
      '.rpt-toc-t{font:500 11px/1 monospace;letter-spacing:.2em;color:#9A9EA6;margin-bottom:10px}' +
      '.rpt-toc a{display:flex;gap:8px;color:#15171C;text-decoration:none;padding:6px 0;border-bottom:1px solid #E3E0D8}' +
      '.rpt-toc a span{color:#0D3BE8;font:500 11px monospace}' +
      '.rpt-overview{display:grid;gap:16px;margin-bottom:36px}' +
      '.rpt-field h4{margin:0 0 6px;font:500 11px/1 monospace;letter-spacing:.16em;color:#9A9EA6}' +
      '.rpt-prose{margin:0;white-space:pre-wrap;font:400 15px/1.8 "PingFang SC",sans-serif;color:#15171C}' +
      '.rpt-list,.rpt-steps,.rpt-stages{margin:0;padding-left:1.2em}' +
      '.rpt-list li,.rpt-steps li,.rpt-stages li{margin:0 0 4px}' +
      '.rpt-empty{margin:0;color:#9A9EA6}' +
      '.rpt-sec{margin:36px 0}' +
      '.rpt-sec-hd{display:flex;gap:14px;align-items:flex-start;margin-bottom:18px}' +
      '.rpt-sec-no{font:500 22px/1 monospace;color:#0D3BE8}' +
      '.rpt-eyebrow{margin:0 0 4px;font:500 10.5px/1 monospace;letter-spacing:.22em;color:#9A9EA6}' +
      '.rpt-sec-hd h2{margin:0;font:600 22px/1.3 "PingFang SC",sans-serif}' +
      '.rpt-task{background:#FBFAF7;border:1px solid #E3E0D8;border-radius:16px;padding:22px 24px;margin-bottom:18px}' +
      '.rpt-task-hd h3{margin:4px 0 16px;font:600 18px/1.4 "PingFang SC",sans-serif}' +
      '.rpt-field{margin:14px 0}' +
      '.rpt-flow{margin-top:18px;padding-top:14px;border-top:1px solid #E3E0D8}' +
      '.rpt-flow header{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline;margin-bottom:12px}' +
      '.rpt-flow header h4{margin:0;font:500 11px/1 monospace;letter-spacing:.16em;color:#9A9EA6}' +
      '.rpt-flow-counts,.rpt-flow-engine{font:500 12.5px "PingFang SC",sans-serif;color:#5B606B}' +
      '.rpt-flow-engine{margin-left:auto;color:#0D3BE8}' +
      '.rpt-persp{margin:0 0 16px}' +
      '.rpt-persp h5{margin:0 0 6px;font:600 14.5px "PingFang SC",sans-serif}' +
      '.rpt-flow-match{margin:0 0 6px;font:500 12.5px;color:#0D3BE8}' +
      '.rpt-gap{color:#C4473A}' +
      '.rpt-table-wrap{overflow:auto}' +
      '.rpt-table{width:100%;border-collapse:collapse;font-size:13px}' +
      '.rpt-table th{text-align:left;font:500 11px monospace;letter-spacing:.08em;color:#9A9EA6;border-bottom:1px solid #E3E0D8;padding:8px 10px}' +
      '.rpt-table td{border-bottom:1px solid #EEEBE3;padding:10px;vertical-align:top}' +
      '.rpt-ag-name{font-weight:600}.rpt-ag-name strong{display:block}.rpt-ag-org{display:block;margin-top:4px;font-size:12px;color:#9A9EA6}' +
      '.rpt-ops{white-space:nowrap}' +
      '.rpt-op{margin-right:6px;border:1px solid #E3E0D8;background:#fff;border-radius:6px;padding:4px 8px;font:500 12px "PingFang SC",sans-serif}' +
      '.rpt-clarify{list-style:none;margin:0;padding:0}' +
      '.rpt-clarify li{border:1px solid #E3E0D8;border-radius:12px;padding:12px 14px;margin:0 0 10px;background:#fff}' +
      '.rpt-ans{margin:8px 0 0;color:#1F7A4D}' +
      '@media print{.rpt-toc{display:none}.rpt-layout{display:block}.rpt-op{display:none}}' +
      '@media(max-width:800px){.rpt-layout{display:block}}';
  }

  function exportHtml(report) {
    const title = report.title + ' · 用户需求报告';
    return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + escapeHtml(title) + '</title><style>' + exportStyles() + '</style></head><body>' +
      viewHtml(report).replace(/<img src="mark.png" alt="">/g, '') +
      '<script>document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".rpt-op");if(!b)return;e.preventDefault();alert("演示态："+(b.dataset.act==="contact"?"联系项目方":"查看")+" · "+(b.dataset.name||""));});<\/script>' +
      '</body></html>';
  }

  function toast(msg) {
    if (window.__demandToast) { window.__demandToast(msg); return; }
    const host = document.getElementById('dmToast') || document.getElementById('dmReportToast');
    if (host) {
      host.textContent = msg;
      host.hidden = false;
      clearTimeout(toast._t);
      toast._t = setTimeout(() => { host.hidden = true; }, 2200);
      return;
    }
    try { console.log(msg); } catch (e) {}
  }

  function bindOps(root) {
    if (!root || root._rptOps) return;
    root._rptOps = true;
    root.addEventListener('click', e => {
      const btn = e.target.closest('.rpt-op');
      if (!btn || !root.contains(btn)) return;
      const act = btn.dataset.act;
      const name = btn.dataset.name || '该 Agent';
      toast(act === 'contact' ? ('演示态：联系项目方 · ' + name) : ('演示态：查看 · ' + name));
    });
  }

  function bindClarify(root, report) {
    if (!root) return;
    root.querySelectorAll('.rpt-clarify-btn').forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.i;
        let sample = '';
        if (typeof session.onClarify === 'function') sample = session.onClarify(i, report) || '';
        if (!sample) {
          if (report.caseId === 'city-ops') {
            sample = i === 0
              ? '按项目正式定级为三级等保，安全建设按三级落实。'
              : '先选画面质量合格的重点道路约 80 条作为试点，其余按画质与流量筛选。';
          } else if (report.caseId === 'education') {
            sample = i === 0 ? '更侧重多角色协作逻辑设计。' : '题库主要为 Excel 导出，后续可接平台接口。';
          } else {
            sample = '已记录补充说明（演示）。';
          }
        }
        session.clarAnswers[i] = sample;
        if (window.__demandOnClarified) window.__demandOnClarified(i, sample);
        paintPanel();
        toast('已记录澄清作答（演示）');
      };
    });
  }

  function ensureOverlay() {
    let el = document.getElementById('dmReportView');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'dmReportView';
    el.hidden = true;
    el.innerHTML = '<div class="rpt-mask" id="dmReportMask"></div>' +
      '<div class="rpt-stage" role="dialog" aria-modal="true" aria-labelledby="dmReportHeading">' +
      '<header class="rpt-toolbar"><div class="rpt-toolbar-title">用户需求报告</div>' +
      '<div class="rpt-toolbar-acts">' +
      '<button type="button" class="rpt-tb-btn" id="dmReportExportBtn">导出 HTML</button>' +
      '<button type="button" class="rpt-tb-btn solid" id="dmReportClose">关闭</button>' +
      '</div></header>' +
      '<div class="rpt-scroll" id="dmReportBody"></div></div>' +
      '<div class="dm-toast" id="dmReportToast" hidden></div>';
    document.body.appendChild(el);
    const close = () => closeView();
    el.querySelector('#dmReportClose').onclick = close;
    el.querySelector('#dmReportMask').onclick = close;
    el.querySelector('#dmReportExportBtn').onclick = () => download();
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' && !el.hidden) closeView();
    });
    bindOps(el);
    return el;
  }

  function paintPanel() {
    const el = document.getElementById('dmDoc');
    if (!el) return null;
    const report = build();
    if (!report) return null;
    el.innerHTML = panelHtml(report);
    bindOps(el);
    bindClarify(el, report);
    return report;
  }

  function openView(opts) {
    opts = opts || {};
    if (opts.includeMatch != null) session.includeMatch = !!opts.includeMatch;
    if (opts.status) session.status = opts.status;
    if (opts.confirmedAt) session.confirmedAt = formatStamp(opts.confirmedAt);
    if (opts.updatedAt) session.updatedAt = formatStamp(opts.updatedAt);
    if (opts.source) session.source = opts.source;
    if (opts.matchOutcome) session.matchOutcome = opts.matchOutcome;
    const report = opts.report || build(opts);
    if (!report) { toast('还没有可查看的需求报告'); return null; }
    const ov = ensureOverlay();
    const body = ov.querySelector('#dmReportBody');
    body.innerHTML = viewHtml(report);
    const h1 = body.querySelector('h1');
    if (h1) h1.id = 'dmReportHeading';
    ov.hidden = false;
    document.body.classList.add('report-view-open');
    body.scrollTop = 0;
    return report;
  }

  function closeView() {
    const ov = document.getElementById('dmReportView');
    if (ov) ov.hidden = true;
    document.body.classList.remove('report-view-open');
  }

  function safeFilePart(s) {
    return String(s || '用户需求报告').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '').slice(0, 60);
  }

  function download(opts) {
    const report = (opts && opts.report) || build(opts || {});
    if (!report) { toast('还没有可导出的需求报告'); return; }
    const html = exportHtml(report);
    const stamp = (report.updatedAt || nowStamp()).replace(/[.\s:]/g, '');
    const name = safeFilePart(report.title) + '_用户需求报告_v1_' + stamp + '.html';
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('已导出需求报告（HTML）');
  }

  function setSession(partial) {
    Object.assign(session, partial || {});
    if (session.updatedAt) session.updatedAt = formatStamp(session.updatedAt);
    if (session.confirmedAt) session.confirmedAt = formatStamp(session.confirmedAt);
  }

  function resetSession() {
    session.source = null;
    session.status = 'idle';
    session.updatedAt = null;
    session.confirmedAt = null;
    session.clarAnswers = {};
    session.includeMatch = false;
    session.matchOutcome = null;
    session.onClarify = null;
    closeView();
  }

  window.DemandReport = {
    textOf,
    splitList,
    formatStamp,
    nowStamp,
    DEMO_STAMP,
    build,
    paintPanel,
    openView,
    closeView,
    download,
    setSession,
    resetSession,
    getSession() { return session; },
    exportHtml,
  };
})();
