const fs = require('fs');
const path = require('path');

const rulesDir = 'public/rules';
const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('Region.json'));

console.log('=== QUESTIONS WITH BRACKETS/PARENTHESES IN QUESTION TEXT ===\n');

files.forEach((file) => {
  const filePath = path.join(rulesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  (data.conditions || []).forEach((c) => {
    (c.questions || []).forEach((q) => {
      const txt = q.questionText || q.question || '';
      const matches = txt.match(/\(([^)]+)\)/g);
      if (matches) {
        console.log(`[${file}] ID: ${q.id}`);
        console.log(`  Raw Text: "${txt}"`);
        console.log(`  Brackets: ${JSON.stringify(matches)}\n`);
      }
    });
  });
});
