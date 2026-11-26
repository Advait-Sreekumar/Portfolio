import { readdir, mkdir, copyFile, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "public", "certificates");
await mkdir(output, { recursive: true });
const folders = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.toLowerCase() === "certificates");
const entries = [];
for (const folder of folders) {
  for (const file of (await readdir(join(root, folder.name), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const extension = extname(file.name).toLowerCase();
    if (!file.isFile() || ![".pdf", ".png", ".jpg", ".jpeg", ".webp"].includes(extension)) continue;
    const source = join(root, folder.name, file.name);
    const hash = createHash("sha256").update(await readFile(source)).digest("hex").slice(0, 16);
    const asset = `${hash}${extension}`;
    await copyFile(source, join(output, asset));
    let image = extension === ".pdf" ? undefined : `/certificates/${asset}`;
    if (extension === ".pdf") {
      const preview = join(output, `${hash}-preview`);
      if (!await stat(`${preview}.png`).catch(() => null)) {
        const result = spawnSync(process.env.PDFTOPPM_PATH || "pdftoppm", ["-f", "1", "-singlefile", "-scale-to", "1000", "-png", source, preview], { windowsHide: true });
        if (result.error || result.status !== 0) console.warn(`PDF preview unavailable for ${file.name}; original PDF remains accessible. Install Poppler or set PDFTOPPM_PATH to enable previews.`);
      }
      if (await stat(`${preview}.png`).catch(() => null)) image = `/certificates/${hash}-preview.png`;
    }
    entries.push({ name: basename(file.name, extname(file.name)).replace(/[_]+/g, " ").replace(/\s+/g, " ").trim(), fileName: file.name, format: extension.slice(1).toUpperCase(), image, verifyUrl: `/certificates/${asset}` });
  }
}
await writeFile(join(root, "src", "data", "certificates.generated.json"), `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Certificates: ${entries.length} files indexed.`);
