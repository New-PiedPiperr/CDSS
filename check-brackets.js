const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');

let depth = 0;
let inString = false;
let escape = false;
let line = 1;
let col = 0;

for (let i = 0; i < data.length; i++) {
  const ch = data[i];
  col++;
  
  if (ch === '\n') {
    line++;
    col = 0;
    continue;
  }
  
  if (inString) {
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = false;
      continue;
    }
    continue;
  }
  
  if (ch === '"') {
    inString = true;
    continue;
  }
  
  if (ch === '{' || ch === '[') {
    depth++;
  } else if (ch === '}' || ch === ']') {
    depth--;
    if (depth < 0) {
      console.log(`Unexpected closing bracket at line ${line}, col ${col}`);
      console.log('Context:', data.substring(Math.max(0, i - 50), i + 50));
      break;
    }
  }
}

console.log('Final depth:', depth);
if (depth !== 0) {
  console.log('Unbalanced brackets!');
}
