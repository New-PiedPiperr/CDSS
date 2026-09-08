const fs = require('fs');
const path = require('path');

const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

const kneeRules = JSON.parse(fs.readFileSync('./public/rules/Knee Region.json', 'utf8'));

// Initialize engine for Knee region
let state = initializeEngine(kneeRules, { age: 30, sex: 'Male' });

console.log('--- TESTING KNEE ENGINE FLOW WITH BRACKETED OPTIONS ---');

// Question 1
let q = getCurrentQuestion(state);
console.log('Q1:', q.question);
console.log('Q1 Options UI:', q.answers.map(a => a.value));

// Select Q1 option
state = processAnswer(state, q.id, q.answers[0].value);

// Question 2
q = getCurrentQuestion(state);
console.log('\nQ2:', q.question);
console.log('Q2 Options UI:', q.answers.map(a => a.value));

// Find a question with a non-red bracketed option
let bracketQuestion = null;
for (const qId of state.questionOrder) {
  const quest = state.questionsMap.get(qId);
  if (quest) {
    const bracketAns = quest.answers.find(a => a.bracketAnnotation && !a.effects.redFlag && a.effects.optionColor !== 'red');
    if (bracketAns) {
      bracketQuestion = { quest, bracketAns };
      break;
    }
  }
}

if (bracketQuestion) {
  const { quest, bracketAns } = bracketQuestion;
  console.log('\n--- FOUND QUESTION WITH NON-RED BRACKETED OPTION ---');
  console.log('Question:', quest.question);
  console.log('Options shown to user (clean):', quest.answers.map(a => a.value));
  console.log('Selected option:', bracketAns.value);
  console.log('Bracket annotation extracted:', bracketAns.bracketAnnotation);

  const nextState = processAnswer(state, quest.id, bracketAns.value);
  const nextQ = getCurrentQuestion(nextState);
  console.log('Next Question after selection:', nextQ ? nextQ.question : 'COMPLETE');
  console.log('Next Question Condition:', nextQ ? nextQ.conditionName : 'NONE');
} else {
  console.log('No bracket question found in initial set');
}
