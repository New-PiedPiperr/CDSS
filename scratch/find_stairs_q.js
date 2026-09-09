const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/rules/Knee Region.json', 'utf8'));

const conds = data.conditions || data;
conds.forEach((c, cIdx) => {
  (c.questions || []).forEach((q, qIdx) => {
    const text = q.questionText || q.question || '';
    if (/descending stairs|ascending stairs|stairs/i.test(text)) {
      console.log(`[Condition ${cIdx}: ${c.condition || c.name}] Q${qIdx+1} (${q.id}): ${text}`);
      console.log('  Options:', q.options || q.answers);
    }
  });
});
