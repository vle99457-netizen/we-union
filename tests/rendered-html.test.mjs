import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("preserves the key storefront route set", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("routes", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const routes = [
    "/",
    "/collections",
    "/collections/water-ripple",
    "/collections/black-rift",
    "/shop",
    "/world/create",
    "/product/water-ripple-24-jersey",
    "/custom",
    "/create-yours",
    "/cart",
    "/checkout",
    "/account",
    "/track",
    "/stories",
    "/craftsmanship",
    "/community",
    "/about",
    "/support",
    "/team-orders",
    "/search",
    "/policies/shipping",
    "/admin",
  ];

  for (const route of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 200, `${route} should render`);
  }
});

test("keeps customer-facing source aligned to WE V2.4", async () => {
  const source = await readFile(new URL("../app/site-app.tsx", import.meta.url), "utf8");
  const data = await readFile(new URL("../app/data.ts", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const customerSource = `${source}\n${data}\n${layout}`;

  assert.doesNotMatch(customerSource, /WE UNION|\bUnion\b|SHOP BY/);
  assert.doesNotMatch(customerSource, /[—–]/);
  assert.match(customerSource, /segments\[0\] === "collections"/);
  assert.match(customerSource, /segments\[0\] === "custom"/);
  assert.match(customerSource, /ORIGINAL DESIGN/);
  assert.match(customerSource, /STRICT QUALITY INSPECTION/);
});

test("passes the repeatable web design guidelines gate", async () => {
  const source = await readFile(new URL("../app/site-app.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /\bautoFocus\b/);
  assert.doesNotMatch(css, /transition:\s*all\b/);
  assert.doesNotMatch(css, /outline:\s*(?:0|none)\b/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /safe-area-inset/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(layout, /@fontsource\/bebas-neue/);
  assert.match(layout, /@fontsource\/roboto/);
  assert.match(source, /function replaceQuery/);
  assert.match(source, /beforeunload/);
  assert.match(source, /<img src=\{src\} alt=\{alt\} width=\{width/);

  const controls = [...source.matchAll(/<(input|select|textarea)\b([^>]*)>/g)];
  assert.ok(controls.length > 0, "expected form controls in the storefront");
  for (const [, element, attributes] of controls) {
    assert.match(attributes, /\bname=/, `${element} must have a name`);
  }

  for (const match of source.matchAll(/placeholder="([^"]*)"/g)) {
    assert.ok(match[1].endsWith("…"), `placeholder must end with an ellipsis: ${match[1]}`);
  }
});

test("keeps the required homepage module order", async () => {
  const source = await readFile(new URL("../app/site-app.tsx", import.meta.url), "utf8");
  const homeStart = source.indexOf("function HomePage");
  const homeEnd = source.indexOf("function CollectionsGatewayPage");
  const home = source.slice(homeStart, homeEnd);
  const modules = [
    'className="hero"',
    'className="section worlds-section"',
    'className="section featured-series"',
    'className="create-banner"',
    'className="section craft-section"',
    'className="promise-section"',
    'className="section stories-section"',
    'className="community-banner"',
    "<Newsletter />",
  ];
  let previous = -1;
  for (const marker of modules) {
    const current = home.indexOf(marker);
    assert.ok(current > previous, `${marker} must appear in the required order`);
    previous = current;
  }
});

test("routes every CREATE entry through the series gateway", async () => {
  const source = await readFile(new URL("../app/site-app.tsx", import.meta.url), "utf8");
  const gatewayStart = source.indexOf("function CollectionsGatewayPage");
  const gatewayEnd = source.indexOf("function CollectionPage");
  const gateway = source.slice(gatewayStart, gatewayEnd);

  assert.match(source, /\["CREATE", "\/collections"\]/);
  assert.match(source, /slug === "create" \? "\/collections"/);
  assert.match(source, /if \(key === "create"\) return <CollectionsGatewayPage \/>/);
  assert.match(gateway, /SERIES_SLUGS\.map/);
  assert.match(gateway, /SeriesFeature/);
  assert.doesNotMatch(gateway, /ProductCard|formatPrice|QUICK ADD|shop-filters/);
});
