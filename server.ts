import { type Context, Hono } from "hono";
import { stream } from "hono/streaming";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
// The next import must precede the import that follows it.
import "@microsoft/fast-ssr/install-dom-shim.js";
import fastSSR from "@microsoft/fast-ssr";

const { templateRenderer } = fastSSR();

const html = String.raw;
const app = new Hono();

app.use("/*", serveStatic({ root: "." }));

function streamHTML(c: Context, html: string) {
  // The type of result is IterableIterator<string>.
  const iterator = templateRenderer.render(html);

  c.header("Content-Type", "text/html; charset=utf-8");
  c.header("Transfer-Encoding", "chunked");
  c.header("X-Content-Type-Options", "nosniff"); // security measure
  const encoder = new TextEncoder();

  return stream(c, async (stream) => {
    for (const chunk of iterator) {
      await stream.write(encoder.encode(chunk));
    }
  });
}

// This returns HTML that includes server-side rendered FAST components.
app.get("/greet", async (c: Context) => {
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
