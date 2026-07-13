import { initializeEngine, processAnswer, getCurrentQuestion } from '../src/lib/branching-assessment-engine.js';
import fs from 'fs';

const rules = JSON.parse(fs.readFileSync('./public/rules/Shoulder Region.json', 'utf8'));

let state = initializeEngine(rules, { age: 30, sex: 'male', fullName: 'Shoulder Test' });

console.log('--- START SHOULDER SIMULATION ---');
let qCount = 0;
while (!state.isComplete && qCount < 40) {
  const q = getCurrentQuestion(state);
  if (!q) {
    console.log('getCurrentQuestion returned null.');
    break;
  }
  let ans = '';
  const options = q.answers || q.options || [];
  const noOpt = options.find(o => o.value?.toLowerCase() === 'no');
  ans = noOpt ? noOpt.value : options[0].value;
  
  console.log(`Q${qCount + 1}: ${q.id} (${q.conditionName}) -> ${ans}`);
  state = processAnswer(state, q.id, ans);
  qCount++;
}

console.log('--- END SHOULDER SIMULATION ---');
console.log('Final State Complete:', state.isComplete);
console.log('Completion Reason:', state.completionReason);
console.log('Ruled Out:', Array.from(state.ruledOutConditions));
