import { initializeEngine, processAnswer, getCurrentQuestion } from '../src/lib/branching-assessment-engine.js';
import fs from 'fs';

const rules = JSON.parse(fs.readFileSync('./public/rules/Shoulder Region.json', 'utf8'));

let state = initializeEngine(rules, { age: 30, sex: 'male', fullName: 'Shoulder Skip Test' });

// Answer Q1 - Q14 (Initial Assessment) with non-triggering/non-red options
const initialAnswers = {
  shoulder_q1: "Shoulder",
  shoulder_q2: "No",
  shoulder_q3: "Sudden",
  shoulder_q4: "No",
  shoulder_q5: "No",
  shoulder_q6: "No",
  shoulder_q7: "Overhead movement",
  shoulder_q8: "No",
  shoulder_q9: "No",
  shoulder_q10: "No",
  shoulder_q11: "No",
  shoulder_q12: "No",
  shoulder_q13: "No",
  shoulder_q14: "No"
};

for (let i = 1; i <= 14; i++) {
  const qid = `shoulder_q${i}`;
  state = processAnswer(state, qid, initialAnswers[qid]);
}

console.log("State after Initial Assessment:", {
  currentQuestionId: getCurrentQuestion(state)?.id,
  ruledOut: Array.from(state.ruledOutConditions)
});

// Answer Q15: "Shoulder" (red option -> proceed)
state = processAnswer(state, 'shoulder_q15', 'Shoulder');
console.log("After Q15:", { q: getCurrentQuestion(state)?.id, ruledOut: Array.from(state.ruledOutConditions) });

// Answer Q16: "No" (red option -> proceed)
state = processAnswer(state, 'shoulder_q16', 'No');
console.log("After Q16:", { q: getCurrentQuestion(state)?.id, ruledOut: Array.from(state.ruledOutConditions) });

// Answer Q17: "Sharp or pinching" (red option -> proceed)
state = processAnswer(state, 'shoulder_q17', 'Sharp or pinching');
console.log("After Q17:", { q: getCurrentQuestion(state)?.id, ruledOut: Array.from(state.ruledOutConditions) });

// Answer Q18: "Gradual" (neither is red)
state = processAnswer(state, 'shoulder_q18', 'Gradual');
console.log("After Q18:", { q: getCurrentQuestion(state)?.id, ruledOut: Array.from(state.ruledOutConditions) });
