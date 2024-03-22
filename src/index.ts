import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";

import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import App from "./react/App";

await Bun.build({
  entrypoints: ['./src/react/index.tsx'],
  outdir: './public',
});

const app = new Elysia()
  .use(staticPlugin())
  .get("/", async () => {
    const app = createElement(App);

    const stream = await renderToReadableStream(app, {
      bootstrapScripts: ["./public/index.js"],
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
