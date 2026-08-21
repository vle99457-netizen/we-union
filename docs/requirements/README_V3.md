# WE 企业宣传网站需求 V3.0

本目录用于评审在“不改变文档 1 网站结构及布局”约束下完成的内容整合结果。

## 交付内容

- `WE_网站需求文档_V3.0_企业宣传与产品故事整合版.docx`：以 V2.5 文档为版式基线的完整需求文档，内含 19 张全新桌面端页面预览。
- `previews/`：V00 网站结构总览及 V01–V18 独立页面预览。
- `WE_V3_网站预览总览图.jpg`：19 张页面预览的快速审阅总览。

## 锁定的网站结构

- 主导航：`Logo | CREATE | HONOR | BELONG | CREATE YOURS | STORIES | ABOUT | Search | Account | Cart`。
- 全站不设置 `SHOP`，旧 `/shop` 只做 301 到 `/collections`。
- 首页保持 9 个模块及原顺序。
- 商品发现保持 `/collections` 系列主题入口 → `/collections/{series-slug}` 商品列表 → PDP / 定制。
- PDP 保持桌面 55–60% 媒体 / 40–45% 购买区。
- Create Yours 保持 `CHOOSE → PERSONALIZE → REVIEW → ORDER & TRACK` 与四面预览。

## V3.0 内容映射

- CREATE：White Pulse、Black Rift、Identity Fusion。
- HONOR：只发布 WE 原创或已完成权利核验的内容；Roman Crest 可作为安全的原创方向。
- BELONG：输入文档明确为未来方向，本期仅显示 `COMING SOON`，不生成虚构商品、价格或合作。
- 视觉：Documentary Luxury；官方色名为 WE BLACK / WE WHITE / METAL SILVER。输入文档未提供色值，预览色值均为临时 token。
- 字体：Bebas Neue 用于系列、姓名、号码与展示标题；Helvetica Neue / Neue Haas Grotesk 用于正文与界面。输入文档未指定中文品牌字体。

## GitHub 原型分析

现有 `src/App.tsx` 路由已覆盖文档 1 的核心页面层级，可继续复用。`src/pages.tsx` 已有首页模块、四项承诺与定制四步骨架。`src/data/catalog.ts` 仍含示例系列、价格和可售 BELONG 商品，因此正式开发时必须：

1. 用 CMS / Catalog 的经确认数据替换原型数据；
2. 增加价格、企业主张和授权证据状态；
3. 将 BELONG 置为 Coming Soon；
4. 将 HONOR 内容置于 rights-gated 发布流程；
5. 保持现有 IA 与布局，不重构为按运动项目或通用商城导航。

## 上线前待确认

公司法定主体、成立时间、工厂 / 产能、MOQ、真实材料参数、检测与认证、价格、库存、制作周期、配送 / 退换政策、正式品牌色值、中文字体，以及所有第三方权利证明。以上信息在需求文档和预览中均未被虚构。

预览中的人物、服装、工艺、社群与设计工作室素材使用内置图像生成工具制作，提示方向为“Documentary Luxury、成年人、原创无品牌运动服、无联盟 / 球队 / 运动员 / 赞助商标识”，仅用于结构和视觉方向评审。
