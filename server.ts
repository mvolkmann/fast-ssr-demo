import { type Context, Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import "@microsoft/fast-ssr/install-dom-shim.js";
import fastSSR from "@microsoft/fast-ssr";

const { defaultRenderInfo, templateRenderer } = fastSSR();
console.log("server.ts : defaultRenderInfo =", defaultRenderInfo);

const html = String.raw;
const app = new Hono();

app.use("/*", serveStatic({ root: "." }));

// This returns HTML that includes server-side rendered FAST components.
app.get("/greet", async (c: Context) => {
  const name = c.req.query("name");
  const template = html`
    <p>The following are server-side rendered FAST components.</p>
    <hello-world></hello-world>
    <hello-world name=${name}></hello-world>
  `;
  const result = templateRenderer.render(template, defaultRenderInfo);
  return c.html(result);
});

serve(app, (info) => {
  console.log(`listing on port ${info.port}`);
});
