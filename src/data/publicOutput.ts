export const publicRepositories = [
  {
    name: "RAGForge",
    href: "https://github.com/likebeans/RAGForge",
    summary: "围绕企业知识库、检索、重排和评测整理的 RAG 工程实践。",
    summaryEn: "RAG engineering practice around enterprise knowledge bases, retrieval, reranking, and evaluation.",
    tags: ["RAG", "Retrieval", "Evaluation"]
  },
  {
    name: "notes-on-llms",
    href: "https://github.com/likebeans/notes-on-llms",
    summary: "大模型、RAG、Agent 与工程化问题的长期学习笔记。",
    summaryEn: "Long-running notes on LLMs, RAG, agents, and engineering practice.",
    tags: ["LLM", "RAG", "Agent"]
  },
  {
    name: "Genesis-LLM",
    href: "https://github.com/likebeans/Genesis-LLM",
    summary: "从底层机制理解大模型训练、推理与系统构成的实验记录。",
    summaryEn: "Experiments for understanding LLM training, inference, and system construction from first principles.",
    tags: ["LLM", "Training", "Systems"]
  },
  {
    name: "OpenResume",
    href: "https://github.com/likebeans/OpenResume",
    summary: "交互式简历与项目展示，把经历、技能和作品组织成可浏览界面。",
    summaryEn: "An interactive resume surface for browsing experience, skills, and project evidence.",
    tags: ["Resume", "Frontend", "Portfolio"]
  }
] as const;

export const publicChannels = [
  {
    label: "GitHub 开源项目",
    labelEn: "GitHub Open Source",
    href: "https://github.com/likebeans?tab=repositories",
    summary: "查看公开仓库、实验项目和长期维护的学习资料。",
    summaryEn: "Browse public repositories, experiments, and long-running learning materials."
  },
  {
    label: "CSDN 技术博客",
    labelEn: "CSDN Technical Blog",
    href: "https://blog.csdn.net/m0_63309778",
    summary: "沉淀 RAG、Agent、模型服务、文档解析和工程实践长文。",
    summaryEn: "Long-form notes on RAG, agents, model services, document parsing, and engineering practice."
  }
] as const;
