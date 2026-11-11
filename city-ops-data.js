/* 城运双方案权威数据：画布芯片原文（线上对话页）为准；覆盖旧导出表 agent 字段 */
window.CITY_OPS = {
  "caseId": "city-ops",
  "reqId": "REQ-CITY-OPS-0001",
  "task": "重点道路视频事件智能识别与工单联动",
  "title": "城市运行视频智能识别与工单联动试点",
  "chatTitle": "城市运行视频智能识别与工单联动",
  "org": "市城市运行管理中心",
  "industry": "政务与公共服务/城市治理",
  "clarifications": [
    "请确认“按项目正式定级”的具体等保级别（如二级或三级），以便细化安全建设方案。",
    "请确认“画面质量合格的重点道路”具体数量或筛选标准，以评估算力需求和试点规模。"
  ],
  "agentsTotal": 39,
  "skillsTotal": 36,
  "libraryAgents": 3000,
  "librarySkills": 10000,
  "libraryAgentsLabel": "3000+",
  "librarySkillsLabel": "10000+",
  "librarySnapshot": "2026-11-10 数据快照",
  "agentsLabel": "26+13 Agent",
  "schemes": [
    {
      "id": "A",
      "tab": "城运中心视角",
      "short": "城运中心",
      "title": "重点道路视频事件智能识别与全流程闭环管控",
      "perspective": "城运中心视角：重点道路视频事件智能识别与全流程闭环管控",
      "fitReason": "本方案聚焦城运中心统筹职能。首先筛选合格视频点位并开展五类事件智能识别，随后关联设施台账等多源数据生成带证据的待核事件。通过算法实现同地点告警合并及跨渠道工单去重，依据职责清单自动推荐承办单位。最后建立督办机制，对超时、退单及重复发生事件进行预警，确保误报率与召回率达标，同时落实等保与隐私脱敏要求。",
      "agents": 26,
      "score": 100,
      "matched": 7,
      "total": 7,
      "meta": "7 个环节 · 6 条连线 · 系统补充 1",
      "evaluation": {
        "total": 100,
        "dimensions": [
          {
            "key": "completeness",
            "label": "任务完整性",
            "score": 5,
            "reason": "覆盖了所有预期成果和用户关键步骤，包括识别、关联、去重、派单、督办及安全合规。"
          },
          {
            "key": "reasonableness",
            "label": "任务合理性",
            "score": 5,
            "reason": "节点划分清晰，无过度拆解，安全合规作为独立节点体现行业硬性要求，合理。"
          },
          {
            "key": "dependency",
            "label": "依赖正确性",
            "score": 5,
            "reason": "数据流向符合业务逻辑，从点位筛选到最终督办，依赖关系正确且必要。"
          },
          {
            "key": "feasibility",
            "label": "业务可行性",
            "score": 5,
            "reason": "基于现有平台和接口，流程可落地，明确了人工介入点和自动化边界，可行性高。"
          }
        ]
      },
      "stages": [
        {
          "id": "n1",
          "name": "监控画面质检",
          "out": "合格试点视频点位列表",
          "agents": [
            {
              "name": "43 LENS",
              "projectId": "en7i1zsn3bgd",
              "skill": "筛选有效镜头素材",
              "skillDesc": "通过动态交互分镜表过滤过程噪音，仅呈现当前确认的有效镜头以替代海量素材的人工筛选",
              "skills": [
                "筛选有效镜头素材"
              ]
            },
            {
              "name": "PHOTOV.STUDIO",
              "projectId": "md9tobgficng",
              "skill": "全面评审影像质量并提供改进建议",
              "skillDesc": "依据专业标准或用户经验对影像进行多维度质量评估，直接给出体系化指导及具体的改进意见。",
              "skills": [
                "全面评审影像质量并提供改进建议"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 2
        },
        {
          "id": "n2",
          "name": "违规行为检测",
          "out": "原始事件告警记录",
          "agents": [
            {
              "name": "rebucca",
              "projectId": "7m9zwjwijdy6",
              "skill": "接入多路视频并执行智能布控分析",
              "skillDesc": "替用户通过GB28181/RTSP协议接入多路视频流，利用YOLO小模型检测与OpenAI兼容大模型复核进行实时智能分析，最终生成包含截图的结构化报警信息。",
              "skills": [
                "接入多路视频并执行智能布控分析"
              ]
            },
            {
              "name": "发生了什么（Whatshappend）",
              "projectId": "eva9cqs704bf",
              "skill": "实时监测视频事件",
              "skillDesc": "替使用者持续监控视频流，自动识别其中的关键事件并发出警报，免除人工长时间值守的需要，帮助使用者节省人力成本并确保不漏掉重要信息。",
              "skills": [
                "实时监测视频事件"
              ]
            },
            {
              "name": "深瞳金砖银行智算解决方案",
              "projectId": "q59asso8346n",
              "skill": "生成视频告警数据",
              "skillDesc": "为使用者完成对边缘设备视频数据的AI分析及中心二次校验，依据告警规则产出最终的告警数据结果。",
              "skills": [
                "生成视频告警数据"
              ]
            },
            {
              "name": "CityVision Pro",
              "projectId": "k3i4he0rnhlf",
              "skill": "智能分析城市场景与异常",
              "skillDesc": "运用深度学习算法进行目标识别、语义分割和变化检测，自动分析城市场景并识别异常情况。",
              "skills": [
                "智能分析城市场景与异常"
              ]
            },
            {
              "name": "PandaX",
              "projectId": "vr7y8d1ixdyw",
              "skill": "摄像头监控与多模态告警",
              "skillDesc": "替使用者通过GB28181和RTSP协议拉取摄像头视频流，并实现基于多模态数据的实时告警功能。",
              "skills": [
                "摄像头监控与多模态告警"
              ]
            },
            {
              "name": "无人机AI智慧巡查平台",
              "projectId": "gbuanqd9m1hc",
              "skill": "通知并处理告警",
              "skillDesc": "替使用者实时检测视频画面中的异常情况，通过短信或电话通知用户，并引导其在小程序中完成告警消息的处理。",
              "skills": [
                "通知并处理告警"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 6
        },
        {
          "id": "n3",
          "name": "事件证据组装",
          "out": "带时间地点及现场证据的待核事件包",
          "agents": [
            {
              "name": "智能告警证据留存",
              "projectId": "l34zkxoj9uik",
              "skill": "智能告警证据留存",
              "skillDesc": "在检测到异常事件时自动触发录像抓拍并入库，结合区域、时段、事件三重联动机制降低误报率，为安全管理提供完整可追溯的证据链。",
              "skills": [
                "智能告警证据留存"
              ]
            },
            {
              "name": "太令",
              "projectId": "7j3qg2sq0ey0",
              "skill": "多模态侦查线索关联分析",
              "skillDesc": "为侦查人员整合文本、图像、音视频等多源数据，快速定位关键证据和嫌疑人活动轨迹，生成关联分析结果。",
              "skills": [
                "多模态侦查线索关联分析"
              ]
            },
            {
              "name": "DeepEye",
              "projectId": "7hafjt18egh0",
              "skill": "整合多源数据",
              "skillDesc": "替使用者智能识别并整合来自不同数据源的数据，无需手动执行ETL流程即可打破数据孤岛，形成统一的数据视图。",
              "skills": [
                "整合多源数据"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 3
        },
        {
          "id": "n4",
          "name": "重复事件清洗",
          "out": "去重后的唯一有效事件列表",
          "agents": [
            {
              "name": "跨来源去重合并事件簇",
              "projectId": "wwctdt9xu6ec",
              "skill": "跨来源去重合并事件簇",
              "skillDesc": "替使用者对同一件事的多源报道进行去重合并，形成包含时间线前因后果的事件簇。",
              "skills": [
                "跨来源去重合并事件簇"
              ]
            },
            {
              "name": "集成报警过滤与转发功能",
              "projectId": "eqwrdgd79dl1",
              "skill": "集成报警过滤与转发功能",
              "skillDesc": "接入报警接口以接收原始警报数据，并按照预设的业务规则进行筛选和后续转发处理。",
              "skills": [
                "集成报警过滤与转发功能"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 2
        },
        {
          "id": "n5",
          "name": "责任部门指派",
          "out": "推荐承办单位及派发状态",
          "agents": [
            {
              "name": "生成热线工单与回复草稿",
              "projectId": "5d28ydjerx7s",
              "skill": "生成热线工单与回复草稿",
              "skillDesc": "将群众诉求整理为可审阅的工单、部门推荐和回复草稿，辅助工作人员完成热线受理流程。",
              "skills": [
                "生成热线工单与回复草稿"
              ]
            },
            {
              "name": "SuperBrain组织大脑",
              "projectId": "bzt0j7asphc7",
              "skill": "目标拆解与派发",
              "skillDesc": "将管理者输入的阶段目标拆解为具体项目任务，匹配员工或数字员工，并通过企业IM进行派发。",
              "skills": [
                "目标拆解与派发"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 2
        },
        {
          "id": "n6",
          "name": "异常事件预警",
          "out": "督办提醒记录",
          "agents": [
            {
              "name": "微语",
              "projectId": "5wiwjxgh735j",
              "skill": "流转并跟踪后续问题",
              "skillDesc": "替使用者将未即时解决的问题转化为工单，通过流程编排进行分配、跟踪及业务扩展处理。",
              "skills": [
                "流转并跟踪后续问题"
              ]
            },
            {
              "name": "风险分析",
              "projectId": "k3sk6242t0x2",
              "skill": "生成处置跟踪任务",
              "skillDesc": "基于识别出的高风险项，自动生成包含责任人、时限和复核点的后续跟踪与处置任务。",
              "skills": [
                "生成处置跟踪任务"
              ]
            },
            {
              "name": "无恙每日",
              "projectId": "wy-daily-001",
              "skill": "逾期提醒触发",
              "skillDesc": "对逾期未闭环事项触发提醒，督促承办及时处置并回传进展。",
              "skills": [
                "逾期提醒触发"
              ]
            },
            {
              "name": "全流程状态管理",
              "projectId": "5d28ydjerx7s",
              "skill": "全流程状态管理",
              "skillDesc": "按案件编号保存从理解到确认的各阶段状态，首页展示在途工单分布，支持点击继续处理已有案件，并记录操作人与备注。",
              "skills": [
                "全流程状态管理"
              ]
            },
            {
              "name": "工单创建与跟进",
              "projectId": "wytv5ujq4e3r",
              "skill": "工单创建与跟进",
              "skillDesc": "为使用者从会话创建或关联工单，进行分类、指派、状态流转和进展记录，得到问题闭环跟踪和管理的服务流程结果。",
              "skills": [
                "工单创建与跟进"
              ]
            },
            {
              "name": "整改智脑",
              "projectId": "hfsuleub5s5w",
              "skill": "整改全生命周期在线管理",
              "skillDesc": "为使用者实现从整改单创建、分派、手机端回复到归档的全流程在线管理，自动记录日志、预警逾期并量化排行及时率与执行力。",
              "skills": [
                "整改全生命周期在线管理"
              ]
            },
            {
              "name": "智效助手",
              "projectId": "r45dv6bdjr7e",
              "skill": "执行跨部门协作流程",
              "skillDesc": "替使用者在办公场景中自动同步多部门权限与进度数据，生成实时报表并提醒逾期任务，从而降低沟通成本与信息差。",
              "skills": [
                "执行跨部门协作流程"
              ]
            },
            {
              "name": "监控项目健康状态",
              "projectId": "vfj036z7wt7c",
              "skill": "监控项目健康状态",
              "skillDesc": "为项目负责人关联任务负责人、期限及验收标准，自动识别逾期、阻塞及记忆质量问题，并提供运行记录与提醒以管理项目进展。",
              "skills": [
                "监控项目健康状态"
              ]
            },
            {
              "name": "SuperBrain组织大脑",
              "projectId": "bzt0j7asphc7",
              "skill": "进度跟踪与归档",
              "skillDesc": "持续跟踪任务状态（进行中、阻塞等），在关键节点提醒确认，并将完成后的成果归档形成组织记忆。",
              "skills": [
                "进度跟踪与归档"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 9
        },
        {
          "id": "n7",
          "name": "数据隐私保护",
          "out": "脱敏规则与权限控制",
          "agents": [
            {
              "name": "准绳 Lawtrix",
              "projectId": "1q43s06uxuns",
              "skill": "自动脱敏上传",
              "skillDesc": "在文件上传前，系统自动将姓名、机构、证件号等敏感信息替换为一致代号，原件保留在本地保险库，模型仅处理代号版数据；若无法安全脱敏则拒绝接收。",
              "skills": [
                "自动脱敏上传"
              ]
            },
            {
              "name": "画境",
              "projectId": "sw49lyoo6msv",
              "skill": "安全分享与隐私保护",
              "skillDesc": "在用户分享视频前自动移除拍摄时间、设备型号等敏感元数据，并添加指向景区官网的动态二维码链接。",
              "skills": [
                "安全分享与隐私保护"
              ]
            },
            {
              "name": "Veil",
              "projectId": "j45ml3mie1rh",
              "skill": "本地敏感信息去标识化与还原",
              "skillDesc": "在数据离开本机前自动将密钥和个人敏感信息替换为可逆令牌，并在响应返回时于本地还原真实值，确保模型侧仅接触脱敏后的令牌。",
              "skills": [
                "本地敏感信息去标识化与还原"
              ]
            },
            {
              "name": "护拍（SafeSnap）",
              "projectId": "3i1rzql4a8gs",
              "skill": "隐私化影像创作与珍藏",
              "skillDesc": "替用户抓拍看护画面、生成全景图及卡通化作品，所有人脸与图像处理均在本机完成，确保数据不上传。",
              "skills": [
                "隐私化影像创作与珍藏"
              ]
            }
          ],
          "bypass": true,
          "gap": false,
          "systemSupplement": true,
          "agentCount": 4
        }
      ],
      "edges": [
        {
          "source": "n1",
          "target": "n2",
          "data": "合格试点视频点位列表"
        },
        {
          "source": "n2",
          "target": "n3",
          "data": "原始事件告警记录"
        },
        {
          "source": "n3",
          "target": "n4",
          "data": "带时间地点及现场证据的待核事件包"
        },
        {
          "source": "n4",
          "target": "n5",
          "data": "去重后的唯一有效事件列表"
        },
        {
          "source": "n5",
          "target": "n6",
          "data": "推荐承办单位及派发状态"
        },
        {
          "source": "n7",
          "target": "n3",
          "data": "脱敏规则与权限控制",
          "bypass": true
        }
      ],
      "samples": [
        "43 LENS",
        "PHOTOV.STUDIO",
        "CityVision Pro"
      ]
    },
    {
      "id": "B",
      "tab": "承办单位视角",
      "short": "承办单位",
      "title": "精准接单与高效处置反馈",
      "perspective": "承办单位视角：精准接单与高效处置反馈",
      "fitReason": "本方案侧重承办单位的执行体验。系统在完成初步识别和去重后，向承办人推送包含完整证据链的工单，减少核实位置和责任查询的时间。承办人依据明确的职责指引进行现场处置，并通过移动端上传回传材料。系统结合回传材料和同点位画面辅助核查整改效果，若无法看清则提示现场复核，确保处置闭环，降低因证据不足导致的退单风险。",
      "agents": 13,
      "score": 100,
      "matched": 4,
      "total": 5,
      "meta": "5 个环节 · 4 条连线 · 系统补充 2",
      "evaluation": {
        "total": 100,
        "dimensions": [
          {
            "key": "completeness",
            "label": "任务完整性",
            "score": 5,
            "reason": "覆盖了接单、处置、核查、督办及执法权限校验。满足承办单位视角的全部预期成果。"
          },
          {
            "key": "reasonableness",
            "label": "任务合理性",
            "score": 5,
            "reason": "节点设计贴合一线工作人员实际操作流程，无多余步骤。执法权限校验体现了行业特殊性。"
          },
          {
            "key": "dependency",
            "label": "依据正确性",
            "score": 5,
            "reason": "从接单到处置再到核查，逻辑链条顺畅。并有关联处理指引（如核查后分流至督办或执法）。"
          },
          {
            "key": "feasibility",
            "label": "业务可行性",
            "score": 5,
            "reason": "依托现有移动终端和视频平台，技术实现难度适中，符合用户提出的快速响应和闭环管理目标。"
          }
        ]
      },
      "stages": [
        {
          "id": "n1",
          "name": "任务接收确认",
          "out": "已确认接单的工单详情",
          "agents": [
            {
              "name": "全流程状态管理",
              "projectId": "5d28ydjerx7s",
              "skill": "全流程状态管理",
              "skillDesc": "按案件编号保存从理解到确认的各阶段状态，首页展示在途工单分布，支持点击继续处理已有案件，并记录操作人与备注。",
              "skills": [
                "全流程状态管理"
              ]
            },
            {
              "name": "自助学",
              "projectId": "fra6iulnslol",
              "skill": "直聊接单",
              "skillDesc": "帮助老师实时查看家长需求，并通过一键直聊高效完成接单。",
              "skills": [
                "直聊接单"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 2
        },
        {
          "id": "n2",
          "name": "违规行为整治",
          "out": "现场处置回传材料",
          "agents": [],
          "bypass": false,
          "gap": true,
          "systemSupplement": false,
          "agentCount": 0
        },
        {
          "id": "n3",
          "name": "整改效果验证",
          "out": "整改核查结论",
          "agents": [
            {
              "name": "BESAFE建造业安全助理",
              "projectId": "09esm7uszdha",
              "skill": "识别现场安全隐患",
              "skillDesc": "通过分析现场图片，自动检测并指出高处作业平台临边保护缺失、逃生通道杂物堆放等具体不安全状态。",
              "skills": [
                "识别现场安全隐患"
              ]
            },
            {
              "name": "深瞳金砖银行智算解决方案",
              "projectId": "q59asso8346n",
              "skill": "生成视频告警数据",
              "skillDesc": "为使用者完成对边缘设备视频数据的AI分析及中心二次校验，依据告警规则产出最终的告警数据结果。",
              "skills": [
                "生成视频告警数据"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 2
        },
        {
          "id": "n4",
          "name": "督办整改通知",
          "out": "督办整改通知",
          "agents": [
            {
              "name": "风险分析",
              "projectId": "k3sk6242t0x2",
              "skill": "生成处置跟踪任务",
              "skillDesc": "基于识别出的高风险项，自动生成包含责任人、时限和复核点的后续跟踪与处置任务。",
              "skills": [
                "生成处置跟踪任务"
              ]
            },
            {
              "name": "整改智脑",
              "projectId": "hfsuleub5s5w",
              "skill": "整改全生命周期在线管理",
              "skillDesc": "为使用者实现从整改单创建、分派、手机端回复到归档的全流程在线管理，自动记录日志、预警逾期并量化排行及时率与执行力。",
              "skills": [
                "整改全生命周期在线管理"
              ]
            },
            {
              "name": "多渠道发送通知与报告",
              "projectId": "loszc3qde7ze",
              "skill": "多渠道发送通知与报告",
              "skillDesc": "通过企业微信、飞书、钉钉、邮件或 Webhook 渠道，向相关人员发送告警消息以及生成的巡检报告。",
              "skills": [
                "多渠道发送通知与报告"
              ]
            },
            {
              "name": "无人机AI智慧巡查平台",
              "projectId": "gbuanqd9m1hc",
              "skill": "通知并处理告警",
              "skillDesc": "替使用者实时检测视频画面中的异常情况，通过短信或电话通知用户，并引导其在小程序中完成告警消息的处理。",
              "skills": [
                "通知并处理告警"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": false,
          "agentCount": 4
        },
        {
          "id": "n5",
          "name": "行政认定审核",
          "out": "合法的行政认定记录",
          "agents": [
            {
              "name": "统一权限与审计管理",
              "projectId": "kjlmgku8plqx",
              "skill": "统一权限与审计管理",
              "skillDesc": "集中配置访问权限，确保授权在系统中正确传播，并对所有操作进行完整记录与审计。",
              "skills": [
                "统一权限与审计管理"
              ]
            },
            {
              "name": "X-Hub",
              "projectId": "clyb3lrz3hk7",
              "skill": "Agent权限管控",
              "skillDesc": "设置仅查看、每次确认或完全权限三档模式，并在时间线中留痕每一笔工具调用以便随时中断。",
              "skills": [
                "Agent权限管控"
              ]
            },
            {
              "name": "实施高危操作人工确认流程",
              "projectId": "2cmcyhvxsk4q",
              "skill": "实施高危操作人工确认流程",
              "skillDesc": "通过工单审批和 RBAC 权限控制机制，确保所有高风险的变更操作必须经过人工确认后才能执行，解决让 AI 操作生产环境的安全顾虑。",
              "skills": [
                "实施高危操作人工确认流程"
              ]
            },
            {
              "name": "敏感动作人工审批拦截",
              "projectId": "5r14tpoim250",
              "skill": "敏感动作人工审批拦截",
              "skillDesc": "针对退款等高风险或政策例外的操作，系统不直接执行，而是将其放入审批队列，由运营者进行人工批准或拒绝，确保动作可控。",
              "skills": [
                "敏感动作人工审批拦截"
              ]
            },
            {
              "name": "实施权限控制与审计",
              "projectId": "h5cg0j4pidp2",
              "skill": "实施权限控制与审计",
              "skillDesc": "通过手动、自动或只读模式管理权限，应用规则集和路径白名单进行 fail-closed 检查，并生成防篡改的链式校验和审计日志。",
              "skills": [
                "实施权限控制与审计"
              ]
            }
          ],
          "bypass": false,
          "gap": false,
          "systemSupplement": true,
          "agentCount": 5
        }
      ],
      "edges": [
        {
          "source": "n1",
          "target": "n2",
          "data": "已确认接单的工单详情"
        },
        {
          "source": "n2",
          "target": "n3",
          "data": "现场处置回传材料"
        },
        {
          "source": "n3",
          "target": "n4",
          "data": "整改核查结论"
        },
        {
          "source": "n3",
          "target": "n5",
          "data": "整改核查结论"
        }
      ],
      "samples": [
        "全流程状态管理",
        "BESAFE建造业安全助理",
        "整改智脑"
      ]
    }
  ],
  "agentModal": {
    "43 LENS": {
      "name": "43 LENS",
      "title": "43 LENS · Agent 能力画像",
      "projectId": "en7i1zsn3bgd",
      "owner": "张凯寓",
      "status": "审核通过",
      "mvp": "MVP已通过",
      "stage": "产品期",
      "category": "文化传媒与娱乐 / 影视与短视频",
      "skills": [
        "完成单镜头视频渲染",
        "筛选有效镜头素材",
        "生成多机位创意灵感方案"
      ],
      "scenarios": [
        "AI视频生成",
        "影视分镜设计",
        "影视后期剪辑",
        "影视素材筛选"
      ],
      "boundaries": [
        "不替代导演创意决策，坚持人机共创模式",
        "不支持一键成片黑盒生成，需通过分镜表进行参数化控制"
      ],
      "intro": "43 LENS 是一款服务于专业视频创作者的AI影视生产中台，将非线性编辑思维与生成式 AI 融合，通过动态交互分镜表过滤过程噪音，仅呈现当前确认的有效镜头。",
      "updatedAt": "2026.11.07"
    }
  }
};
