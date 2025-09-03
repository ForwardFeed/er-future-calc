// File took from https://github.com/cheikhn414/bun-static-files-server/blob/master/static-server.ts

import { serve } from "bun";
import { watch } from "fs";
import path from "path";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
      short: 'p',
      default: '8080',
      required: false,
    },
    dir: {
      type: 'string',
      short: 'd',
      default: '../ui/dist/',
      required: false,
    }
  },
  allowPositionals: true,
})
const PORT = +values.port;
const PUBLIC_DIR = values.dir



const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".wasm": "application/wasm",
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
}

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;
    
    if (filePath === "/") {
      filePath = "/index.html";
    }
    
    const fullPath = path.join(PUBLIC_DIR, filePath);
    
    try {
      const file = Bun.file(fullPath);
      const exists = await file.exists();
      
      if (!exists) {
        return new Response("404 - File Not Found", { 
          status: 404,
          headers: { "Content-Type": "text/plain" }
        });
      }
      
      const mimeType = getMimeType(fullPath);
      return new Response(file, {
        headers: { 
          "Content-Type": mimeType,
          "Cache-Control": "no-cache"
        }
      });
    } catch (error) {
      return new Response("500 - Internal Server Error", { 
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
});


watch(PUBLIC_DIR, { recursive: true }, (eventType, filename) => {
  if (filename) {
    console.log(`File modified : ${filename}`);
  }
});

console.log(`Running Custom Server at
http://localhost:${server.port}/
With directory ${PUBLIC_DIR}`)