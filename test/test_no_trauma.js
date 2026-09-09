const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

const kneeRules = require('../public/rules/Knee Region.json');

console.log('=== TESTING ENGINE TRAVERSAL (NO TO TRAUMA) ===\n');

let state = initializeEngine(kneeRules);

let q1 = getCurrentQuestion(state);
console.log('Step 1 ->', q1.id, ':', q1.question);
state = processAnswer(state, q1.id, 'Front part of the knee');

let q2 = getCurrentQuestion(state);
console.log('Step 2 ->', q2.id, ':', q2.question);
state = processAnswer(state, q2.id, 'No');

let q3 = getCurrentQuestion(state);
console.log('Step 3 ->', q3.id, ':', q3.question);
state = processAnswer(state, q3.id, 'Dull, aching');

let q4 = getCurrentQuestion(state);
console.log('Step 4 ->', q4.id, ':', q4.question);
state = processAnswer(state, q4.id, 'Gradual, insidious');

let q5 = getCurrentQuestion(state);
console.log('Step 5 ->', q5.id, ':', q5.question);
state = processAnswer(state, q5.id, 'Running, squatting, stairs, prolonged sitting');

let q6 = getCurrentQuestion(state);
console.log('Step 6 ->', q6.id, ':', q6.question);
state = processAnswer(state, q6.id, 'No (Supports PFPS diagnosis)');

let q7 = getCurrentQuestion(state);
console.log('Step 7 ->', q7.id, ':', q7.question);
