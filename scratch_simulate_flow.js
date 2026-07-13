
import { initializeEngine, processAnswer, completeAssessment, getCurrentQuestion } from './src/lib/branching-assessment-engine.js';
import fs from 'fs';

const rules = JSON.parse(fs.readFileSync('./public/rules/Lumbar Region.json', 'utf8'));

// Initialize engine with patient biodata (age 50, female)
let state = initializeEngine(rules, { age: 50, sex: 'female', fullName: 'Test Patient' });

console.log('--- Start of Assessment ---');
let q = getCurrentQuestion(state);
console.log(`Q1 to display: ${q ? `${q.id} - ${q.question}` : 'None'}`);

// Answer Q1
state = processAnswer(state, q.id, 'Radiates down both legs');
console.log(`\nAnswered ${q.id} with "Radiates down both legs"`);
console.log(`ruledOutConditions:`, Array.from(state.ruledOutConditions));

q = getCurrentQuestion(state);
console.log(`Q2 to display: ${q ? `${q.id} - ${q.question}` : 'None'}`);

if (q) {
  // Answer Q2
  state = processAnswer(state, q.id, 'No');
  console.log(`\nAnswered ${q.id} with "No"`);
  console.log(`ruledOutConditions:`, Array.from(state.ruledOutConditions));
  
  q = getCurrentQuestion(state);
  console.log(`Q3 to display: ${q ? `${q.id} - ${q.question}` : 'None'}`);
  
  if (q) {
    // Answer Q3
    state = processAnswer(state, q.id, 'No');
    console.log(`\nAnswered ${q.id} with "No"`);
    console.log(`ruledOutConditions:`, Array.from(state.ruledOutConditions));
    
    q = getCurrentQuestion(state);
    console.log(`Q4 to display: ${q ? `${q.id} - ${q.question}` : 'None'}`);
  }
}
