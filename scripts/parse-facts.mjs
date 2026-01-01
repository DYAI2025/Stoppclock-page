/**
 * Parse timer facts from .txt files and generate JSON
 * Run: node scripts/parse-facts.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACTS_DIR = path.join(__dirname, '../timer_facts');
const OUTPUT_FILE = path.join(__dirname, '../public/data/facts.json');

// Category detection based on keywords
const CATEGORY_KEYWORDS = {
  history: ['geschichte', 'history', 'historisch', 'jahrhundert', 'antike', 'ägypten', 'röm', 'griech'],
  technology: ['technologie', 'technology', 'mechanisch', 'quarz', 'atom', 'innovation', 'erfindung'],
  culture: ['kultur', 'culture', 'gesellschaft', 'ritual', 'tradition', 'sprache'],
  science: ['wissenschaft', 'science', 'physik', 'relativität', 'atom', 'präzision'],
  productivity: ['produktivität', 'productivity', 'pomodoro', 'zeitmanagement', 'fokus', 'konzentration'],
  psychology: ['psychologie', 'psychology', 'verhalten', 'wahrnehmung', 'kognit']
};

function detectCategory(text) {
  const lowerText = text.toLowerCase();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = keywords.filter(kw => lowerText.includes(kw)).length;
  }

  const maxCategory = Object.entries(scores).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  );

  return maxCategory[1] > 0 ? maxCategory[0] : 'history';
}

function extractTags(text) {
  const tags = new Set();
  const commonTags = [
    'sonnenuhr', 'wasseruhr', 'mechanische uhr', 'quarzuhr', 'atomuhr',
    'pendel', 'hemmung', 'chronometer', 'chronograph',
    'countdown', 'pomodoro', 'zeitmanagement',
    'eisenbahn', 'gps', 'relativität', 'präzision'
  ];

  const lowerText = text.toLowerCase();
  commonTags.forEach(tag => {
    if (lowerText.includes(tag)) tags.add(tag);
  });

  return Array.from(tags);
}

function parseFactFile(filename, content) {
  const language = filename.includes('English') ? 'en' : 'de';
  const lines = content.split('\n');
  const facts = [];
  let currentSection = null;
  let currentContent = [];
  let factId = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section headers (e.g., "1.1. ", "2.3. ", etc.)
    const headerMatch = line.match(/^(\d+\.(\d+\.)?)\s+(.+)/);

    if (headerMatch || line.startsWith('---')) {
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        const content = currentContent.join('\n').trim();
        if (content.length > 100) {
          facts.push({
            id: `${filename.replace(/\.\w+$/, '')}-fact-${factId++}`,
            title: currentSection,
            content: content,
            category: detectCategory(content),
            source: filename,
            tags: extractTags(content),
            wordCount: content.split(/\s+/).length
          });
        }
      }

      if (headerMatch) {
        currentSection = headerMatch[3];
        currentContent = [];
      } else {
        currentSection = null;
        currentContent = [];
      }
    } else if (line.length > 0 && currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    const content = currentContent.join('\n').trim();
    if (content.length > 100) {
      facts.push({
        id: `${filename.replace(/\.\w+$/, '')}-fact-${factId++}`,
        title: currentSection,
        content: content,
        category: detectCategory(content),
        source: filename,
        tags: extractTags(content),
        wordCount: content.split(/\s+/).length
      });
    }
  }

  return { language, facts };
}

async function parseAllFacts() {
  const files = fs.readdirSync(FACTS_DIR);
  const txtFiles = files.filter(f => f.endsWith('.txt'));

  const allFacts = {
    version: 1,
    generatedAt: new Date().toISOString(),
    totalFacts: 0,
    categories: {},
    languages: { de: [], en: [] },
    facts: []
  };

  for (const file of txtFiles) {
    try {
      const content = fs.readFileSync(path.join(FACTS_DIR, file), 'utf-8');
      const { language, facts } = parseFactFile(file, content);

      console.log(`Parsed ${file}: ${facts.length} facts`);

      allFacts.facts.push(...facts);
      allFacts.languages[language].push(...facts);
      allFacts.totalFacts += facts.length;

      // Group by category
      facts.forEach(fact => {
        if (!allFacts.categories[fact.category]) {
          allFacts.categories[fact.category] = [];
        }
        allFacts.categories[fact.category].push(fact.id);
      });
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message);
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allFacts, null, 2));

  console.log(`\n✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Total facts: ${allFacts.totalFacts}`);
  console.log(`   German: ${allFacts.languages.de.length}`);
  console.log(`   English: ${allFacts.languages.en.length}`);
  console.log(`   Categories:`, Object.keys(allFacts.categories).map(c =>
    `${c}(${allFacts.categories[c].length})`
  ).join(', '));
}

// Run parser
parseAllFacts().catch(console.error);
