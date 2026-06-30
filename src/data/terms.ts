const termLabelsZh: Record<string, string> = {
  "AI Application": "AI 应用",
  "AI Platform": "AI 平台",
  "Browser Agent": "浏览器 Agent",
  Crawler: "爬虫",
  Infrastructure: "基础设施",
  "Hybrid Search": "混合检索",
  LLMOps: "模型工程",
  "Multi-Agent": "多智能体",
  Platform: "平台",
  Security: "安全",
  Search: "搜索",
  "Tool Calling": "工具调用",
  Workflow: "工作流"
};

export const toZhTerm = (value: string) => termLabelsZh[value] ?? value;

export const toZhPhrase = (value: string) => value.split(" / ").map(toZhTerm).join(" / ");
