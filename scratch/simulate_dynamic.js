import { initializeEngine, processAnswer, getCurrentQuestion } from '../src/lib/branching-assessment-engine.js';
import fs from 'fs';

const rules = JSON.parse(fs.readFileSync('./public/rules/Lumbar Region.json', 'utf8'));

let state = initializeEngine(rules, { age: 50, sex: 'female', fullName: 'Dynamic Test' });

console.log('--- START DYNAMIC SIMULATION ---');
while (!state.isComplete) {
  const q = getCurrentQuestion(state);
  if (!q) {
    console.log('getCurrentQuestion returned null.');
    break;
  }
  let ans = '';
  if (q.id === 'lumbar_q1') {
    ans = 'Radiates down one leg';
  } else {
    // Pick 'No' if available, otherwise first option
    const options = q.answers || q.options || [];
    const noOpt = options.find(o => o.value?.toLowerCase() === 'no');
    ans = noOpt ? noOpt.value : options[0].value;
  }
  console.log(`Question: ${q.id} - ${q.question} -> Answer: ${ans}`);
  state = processAnswer(state, q.id, ans);
}

console.log('--- END DYNAMIC SIMULATION ---');
console.log('Final State Complete:', state.isComplete);
console.log('Completion Reason:', state.completionReason);
console.log('Ruled Out:', Array.from(state.ruledOutConditions));
