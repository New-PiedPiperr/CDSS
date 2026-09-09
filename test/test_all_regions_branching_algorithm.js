const fs = require('fs');
const path = require('path');
const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
} = require('../src/lib/branching-assessment-engine');

console.log('================================================================');
console.log('=== TEST SUITE: ALL 8 REGIONS BRANCHING & RED COLOR ALGORITHM ===');
console.log('================================================================\n');

const REGION_FILES = [
  { file: 'Ankle Region.json', regionKeyword: 'Ankle' },
  { file: 'Cervical Region.json', regionKeyword: 'Neck' },
  { file: 'Elbow Region.json', regionKeyword: 'Elbow' },
  { file: 'Hip Region.json', regionKeyword: 'Groin/anterior hip' },
  { file: 'Knee Region.json', regionKeyword: 'Front part of the knee' },
  { file: 'Lumbar Region.json', regionKeyword: 'Lower back only' },
  { file: 'Shoulder Region.json', regionKeyword: 'Shoulder' },
  { file: 'Wrist Region.json', regionKeyword: 'Palmar wrist/hand' },
];

let totalTests = 0;
let passedTests = 0;
let totalRegionsTested = 0;

for (const { file, regionKeyword } of REGION_FILES) {
  const filePath = path.join(__dirname, '..', 'public', 'rules', file);
  const rules = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  totalRegionsTested++;
  console.log(`\n------------------------------------------------------------`);
  console.log(`Region [${totalRegionsTested}/8]: ${rules.title || rules.region || file}`);
  console.log(`------------------------------------------------------------`);

  // Count red options and colored questions
  let totalColoredQuestions = 0;
  let totalRedOptions = 0;
  const conditionsWithRed = [];

  for (const cond of rules.conditions) {
    if (!cond || !Array.isArray(cond.questions)) continue;
    let condColoredQs = 0;
    for (const q of cond.questions) {
      const redOpts = (q.options || []).filter(
        (o) => (o.effects || {}).optionColor === 'red'
      );
      if (redOpts.length > 0) {
        totalColoredQuestions++;
        condColoredQs++;
        totalRedOptions += redOpts.length;
      }
    }
    // Only test non-general, non-intake clinical conditions for condition-level rule-out
    const isGeneral =
      cond.is_general ||
      cond.name.toLowerCase().includes('general') ||
      cond.name.toLowerCase().includes('initial assessment') ||
      cond.name === 'Non-specific low-back pain';

    if (condColoredQs > 0 && !isGeneral) {
      conditionsWithRed.push({ name: cond.name, count: condColoredQs });
    }
  }

  console.log(`  Total Conditions: ${rules.conditions.length}`);
  console.log(`  Target Clinical Conditions with Red: ${conditionsWithRed.length}`);
  console.log(`  Total Questions with Red: ${totalColoredQuestions}`);
  console.log(`  Total Red Options: ${totalRedOptions}`);

  if (totalColoredQuestions === 0) {
    console.error(`  FAIL: No red options found in ${file}!`);
    process.exit(1);
  }

  // Helper to pick a safe answer for a question (navigates through intake without ruling out the region)
  const pickNavAnswer = (q) => {
    const opts = q.answers || q.options || [];
    const qText = (q.question || '').toLowerCase();
    if (qText.includes('region is pain') || qText.includes('where is your pain')) {
      const matchedRegionOpt = opts.find((o) =>
        o.value.toLowerCase().includes(regionKeyword.toLowerCase())
      );
      if (matchedRegionOpt) return matchedRegionOpt.value;
    }
    // Prefer red option if available to stay on positive diagnostic track
    const redOpt = opts.find((o) => (o.effects || {}).optionColor === 'red');
    if (redOpt) return redOpt.value;
    return opts[0]?.value || 'Yes';
  };

  // --- TEST 1: Red answer preserves sequence within the condition ---
  let stateRed = initializeEngine(rules);
  let currentQ = getCurrentQuestion(stateRed);

  // Advance past intake questions until we reach the first target clinical condition
  let steps = 0;
  while (currentQ && steps < 40) {
    const isTargetCond = conditionsWithRed.some((c) => c.name === currentQ.conditionName);
    const opts = currentQ.answers || currentQ.options || [];
    const hasRedOpt = opts.some((o) => (o.effects || {}).optionColor === 'red');

    if (isTargetCond && hasRedOpt) {
      break;
    }
    stateRed = processAnswer(stateRed, currentQ.id, pickNavAnswer(currentQ));
    currentQ = getCurrentQuestion(stateRed);
    steps++;
  }

  if (currentQ) {
    const hostCondition = currentQ.conditionName;
    const opts = currentQ.answers || currentQ.options || [];
    const redOpt = opts.find((o) => (o.effects || {}).optionColor === 'red');

    if (redOpt) {
      totalTests++;
      const nextState = processAnswer(stateRed, currentQ.id, redOpt.value);
      const afterRedQ = getCurrentQuestion(nextState);

      const keptCondition =
        afterRedQ?.conditionName === hostCondition ||
        nextState.isComplete ||
        nextState.temporaryDiagnosis === hostCondition;

      if (keptCondition) {
        console.log(
          `  PASS [Red Selection]: Selecting red "${redOpt.value}" on "${currentQ.id}" preserved sequence in condition "${hostCondition}".`
        );
        passedTests++;
      } else {
        console.error(
          `  FAIL [Red Selection]: Expected to stay in condition "${hostCondition}", got "${afterRedQ?.conditionName}".`
        );
        process.exit(1);
      }
    }
  }

  // --- TEST 2: Non-red answer on a red-bearing question SKIPS the condition immediately ---
  // For each condition, fast-forward to it and verify non-red answer skips it to next condition
  for (let cIdx = 0; cIdx < Math.min(3, conditionsWithRed.length); cIdx++) {
    const targetCondName = conditionsWithRed[cIdx].name;
    let stateSkip = initializeEngine(rules);
    let q = getCurrentQuestion(stateSkip);

    let safety = 0;
    while (q && safety < 120) {
      const qOpts = q.answers || q.options || [];
      if (q.conditionName === targetCondName) {
        const hasRed = qOpts.some((o) => (o.effects || {}).optionColor === 'red');
        const hasNonRed = qOpts.some((o) => (o.effects || {}).optionColor !== 'red');
        if (hasRed && hasNonRed) break;
      }
      stateSkip = processAnswer(stateSkip, q.id, pickNavAnswer(q));
      q = getCurrentQuestion(stateSkip);
      safety++;
    }

    if (q && q.conditionName === targetCondName) {
      const qOpts = q.answers || q.options || [];
      const nonRedOpt = qOpts.find((o) => (o.effects || {}).optionColor !== 'red');

      if (nonRedOpt) {
        totalTests++;
        const stateAfterSkip = processAnswer(stateSkip, q.id, nonRedOpt.value);
        const nextQAfterSkip = getCurrentQuestion(stateAfterSkip);

        const isRuledOut = stateAfterSkip.ruledOutConditions.has(targetCondName);
        const notSameCondition =
          !nextQAfterSkip || nextQAfterSkip.conditionName !== targetCondName;

        if (isRuledOut && notSameCondition) {
          console.log(
            `  PASS [Non-Red Skip]: Selecting "${nonRedOpt.value}" on "${q.id}" ruled out "${targetCondName}" and jumped to ${
              nextQAfterSkip ? `"${nextQAfterSkip.conditionName}" (${nextQAfterSkip.id})` : 'assessment completion'
            }.`
          );
          passedTests++;
        } else {
          console.error(
            `  FAIL [Non-Red Skip]: Failed to skip condition "${targetCondName}". RuledOut=${isRuledOut}, NextQ Condition=${nextQAfterSkip?.conditionName}`
          );
          process.exit(1);
        }
      }
    }
  }
}

console.log('\n================================================================');
console.log(`=== ALL TESTS PASSED: ${passedTests}/${totalTests} tests across ${totalRegionsTested} regions ===`);
console.log('================================================================\n');
