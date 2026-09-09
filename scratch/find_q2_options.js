const fs = require('fs');
const knee = JSON.parse(fs.readFileSync('public/rules/Knee Region.json', 'utf8'));

knee.conditions.forEach((c, cIdx) => {
  console.log(`\n=== Condition ${cIdx + 1}: ${c.name} ===`);
  (c.questions || []).forEach((q, qIdx) => {
    console.log(`Q${qIdx + 1} (${q.id}): "${q.questionText || q.question}"`);
    (q.options || q.answers || []).forEach((opt, oIdx) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      console.log(`   [Opt ${oIdx + 1}] ${val}`);
    });
  });
});
