// test/patientVisibleTest.js
const { initializeEngine, getCurrentQuestion } = require('../src/lib/branching-assessment-engine');
const fs = require('fs');
const path = require('path');

function runTest(regionFile) {
  const rules = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/rules', regionFile), 'utf-8'));
  const state = initializeEngine(rules, {});
  const q = getCurrentQuestion(state);
  if (!q) {
    console.log('No initial question');
    return;
  }
  // Find any question with patientVisible false
  const hidden = state.questionsMap.values().next().value ? [] : [];
  let hiddenFound = false;
  for (const [id, question] of state.questionsMap) {
    if (question.patientVisible === false) {
      hiddenFound = true;
      const canShow = (() => {
        // reuse canShowQuestion from engine file - require the module again
        const { canShowQuestion } = require('../src/lib/branching-assessment-engine');
        return canShowQuestion(state, question);
      })();
      console.log(`Question ${id} patientVisible false, canShowQuestion=${canShow}`);
    }
  }
  console.log('Hidden flag present?', hiddenFound);
}

runTest('Knee Region.json');
