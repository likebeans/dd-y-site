import { motion, useReducedMotion } from "motion/react";

const nodes = [
  { label: "MODEL", text: "Understand capability" },
  { label: "CONTEXT", text: "Organize information" },
  { label: "RETRIEVAL", text: "Find relevant knowledge" },
  { label: "TOOLS", text: "Call reliable functions" },
  { label: "WORKFLOW", text: "Orchestrate process" },
  { label: "PRODUCT", text: "Deliver value" }
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
        <a className="system-trace__node" href={`/writing?topic=${node.label.toLowerCase()}`} key={node.label}>
          <span className="system-trace__dot" aria-hidden="true" />
          <strong>{node.label}</strong>
          <small>{node.text}</small>
        </a>
      ))}
    </div>
  );
}
