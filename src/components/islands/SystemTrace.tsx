import { motion, useReducedMotion } from "motion/react";

const nodes = [
  { label: "模型", labelEn: "MODEL", text: "理解能力边界", textEn: "Understand capability", topic: "model" },
  { label: "上下文", labelEn: "CONTEXT", text: "组织信息", textEn: "Organize information", topic: "context" },
  { label: "检索", labelEn: "RETRIEVAL", text: "找到相关知识", textEn: "Find relevant knowledge", topic: "retrieval" },
  { label: "工具", labelEn: "TOOLS", text: "调用可靠函数", textEn: "Call reliable functions", topic: "tools" },
  { label: "工作流", labelEn: "WORKFLOW", text: "编排过程", textEn: "Orchestrate process", topic: "workflow" },
  { label: "产品", labelEn: "PRODUCT", text: "交付用户价值", textEn: "Deliver value", topic: "product" }
];

export function SystemTrace() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="system-trace" aria-label="System trace">
      <div className="system-trace__line" aria-hidden="true">
        <motion.span
          initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {nodes.map((node) => (
        <a className="system-trace__node" href={`/writing?topic=${node.topic}`} key={node.topic}>
          <span className="system-trace__dot" aria-hidden="true" />
          <strong data-i18n-zh={node.label} data-i18n-en={node.labelEn}>
            {node.label}
          </strong>
          <small data-i18n-zh={node.text} data-i18n-en={node.textEn}>
            {node.text}
          </small>
        </a>
      ))}
    </div>
  );
}
