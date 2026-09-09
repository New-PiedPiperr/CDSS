const fs = require('fs');
const knee = JSON.parse(fs.readFileSync('public/rules/Knee Region.json', 'utf8'));

knee.conditions.forEach((c, cIdx) => {
  (c.questions || []).forEach((q, qIdx) => {
    const opts = (q.options || q.answers || []).map((o) => (typeof o === 'string' ? o : o.value));
    console.log(`[Cond ${cIdx + 1}: ${c.name}] Q${qIdx + 1} (${q.id}): "${q.questionText || q.question}"`);
    opts.forEach((o, i) => console.log(`   Opt ${i + 1}: ${o}`));
  });
});
