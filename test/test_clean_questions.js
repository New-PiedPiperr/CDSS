const fs = require('fs');
const path = require('path');

const rulesDir = 'public/rules';
const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.json'));

function cleanQuestionText(str) {
  if (typeof str !== 'string') return str;
  let clean = str.replace(/^\s*\d+[\.\)\:-]\s*/, '').trim();
  clean = clean
    .replace(
      /\s*\((Cinema sign|question mark sign|Subacute Tendinitis|Dead-arm syndrome|Link to question[^)]*)\)\s*/gi,
      ' '
    )
    .trim();
  clean = clean.replace(/\s+\?/g, '?').replace(/\s{2,}/g, ' ');
  return clean;
}

console.log('=== TESTING CLEAN QUESTION TEXT ON ALL QUESTIONS ===\n');

files.forEach((file) => {
  const filePath = path.join(rulesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (Array.isArray(data.conditions)) {
    data.conditions.forEach((c) => {
      (c.questions || []).forEach((q) => {
        const raw = q.questionText || q.question || '';
        const cleaned = cleanQuestionText(raw);
        if (raw !== cleaned) {
          console.log(`[${file}] ${q.id}:`);
          console.log(`   BEFORE: "${raw}"`);
          console.log(`   AFTER:  "${cleaned}"\n`);
        }
      });
    });
  }
});
