
import { initializeEngine, processAnswer, completeAssessment } from './src/lib/branching-assessment-engine.js';
import fs from 'fs';

const rules = JSON.parse(fs.readFileSync('./public/rules/Lumbar Region.json', 'utf8'));

// Initialize engine with patient biodata (age 50, female)
let state = initializeEngine(rules, { age: 50, sex: 'female', fullName: 'Test Patient' });

const answers = [
  { qid: 'lumbar_q1', val: 'Radiates down both legs' },
  { qid: 'lumbar_q19', val: 'No' }, // Stenosis Q1
  // Note: LDH (lumbar_q26) is ruled out by age 50 (>40) during entry criteria evaluation
  { qid: 'lumbar_q31', val: 'No' }, // CES Q1
  { qid: 'lumbar_q39', val: 'No' }  // Axial spondyloarthropathy Q1
];

for (const ans of answers) {
  state = processAnswer(state, ans.qid, ans.val);
  console.log(`Answered ${ans.qid} with "${ans.val}":`);
  console.log(`  currentQuestionId: ${state.currentQuestionId}`);
  console.log(`  isComplete: ${state.isComplete}`);
  console.log(`  completionReason: ${state.completionReason}`);
  console.log(`  temporaryDiagnosis: ${state.temporaryDiagnosis}`);
  console.log(`  ruledOutConditions:`, Array.from(state.ruledOutConditions));
}

state = completeAssessment(state);
console.log('\nFinal Summary:');
console.log('primarySuspicion:', state.summary.primarySuspicion);
console.log('rankedConditions:', state.summary.rankedConditions.map(c => ({ name: c.name, likelihood: c.likelihood })));
