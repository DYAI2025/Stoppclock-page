import fs from "fs/promises";

const base = "https://www.stoppclock.com";

// Alle Routes inkl. Blog + DFY-Pages + Content-Pages
const routes = [
  // Main Routes
  "/",
  "/analog",
  "/stopwatch",
  "/countdown",
  "/pomodoro",
  "/cooking",
  "/couples",
  "/digital",
  "/world",
  "/alarm",
  "/metronome",
  "/chess",
  "/timesince",
  "/timelab",
  // Content/Blog Routes
  "/blog",
  "/blog/pomodoro-timer-online",
  "/blog/pomodoro-vs-countdown",
  // DFY Pages (Timer für...)
  "/timer-for-students",
  "/timer-for-productivity",
  "/timer-for-fitness",
  "/timer-for-cooking",
  "/timer-for-meditation",
  "/timer-for-focus",
  // Info Pages
  "/time-philosophy",
  "/about",
  "/contact",
  "/imprint",
  "/privacy",
  "/impressum",
  "/datenschutz",
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(p => `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : p.startsWith("/blog") || p.startsWith("/timer-for") ? "0.8" : "0.6"}</priority></url>`).join("\n")}
</urlset>`;

await fs.mkdir("dist", { recursive: true });
await fs.writeFile("dist/sitemap.xml", xml, "utf8");
console.log("[sitemap] Generated dist/sitemap.xml with", routes.length, "routes");
