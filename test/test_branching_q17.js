const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

const kneeRules = require('../public/rules/Knee Region.json');

console.log('=== TESTING Q17 BRANCHING TO MENISCUS TEAR (knee_mentea_q1) ===\n');

let state = initializeEngine(kneeRules);

// Process Q17 with Option B ("No")
const q17 = state.questionsMap.get('knee_patpaisynpfprunkne_q17');
console.log('Q17 Text (Patient View):', `"${q17.question}"`);
console.log('Answering "No" (Option B)...');

state = processAnswer(state, 'knee_patpaisynpfprunkne_q17', 'No');

const nextQ = getCurrentQuestion(state);
console.log('Next Question ID:', nextQ?.id);
console.log('Next Question Text:', `"${nextQ?.question}"`);
console.log('Next Question Condition Context:', nextQ?.conditionName);

if (nextQ?.id === 'knee_mentea_q1') {
  console.log('\n✅ Branching test PASSED! Selected Option B jumped directly to Meniscus Tear Q1 (knee_mentea_q1).');
} else {
  console.error('\n❌ Branching test FAILED! Expected knee_mentea_q1 but got:', nextQ?.id);
}
