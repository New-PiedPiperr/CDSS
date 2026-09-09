// scripts/addPatientVisibleFlag.js
const fs = require('fs');
const path = require('path');

const rulesDir = path.resolve(__dirname, '../public/rules');

function hasParenthetical(text) {
  return /\([^)]*\)/.test(text);
}

function processFile(filePath) {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);
  let modified = false;
  if (Array.isArray(data.conditions)) {
    data.conditions.forEach((cond) => {
      if (Array.isArray(cond.questions)) {
        cond.questions.forEach((q) => {
          const raw = q.questionText || q.question || '';
          const hasParen = hasParenthetical(raw);
          if (hasParen) {
            if (q.patientVisible !== false) {
              q.patientVisible = false;
              modified = true;
            }
          } else {
            if (q.patientVisible !== true) {
              q.patientVisible = true;
              modified = true;
            }
          }
        });
      }
    });
  }
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

fs.readdirSync(rulesDir).forEach((file) => {
  if (file.endsWith('.json')) {
    processFile(path.join(rulesDir, file));
  }
});
