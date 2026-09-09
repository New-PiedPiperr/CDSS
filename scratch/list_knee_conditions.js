const fs = require('fs');
const knee = JSON.parse(fs.readFileSync('public/rules/Knee Region.json', 'utf8'));

console.log('=== CONDITIONS IN KNEE REGION ===');
knee.conditions.forEach((c, idx) => {
  console.log(`${idx + 1}. Name: "${c.name}" (ID prefix: ${c.id || 'none'})`);
  if (c.questions) {
    console.log(`   Questions count: ${c.questions.length}`);
    c.questions.forEach((q, qIdx) => {
      console.log(`   Q${qIdx + 1} (${q.id}): "${q.questionText || q.question}"`);
      (q.options || q.answers || []).forEach((opt, oIdx) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        console.log(`      Opt ${oIdx + 1}: "${val}"`);
      });
    });
  }
});
