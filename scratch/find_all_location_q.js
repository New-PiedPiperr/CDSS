const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/rules/Knee Region.json', 'utf8'));
const conds = data.conditions || data;

conds.forEach((c, cIdx) => {
  (c.questions || []).forEach((q, qIdx) => {
    const text = q.questionText || q.question || '';
    if (/region|where is the pain|location/i.test(text)) {
      console.log(`[${c.condition || c.name}] Q${qIdx+1} (${q.id}): ${text}`);
      (q.options || []).forEach(opt => console.log(`   - ${opt.value}`));
    }
  });
});
