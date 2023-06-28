import { serve } from "https://deno.land/std/http/server.ts";
import { posix } from "https://deno.land/std@0.192.0/path/mod.ts";
import Downloader from "npm:nodejs-file-downloader"

const config = JSON.parse(Deno.readTextFileSync("./config.json"));

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/upload") {
    console.log("upload");
    const data = await req.formData();
    const files = data.getAll("files");
    const type = data.get("type")?.toString().toLowerCase();

    for (let file of files) {
      file = file as File;
      const content = await file.arrayBuffer();

      if (type) {
        const location = posix.join(posix.fromFileUrl(`file://${config.locations[type]}`), file.name);
        Deno.writeFileSync(location, new Uint8Array(content));
      } else {
        return new Response("type not provided", { status: 400 });
      }
    }

    return new Response("uploaded");
  } 
  else if (path === "/link") {
    console.log("link");
    const data = await req.formData();
    const url = data.get("link")?.toString();
    const type = data.get("type")?.toString().toLowerCase();
    if (!type || !url) return new Response("type or link not provided", { status: 400 });

    const downloader = new Downloader({
      url,
      directory: config.locations[type],
    });
    await downloader.download();

    return new Response("downloaded");
  }

  return new Promise((resolve, reject) => {
    resolve(new Response("Hello World"));
  });
}

serve(handler, { port: 3000 });