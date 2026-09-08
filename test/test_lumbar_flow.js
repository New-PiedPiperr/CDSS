const fs = require('fs');
const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

const lumbarRules = JSON.parse(fs.readFileSync('./public/rules/Lumbar Region.json', 'utf8'));

let state = initializeEngine(lumbarRules, { age: 35, sex: 'Female' });

console.log('--- TESTING LUMBAR ENGINE FLOW WITH BRACKETED OPTIONS ---');

let q = getCurrentQuestion(state);
console.log('Q1:', q.question);
console.log('Q1 Options UI:', q.answers.map(a => a.value));

// Find options with bracket text
q.answers.forEach((ans, idx) => {
  if (ans.bracketAnnotation) {
    console.log(`\nTesting Selection of Option ${idx + 1}: "${ans.value}" (Bracket: "${ans.bracketAnnotation}")`);
    const nextState = processAnswer(state, q.id, ans.value);
    const nextQ = getCurrentQuestion(nextState);
    console.log('  -> Next Question:', nextQ ? nextQ.question : 'COMPLETE');
    console.log('  -> Next Condition:', nextQ ? nextQ.conditionName : 'NONE');
  }
});
