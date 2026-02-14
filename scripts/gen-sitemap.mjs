import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const base = "https://www.stoppclock.com";

// Static routes
const staticRoutes = [
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
  // Blog Index
  "/blog",
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

// Auto-discover blog posts from the content directory
async function getBlogRoutes() {
  const blogContentDir = path.join(__dirname, "../src/data/blog-content");
  const blogRoutes = [];

  try {
    // Read the index.ts to extract the exported blog post slugs
    const indexPath = path.join(blogContentDir, "index.ts");
    const indexContent = await fs.readFile(indexPath, "utf8");

    // Extract slugs from the blogPosts object
    // Look for patterns like: 'slug-name': postVariable,
    const slugMatches = indexContent.match(/'([^']+)':\s*\w+/g);
    if (slugMatches) {
      for (const match of slugMatches) {
        const slug = match.match(/'([^']+)'/)?.[1];
        if (slug) {
          blogRoutes.push(`/blog/${slug}`);
        }
      }
    }
  } catch (error) {
    console.warn("[sitemap] Could not auto-discover blog routes:", error.message);
    // Fallback to known blog routes
    blogRoutes.push(
      "/blog/pomodoro-timer-online",
      "/blog/pomodoro-vs-countdown"
    );
  }

  return blogRoutes;
}

// Additional content routes (guides, etc.)
const additionalContentRoutes = [
  "/blog/countdown-timer-guide",
];

async function generateSitemap() {
  const blogRoutes = await getBlogRoutes();
  const routes = [...staticRoutes, ...blogRoutes, ...additionalContentRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(p => {
  let priority = "0.6";
  if (p === "/") priority = "1.0";
  else if (p.startsWith("/blog") || p.startsWith("/timer-for")) priority = "0.8";

  return `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
}).join("\n")}
</urlset>`;

  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/sitemap.xml", xml, "utf8");
  console.log("[sitemap] Generated dist/sitemap.xml with", routes.length, "routes");
  console.log("[sitemap] Blog routes:", blogRoutes.length);
}

generateSitemap();
