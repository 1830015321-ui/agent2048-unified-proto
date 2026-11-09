/* 教育样例 · 对齐高雨晴清单附录 JSON（Prototype 模拟，非真实后端） */
window.EDU_CASE = {
  "demand": {
    "schema_version": 3,
    "caseId": "education",
    "reqId": "REQ-EDU-0001",
    "scene": "中学智能教学",
    "title": "中学智能教学与个性化学习协作方案",
    "chatTitle": "中学智能教学与个性化学习",
    "userText": "我们是一所中学，想利用学生的作业、考试成绩和课堂表现，分析每个学生的薄弱知识点和近期学习变化，生成学习建议。同时，希望结合学校现有题库准备适合不同学习水平的练习，方便老师布置、学生练习，家长也能了解孩子的学习进展并给予辅导。请推荐合适的智能体协作方案。",
    "customer": {
      "name": {
        "text": "一所中学",
        "origin": "USER"
      },
      "industry": {
        "text": "教育培训/基础教育、教育培训/教育信息化",
        "origin": "INFERRED"
      },
      "organization_size": null
    },
    "summary": {
      "text": "面向中学场景，利用学生作业、考试成绩和课堂表现分析薄弱知识点并生成学习建议；结合学校题库准备分层练习，支持老师布置、学生练习及家长了解进展，推荐合适的智能体协作方案。",
      "origin": "USER"
    },
    "tasks": [
      {
        "id": "wf1",
        "name": "学情分析与个性化学习建议",
        "description": {
          "text": "我们是一所中学，想利用学生的作业、考试成绩和课堂表现，分析每个学生的薄弱知识点和近期学习变化，生成学习建议。",
          "origin": "USER"
        },
        "target_users": [
          {
            "text": "教师"
          },
          {
            "text": "学生"
          }
        ],
        "expected_results": [
          {
            "text": "学生薄弱知识点分析报告"
          },
          {
            "text": "近期学习变化趋势数据"
          },
          {
            "text": "个性化学习建议"
          }
        ],
        "business_inputs": [
          {
            "text": "学生作业数据"
          },
          {
            "text": "考试成绩数据"
          },
          {
            "text": "课堂表现记录"
          }
        ],
        "business_dag": {
          "version": "business-dag.v2",
          "status": "READY",
          "plans": [
            {
              "plan_id": "p1",
              "audience": "教师",
              "perspective": "教师视角：班级学情诊断与教学改进",
              "fit_reason": "整合全班作业、考试和课堂数据，梳理知识点掌握情况以定位共性薄弱环节，追踪近期成绩波动趋势。最终生成包含个体差异的学情分析报告，帮助教师精准识别需重点辅导的学生。",
              "dag": {
                "nodes": [
                  {
                    "id": "n1",
                    "name": "教育数据整合",
                    "display_name": "多源数据汇总",
                    "description": {
                      "text": "收集并清洗学生作业、考试成绩和课堂表现记录，形成统一格式的结构化数据集。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "结构化学生综合数据表"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n2",
                    "name": "学科知识图谱构建",
                    "display_name": "知识点梳理",
                    "description": {
                      "text": "基于课程标准和题目内容，建立知识点体系，并将每位学生的答题结果映射到具体知识点上。",
                      "source_ids": [],
                      "origin": "INFERRED"
                    },
                    "outputs": [
                      "学生-知识点掌握矩阵"
                    ],
                    "node_source": "system",
                    "supplement_reason": "流程衔接"
                  },
                  {
                    "id": "n3",
                    "name": "学情诊断分析",
                    "display_name": "薄弱点定位",
                    "description": {
                      "text": "分析学生在各知识点上的正确率和错误模式，识别出每个学生的薄弱知识点。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "个体薄弱知识点清单"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n4",
                    "name": "学习轨迹追踪",
                    "display_name": "学习趋势分析",
                    "description": {
                      "text": "对比近期多次考试和作业数据，计算成绩变化斜率和知识点掌握度的动态变化。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "近期学习变化趋势数据"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n5",
                    "name": "教学策略推荐",
                    "display_name": "教学改进建议",
                    "description": {
                      "text": "结合薄弱知识点分布和班级整体趋势，生成针对教师的教学调整建议和重点关注名单。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "教师用个性化学习建议报告"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  }
                ],
                "edges": [
                  {
                    "source": "n1",
                    "target": "n2",
                    "type": "sequential",
                    "data": "结构化学生综合数据表（含题目详情）",
                    "confidence": 0.9
                  },
                  {
                    "source": "n1",
                    "target": "n4",
                    "type": "sequential",
                    "data": "结构化学生综合数据表（含时间戳）",
                    "confidence": 0.9
                  },
                  {
                    "source": "n2",
                    "target": "n3",
                    "type": "sequential",
                    "data": "学生-知识点掌握矩阵",
                    "confidence": 0.98
                  },
                  {
                    "source": "n3",
                    "target": "n5",
                    "type": "sequential",
                    "data": "个体薄弱知识点清单",
                    "confidence": 0.9
                  },
                  {
                    "source": "n4",
                    "target": "n5",
                    "type": "sequential",
                    "data": "近期学习变化趋势数据",
                    "confidence": 0.9
                  }
                ]
              }
            },
            {
              "plan_id": "p2",
              "audience": "学生",
              "perspective": "学生视角：个人薄弱点突破与自主规划",
              "fit_reason": "聚焦个人作业与考试记录，自动识别自身知识盲区并可视化近期努力成效。系统生成易懂的个人学习建议。",
              "dag": {
                "nodes": [
                  {
                    "id": "n1",
                    "name": "个人数据归档",
                    "display_name": "个人记录整理",
                    "description": {
                      "text": "提取当前学生的作业完成度、试卷得分及课堂互动记录，按时间顺序排列。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "学生个人学习档案"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n2",
                    "name": "错题智能归因",
                    "display_name": "错题原因分析",
                    "description": {
                      "text": "分析作业和考试中的错题，判断是由于概念不清、计算失误还是题型不熟导致的。",
                      "source_ids": [],
                      "origin": "INFERRED"
                    },
                    "outputs": [
                      "错题归因明细"
                    ],
                    "node_source": "system",
                    "supplement_reason": "流程衔接"
                  },
                  {
                    "id": "n3",
                    "name": "薄弱点画像生成",
                    "display_name": "薄弱点报告",
                    "description": {
                      "text": "汇总高频错题对应的知识点，生成直观的个人薄弱知识点分析报告。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "个人薄弱知识点分析报告"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n4",
                    "name": "成长曲线绘制",
                    "display_name": "进步曲线绘制",
                    "description": {
                      "text": "根据近期多次测试成绩，绘制可视化的学习变化趋势图，标注进步或退步区间。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "近期学习变化趋势数据"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n5",
                    "name": "自主规划建议",
                    "display_name": "自主规划建议",
                    "description": {
                      "text": "结合薄弱点和趋势，生成具体的每日/每周学习任务清单和推荐练习题。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "学生用个性化学习建议"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  }
                ],
                "edges": [
                  {
                    "source": "n1",
                    "target": "n2",
                    "type": "sequential",
                    "data": "学生个人学习档案（含错题）",
                    "confidence": 0.9
                  },
                  {
                    "source": "n1",
                    "target": "n4",
                    "type": "sequential",
                    "data": "学生个人学习档案（含成绩序列）",
                    "confidence": 0.9
                  },
                  {
                    "source": "n2",
                    "target": "n3",
                    "type": "sequential",
                    "data": "错题归因明细",
                    "confidence": 0.98
                  },
                  {
                    "source": "n3",
                    "target": "n5",
                    "type": "sequential",
                    "data": "个人薄弱知识点分析报告",
                    "confidence": 0.9
                  },
                  {
                    "source": "n4",
                    "target": "n5",
                    "type": "sequential",
                    "data": "近期学习变化趋势数据",
                    "confidence": 0.9
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "id": "wf2",
        "name": "分层练习资源准备与家校协同",
        "depends_on": [
          "wf1"
        ],
        "description": {
          "text": "同时，希望结合学校现有题库准备适合不同学习水平的练习，方便老师布置、学生练习，家长也能了解孩子的学习进展并给予辅导。",
          "origin": "USER"
        },
        "target_users": [
          {
            "text": "教师"
          },
          {
            "text": "学生"
          },
          {
            "text": "家长"
          }
        ],
        "expected_results": [
          {
            "text": "适合不同学习水平的分层练习资源"
          },
          {
            "text": "老师布置与学生练习的便捷流程"
          },
          {
            "text": "家长查看学习进展及辅导指引"
          }
        ],
        "business_inputs": [
          {
            "text": "学校现有题库"
          },
          {
            "text": "学生学习水平评估数据"
          }
        ],
        "business_dag": {
          "version": "business-dag.v2",
          "status": "READY",
          "plans": [
            {
              "plan_id": "p1",
              "audience": "教师",
              "perspective": "教师视角：分层作业布置与学情诊断",
              "fit_reason": "从学校题库中按知识点和难度筛选组装分层练习，生成适合不同水平学生的作业包。",
              "dag": {
                "nodes": [
                  {
                    "id": "n1",
                    "name": "题库资源整理",
                    "display_name": "练习题目梳理",
                    "description": {
                      "text": "基于学校现有题库，按学科、知识点和难度标签对题目进行分类清洗和标准化处理，形成结构化题目库。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "结构化题目库"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n2",
                    "name": "分层练习组装",
                    "display_name": "分级作业生成",
                    "description": {
                      "text": "根据学生学习水平评估数据，从结构化题目库中智能匹配并组装出基础、提高、拓展三个层级的练习内容。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "分层练习资源包"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n3",
                    "name": "作业布置管理",
                    "display_name": "任务下发执行",
                    "description": {
                      "text": "教师选择特定班级或学生群体，将对应的分层练习资源发布为在线作业，设定截止时间并通知学生。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "已布置作业记录",
                      "学生作答数据流"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n4",
                    "name": "学情数据分析",
                    "display_name": "班级情况诊断",
                    "description": {
                      "text": "汇总学生作答数据，分析各层级题目的正确率、耗时及知识点掌握度，生成可视化班级学习情况报告。",
                      "source_ids": [],
                      "origin": "INFERRED"
                    },
                    "outputs": [
                      "班级学情诊断报告"
                    ],
                    "node_source": "system",
                    "supplement_reason": "流程衔接"
                  }
                ],
                "edges": [
                  {
                    "source": "n1",
                    "target": "n2",
                    "type": "sequential",
                    "data": "结构化题目库",
                    "confidence": 0.9
                  },
                  {
                    "source": "n2",
                    "target": "n3",
                    "type": "sequential",
                    "data": "分层练习资源包",
                    "confidence": 0.98
                  },
                  {
                    "source": "n3",
                    "target": "n4",
                    "type": "sequential",
                    "data": "学生作答数据流",
                    "confidence": 0.9
                  }
                ]
              }
            },
            {
              "plan_id": "p2",
              "audience": "学生",
              "perspective": "学生视角：个性化练习与即时反馈",
              "fit_reason": "系统根据学生水平推送专属分层练习，学生完成作答并获得即时批改与解析；错题自动归集形成个人错题本。",
              "dag": {
                "nodes": [
                  {
                    "id": "n1",
                    "name": "个性化推荐",
                    "display_name": "专属练习推送",
                    "description": {
                      "text": "基于学生学习水平评估数据和历史错题，从题库中筛选并推送最适合当前能力的分层练习题。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "个性化练习清单"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n2",
                    "name": "在线练习作答",
                    "display_name": "题目互动解答",
                    "description": {
                      "text": "学生通过终端设备完成推送的练习题目，系统实时记录作答过程、答案及用时。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "学生作答记录"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n3",
                    "name": "即时批改反馈",
                    "display_name": "答案解析指导",
                    "description": {
                      "text": "对学生提交的客观题自动判分，对主观题提供参考答案或AI辅助评分，并展示详细解析。",
                      "source_ids": [],
                      "origin": "INFERRED"
                    },
                    "outputs": [
                      "批改结果与解析"
                    ],
                    "node_source": "system",
                    "supplement_reason": "行业要求"
                  },
                  {
                    "id": "n4",
                    "name": "错题自动归集",
                    "display_name": "个人错题整理",
                    "description": {
                      "text": "将学生做错的题目及其关联知识点自动收录进个人错题本，支持按时间或知识点分类查看。",
                      "source_ids": [],
                      "origin": "INFERRED"
                    },
                    "outputs": [
                      "个人错题本"
                    ],
                    "node_source": "system",
                    "supplement_reason": "行业要求"
                  }
                ],
                "edges": [
                  {
                    "source": "n1",
                    "target": "n2",
                    "type": "sequential",
                    "data": "个性化练习清单",
                    "confidence": 0.9
                  },
                  {
                    "source": "n2",
                    "target": "n3",
                    "type": "sequential",
                    "data": "学生作答记录",
                    "confidence": 0.98
                  },
                  {
                    "source": "n2",
                    "target": "n4",
                    "type": "sequential",
                    "data": "学生作答记录中的错误项",
                    "confidence": 0.9
                  },
                  {
                    "source": "n4",
                    "target": "n1",
                    "type": "feedback",
                    "data": "个人错题本数据",
                    "confidence": 0.75
                  }
                ]
              }
            },
            {
              "plan_id": "p3",
              "audience": "家长",
              "perspective": "家长视角：学习进展同步与家庭辅导",
              "fit_reason": "系统将孩子的分层练习完成情况转化为易懂的学习进展简报，并推送家庭辅导建议。",
              "dag": {
                "nodes": [
                  {
                    "id": "n1",
                    "name": "学习进展同步",
                    "display_name": "孩子表现汇总",
                    "description": {
                      "text": "整合学生练习数据，生成面向家长的可视化学习进展报告，涵盖完成率、正确率趋势及主要薄弱知识点。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "家长版学习进展报告"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n2",
                    "name": "辅导指引生成",
                    "display_name": "家庭辅导建议",
                    "description": {
                      "text": "基于学习进展报告中的薄弱环节，匹配相应的家庭教育方法或微课资源，生成具体的辅导行动指南。",
                      "source_ids": [],
                      "origin": "USER"
                    },
                    "outputs": [
                      "个性化辅导指引"
                    ],
                    "node_source": "user",
                    "supplement_reason": null
                  },
                  {
                    "id": "n3",
                    "name": "家校消息触达",
                    "display_name": "通知提醒发送",
                    "description": {
                      "text": "通过微信、APP推送等渠道，将学习进展报告和辅导指引及时发送给家长，并支持家长确认阅读。",
                      "source_ids": [],
                      "origin": "INFERRED"
                    },
                    "outputs": [
                      "消息送达状态"
                    ],
                    "node_source": "system",
                    "supplement_reason": "流程衔接"
                  }
                ],
                "edges": [
                  {
                    "source": "n1",
                    "target": "n2",
                    "type": "sequential",
                    "data": "家长版学习进展报告",
                    "confidence": 0.9
                  },
                  {
                    "source": "n1",
                    "target": "n3",
                    "type": "sequential",
                    "data": "家长版学习进展报告",
                    "confidence": 0.9
                  },
                  {
                    "source": "n2",
                    "target": "n3",
                    "type": "sequential",
                    "data": "个性化辅导指引",
                    "confidence": 0.9
                  }
                ]
              }
            }
          ]
        }
      }
    ],
    "clarifications": {
      "required": [],
      "suggested": [
        {
          "text": "关于“智能体协作方案”，您更倾向于具体的软件产品选型建议，还是侧重于业务流程中多角色（如AI助教、数据分析Agent）的交互逻辑设计？"
        },
        {
          "text": "学校现有题库的数据格式是怎样的（如Excel、数据库接口或特定平台导出文件），以便评估自动化组卷的可行性？"
        }
      ]
    }
  },
  "match": {
    "success": {
      "outcome": "success",
      "statusLabel": "组网成功",
      "score": 92,
      "matched": 10,
      "total": 10,
      "agents": 18,
      "tasks": [
        {
          "taskId": "wf1",
          "name": "学情分析与个性化学习建议",
          "audiences": {
            "教师": {
              "matched": 5,
              "total": 5,
              "agents": 9,
              "score": 94,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "多源数据汇总",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "学情数据管家",
                      "skill": "多源学情清洗与对齐"
                    }
                  ],
                  "outputs": [
                    "结构化学生综合数据表"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "知识点梳理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "知识图谱助理",
                      "skill": "知识点体系构建"
                    }
                  ],
                  "outputs": [
                    "学生-知识点掌握矩阵"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "薄弱点定位",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "薄弱诊断师",
                      "skill": "错因与薄弱定位"
                    }
                  ],
                  "outputs": [
                    "个体薄弱知识点清单"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "学习趋势分析",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "趋势洞察",
                      "skill": "成绩轨迹分析"
                    }
                  ],
                  "outputs": [
                    "近期学习变化趋势数据"
                  ]
                },
                {
                  "id": "n5",
                  "display_name": "教学改进建议",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "教学参谋",
                      "skill": "分层教学建议生成"
                    }
                  ],
                  "outputs": [
                    "教师用个性化学习建议报告"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "结构化学生综合数据表（含题目详情）",
                  "confidence": 0.9
                },
                {
                  "source": "n1",
                  "target": "n4",
                  "type": "sequential",
                  "data": "结构化学生综合数据表（含时间戳）",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "学生-知识点掌握矩阵",
                  "confidence": 0.98
                },
                {
                  "source": "n3",
                  "target": "n5",
                  "type": "sequential",
                  "data": "个体薄弱知识点清单",
                  "confidence": 0.9
                },
                {
                  "source": "n4",
                  "target": "n5",
                  "type": "sequential",
                  "data": "近期学习变化趋势数据",
                  "confidence": 0.9
                }
              ]
            },
            "学生": {
              "matched": 5,
              "total": 5,
              "agents": 9,
              "score": 90,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "个人记录整理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "个人学档",
                      "skill": "个人学习档案整理"
                    }
                  ],
                  "outputs": [
                    "学生个人学习档案"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "错题原因分析",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "错因分析",
                      "skill": "错题智能归因"
                    }
                  ],
                  "outputs": [
                    "错题归因明细"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "薄弱点报告",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "薄弱画像",
                      "skill": "个人薄弱报告"
                    }
                  ],
                  "outputs": [
                    "个人薄弱知识点分析报告"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "进步曲线绘制",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "成长曲线",
                      "skill": "进步可视化"
                    }
                  ],
                  "outputs": [
                    "近期学习变化趋势数据"
                  ]
                },
                {
                  "id": "n5",
                  "display_name": "自主规划建议",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "学习规划",
                      "skill": "个性化学习计划"
                    }
                  ],
                  "outputs": [
                    "学生用个性化学习建议"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "学生个人学习档案（含错题）",
                  "confidence": 0.9
                },
                {
                  "source": "n1",
                  "target": "n4",
                  "type": "sequential",
                  "data": "学生个人学习档案（含成绩序列）",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "错题归因明细",
                  "confidence": 0.98
                },
                {
                  "source": "n3",
                  "target": "n5",
                  "type": "sequential",
                  "data": "个人薄弱知识点分析报告",
                  "confidence": 0.9
                },
                {
                  "source": "n4",
                  "target": "n5",
                  "type": "sequential",
                  "data": "近期学习变化趋势数据",
                  "confidence": 0.9
                }
              ]
            }
          }
        },
        {
          "taskId": "wf2",
          "name": "分层练习资源准备与家校协同",
          "audiences": {
            "教师": {
              "matched": 4,
              "total": 4,
              "agents": 7,
              "score": 91,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "练习题目梳理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "题库管家",
                      "skill": "题库结构化"
                    }
                  ],
                  "outputs": [
                    "结构化题目库"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "分级作业生成",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "分层组卷",
                      "skill": "难度分层组卷"
                    }
                  ],
                  "outputs": [
                    "分层练习资源包"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "任务下发执行",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "作业管家",
                      "skill": "作业布置与催交"
                    }
                  ],
                  "outputs": [
                    "已布置作业记录"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "班级情况诊断",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "班级诊断",
                      "skill": "班级学情报告"
                    }
                  ],
                  "outputs": [
                    "班级学情诊断报告"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "结构化题目库",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "分层练习资源包",
                  "confidence": 0.98
                },
                {
                  "source": "n3",
                  "target": "n4",
                  "type": "sequential",
                  "data": "学生作答数据流",
                  "confidence": 0.9
                }
              ]
            },
            "学生": {
              "matched": 4,
              "total": 4,
              "agents": 6,
              "score": 88,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "专属练习推送",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "练习推荐",
                      "skill": "个性化练习推荐"
                    }
                  ],
                  "outputs": [
                    "个性化练习清单"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "题目互动解答",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "练习互动",
                      "skill": "在线作答采集"
                    }
                  ],
                  "outputs": [
                    "学生作答记录"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "答案解析指导",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "即时批改",
                      "skill": "客观题批改与解析"
                    }
                  ],
                  "outputs": [
                    "批改结果与解析"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "个人错题整理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "错题本",
                      "skill": "错题自动归集"
                    }
                  ],
                  "outputs": [
                    "个人错题本"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "个性化练习清单",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "学生作答记录",
                  "confidence": 0.98
                },
                {
                  "source": "n2",
                  "target": "n4",
                  "type": "sequential",
                  "data": "学生作答记录中的错误项",
                  "confidence": 0.9
                },
                {
                  "source": "n4",
                  "target": "n1",
                  "type": "feedback",
                  "data": "个人错题本数据",
                  "confidence": 0.75
                }
              ]
            },
            "家长": {
              "matched": 3,
              "total": 3,
              "agents": 5,
              "score": 89,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "孩子表现汇总",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "家校简报",
                      "skill": "家长版进展报告"
                    }
                  ],
                  "outputs": [
                    "家长版学习进展报告"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "家庭辅导建议",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "家庭辅导",
                      "skill": "辅导行动指南"
                    }
                  ],
                  "outputs": [
                    "个性化辅导指引"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "通知提醒发送",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "家校触达",
                      "skill": "多渠道家长通知"
                    }
                  ],
                  "outputs": [
                    "消息送达状态"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "家长版学习进展报告",
                  "confidence": 0.9
                },
                {
                  "source": "n1",
                  "target": "n3",
                  "type": "sequential",
                  "data": "家长版学习进展报告",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "个性化辅导指引",
                  "confidence": 0.9
                }
              ]
            }
          }
        }
      ]
    },
    "partial": {
      "outcome": "partial",
      "statusLabel": "部分匹配",
      "score": 76,
      "matched": 8,
      "total": 10,
      "agents": 14,
      "tasks": [
        {
          "taskId": "wf1",
          "name": "学情分析与个性化学习建议",
          "audiences": {
            "教师": {
              "matched": 5,
              "total": 5,
              "agents": 9,
              "score": 94,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "多源数据汇总",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "学情数据管家",
                      "skill": "多源学情清洗与对齐"
                    }
                  ],
                  "outputs": [
                    "结构化学生综合数据表"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "知识点梳理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "知识图谱助理",
                      "skill": "知识点体系构建"
                    }
                  ],
                  "outputs": [
                    "学生-知识点掌握矩阵"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "薄弱点定位",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "薄弱诊断师",
                      "skill": "错因与薄弱定位"
                    }
                  ],
                  "outputs": [
                    "个体薄弱知识点清单"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "学习趋势分析",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "趋势洞察",
                      "skill": "成绩轨迹分析"
                    }
                  ],
                  "outputs": [
                    "近期学习变化趋势数据"
                  ]
                },
                {
                  "id": "n5",
                  "display_name": "教学改进建议",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "教学参谋",
                      "skill": "分层教学建议生成"
                    }
                  ],
                  "outputs": [
                    "教师用个性化学习建议报告"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "结构化学生综合数据表（含题目详情）",
                  "confidence": 0.9
                },
                {
                  "source": "n1",
                  "target": "n4",
                  "type": "sequential",
                  "data": "结构化学生综合数据表（含时间戳）",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "学生-知识点掌握矩阵",
                  "confidence": 0.98
                },
                {
                  "source": "n3",
                  "target": "n5",
                  "type": "sequential",
                  "data": "个体薄弱知识点清单",
                  "confidence": 0.9
                },
                {
                  "source": "n4",
                  "target": "n5",
                  "type": "sequential",
                  "data": "近期学习变化趋势数据",
                  "confidence": 0.9
                }
              ]
            },
            "学生": {
              "matched": 5,
              "total": 5,
              "agents": 9,
              "score": 90,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "个人记录整理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "个人学档",
                      "skill": "个人学习档案整理"
                    }
                  ],
                  "outputs": [
                    "学生个人学习档案"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "错题原因分析",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "错因分析",
                      "skill": "错题智能归因"
                    }
                  ],
                  "outputs": [
                    "错题归因明细"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "薄弱点报告",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "薄弱画像",
                      "skill": "个人薄弱报告"
                    }
                  ],
                  "outputs": [
                    "个人薄弱知识点分析报告"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "进步曲线绘制",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "成长曲线",
                      "skill": "进步可视化"
                    }
                  ],
                  "outputs": [
                    "近期学习变化趋势数据"
                  ]
                },
                {
                  "id": "n5",
                  "display_name": "自主规划建议",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "学习规划",
                      "skill": "个性化学习计划"
                    }
                  ],
                  "outputs": [
                    "学生用个性化学习建议"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "学生个人学习档案（含错题）",
                  "confidence": 0.9
                },
                {
                  "source": "n1",
                  "target": "n4",
                  "type": "sequential",
                  "data": "学生个人学习档案（含成绩序列）",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "错题归因明细",
                  "confidence": 0.98
                },
                {
                  "source": "n3",
                  "target": "n5",
                  "type": "sequential",
                  "data": "个人薄弱知识点分析报告",
                  "confidence": 0.9
                },
                {
                  "source": "n4",
                  "target": "n5",
                  "type": "sequential",
                  "data": "近期学习变化趋势数据",
                  "confidence": 0.9
                }
              ]
            }
          }
        },
        {
          "taskId": "wf2",
          "name": "分层练习资源准备与家校协同",
          "audiences": {
            "教师": {
              "matched": 4,
              "total": 4,
              "agents": 7,
              "score": 91,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "练习题目梳理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "题库管家",
                      "skill": "题库结构化"
                    }
                  ],
                  "outputs": [
                    "结构化题目库"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "分级作业生成",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "分层组卷",
                      "skill": "难度分层组卷"
                    }
                  ],
                  "outputs": [
                    "分层练习资源包"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "任务下发执行",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "作业管家",
                      "skill": "作业布置与催交"
                    }
                  ],
                  "outputs": [
                    "已布置作业记录"
                  ]
                },
                {
                  "id": "n4",
                  "display_name": "班级情况诊断",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "班级诊断",
                      "skill": "班级学情报告"
                    }
                  ],
                  "outputs": [
                    "班级学情诊断报告"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "结构化题目库",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "分层练习资源包",
                  "confidence": 0.98
                },
                {
                  "source": "n3",
                  "target": "n4",
                  "type": "sequential",
                  "data": "学生作答数据流",
                  "confidence": 0.9
                }
              ]
            },
            "学生": {
              "matched": 3,
              "total": 4,
              "agents": 6,
              "score": 72,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "专属练习推送",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "练习推荐",
                      "skill": "个性化练习推荐"
                    }
                  ],
                  "outputs": [
                    "个性化练习清单"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "题目互动解答",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "练习互动",
                      "skill": "在线作答采集"
                    }
                  ],
                  "outputs": [
                    "学生作答记录"
                  ]
                },
                {
                  "id": "n3",
                  "display_name": "答案解析指导",
                  "status": "unmatched",
                  "agents": [],
                  "outputs": [
                    "批改结果与解析"
                  ],
                  "unmatched_reason": "候选 Skill 覆盖主观题评分不足，暂无合格 Agent"
                },
                {
                  "id": "n4",
                  "display_name": "个人错题整理",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "错题本",
                      "skill": "错题自动归集"
                    }
                  ],
                  "outputs": [
                    "个人错题本"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "个性化练习清单",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "学生作答记录",
                  "confidence": 0.98
                },
                {
                  "source": "n2",
                  "target": "n4",
                  "type": "sequential",
                  "data": "学生作答记录中的错误项",
                  "confidence": 0.9
                },
                {
                  "source": "n4",
                  "target": "n1",
                  "type": "feedback",
                  "data": "个人错题本数据",
                  "confidence": 0.75
                }
              ]
            },
            "家长": {
              "matched": 2,
              "total": 3,
              "agents": 5,
              "score": 70,
              "nodes": [
                {
                  "id": "n1",
                  "display_name": "孩子表现汇总",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "家校简报",
                      "skill": "家长版进展报告"
                    }
                  ],
                  "outputs": [
                    "家长版学习进展报告"
                  ]
                },
                {
                  "id": "n2",
                  "display_name": "家庭辅导建议",
                  "status": "unmatched",
                  "agents": [],
                  "outputs": [
                    "个性化辅导指引"
                  ],
                  "unmatched_reason": "家庭辅导类 Agent 测评未达标"
                },
                {
                  "id": "n3",
                  "display_name": "通知提醒发送",
                  "status": "matched",
                  "agents": [
                    {
                      "name": "家校触达",
                      "skill": "多渠道家长通知"
                    }
                  ],
                  "outputs": [
                    "消息送达状态"
                  ]
                }
              ],
              "edges": [
                {
                  "source": "n1",
                  "target": "n2",
                  "type": "sequential",
                  "data": "家长版学习进展报告",
                  "confidence": 0.9
                },
                {
                  "source": "n1",
                  "target": "n3",
                  "type": "sequential",
                  "data": "家长版学习进展报告",
                  "confidence": 0.9
                },
                {
                  "source": "n2",
                  "target": "n3",
                  "type": "sequential",
                  "data": "个性化辅导指引",
                  "confidence": 0.9
                }
              ]
            }
          }
        }
      ]
    },
    "fail": {
      "outcome": "fail",
      "statusLabel": "组网失败",
      "score": null,
      "matched": 0,
      "total": 10,
      "agents": 0,
      "failReason": "当前库中缺少教育场景可用的核心学情诊断与分层组卷能力组合，无法形成可落地协作网络。",
      "tasks": []
    }
  },
  "carousel": [
    {
      "title": "让智能，因连接而生",
      "sub": "打破单一能力边界，让多元智能体协同创造更大价值。"
    },
    {
      "title": "从理解需求，到连接能力",
      "sub": "以真实业务需求为起点，构建更贴合目标的智能协作网络。"
    },
    {
      "title": "智能不止于个体，更在于协同",
      "sub": "让不同能力相互连接、彼此补充，共同完成复杂任务。"
    },
    {
      "title": "让合适的能力，出现在合适的位置",
      "sub": "围绕业务流程寻找适配的智能体能力，构建更合理的协作组合。"
    },
    {
      "title": "不追求更多，而追求更合适",
      "sub": "在满足业务需求的前提下，减少不必要的能力重复，让智能协作更加精简高效。"
    }
  ]
};
