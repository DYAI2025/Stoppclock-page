import fs from "fs/promises";

const base = "https://www.stoppclock.com";
const routes = [
  "/",
  "/analog",
  "/stopwatch",
  "/countdown",
  "/digital",
  "/world",
  "/alarm",
  "/metronome",
  "/chess"
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(p => `  <url><loc>${base}${p}</loc></url>`).join("\n")}
</urlset>`;

await fs.mkdir("dist", { recursive: true });
await fs.writeFile("dist/sitemap.xml", xml, "utf8");
console.log("[sitemap] Generated dist/sitemap.xml with", routes.length, "routes");
