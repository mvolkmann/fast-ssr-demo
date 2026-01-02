import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { stream } from "hono/streaming";
import "@microsoft/fast-ssr/install-dom-shim.js";
import fastSSR from "@microsoft/fast-ssr";
const { templateRenderer } = fastSSR();
function streamHTML(c, html2) {
  c.header("Content-Type", "text/html; charset=utf-8");
  c.header("Transfer-Encoding", "chunked");
  c.header("X-Content-Type-Options", "nosniff");
  const iterator = templateRenderer.render(html2);
  const encoder = new TextEncoder();
  return stream(c, async (stream2) => {
    for (const chunk of iterator) {
      await stream2.write(encoder.encode(chunk));
    }
  });
}
const html = String.raw;
const app = new Hono();
app.use("/*", serveStatic({ root: "." }));
app.get("/greet", async (c) => {
  const name = c.req.query("name");
  const template = html`
    <p>The following are server-side rendered FAST components.</p>
    <hello-world></hello-world>
    <hello-world name=${name}></hello-world>
  `;
  return streamHTML(c, template);
});
serve(app, (info) => {
  console.log(`listing on port ${info.port}`);
});
