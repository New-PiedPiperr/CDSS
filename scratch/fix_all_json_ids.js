const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, '..', 'public', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.json'));

function slugifyCondition(condName) {
  // Convert condition name to a short 5-6 letter unique prefix
  const clean = condName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toLowerCase();
  
  const words = clean.split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 6);
  }
  return words.map(w => w.slice(0, 3)).join('');
}

files.forEach(file => {
  const filePath = path.join(rulesDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    const conds = data.conditions || (Array.isArray(data) ? data : []);
    
    const regionPrefix = (data.region || file.split(' ')[0] || 'rule').toLowerCase();
    const usedPrefixes = new Set();
    let fileModified = false;

    conds.forEach((c, cIdx) => {
      const condName = c.condition || c.name || `cond${cIdx}`;
      let basePrefix = `${regionPrefix}_${slugifyCondition(condName)}`;
      
      // Ensure basePrefix is unique among conditions in this file
      let count = 1;
      let finalPrefix = basePrefix;
      while (usedPrefixes.has(finalPrefix)) {
        count++;
        finalPrefix = `${basePrefix}${count}`;
      }
      usedPrefixes.add(finalPrefix);

      (c.questions || []).forEach((q, qIdx) => {
        const newId = `${finalPrefix}_q${qIdx + 1}`;
        if (q.id !== newId) {
          q.id = newId;
          fileModified = true;
        }
      });
    });

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated IDs in ${file}`);
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
});
