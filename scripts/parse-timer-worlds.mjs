/**
 * Parse timer worlds from markdown files and generate JSON
 * Run: node scripts/parse-timer-worlds.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../public/content/timer-worlds');
const OUTPUT_FILE = path.join(__dirname, '../public/data/timer-worlds.json');

function parseMarkdownWorld(filename, content) {
  const slug = filename.replace(/\.md$/, '');
  const sections = content.split(/^##\s+/m);
  
  // Header section (Title, Tagline, Character)
  const headerPart = sections[0];
  const titleMatch = headerPart.match(/^#\s+(.+)/m);
  const taglineMatch = headerPart.match(/^>\s+(.+)/m);
  
  const name = titleMatch ? titleMatch[1].trim() : slug;
  const tagline = taglineMatch ? taglineMatch[1].trim() : '';
  
  // Find the "Character" part within the header or in a section
  let heroStory = '';
  const characterSection = sections.find(s => s.toLowerCase().startsWith('character'));
  if (characterSection) {
    heroStory = characterSection.replace(/^character\s+/i, '').trim();
  }

  // Parse Rituals
  const rituals = [];
  const ritualsSection = sections.find(s => s.toLowerCase().startsWith('rituals'));
  if (ritualsSection) {
    const rawRituals = ritualsSection.split(/^###\s+/m).slice(1);
    rawRituals.forEach((r, i) => {
      const [title, ...descLines] = r.split('\n');
      const desc = descLines.join('\n').trim();
      rituals.push({
        id: `${slug}-ritual-${i}`,
        title: title.trim(),
        description: desc,
        steps: [] // Future: parse list items as steps
      });
    });
  }

  // Parse Effects
  const effects = [];
  const effectsSection = sections.find(s => s.toLowerCase().startsWith('effects'));
  if (effectsSection) {
    const rawEffects = effectsSection.split(/^###\s+/m).slice(1);
    rawEffects.forEach((e, i) => {
      const [title, ...descLines] = e.split('\n');
      effects.push({
        id: `${slug}-effect-${i}`,
        title: title.trim(),
        description: descLines.join('\n').trim()
      });
    });
  }

  // Parse Facts
  const facts = [];
  const factsSection = sections.find(s => s.toLowerCase().startsWith('facts'));
  if (factsSection) {
    const rawFacts = factsSection.split(/^###\s+/m).slice(1);
    rawFacts.forEach((f, i) => {
      const [title, ...descLines] = f.split('\n');
      const fullContent = descLines.join('\n').trim();
      
      // Extract source if present (looks for [Source: ...] pattern)
      const sourceMatch = fullContent.match(/\[Source:\s*([^\]]+)\]\(([^)]+)\)/);
      let content = fullContent;
      let source = undefined;
      
      if (sourceMatch) {
        source = sourceMatch[2]; // URL
        // Keep the source in content for markdown rendering
      }
      
      facts.push({
        id: `${slug}-fact-${i}`,
        title: title.trim(),
        content,
        source
      });
    });
  }

  return {
    id: slug,
    slug,
    name,
    tagline,
    heroStory,
    rituals,
    effects,
    facts,
    updatedAt: new Date().toISOString()
  };
}

async function parseAllWorlds() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Directory not found: ${CONTENT_DIR}`);
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const allWorlds = {
    version: 1,
    generatedAt: new Date().toISOString(),
    worlds: {}
  };

  console.log(`\n📚 Parsing Timer Worlds from ${CONTENT_DIR}...\n`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      const worldData = parseMarkdownWorld(file, content);
      allWorlds.worlds[worldData.slug] = worldData;
      console.log(`✅ Parsed: ${worldData.name} (${worldData.slug})`);
    } catch (err) {
      console.error(`❌ Error parsing ${file}:`, err.message);
      console.error(`   Stack trace: ${err.stack}`);
    }
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allWorlds, null, 2));
  console.log(`\n✅ Successfully generated ${OUTPUT_FILE}`);
  console.log(`📊 Total worlds: ${Object.keys(allWorlds.worlds).length}\n`);
}

parseAllWorlds().catch(console.error);
