import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { posix } from "https://deno.land/std@0.192.0/path/mod.ts";
import Downloader from "npm:nodejs-file-downloader"
import { copy } from "https://deno.land/std@0.192.0/bytes/copy.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

let config: Record<string | number | symbol, never>;
try{
  config = JSON.parse(Deno.readTextFileSync(Deno.execPath().split("/").slice(0, -1).join("/") + "/config.json"));
} catch (_e) {
  console.log("config.json not found, might be in development mode");
  config = JSON.parse(Deno.readTextFileSync("./config.json"));
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/upload") {
    console.log("upload");
    const fileName = url.searchParams.get("fileName");
    const type = url.searchParams.get("type");

    if (!fileName || !type) return new Response("files or type not provided", { status: 400 });

    const file = await Deno.open(posix.join(config.locations[type], fileName), { create: true, write: true, append: true });
    //@ts-ignore it will be a chunck
    copy(req.body, file);
    file.close();

    return new Response("uploaded", {status: 200});
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
      skipExistingFileName: true,
      onProgress: function (percentage: number, chunk: ArrayBuffer, remainingSize: number) {
        //Gets called with each chunk.
        console.log("% ", percentage);
        console.log("Current chunk of data: ", chunk);
        console.log("Remaining bytes: ", remainingSize);
      },
    });
    await downloader.download();

    return new Response(JSON.stringify({message: "downloaded",}));
  }

  return new Promise((resolve, reject) => {
    resolve(new Response("Hello World"));
  });
}

try {
  serve(handler, { port: config.port, hostname: config.hostname });
} catch (e) {
  console.log('Error: ', e);
}