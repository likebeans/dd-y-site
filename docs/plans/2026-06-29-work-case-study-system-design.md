# Work Case Study System Design

## Goal

Turn the Work area into a reusable project system that supports hiring, technical credibility, and long-term project writing without inventing project-specific content.

## Positioning

The Work pages should feel like an engineering portfolio, not a gallery. The reader should be able to scan project type, role, system signals, and evidence before reading the narrative.

## Information Architecture

- `/work` acts as a project index table for quick scanning.
- Each case study acts as a reusable evidence template.
- Project content remains authored in MDX, but the layout provides stable structure.
- Project metadata should carry enough signal for lists, hero areas, and side rails.

## Work Index

The Work index should support fast comparison:

- project title
- system type or role
- stack and tags
- year
- short summary
- visible signal that the project belongs to a systems-focused portfolio

The layout should remain dense, calm, and table-like. Avoid marketing cards.

## Case Study Template

Each case study should provide these structural slots:

- overview
- system snapshot
- metadata rail
- content navigation
- body sections
- next action

The body can keep project-specific headings from MDX. The layout should not force made-up content.

## UIUX Principles

- Preserve the current paper, ink, grid, and rare-lime language.
- Use thin rules, rails, and structured columns instead of nested cards.
- Make section boundaries visible during scroll.
- Keep desktop reading wide enough for architecture content.
- Collapse side rails into readable stacked sections on mobile.
- Do not add decorative effects unrelated to reading or scanning.

## Component Boundaries

- `WorkIndex` should become a richer scan surface.
- `CaseStudyLayout` should own the reusable case structure.
- `ProjectMeta` should become a compact evidence rail.
- `ArchitectureFigure` should remain generic but feel more like a system snapshot.
- `MetricStrip` should support empty or placeholder metrics gracefully.

## Success Criteria

- A visitor can understand the shape of a project before reading paragraphs.
- A future project can be added by editing MDX and frontmatter, not layout code.
- The Work area feels consistent with `FROM MODELS TO SYSTEMS`.
- Existing project content continues to render without requiring new factual details.
