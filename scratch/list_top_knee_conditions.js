const fs = require('fs');
const knee = JSON.parse(fs.readFileSync('public/rules/Knee Region.json', 'utf8'));

console.log('=== FIRST 5 CONDITIONS IN KNEE REGION ===');
knee.conditions.slice(0, 5).forEach((c, idx) => {
  console.log(`\nCondition ${idx + 1}: "${c.name}"`);
  if (c.questions) {
    c.questions.slice(0, 5).forEach((q, qIdx) => {
      console.log(`  Q${qIdx + 1} (${q.id}): "${q.questionText || q.question}"`);
      (q.options || q.answers || []).forEach((opt, oIdx) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        console.log(`     Opt ${oIdx + 1}: "${val}"`);
      });
    });
  }
});
