const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

const kneeRules = require('../public/rules/Knee Region.json');

console.log('=== TESTING COLOR SKIP BEHAVIOR (NON-RED ADVANCES TO MENISCUS) ===\n');

// Test 1: Answering Sharp on Q3/5
let state1 = initializeEngine(kneeRules);
state1 = processAnswer(state1, 'knee_patpaisynpfprunkne_q1', 'Front part of the knee');
state1 = processAnswer(state1, 'knee_patpaisynpfprunkne_q2', 'No');

let q = getCurrentQuestion(state1);
if (q.id !== 'knee_patpaisynpfprunkne_q4') {
  console.error(`Expected knee_patpaisynpfprunkne_q4, got ${q.id}`);
  process.exit(1);
}

// Select non-red alternative "Sharp"
state1 = processAnswer(state1, q.id, 'Sharp');
let nextQ = getCurrentQuestion(state1);

if (nextQ && nextQ.id === 'knee_mentea_q1') {
  console.log('PASS: Selecting "Sharp" skipped PFPS and transitioned to Meniscus Tear (knee_mentea_q1).');
} else {
  console.error(`FAIL: Expected knee_mentea_q1, got ${nextQ ? nextQ.id : 'null'}`);
  process.exit(1);
}

// Test 2: Answering Sudden on Q4 ("How did the pain begin?")
let state2 = initializeEngine(kneeRules);
state2 = processAnswer(state2, 'knee_patpaisynpfprunkne_q1', 'Front part of the knee');
state2 = processAnswer(state2, 'knee_patpaisynpfprunkne_q2', 'No');
state2 = processAnswer(state2, 'knee_patpaisynpfprunkne_q4', 'Dull, aching');

q = getCurrentQuestion(state2);
if (q.id !== 'knee_patpaisynpfprunkne_q3') {
  console.error(`Expected knee_patpaisynpfprunkne_q3, got ${q.id}`);
  process.exit(1);
}

// Select non-red alternative "Sudden"
state2 = processAnswer(state2, q.id, 'Sudden');
nextQ = getCurrentQuestion(state2);

if (nextQ && nextQ.id === 'knee_mentea_q1') {
  console.log('PASS: Selecting "Sudden" skipped PFPS and transitioned to Meniscus Tear (knee_mentea_q1).');
} else {
  console.error(`FAIL: Expected knee_mentea_q1, got ${nextQ ? nextQ.id : 'null'}`);
  process.exit(1);
}

// Test 3: Red answers stay in PFPS
let state3 = initializeEngine(kneeRules);
state3 = processAnswer(state3, 'knee_patpaisynpfprunkne_q1', 'Front part of the knee');
state3 = processAnswer(state3, 'knee_patpaisynpfprunkne_q2', 'No');
state3 = processAnswer(state3, 'knee_patpaisynpfprunkne_q4', 'Dull, aching');
state3 = processAnswer(state3, 'knee_patpaisynpfprunkne_q3', 'Gradual, insidious');

q = getCurrentQuestion(state3);
if (q.id === 'knee_patpaisynpfprunkne_q5') {
  console.log('PASS: Answering red options progressed within PFPS to knee_patpaisynpfprunkne_q5.');
} else {
  console.error(`FAIL: Expected knee_patpaisynpfprunkne_q5, got ${q ? q.id : 'null'}`);
  process.exit(1);
}

console.log('\nAll color skip tests passed successfully!\n');
process.exit(0);
