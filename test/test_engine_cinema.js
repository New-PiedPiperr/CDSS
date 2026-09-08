const {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
  cleanQuestionText,
} = require('../src/lib/branching-assessment-engine');

const kneeRules = require('../public/rules/Knee Region.json');

console.log('=== TESTING CINEMA SIGN & CLINICAL SIGN CLEANING ===\n');

// 1. Check cleanQuestionText directly
const q15Raw = "Do you experience pain when sitting for prolonged periods with the knee bent (Cinema sign)?";
const q15Clean = cleanQuestionText(q15Raw);
console.log('Raw Question:', q15Raw);
console.log('Cleaned Question (Patient View):', q15Clean);

if (q15Clean === "Do you experience pain when sitting for prolonged periods with the knee bent?") {
  console.log('✅ Clean Question Text PASSED!\n');
} else {
  console.error('❌ Clean Question Text FAILED!');
}

// 2. Test initializing engine with Knee Region rules
const state = initializeEngine(kneeRules);
const q15Normalized = state.questionsMap.get('knee_patpaisynpfprunkne_q15');

if (q15Normalized) {
  console.log('Normalized Question ID:', q15Normalized.id);
  console.log('Normalized Question Text (Patient View):', `"${q15Normalized.question}"`);
  console.log('Raw Question Text (Clinician View):', `"${q15Normalized.rawQuestionText}"`);
  console.log('Options for Patient View:');
  q15Normalized.answers.forEach((ans, i) => {
    console.log(`  Option ${i + 1}: display="${ans.value}" | raw="${ans.rawValue}" | annotation="${ans.bracketAnnotation}"`);
  });
}
