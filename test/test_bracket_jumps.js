const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '..', 'public', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json'));

function cleanOptionDisplay(str) {
  if (typeof str !== 'string') return str;
  let clean = str.replace(/^\s*([a-zA-Z]|\d{1,2})[\.\)]\s+/, '').trim();
  clean = clean.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  return clean;
}

function extractBracketText(str) {
  if (typeof str !== 'string') return null;
  const match = str.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
}

let totalJumpsFound = 0;

files.forEach(file => {
  const filePath = path.join(rulesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const conds = data.conditions || (Array.isArray(data) ? data : []);
    const allCondNames = conds.map(c => c.condition || c.name || '');

    conds.forEach(c => {
      (c.questions || []).forEach(q => {
        (q.options || q.answers || []).forEach(opt => {
          const rawVal = typeof opt === 'string' ? opt : (opt.value || '');
          const isRed = opt.effects?.optionColor === 'red' || opt.effects?.redFlag || opt.effects?.red_flag;
          const bracket = extractBracketText(rawVal);

          if (bracket && !isRed) {
            const cleanDisplay = cleanOptionDisplay(rawVal);
            const term = bracket.replace(/^(rule out|suspect|suggests|consider|possible|rule out prior)\s+/i, '').trim().toLowerCase();
            
            // Find target condition
            const matchedCond = conds.find(targetC => {
              const name = (targetC.condition || targetC.name || '').toLowerCase();
              return name.includes(term) || term.split(/[\/\s]/).some(t => t.length > 3 && name.includes(t));
            });

            if (matchedCond) {
              totalJumpsFound++;
              const firstQ = matchedCond.questions[0];
              console.log(`[${file}] Q: "${q.questionText || q.question}"`);
              console.log(`  Selected Option: "${cleanDisplay}" (Raw: "${rawVal}")`);
              console.log(`  -> Jumps to Condition: "${matchedCond.condition || matchedCond.name}" (First Q: "${firstQ.questionText || firstQ.question}")`);
            }
          }
        });
      });
    });
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
});

console.log(`Total non-red bracket jumps mapped: ${totalJumpsFound}`);
