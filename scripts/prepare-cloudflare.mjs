import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const maxAssetSize = 25 * 1024 * 1024;

async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await prepare(file);
      continue;
    }
    if ((await stat(file)).size <= maxAssetSize) continue;

    // Only modify exported copies; keep the original photography in public/.
    if (/\.jpe?g$/i.test(file)) {
      const compressed = await sharp(await readFile(file))
        .rotate()
        .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
      await writeFile(file, compressed);
      console.log(`Compressed ${file} to ${(compressed.length / 1024 / 1024).toFixed(1)} MiB`);
    }

    if ((await stat(file)).size > maxAssetSize) {
      throw new Error(`${file} exceeds Cloudflare's 25 MiB asset limit.`);
    }
  }
}

// Vercel builds run a Next.js server instead of a static export, so there is no out/.
if (process.env.VERCEL) console.log("Vercel build: skipping Cloudflare asset preparation.");
else await prepare("out");
