const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '..', 'public', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(rulesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const conds = data.conditions || (Array.isArray(data) ? data : []);
    const seen = new Map();
    const collisions = [];

    conds.forEach(c => {
      const condName = c.condition || c.name;
      (c.questions || []).forEach(q => {
        if (seen.has(q.id)) {
          collisions.push({
            id: q.id,
            firstCondition: seen.get(q.id).condName,
            firstQuestion: seen.get(q.id).questionText,
            secondCondition: condName,
            secondQuestion: q.questionText || q.question
          });
        } else {
          seen.set(q.id, { condName, questionText: q.questionText || q.question });
        }
      });
    });

    if (collisions.length > 0) {
      console.log(`=== COLLISIONS IN ${file} (${collisions.length}) ===`);
      collisions.forEach(c => {
        console.log(`ID Collision: ${c.id}`);
        console.log(`  1: [${c.firstCondition}] ${c.firstQuestion}`);
        console.log(`  2: [${c.secondCondition}] ${c.secondQuestion}`);
      });
    } else {
      console.log(`No ID collisions in ${file}`);
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
});
