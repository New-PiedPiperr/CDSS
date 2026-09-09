const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rulesDir = path.resolve('public/rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json') && !f.includes('mapping') && !f.includes('casefile') && f !== 'index.json');

function getOptValue(opt) {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object') return opt.value || opt.text || '';
  return String(opt || '');
}

console.log('Testing question options integrity across', files.length, 'rule files...');

for (const file of files) {
  const fullPath = path.join(rulesDir, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  for (const cond of data.conditions || []) {
    for (const q of cond.questions || []) {
      const opts = (q.options || []).map(getOptValue);

      // Check for duplicate Yes/No in options
      const yesCount = opts.filter(o => o.trim().toLowerCase() === 'yes').length;
      const noCount = opts.filter(o => o.trim().toLowerCase() === 'no').length;
      assert(yesCount <= 1, `[${file}] ${q.id} has multiple Yes options: ${JSON.stringify(opts)}`);
      assert(noCount <= 1, `[${file}] ${q.id} has multiple No options: ${JSON.stringify(opts)}`);

      // Check for embedded questions
      const hasEmbeddedQ = opts.some(o => o.includes('?') || o.startsWith('Any previous') || o.startsWith('Where is your'));
      assert(!hasEmbeddedQ, `[${file}] ${q.id} has embedded question in options: ${JSON.stringify(opts)}`);

      // Check for clinical test instructions in options
      const hasClinicalTest = opts.some(o => 
        o.toLowerCase().includes('patient lies') ||
        o.toLowerCase().includes('patient is supine') ||
        o.toLowerCase().includes('procedure:') ||
        o.toLowerCase().includes('sign is positive') ||
        o.toLowerCase().includes('positive sign =') ||
        o.toLowerCase().includes('how to perform:')
      );
      assert(!hasClinicalTest, `[${file}] ${q.id} has test instructions in options: ${JSON.stringify(opts)}`);
    }
  }
}

// Specific assertions for Knee Region
const knee = JSON.parse(fs.readFileSync(path.join(rulesDir, 'Knee Region.json'), 'utf8'));
const kneeQuestions = {};
for (const cond of knee.conditions || []) {
  for (const q of cond.questions || []) {
    kneeQuestions[q.id] = q;
  }
}

// 1. knee_patdissub_q7 & knee_patdissub_q7_b
assert(kneeQuestions['knee_patdissub_q7'], 'knee_patdissub_q7 must exist');
const q7Opts = kneeQuestions['knee_patdissub_q7'].options.map(getOptValue);
assert.deepStrictEqual(q7Opts, ['Yes (Rule out nerve injury)', 'No']);

assert(kneeQuestions['knee_patdissub_q7_b'], 'knee_patdissub_q7_b must exist');
const q7bOpts = kneeQuestions['knee_patdissub_q7_b'].options.map(getOptValue);
assert.deepStrictEqual(q7bOpts, ['Yes', 'No']);

// 2. knee_patdissub_q4 & knee_patdissub_q4_b
assert(kneeQuestions['knee_patdissub_q4'], 'knee_patdissub_q4 must exist');
const q4Opts = kneeQuestions['knee_patdissub_q4'].options.map(getOptValue);
assert.deepStrictEqual(q4Opts, ['Yes (Hemarthrosis likely)', 'No']);

assert(kneeQuestions['knee_patdissub_q4_b'], 'knee_patdissub_q4_b must exist');
const q4bOpts = kneeQuestions['knee_patdissub_q4_b'].options.map(getOptValue);
assert.deepStrictEqual(q4bOpts, ['Anterior knee', 'Medial joint line (Rule out meniscus)']);

// 3. knee_mentea_q4 & knee_mentea_q4_sounds
assert(kneeQuestions['knee_mentea_q4'], 'knee_mentea_q4 must exist');
const mq4Opts = kneeQuestions['knee_mentea_q4'].options.map(getOptValue);
assert.deepStrictEqual(mq4Opts, ['Yes', 'No']);

assert(kneeQuestions['knee_mentea_q4_sounds'], 'knee_mentea_q4_sounds must exist');
const mq4sOpts = kneeQuestions['knee_mentea_q4_sounds'].options.map(getOptValue);
assert.deepStrictEqual(mq4sOpts, ['Popping, clicking, snapping', 'None']);

// 4. knee_mentea_q8, knee_mentea_q8_b, knee_mentea_q8_c
assert(kneeQuestions['knee_mentea_q8'], 'knee_mentea_q8 must exist');
assert(kneeQuestions['knee_mentea_q8_b'], 'knee_mentea_q8_b must exist');
assert(kneeQuestions['knee_mentea_q8_c'], 'knee_mentea_q8_c must exist');

// 5. knee_mentea_q10, knee_mentea_q11, knee_mentea_q12, knee_mentea_q13
assert(kneeQuestions['knee_mentea_q10'], 'knee_mentea_q10 must exist');
assert(kneeQuestions['knee_mentea_q11'], 'knee_mentea_q11 must exist');
assert(kneeQuestions['knee_mentea_q12'], 'knee_mentea_q12 must exist');
assert(kneeQuestions['knee_mentea_q13'], 'knee_mentea_q13 must exist');

// 6. knee_musstr_q6 & knee_musstr_q7
assert(kneeQuestions['knee_musstr_q6'], 'knee_musstr_q6 must exist');
assert(kneeQuestions['knee_musstr_q7'], 'knee_musstr_q7 must exist');

// 7. knee_patten_q6 & knee_patten_q6_b
assert(kneeQuestions['knee_patten_q6'], 'knee_patten_q6 must exist');
assert(kneeQuestions['knee_patten_q6_b'], 'knee_patten_q6_b must exist');

console.log('All question options integrity checks passed successfully!');
