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
  history: ['geschichte', 'history', 'historical', 'historisch', 'jahrhundert', 'century', 'antike', 'ancient', 'ägypten', 'egypt', 'röm', 'roman', 'griech', 'greek', 'medieval', 'invented'],
  technology: ['technologie', 'technology', 'technical', 'mechanisch', 'mechanical', 'quarz', 'quartz', 'atom', 'atomic', 'innovation', 'erfindung', 'invention', 'clock', 'watch', 'escapement', 'gear'],
  culture: ['kultur', 'culture', 'cultural', 'gesellschaft', 'society', 'ritual', 'tradition', 'sprache', 'language'],
  science: ['wissenschaft', 'science', 'scientific', 'physik', 'physics', 'relativität', 'relativity', 'atom', 'präzision', 'precision', 'accuracy'],
  productivity: ['produktivität', 'productivity', 'pomodoro', 'zeitmanagement', 'time management', 'fokus', 'focus', 'konzentration', 'concentration', 'countdown'],
  psychology: ['psychologie', 'psychology', 'psychological', 'verhalten', 'behavior', 'wahrnehmung', 'perception', 'kognit', 'cognitive']
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
    // German
    'sonnenuhr', 'wasseruhr', 'mechanische uhr', 'quarzuhr', 'atomuhr',
    'pendel', 'hemmung', 'chronometer', 'chronograph',
    'countdown', 'pomodoro', 'zeitmanagement',
    'eisenbahn', 'gps', 'relativität', 'präzision',
    // English
    'sundial', 'water clock', 'mechanical clock', 'quartz watch', 'atomic clock',
    'pendulum', 'escapement', 'time management',
    'railroad', 'precision', 'relativity',
    'digital watch', 'analog watch', 'swiss'
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
  let factId = 0;

  // Check if this file uses simple paragraph format (no numbered sections)
  const hasNumberedSections = lines.some(line => /^\d+\.\d+\./.test(line.trim()));

  // Simple paragraph format: "Title\n\n\nContent" (English and some German files)
  if (language === 'en' || !hasNumberedSections) {
    let currentTitle = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (line.length === 0) {
        if (currentTitle && currentContent.length > 0) {
          // Save fact
          const content = currentContent.join(' ').trim();
          if (content.length > 50) {
            facts.push({
              id: `${filename.replace(/\.\w+$/, '')}-fact-${factId++}`,
              title: currentTitle,
              content: content,
              category: detectCategory(currentTitle + ' ' + content),
              source: filename,
              tags: extractTags(currentTitle + ' ' + content),
              wordCount: content.split(/\s+/).length
            });
          }
          currentTitle = null;
          currentContent = [];
        }
        continue;
      }

      // First non-empty line after reset is title
      if (!currentTitle && line.length > 10 && line.length < 150) {
        currentTitle = line;
      } else if (currentTitle) {
        currentContent.push(line);
      }
    }

    // Save last fact
    if (currentTitle && currentContent.length > 0) {
      const content = currentContent.join(' ').trim();
      if (content.length > 50) {
        facts.push({
          id: `${filename.replace(/\.\w+$/, '')}-fact-${factId++}`,
          title: currentTitle,
          content: content,
          category: detectCategory(currentTitle + ' ' + content),
          source: filename,
          tags: extractTags(currentTitle + ' ' + content),
          wordCount: content.split(/\s+/).length
        });
      }
    }

    return { language, facts };
  }

  // German format: Structured with section numbers "1.1. Title"
  let currentSection = null;
  let currentContent = [];

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
