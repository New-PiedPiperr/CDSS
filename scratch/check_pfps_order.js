const fs = require('fs');
const knee = JSON.parse(fs.readFileSync('public/rules/Knee Region.json', 'utf8'));
const pfps = knee.conditions[0];

console.log('Condition 1:', pfps.name);
pfps.questions.forEach((q, idx) => {
  console.log(`${idx + 1}. [${q.id}]: "${q.questionText || q.question}"`);
});
