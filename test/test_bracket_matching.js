const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '..', 'public', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(rulesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const conds = data.conditions || (Array.isArray(data) ? data : []);
    const condNames = conds.map(c => c.condition || c.name || '');

    console.log(`=== ${file} ===`);
    console.log('Conditions:', condNames);

    conds.forEach(c => {
      (c.questions || []).forEach(q => {
        (q.options || q.answers || []).forEach(opt => {
          const val = typeof opt === 'string' ? opt : (opt.value || '');
          const match = val.match(/\(([^)]+)\)/);
          if (match) {
            const isRed = opt.effects?.optionColor === 'red' || opt.effects?.redFlag || opt.effects?.red_flag;
            if (!isRed) {
              const bracketText = match[1];
              // Try to find matching condition in condNames
              const cleanBracket = bracketText.replace(/^(rule out|suspect|suggests|consider|possible)\s+/i, '').trim().toLowerCase();
              const matchedCond = condNames.find(cn => cn.toLowerCase().includes(cleanBracket) || cleanBracket.includes(cn.toLowerCase()));
              
              const cleanVal = val.replace(/\s*\([^)]*\)/g, '').trim();
              console.log(`  Q: ${q.questionText || q.question}`);
              console.log(`    Opt Raw: "${val}" -> Clean UI: "${cleanVal}"`);
              console.log(`    Bracket: "${bracketText}" -> Target Match: ${matchedCond ? `"${matchedCond}"` : 'NONE'}`);
            }
          }
        });
      });
    });
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
});
