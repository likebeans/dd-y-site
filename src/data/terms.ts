const termLabelsZh: Record<string, string> = {
  "Browser Agent": "浏览器 Agent",
  Crawler: "爬虫",
  Search: "搜索",
  "Tool Calling": "工具调用",
  Workflow: "工作流"
};

export const toZhTerm = (value: string) => termLabelsZh[value] ?? value;

export const toZhPhrase = (value: string) => value.split(" / ").map(toZhTerm).join(" / ");
