import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { posix } from "https://deno.land/std@0.192.0/path/mod.ts";
import Downloader from "npm:nodejs-file-downloader"
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

const config = JSON.parse(Deno.readTextFileSync(Deno.execPath().split("/").slice(0, -1).join("/") + "/config.json"));

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/upload") {
    console.log("upload");
    const data = await req.formData();
    const files = data.getAll("files");
    const type = data.get("type")?.toString().toLowerCase();

    if (!files || !type) return new Response("files or type not provided", { status: 400 });

    for (let file of files) {
      console.log("next file")
      file = file as File;
      const content = await file.arrayBuffer();
      console.log({file, content})

      if (type) {
        const location = posix.join(config.locations[type], file.name);
        console.log("ready to write")
        Deno.writeFileSync(location, new Uint8Array(content));
        console.log("written")
      } else {
        return new Response("type not provided", { status: 400 });
      }
    }

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

serve(handler, { port: config.port, hostname: config.hostname });