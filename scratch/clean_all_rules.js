const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '..', 'public', 'rules');

function cleanQuestionText(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/^\s*\d+[\.\)\:-]\s*/, '').trim();
}

function cleanOptionText(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/^\s*([a-zA-Z]|\d{1,2})[\.\)]\s+/, '').trim();
}

const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json'));

let totalQ = 0;
let totalOpt = 0;

files.forEach(f => {
  const filePath = path.join(rulesDir, f);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    let modified = false;

    const conditions = Array.isArray(data) ? data : (data.conditions || [data]);
    conditions.forEach(cond => {
      (cond.questions || []).forEach(q => {
        if (q.questionText) {
          const cleaned = cleanQuestionText(q.questionText);
          if (cleaned !== q.questionText) {
            q.questionText = cleaned;
            totalQ++;
            modified = true;
          }
        }
        if (q.question) {
          const cleaned = cleanQuestionText(q.question);
          if (cleaned !== q.question) {
            q.question = cleaned;
            totalQ++;
            modified = true;
          }
        }

        if (Array.isArray(q.options)) {
          q.options.forEach(opt => {
            if (typeof opt === 'string') {
              const cleaned = cleanOptionText(opt);
              if (cleaned !== opt) {
                totalOpt++;
                modified = true;
              }
            } else if (opt && opt.value) {
              const cleaned = cleanOptionText(opt.value);
              if (cleaned !== opt.value) {
                opt.value = cleaned;
                totalOpt++;
                modified = true;
              }
            }
          });
        }

        if (Array.isArray(q.answers)) {
          q.answers.forEach(opt => {
            if (typeof opt === 'string') {
              const cleaned = cleanOptionText(opt);
              if (cleaned !== opt) {
                totalOpt++;
                modified = true;
              }
            } else if (opt && opt.value) {
              const cleaned = cleanOptionText(opt.value);
              if (cleaned !== opt.value) {
                opt.value = cleaned;
                totalOpt++;
                modified = true;
              }
            }
          });
        }
      });
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Cleaned ${f}`);
    }
  } catch (err) {
    console.error(`Error processing ${f}:`, err.message);
  }
});

console.log(`Total questions cleaned: ${totalQ}`);
console.log(`Total options cleaned: ${totalOpt}`);
