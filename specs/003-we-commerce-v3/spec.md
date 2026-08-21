# WE Website Requirements V3.0

**Status:** Draft for cross-functional review  
**Date:** 2026-08-12  
**Baseline:** V2.7 requirements + current `main` implementation  
**Structure lock:** Existing routes, 19 page types, primary navigation, and the 9-part homepage order remain unchanged.

> WE is an original sportswear brand that turns names, numbers, colors, city context, and personal stories into manufacturable personalized garments.

## 1. Locked decisions

| ID | Decision | Status | Rationale |
|---|---|---|---|
| D01 | 保持 V2.7 页面结构与路由不变 | Approved | 用户明确要求结构不改变；V3.0 只强化规格、UI 规则与验收。 |
| D02 | 主导航删除 SHOP | Approved | 产品发现由系列入口、搜索和 Footer 承接。 |
| D03 | 品牌可见名称使用 WE | Approved | 技术仓库 slug 与指定法务声明属于例外，不出现在营销品牌位。 |
| D04 | 首页商品发现按系列主题带，不用四列卡片 | Approved | 先建立纹理与系列记忆，再进入商品列表。 |
| D05 | V04 增加 FIND YOUR CITY | Approved | 城市选择为发现过滤器，不改变当前 SKU。 |
| D06 | Create 底部常驻指定英文声明 | Approved | 真实 DOM 文本、Footer 前、不阻断流程。 |
| D07 | 首期保留 2D 多视角预览 | Approved | 实时 3D 仿真列入 P2，不阻塞交易闭环。 |
| D08 | GitHub 仅提交轻量规格源文件 | Approved | 大体积 DOCX/PDF/PPTX/XLSX 保存到 Library，避免仓库膨胀。 |

## 2. Users and outcomes

| ID | Persona | Need | Success |
|---|---|---|---|
| P01 | Identity-led buyer / 身份表达型个人买家 | 快速理解 WE 的原创设计语言，从系列进入单品，并用姓名、号码、配色表达个人故事。 | 在不接触受保护标识的前提下完成选款、预览、下单与追踪。 |
| P02 | Gift buyer / 个性礼物购买者 | 用明确的示例、价格变化、交付时间和礼物语境降低定制不确定性。 | 能保存、复核并放心购买，收件前持续查看生产与配送状态。 |
| P03 | Team organizer / 团体组织者 | 提交人数、预算、日期、颜色与名单，获得可追踪的 Brief、报价和校样流程。 | 一次确认基础设计，成员信息可批量管理，审批与生产节点清晰。 |
| P04 | City discovery shopper / 城市主题发现用户 | 通过城市语境发现 WE 原创商品，同时清楚知道城市标签不是官方球队或联盟授权。 | 搜索、筛选、分享和返回都保留城市状态，且不会改变当前 SKU 选择。 |

## 3. Information architecture

| ID | Page | Route | Job | Status |
|---|---|---|---|---|
| V01 | Homepage | / | 品牌与商品发现 | 已实现原型；按 V3.0 规格升级内容与验收 |
| V02A | Collection Gateway | /collections | 一行一个系列的全宽主题入口 | 已实现原型 |
| V02B | Collection Product List | /collections/:series-slug | 系列内商品筛选与比较 | 已实现原型 |
| V03 | World Landing | /create \| /honor \| /belong | 三大品牌世界 | 已实现原型 |
| V04 | Product Detail | /products/:slug | 商品详情、城市发现与购买入口 | PDP 已有；FIND YOUR CITY 待实现 |
| V05 | Create Yours | /custom \| /custom/saved/:id | 四步个性化定制 | 原型已有；声明与权利审查流程需锁定 |
| V06 | Cart | /cart | 购物车与设计版本确认 | 已实现原型；真实服务待接入 |
| V07 | Checkout | /checkout | 联系、配送、支付、复核 | 演示页面；支付不得伪装为真实 |
| V08 | Account / Saved Designs | /account \| /account/saved-designs | 账户与保存设计 | 已实现原型；认证待接入 |
| V09 | Order Tracking | /track \| /account/track | 生产、质检与物流追踪 | 已实现原型；履约数据待接入 |
| V10 | Stories Index | /stories | 品牌故事索引 | 已实现原型 |
| V11 | Story Detail | /stories/:slug | 长篇品牌内容 | 已实现原型 |
| V12 | Craftsmanship | /craftsmanship | 工艺与可核验证明 | 已实现原型 |
| V13 | Community | /community | 穿着展示与 UGC | 已实现原型；授权流程待接入 |
| V14 | About | /about | 品牌介绍与 Three Worlds | 已实现原型 |
| V15 | Support / FAQ | /support \| /faq | 帮助、政策和上下文检索 | 已实现原型 |
| V16 | Team & Group Orders | /team \| /custom/team | 团体定制 Brief 与询价 | 已实现原型；CRM 待接入 |
| V17 | Site Search | /search | 商品、系列、故事和支持搜索 | 已实现原型；需扩展 city 参数 |
| V18 | Policy / Guide | /legal/:slug | 政策与指南 | 已实现原型；正式法务文本待审 |
| V19 | Not Found | * | 错误恢复与继续浏览 | 已实现原型 |

## 4. Global product rules

- Customer-facing brand is `WE`; the historical repository slug and the approved legal notice are technical/legal exceptions.
- Primary navigation: CREATE / HONOR / BELONG / CREATE YOURS / STORIES / ABOUT. No SHOP entry.
- Display font: Bebas Neue. Body and functional UI: Roboto. Chinese fallback: Noto Sans CJK SC.
- Gateway pages show one full-width series per row. Product grids appear only after entering a series.
- All filters, sorting, pagination, search and city selection are URL-addressable.
- No fabricated reviews, inventory, pricing, delivery or transaction success.

## 5. Page specifications

### V01 Homepage / 品牌首页

**Purpose:** 在首屏回答 WE 是谁、为什么不同、用户下一步去哪里；再用九段固定顺序完成品牌—系列—定制—信任—内容转化。

**Modules**

- Hero：WE / GEAR MADE PERSONAL，主 CTA 进入系列，次 CTA 进入 Create Yours。
- Three Worlds：CREATE / HONOR / BELONG 三联叙事，移动端按纵向卡片排列。
- New & Featured：改为系列主题陈列；不在首页出现四列商品网格。
- Create Yours：Choose、Personalize、Review、Order & Track 四步。
- Craftsmanship：Embroidery、Materials、Construction、Inspection。
- 四项轻承诺：原创设计、个性化定制生产、严格质检、全程追踪配送；只回答这四件事。
- Stories；Worn Your Way / Community；Newsletter / Footer。

**States:** Hero 媒体加载失败、系列未发布、故事为空、Newsletter 成功/错误；每个状态保留可继续路径。

**Analytics:** `view_home_module、select_world、select_series、begin_customization、view_story、newsletter_submit。`

**Acceptance:** 桌面与移动端顺序均为九段；导航无 SHOP；首屏仅一个 H1；每个模块最多两个主动作；无虚构销量、评价或库存。

### V02A Collection Gateway / 系列主题入口

**Purpose:** 以一行一个系列的全宽主题带承接商品发现：先看独有纹理与代表产品，再进入系列商品列表。

**Modules**

- Water Ripple：浅色流体/水波纹背景，使用指定白色绿纹服装及纹理特征。
- Crack：深色裂纹背景，使用指定黑色蓝裂纹服装及纹理特征。
- 后续系列采用同一结构：序号、World、系列名、短句、2–4 件代表产品、唯一 CTA。

**States:** Published + Sellable 才显示；无在售商品时系列入口不发布；图片失败显示同色系纹理占位与文本。

**Analytics:** `view_series_gateway、select_series、gateway_impression。`

**Acceptance:** 1440 px 全宽主题带高度 640–760 px；移动端高度随内容增长；整带和 CTA 都可进入 /collections/{slug}；不出现价格/库存/Quick Add。

### V02B Collection Product List / 系列商品列表

**Purpose:** 在用户已选定系列后完成筛选、排序、比较和进入商品详情。

**Modules**

- 系列 Hero 不超过首屏 25%，含标题、说明、面包屑与结果数。
- 筛选：Product Type、Ready to Ship / Customizable、Fit、Size、Color、Price、Availability。
- 排序：Featured、Newest、Price Low to High、Price High to Low。
- 桌面 3 列，平板 2–3 列，移动 2 列，320 px 可回退 1 列。

**States:** 加载骨架与最终卡片等高；0 结果提供 Clear Filters 与 Back to All Series；错误可 Retry。

**Analytics:** `view_series_list、apply_filter、sort_series_list、select_product、load_more。`

**Acceptance:** 筛选/排序/分页写入 URL；刷新、分享与后退保持状态；商品卡只显示真实可用信息。

### V03 World Landing / Three Worlds 落地页

**Purpose:** 分别解释 CREATE、HONOR、BELONG 的意义，并连接相关系列、故事和定制入口。

**Modules**

- 单一情绪 Hero
- World manifesto
- 相关系列主题带
- 相关故事
- Create Yours 或系列 CTA

**States:** 无关联系列时回退到品牌故事与 /collections；不得出现空白死路。

**Analytics:** `view_world、select_world_series、select_world_story。`

**Acceptance:** 每页一个 H1；图片、语气和内容语义与对应 World 一致；不复用同一 Hero 图形成模板感。

### V04 Product Detail / 商品详情页

**Purpose:** 完整展示原创商品、价格、变体、工艺与交付信息，并在购买区顶部提供 FIND YOUR CITY 城市商品发现。

**Modules**

- 55–60% 媒体画廊；40–45% sticky 商品摘要与购买区。
- FIND YOUR CITY：搜索输入、热门城市 Chip、选中城市结果摘要和 View All。
- 标题、系列、价格、颜色、尺码、库存/制作状态、Add to Bag、Customize This Piece。
- Craft & materials、Production timeline、Shipping & returns、Reviews/Community、Related。

**States:** 城市搜索初始、输入、建议、加载、结果、0 结果、错误；SKU 加载、缺货、不可定制、价格变化、加入购物车中。

**Analytics:** `view_product、city_search_open、city_suggestion_select、city_result_click、select_variant、add_to_cart、begin_customization。`

**Acceptance:** 城市状态进入 /search?city={city-slug}；选择城市不得更改 SKU/价格/尺码；城市只是 WE 原创编辑标签，不暗示联盟/球队/运动员授权。

### V05 Create Yours / 个性化定制器

**Purpose:** 通过 Choose、Personalize、Review、Order & Track 四步，让用户在 WE 原创基础版型上完成可生产、可审查、可复核的个性化设计。

**Modules**

- Step 1：选择原创模板、版型、尺码、数量。
- Step 2：姓名、号码、颜色、字体、补丁/原创图形、面料/工艺与位置。
- Step 3：Front / Back / Left / Right 预览、价格变化、权利确认和 Proof Version。
- Step 4：个人下单或团队询价，并进入生产/质检/配送追踪。
- 主内容最下方、Footer 之前显示固定 CREATE CONTENT NOTICE。

**States:** 自动保存、未保存、恢复、校验错误、图稿上传/审查、超出生产边界、价格计算、网络错误。

**Analytics:** `begin_customization、custom_step_complete、custom_validation_error、save_design、share_design、request_bulk_quote、add_custom_to_cart。`

**Acceptance:** 所有关键选项即时反映到预览与价格；声明为真实 DOM 文本，不弹窗、不强制勾选、不遮挡主 CTA；上传图稿必须经过授权声明与 IP 审查。

### V06–V09 Cart / Checkout / Account / Tracking

**Purpose:** 将已确认的 SKU、Design ID、Proof Version 与订单状态贯通到支付、账户和履约追踪。

**Modules**

- Cart：行项目、变体、定制摘要、Edit Design、数量、删除/撤销、费用摘要。
- Checkout：Contact、Delivery、Payment、Review；未接真实支付时必须标明演示。
- Account：Profile、Addresses、Orders、Saved Designs、Reorder、Returns/Issues。
- Tracking：Design Review、Awaiting Approval、In Production、Quality Inspection、Packed、Shipped、Delivered。

**States:** 购物车为空/库存变化/价格变化；支付处理中/失败；认证过期；订单状态异常与 Action Required。

**Analytics:** `view_cart、begin_checkout、purchase、payment_error、view_order_status、reorder。`

**Acceptance:** 定制行项目保存 Design ID 与 Proof Version；支付幂等；任何原型/未接服务不得伪造成真实完成状态。

### V10–V16 Stories / Craft / Community / About / Support / Team

**Purpose:** 用原创内容、工艺证据、社区授权与团体服务建立品牌深度和购买信任。

**Modules**

- Stories：Editorial index + story detail；每篇有作者/发布日期/阅读时间/相关系列。
- Craftsmanship：Embroidery、Materials、Construction、Inspection 的可核验证据。
- Community：真实穿着展示、授权状态、举报/下架、相关商品。
- About：品牌立场、Three Worlds、团队与产地信息（核实后发布）。
- Support：订单状态、Create 指南、尺码、配送/退换、FAQ 和上下文搜索。
- Team Orders：Brief、Design、Roster、Produce，支持文件上传、报价和审批。

**States:** 内容为空、链接失效、UGC 未授权、FAQ 无结果、询价提交/失败。

**Analytics:** `view_story、read_story_complete、view_craft_proof、view_community、support_search、submit_team_brief。`

**Acceptance:** 故事与工艺主张必须有来源；UGC 未授权不发布；团队提交生成可追踪 Request ID。

### V17–V19 Search / Policy / Not Found

**Purpose:** 提供全站检索、正式政策和错误恢复，确保任何入口都有下一步。

**Modules**

- Search：q、city、type、series、sort 等 URL 参数；结果分 Products / Series / Stories / Support。
- Policy：Shipping、Returns、Size Guide、Care、Custom Order Policy、Privacy、Terms、Accessibility。
- 404：清楚说明未找到，并提供 Home、All Series、Create Yours、Support。

**States:** 空查询、0 结果、拼写建议、加载、错误、政策版本历史。

**Analytics:** `search_submit、search_no_results、policy_view、not_found_view、recovery_click。`

**Acceptance:** URL 可分享；搜索不把城市误当语言/位置；政策显示生效日期；404 返回正确状态且不是空白页。

## 6. Data model

| Entity | Fields | Purpose |
|---|---|---|
| Series | id, slug, name, world, status, hero_media, texture_tokens, representative_product_ids, SEO | 系列主题与发布状态 |
| Product | id, slug, series_id, title, description, media, city_tags, variant_ids, personalizable, status | 商品主数据 |
| Variant | id, product_id, SKU, color, size, fit, price, availability, lead_time | 可购买变体 |
| City | id, slug, display_name, state_code, aliases, active, editorial_rank | 城市发现标签；不是第三方授权 |
| Design | id, owner_id, base_product_id, variant_id, layers, proof_version, rights_attestation, review_status | 定制设计与校样 |
| Order | id, customer_id, line_items, totals, payment_status, fulfillment_status, consent_snapshot | 订单与法务快照 |
| ProductionJob | id, order_line_id, design_id, stage, QC_records, timestamps | 生产与质检 |
| Story | id, slug, type, title, author, published_at, series_ids, rights, SEO | 品牌内容 |
| UGCAsset | id, owner, consent_scope, expires_at, revoked_at, product_ids, moderation_status | 社区授权资产 |
| LegalNotice | id, key, locale, version, body, effective_at, status, approved_by | 锁定法务声明 |

## 7. API boundaries

| Method | Endpoint | Purpose | Constraint |
|---|---|---|---|
| GET | /api/series | 发布系列列表 | 可缓存；仅 Published + Sellable |
| GET | /api/series/{slug}/products | 系列内商品与筛选 facet | query: filter, sort, cursor |
| GET | /api/products/{slug} | PDP 主数据、变体、相关内容 | 不得混入模拟库存 |
| GET | /api/cities?query={q} | 城市建议 | 防抖、别名匹配、稳定排序 |
| GET | /api/products?city={slug} | 城市相关 WE 原创商品 | 返回结果数与 canonical |
| POST | /api/designs | 创建 Design ID | 需认证或匿名 session；审计输入 |
| PATCH | /api/designs/{id} | 自动保存定制层 | 乐观并发 + version |
| POST | /api/designs/{id}/assets | 上传原创/授权图稿 | 病毒扫描、格式/尺寸、IP 审查队列 |
| POST | /api/cart/items | 加入标准或定制行项目 | 幂等键、价格版本、Proof Version |
| POST | /api/checkout/session | 创建支付会话 | 服务端价格复核；失败可恢复 |
| GET | /api/orders/{id}/timeline | 订单、生产、质检、物流时间线 | 授权校验；事件驱动 |
| POST | /api/team-briefs | 提交团队询价 | 生成 Request ID；CRM 异步同步 |

## 8. Requirements traceability

| ID | Domain | Route | Priority | Status | Requirement | Verification |
|---|---|---|---|---|---|---|
| BR-001 | Brand | Global | P0 | 已实现 | 所有消费者可见品牌名统一为 WE；技术仓库 slug 与指定法务声明除外。 | 源码文本审计 + 视觉抽查 |
| BR-002 | Brand | Global | P0 | 已实现 | 主导航及移动导航不得出现 SHOP，且不设置同义替代入口。 | 导航快照 + 文本审计 |
| BR-003 | Brand | Global | P0 | 已实现 | 标题统一使用 Bebas Neue；正文、表单和功能 UI 使用 Roboto；中文回退 Noto Sans CJK SC。 | computed font-family 审计 |
| BR-004 | Brand | Global | P0 | 部分实现 | 所有商品、系列、故事、城市标签与定制图形必须为 WE 原创或已取得许可。 | CMS 授权字段 + 发布门禁 |
| BR-005 | Brand | Global | P1 | 部分实现 | 官方 WE Logo 使用批准的矢量或高分辨率资产，不拉伸、不加阴影、不重绘。 | 图像资产审计 |
| IA-001 | IA | Global | P0 | 已实现 | 保留 19 类页面与既有路由，不重排信息架构。 | route smoke |
| IA-002 | IA | Global | P0 | 已实现 | 桌面主导航固定为 CREATE / HONOR / BELONG / CREATE YOURS / STORIES / ABOUT。 | 导航快照 |
| IA-003 | IA | Global | P0 | 已实现 | 搜索、账户、购物袋作为图标动作，均具有可读 aria-label。 | 无障碍树审计 |
| IA-004 | IA | Global | P0 | 部分实现 | 所有筛选、排序、分页、搜索和城市选择写入 URL，支持刷新、分享和后退。 | 端到端 URL 状态测试 |
| IA-005 | IA | Global | P0 | 已实现 | 每个页面只有一个 H1，并提供 main landmark 与 Skip to content。 | route smoke + a11y audit |
| IA-006 | IA | Global | P1 | 部分实现 | 返回上一页恢复滚动位置；深链接后的标题使用 scroll-margin-top。 | 浏览器导航测试 |
| HOME-001 | Homepage | / | P0 | 待验收 | 首页按九段固定顺序呈现，不增删、不交换。 | 结构快照 |
| HOME-002 | Homepage | / | P0 | 待验收 | Hero 回答 WE 是谁，并提供 Explore Originals 与 Create Yours 两个动作。 | 内容/CTA 审计 |
| HOME-003 | Homepage | / | P0 | 已实现 | Three Worlds 只显示 CREATE / HONOR / BELONG。 | 结构快照 |
| HOME-004 | Homepage | / | P0 | 部分实现 | New & Featured 使用系列主题陈列，不使用首页四列商品网格。 | 视觉回归 |
| HOME-005 | Homepage | / | P0 | 部分实现 | Create Yours 采用 Choose / Personalize / Review / Order & Track。 | 内容审计 |
| HOME-006 | Homepage | / | P0 | 待验收 | Craftsmanship 后只展示四项轻承诺，不出现第五项。 | 结构/文案审计 |
| HOME-007 | Homepage | / | P1 | 部分实现 | Stories、Community 与 Newsletter 均有真实下一步与空状态。 | 状态测试 |
| COL-001 | Collections | /collections | P0 | 已实现 | Collection Gateway 一行一个系列、全宽主题带。 | 视觉回归 |
| COL-002 | Collections | /collections | P0 | 待验收 | Water Ripple 使用指定白色绿纹服装与水波纹底图；Crack 使用指定黑色蓝裂纹服装与裂纹底图。 | 资产/视觉审计 |
| COL-003 | Collections | /collections | P0 | 已实现 | Gateway 不显示价格、库存、筛选与 Quick Add。 | DOM 审计 |
| COL-004 | Collections | /collections/:slug | P0 | 部分实现 | 系列列表才显示商品网格、筛选、排序与结果数。 | 路由/DOM 审计 |
| COL-005 | Collections | /collections/:slug | P0 | 部分实现 | 筛选、排序、分页持久化到 URL。 | 端到端测试 |
| COL-006 | Collections | /collections/:slug | P1 | 待实现 | 加载骨架与最终商品卡几何一致，避免 CLS。 | 性能视觉测试 |
| PDP-001 | PDP | /products/:slug | P0 | 部分实现 | 媒体画廊 55–60%，购买区 40–45%，桌面购买区可 sticky。 | 响应式视觉回归 |
| PDP-002 | PDP | /products/:slug | P0 | 待实现 | 购买区顶部新增 FIND YOUR CITY，含搜索框、热门城市、选中结果摘要。 | 组件/端到端测试 |
| PDP-003 | PDP | /products/:slug | P0 | 待实现 | 城市建议支持键盘上下、Enter、Escape，使用 combobox/listbox 语义。 | 键盘/a11y 测试 |
| PDP-004 | PDP | /products/:slug | P0 | 待实现 | 选择城市不得改变当前 SKU、价格、颜色、尺码与数量。 | 状态隔离单元测试 |
| PDP-005 | PDP | /products/:slug | P0 | 待实现 | View All 进入 /search?city={city-slug}，并保留可分享 URL。 | 路由测试 |
| PDP-006 | PDP | /products/:slug | P0 | 待实现 | 城市标签仅代表 WE 原创编辑语境，不暗示第三方官方授权。 | 文案/法务审计 |
| PDP-007 | PDP | /products/:slug | P0 | 部分实现 | 变体选择、库存/制作状态、价格与主动作保持一致。 | PDP 状态测试 |
| PDP-008 | PDP | /products/:slug | P1 | 待实现 | 所有城市搜索状态均有 loading、0 results、error、retry 与 aria-live。 | 状态/a11y 测试 |
| CUS-001 | Create | /custom | P0 | 部分实现 | 定制流程固定为 Choose / Personalize / Review / Order & Track。 | 流程测试 |
| CUS-002 | Create | /custom | P0 | 部分实现 | Front / Back / Left / Right 预览与姓名、号码、字体、颜色、位置同步。 | 状态/视觉测试 |
| CUS-003 | Create | /custom | P0 | 待实现 | 任何影响价格的选项都即时更新 Estimated total 与费用明细。 | 价格引擎测试 |
| CUS-004 | Create | /custom | P0 | 待实现 | 设计自动保存 Design ID 与 Proof Version，并可恢复。 | 持久化测试 |
| CUS-005 | Create | /custom | P0 | 待实现 | 用户上传图稿需进行原创/授权声明、文件安全扫描与 IP 审查。 | 上传/审批集成测试 |
| CUS-006 | Create | /custom | P0 | 待验收 | 页面主内容最下方、Footer 之前常驻指定英文声明。 | DOM 文本精确匹配 |
| CUS-007 | Create | /custom | P0 | 待验收 | 声明不使用弹窗、不要求勾选、不阻挡主流程，且在 320 px 无横向滚动。 | 响应式/a11y 测试 |
| CUS-008 | Create | /custom/team | P1 | 待实现 | 团队订单支持 Brief、Roster、Proof、审批、报价和生产追踪。 | 团队流程测试 |
| COM-001 | Commerce | /cart | P0 | 部分实现 | 定制行项目携带 SKU、Design ID、Proof Version、数量与价格版本。 | 购物车数据测试 |
| COM-002 | Commerce | /checkout | P0 | 待实现 | 支付提交使用幂等键；处理中禁用重复提交并保留原按钮标签。 | 支付集成测试 |
| COM-003 | Commerce | /checkout | P0 | 已实现原型 | 未接真实支付、库存或物流时明确标示 Prototype，不伪造成功。 | 内容/接口审计 |
| COM-004 | Commerce | /account | P1 | 待实现 | 账户、订单、地址和保存设计接入真实认证与权限控制。 | 认证/授权测试 |
| COM-005 | Commerce | /track | P0 | 待实现 | 订单追踪由 OMS/WMS/承运商事件驱动，不使用硬编码状态。 | 事件集成测试 |
| CONTENT-001 | Content | /stories | P1 | 部分实现 | 故事具有作者、发布日期、阅读时间、相关系列与 SEO 字段。 | CMS/SEO 审计 |
| CONTENT-002 | Content | /craftsmanship | P0 | 部分实现 | 工艺、材料、耐久与质检主张必须有来源和版本。 | 发布门禁 |
| CONTENT-003 | Content | /community | P0 | 待实现 | UGC 必须记录授权范围、日期、撤回/下架状态与关联商品。 | UGC 权利审计 |
| CONTENT-004 | Content | /support | P1 | 部分实现 | FAQ 支持分类、搜索、空结果与 Contact / Track Order 下一步。 | 支持流程测试 |
| CMS-001 | CMS | Back office | P0 | 待实现 | Series、Product、City、Story、Craft proof、Policy 与 Legal notice 均可版本化。 | CMS 模型测试 |
| CMS-002 | CMS | Back office | P0 | 待实现 | 发布需满足 required fields、授权、价格/库存、SEO 与预览检查。 | 发布工作流测试 |
| CMS-003 | CMS | Back office | P1 | 待实现 | Legal notice 为 Brand Locked，仅法务/管理员可修改并记录生效日期。 | RBAC/审计日志测试 |
| A11Y-001 | Accessibility | Global | P0 | 部分实现 | 达到 WCAG 2.2 AA；键盘可操作、焦点可见、语义优先。 | axe + 手工键盘 |
| A11Y-002 | Accessibility | Global | P0 | 已实现 | 移动端触控目标至少 44 × 44 px；输入字号至少 16 px。 | computed style 审计 |
| A11Y-003 | Accessibility | Global | P0 | 已实现 | 不禁用浏览器缩放；装饰图 aria-hidden，内容图有准确 alt。 | 源码/a11y 审计 |
| A11Y-004 | Accessibility | Global | P0 | 部分实现 | 异步更新使用 aria-live；错误就地显示，提交后聚焦首个错误。 | 表单/a11y 测试 |
| PERF-001 | Performance | Global | P0 | 待实现 | 移动端 p75 LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.10。 | RUM + Lighthouse |
| PERF-002 | Performance | Global | P0 | 部分实现 | 首屏图片使用 AVIF/WebP、响应式尺寸、显式宽高和必要 preload。 | 资源审计 |
| PERF-003 | Performance | Global | P1 | 待实现 | 静态页面缓存；目录和内容按策略再验证；个人/购物状态不公共缓存。 | 缓存头测试 |
| SEO-001 | SEO | Global | P0 | 待实现 | 每页唯一 title、description、canonical、OG、结构化数据与可索引正文。 | SEO crawler |
| SEC-001 | Security | Global | P0 | 待实现 | CSP、HSTS、CSRF/XSS 防护、限流、文件扫描、秘密管理与依赖更新。 | 安全测试 |
| PRIV-001 | Privacy | Global | P0 | 待实现 | Cookie/分析同意按地区配置；最小化收集上传图稿、地址与订单数据。 | 隐私审计 |
| I18N-001 | Locale | Global | P1 | 待实现 | 默认 en-US；语言按用户设置/Accept-Language，不以 IP 决定语言。 | locale 测试 |
| ANA-001 | Analytics | Global | P0 | 待实现 | 统一事件命名、参数字典、匿名/同意状态与去重规则。 | 分析 QA |
| QA-001 | Quality | Global | P0 | 已实现 | 每个代表路由通过一个 H1、main landmark 与源代码审计。 | npm run smoke:routes + audit:source |
| QA-002 | Quality | Global | P0 | 待实现 | 新增城市与定制流程的组件、端到端、视觉与无障碍回归测试。 | CI 质量门禁 |

## 9. Non-functional requirements

- WCAG 2.2 AA, keyboard operation, visible focus, semantic controls, 44px mobile targets, 16px mobile inputs.
- p75 mobile targets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.10.
- Responsive validation at 320, 375, 768, 1024, 1440 and ultra-wide widths.
- Explicit loading, empty, sparse, dense, error, success and unsaved states.
- CSP, HSTS, CSRF/XSS protections, rate limits, file scanning, RBAC and audit logs.
- Unique metadata, canonical URL, OG, structured data, correct HTTP status and indexable copy.

## 10. Risks

| ID | Risk | Impact | Likelihood | Mitigation | Owner |
|---|---|---|---|---|---|
| R01 | 城市标签被误解为官方球队/联盟授权 | 高 | 高 | 城市文案与视觉避免官方名称/徽标；City 仅为 WE 编辑标签；法务抽检。 | Brand + Legal |
| R02 | 用户上传第三方商标、签名或队徽 | 高 | 高 | 授权声明、自动/人工审查、禁止词与相似性检测、拒绝/申诉流程。 | Legal + Operations |
| R03 | 定制价格、交期与实际生产能力不一致 | 高 | 中 | 规则引擎版本化；下单前服务端复核；订单保存规则快照。 | Product + Production |
| R04 | 视觉大图导致移动端性能下降 | 中 | 高 | 响应式图片、AVIF/WebP、显式尺寸、预算与 RUM。 | Frontend |
| R05 | 原型文案被误认为真实库存/支付/追踪 | 高 | 中 | Prototype 标识；未接服务不可生成假成功状态；上线门禁。 | Product + QA |
| R06 | UGC 权利撤回后仍继续展示 | 高 | 中 | 授权记录、撤回 webhook、内容下架 SLA、CDN 失效。 | Content Ops |
| R07 | 不同格式的需求文档漂移 | 中 | 中 | 单一事实源、统一需求 ID、GitHub PR 审核、Excel 追踪矩阵。 | Product Ops |

## 11. Create content notice

> WE UNION CREATE products are built on original garment designs and customer-led personalization. WE UNION does not reproduce or accept official league, team, athlete, or third-party brand names, logos, wordmarks, signatures, or confusingly similar variations. Customer-submitted artwork must be original or properly authorized and is subject to intellectual property review.

This is Brand Locked content. It appears as real DOM text at the end of `/custom`, before the global footer, without a modal or required checkbox.

## 12. Sources

- [Superpowers / brainstorming](https://github.com/obra/superpowers) — 先澄清目标、约束与成功标准，再形成规格；本次为文档重构，不进入网站代码实现。
- [Anthropic skills / doc-coauthoring + artifact skills](https://github.com/anthropics/skills) — 以单一事实源派生 DOCX、PDF、PPTX、XLSX；通过渲染检查确保跨格式一致。
- [GitHub Spec Kit](https://github.com/github/spec-kit) — 将需求拆为 spec、plan、tasks、data model 与 API contract，并写入独立 GitHub 分支。
- [BMAD / PRD](https://github.com/bmad-code-org/BMAD-METHOD) — 补齐愿景、用户、范围、功能/非功能需求、风险、优先级与验收闭环。
- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 形成 Master Design System，并为 Homepage、Collection、PDP、Create 定义页面覆盖规则。
- [Frontend Design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) — 强调原创视觉主张、图像优先、克制动效与避免通用模板化页面。
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) — 落实键盘、焦点、目标尺寸、URL 状态、表单、动效、响应式与性能验收规则。
- [WE repository](https://github.com/vle99457-netizen/we-union)
