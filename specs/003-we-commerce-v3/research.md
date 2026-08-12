# Research and Method Synthesis

This specification uses the official repositories below as process references. Named skills that were not callable in the active environment are not represented as executed; their published methods were synthesized instead.

| Method | Source | Applied to WE | Execution status |
|---|---|---|---|
| Superpowers / brainstorming | https://github.com/obra/superpowers | 先澄清目标、约束与成功标准，再形成规格；本次为文档重构，不进入网站代码实现。 | 官方仓库方法论采用；同名插件安装请求未在本轮变为可调用能力 |
| Anthropic skills / doc-coauthoring + artifact skills | https://github.com/anthropics/skills | 以单一事实源派生 DOCX、PDF、PPTX、XLSX；通过渲染检查确保跨格式一致。 | 官方仓库方法论采用；本地使用 Documents/PDF/Presentations/Spreadsheets 能力执行 |
| GitHub Spec Kit | https://github.com/github/spec-kit | 将需求拆为 spec、plan、tasks、data model 与 API contract，并写入独立 GitHub 分支。 | 官方仓库模板方法采用 |
| BMAD / PRD | https://github.com/bmad-code-org/BMAD-METHOD | 补齐愿景、用户、范围、功能/非功能需求、风险、优先级与验收闭环。 | 官方仓库方法论采用 |
| UI/UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | 形成 Master Design System，并为 Homepage、Collection、PDP、Create 定义页面覆盖规则。 | 官方仓库方法论采用 |
| Frontend Design | https://github.com/anthropics/skills/tree/main/skills/frontend-design | 强调原创视觉主张、图像优先、克制动效与避免通用模板化页面。 | 官方仓库方法论采用 |
| Vercel Web Interface Guidelines | https://github.com/vercel-labs/web-interface-guidelines | 落实键盘、焦点、目标尺寸、URL 状态、表单、动效、响应式与性能验收规则。 | 官方仓库规范采用 |
| Website Requirements Orchestrator | 本项目编排层 | 把品牌、商品发现、定制、交易、内容、后台、NFR 和交付任务归入统一追踪矩阵。 | 未发现同名可调用技能；本次以等价编排流程执行 |

## Current repository facts

- Stack: React 19, TypeScript, Vite, React Router, Motion and Phosphor Icons.
- Quality gates: type check, tests, source audit, route smoke and production build.
- Current data is prototype content; commercial catalog, inventory, pricing, auth, payment, fulfillment, CRM, CMS and analytics remain integration boundaries.
- The specification preserves all existing routes and the approved V2.7 information architecture.