# Data Model

| Entity | Key fields | Purpose |
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

## Invariants

- A sellable variant belongs to one product and has one canonical SKU.
- A city tag is editorial metadata owned by WE and does not imply third-party authorization.
- A customized order line references a Design ID and immutable Proof Version.
- Price and production rules are versioned and snapshotted at checkout.
- UGC cannot be published without an active rights record.
- Legal notice versions are immutable after activation; changes create a new version.