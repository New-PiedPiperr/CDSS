const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rulesDir = path.resolve('public/rules');

console.log('Testing clinician tests integrity across rule files...\n');

// 1. Verify Knee Region conditions have clinical tests
const knee = JSON.parse(fs.readFileSync(path.join(rulesDir, 'Knee Region.json'), 'utf8'));
assert.strictEqual(knee.conditions.length, 12, 'Knee must have 12 conditions');
for (const cond of knee.conditions) {
  assert(Array.isArray(cond.tests), `Knee condition '${cond.name}' must have a tests array`);
  assert(cond.tests.length >= 2, `Knee condition '${cond.name}' must have at least 2 tests, found ${cond.tests.length}`);
  for (const t of cond.tests) {
    assert(t.name, `Test in '${cond.name}' missing name: ${JSON.stringify(t)}`);
    assert(t.procedure, `Test '${t.name}' in '${cond.name}' missing procedure`);
    assert(t.positiveImplication, `Test '${t.name}' in '${cond.name}' missing positiveImplication`);
  }
}
console.log('✓ All 12 Knee Region conditions have comprehensive clinical tests.');

// 2. Verify Hip Region conditions have clinical tests
const hip = JSON.parse(fs.readFileSync(path.join(rulesDir, 'Hip Region.json'), 'utf8'));
assert.strictEqual(hip.conditions.length, 6, 'Hip must have 6 conditions');
for (const cond of hip.conditions) {
  assert(Array.isArray(cond.tests), `Hip condition '${cond.name}' must have a tests array`);
  assert(cond.tests.length >= 3, `Hip condition '${cond.name}' must have at least 3 tests, found ${cond.tests.length}`);
  for (const t of cond.tests) {
    assert(t.name, `Test in '${cond.name}' missing name`);
    assert(t.procedure, `Test '${t.name}' missing procedure`);
    assert(t.positiveImplication, `Test '${t.name}' missing positiveImplication`);
  }
}
console.log('✓ All 6 Hip Region conditions have comprehensive clinical tests.');

// 3. Verify Wrist Region conditions have clinical tests
const wrist = JSON.parse(fs.readFileSync(path.join(rulesDir, 'Wrist Region.json'), 'utf8'));
assert.strictEqual(wrist.conditions.length, 8, 'Wrist must have 8 conditions');
for (const cond of wrist.conditions) {
  assert(Array.isArray(cond.tests), `Wrist condition '${cond.name}' must have a tests array`);
  assert(cond.tests.length >= 2, `Wrist condition '${cond.name}' must have at least 2 tests, found ${cond.tests.length}`);
  for (const t of cond.tests) {
    assert(t.name, `Test in '${cond.name}' missing name`);
    assert(t.procedure, `Test '${t.name}' missing procedure`);
    assert(t.positiveImplication, `Test '${t.name}' missing positiveImplication`);
  }
}
console.log('✓ All 8 Wrist Region conditions have comprehensive clinical tests.');

// 4. Verify Elbow Region conditions have clinical tests
const elbow = JSON.parse(fs.readFileSync(path.join(rulesDir, 'Elbow Region.json'), 'utf8'));
assert.strictEqual(elbow.conditions.length, 5, 'Elbow must have 5 conditions');
for (const cond of elbow.conditions) {
  assert(Array.isArray(cond.tests), `Elbow condition '${cond.name}' must have a tests array`);
  assert(cond.tests.length >= 1, `Elbow condition '${cond.name}' must have at least 1 test`);
}
console.log('✓ All 5 Elbow Region conditions have clinical tests.');

// 5. Verify clinical-tests-for-casefile.json
const caseFileJson = JSON.parse(fs.readFileSync(path.join(rulesDir, 'clinical-tests-for-casefile.json'), 'utf8'));
assert(Array.isArray(caseFileJson.conditionTests), 'clinical-tests-for-casefile.json must have conditionTests array');
assert(caseFileJson.conditionTests.length >= 66, 'Must have at least 66 conditions mapped in casefile tests');

const kneeCaseTests = caseFileJson.conditionTests.filter(c => c.region === 'knee');
assert.strictEqual(kneeCaseTests.length, 12, 'All 12 knee conditions must be in casefile tests');
for (const ct of kneeCaseTests) {
  assert(ct.recommendedTests.length >= 2, `Knee condition '${ct.condition}' in casefile must have >=2 tests`);
  assert(ct.procedures.length >= 2, `Knee condition '${ct.condition}' in casefile must have >=2 procedures`);
}
console.log('✓ clinical-tests-for-casefile.json verified with all conditions and procedures.');

// 6. Verify clinical-tests-mapping.json
const mappingJson = JSON.parse(fs.readFileSync(path.join(rulesDir, 'clinical-tests-mapping.json'), 'utf8'));
assert(Array.isArray(mappingJson.conditionMappings), 'clinical-tests-mapping.json must have conditionMappings');
assert(mappingJson.conditionMappings.length >= 66, 'Must have >=66 condition mappings');
assert(Array.isArray(mappingJson.questionResponseTests), 'Must have questionResponseTests array');
assert(mappingJson.questionResponseTests.length > 500, 'Must have detailed question-to-test mappings');
console.log(`✓ clinical-tests-mapping.json verified with ${mappingJson.conditionMappings.length} conditions and ${mappingJson.questionResponseTests.length} response mappings.`);

console.log('\nAll clinician tests integrity checks passed successfully!');
