const fs = require('fs');
const path = require('path');

const rulesDir = 'public/rules';
const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.json'));

console.log('=== ALL BRACKETED STRINGS IN QUESTIONS & OPTIONS ===\n');

files.forEach((file) => {
  const filePath = path.join(rulesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (Array.isArray(data.conditions)) {
    data.conditions.forEach((c) => {
      (c.questions || []).forEach((q) => {
        const qTxt = q.questionText || q.question || '';
        const qMatches = qTxt.match(/\(([^)]+)\)/g);
        if (qMatches) {
          console.log(`[${file}] QUESTION ID: ${q.id}`);
          console.log(`  Question: "${qTxt}"`);
          console.log(`  Brackets: ${JSON.stringify(qMatches)}\n`);
        }

        const opts = q.options || q.answers || [];
        opts.forEach((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const oMatches = val ? val.match(/\(([^)]+)\)/g) : null;
          if (oMatches) {
            console.log(`[${file}] OPTION IN Q: ${q.id}`);
            console.log(`  Option value: "${val}"`);
            console.log(`  Brackets: ${JSON.stringify(oMatches)}\n`);
          }
        });
      });
    });
  }
});
