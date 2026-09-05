const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/rules/Knee Region.json', 'utf8'));

console.log('Title:', data.region || data.title);
const conds = data.conditions || (Array.isArray(data) ? data : []);
console.log('Conditions count:', conds.length);

conds.forEach((c, idx) => {
  console.log(`Condition ${idx}: ${c.condition || c.name} (${(c.questions || []).length} questions)`);
  if (c.questions && c.questions.length > 0) {
    const q0 = c.questions[0];
    console.log(`  First Q: ${q0.id} - ${q0.questionText || q0.question}`);
    console.log(`  isGating: ${q0.isGating}, category: ${q0.category}`);
  }
});
