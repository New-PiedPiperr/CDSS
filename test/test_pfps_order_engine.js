const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

const kneeRules = require('../public/rules/Knee Region.json');

console.log('=== TESTING ENGINE QUESTION TRAVERSAL ORDER ===\n');

let state = initializeEngine(kneeRules);

let qCount = 0;
while (!state.isComplete && qCount < 10) {
  const current = getCurrentQuestion(state);
  if (!current) break;
  qCount++;
  console.log(`Step ${qCount} -> [${current.id}]: "${current.question}"`);
  
  // Pick first answer
  const firstAns = current.answers[0].value;
  state = processAnswer(state, current.id, firstAns);
}
