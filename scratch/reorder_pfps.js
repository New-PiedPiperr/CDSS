const fs = require('fs');
const filePath = 'public/rules/Knee Region.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const pfps = data.conditions[0];
const questions = pfps.questions;

// Find q22 ("Is the pain localized specifically to the inferior pole of the patella?")
// Find q3 ("How did the pain begin?")
const q22Index = questions.findIndex((q) => q.id === 'knee_patpaisynpfprunkne_q22');
const q3Index = questions.findIndex((q) => q.id === 'knee_patpaisynpfprunkne_q3');

if (q22Index === -1 || q3Index === -1) {
  console.error('Questions not found!');
  process.exit(1);
}

// Remove q22 and q3 from array
const [q22] = questions.splice(q22Index, 1);
// Note: if q3 was before q22, removing q22 doesn't change q3 index. If after, index shifts by -1.
const newQ3Index = questions.findIndex((q) => q.id === 'knee_patpaisynpfprunkne_q3');
const [q3] = questions.splice(newQ3Index, 1);

// Currently questions array has q1, q2, q4, q5... at indices 0, 1, 2, 3...
// We want:
// Position 1 (index 0): q1
// Position 2 (index 1): q2
// Position 3 (index 2): q4
// Position 4 (index 3): q5
// Position 5 (index 4): q22
// Position 6 (index 5): q3

// Insert q22 at index 4 (Position 5)
questions.splice(4, 0, q22);
// Insert q3 at index 5 (Position 6)
questions.splice(5, 0, q3);

// Update q22 effects
q22.options.forEach((opt) => {
  if (opt.value.includes('Suggests patellar tendinopathy')) {
    opt.effects.triggeredConditions = ['Patellar Tendinopathy'];
    opt.effects.nextQuestionId = 'knee_patten_q1';
    opt.effects.skipToQuestionId = 'knee_patten_q1';
  } else if (opt.value.includes('Supports PFPS diagnosis')) {
    opt.effects.increaseLikelihood = ['PATELLOFEMORAL PAIN SYNDROME (PFPS – “Runner’s Knee”)'];
  }
});
if (q22.answers) {
  q22.answers.forEach((ans) => {
    if (ans.value.includes('Suggests patellar tendinopathy')) {
      ans.effects.triggeredConditions = ['Patellar Tendinopathy'];
      ans.effects.nextQuestionId = 'knee_patten_q1';
      ans.effects.skipToQuestionId = 'knee_patten_q1';
    } else if (ans.value.includes('Supports PFPS diagnosis')) {
      ans.effects.increaseLikelihood = ['PATELLOFEMORAL PAIN SYNDROME (PFPS – “Runner’s Knee”)'];
    }
  });
}

// Write back to Knee Region.json
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('=== NEW PFPS QUESTIONS ORDER ===');
pfps.questions.forEach((q, idx) => {
  console.log(`${idx + 1}. [${q.id}]: "${q.questionText || q.question}"`);
});
