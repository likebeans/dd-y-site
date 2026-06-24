import { useMemo, useState } from "react";

type Project = {
  title: string;
  role: string;
  year: number;
  href: string;
};

type Props = {
  projects: Project[];
};

const previewNodes = ["Intent", "Retrieval", "Agent", "Tools", "Review", "System"];

export function ProjectPreview({ projects }: Props) {
  const [activeHref, setActiveHref] = useState(projects[0]?.href ?? "");
  const activeProject = useMemo(
    () => projects.find((project) => project.href === activeHref) ?? projects[0],
    [activeHref, projects]
  );

  return (
    <div className="project-preview">
      <div className="project-preview__list">
        {projects.map((project, index) => (
          <a
            className="work-row"
            data-active={project.href === activeProject?.href}
            href={project.href}
            key={project.href}
            onBlur={() => setActiveHref(projects[0]?.href ?? "")}
            onFocus={() => setActiveHref(project.href)}
            onMouseEnter={() => setActiveHref(project.href)}
          >
            <span className="work-row__index">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>{project.title}</strong>
              <small>{project.role}</small>
            </span>
            <span className="work-row__year">{project.year}</span>
          </a>
        ))}
      </div>
      <aside className="selected-work__preview" aria-label="Architecture preview">
        <div className="selected-work__preview-title">
          <span>{activeProject?.title}</span>
          <small>{activeProject?.role}</small>
        </div>
        <div className="preview-grid">
          {previewNodes.map((node) => (
            <span className={node === "Agent" ? "active" : undefined} key={node}>
              {node}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
