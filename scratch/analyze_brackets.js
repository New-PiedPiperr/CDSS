const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '..', 'public', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json'));

let totalBracketOpts = 0;
let redBracketOpts = 0;
let nonRedBracketOpts = 0;

const bracketReport = [];

files.forEach(file => {
  const filePath = path.join(rulesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const conds = data.conditions || (Array.isArray(data) ? data : []);

    conds.forEach(c => {
      const condName = c.condition || c.name;
      (c.questions || []).forEach(q => {
        (q.options || q.answers || []).forEach(opt => {
          const val = typeof opt === 'string' ? opt : (opt.value || '');
          const match = val.match(/\(([^)]+)\)/);
          if (match) {
            totalBracketOpts++;
            const isRed = opt.effects?.optionColor === 'red' || opt.effects?.redFlag || opt.effects?.red_flag;
            if (isRed) redBracketOpts++;
            else nonRedBracketOpts++;

            bracketReport.push({
              file,
              condition: condName,
              questionId: q.id,
              question: q.questionText || q.question,
              optionValue: val,
              bracketText: match[1],
              isRed
            });
          }
        });
      });
    });
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
});

console.log(`Total options with brackets: ${totalBracketOpts}`);
console.log(`Red options with brackets: ${redBracketOpts}`);
console.log(`Non-red options with brackets: ${nonRedBracketOpts}`);
console.log('\n--- SAMPLE NON-RED BRACKET OPTIONS ---');
bracketReport.filter(b => !b.isRed).slice(0, 35).forEach(b => {
  console.log(`[${b.file} -> ${b.condition}]`);
  console.log(`  Q: ${b.question}`);
  console.log(`  Opt: "${b.optionValue}" | Bracket: "${b.bracketText}"`);
});
