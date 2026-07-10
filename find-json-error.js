const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');

try {
  JSON.parse(data);
  console.log('JSON is valid!');
} catch (e) {
  console.log('Parse error:', e.message);
  
  const lines = data.split('\n');
  const pos = e.position || 0;
  
  let currentPos = 0;
  let errorLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (currentPos + lines[i].length >= pos) {
      errorLine = i + 1;
      break;
    }
    currentPos += lines[i].length + 1;
  }
  
  console.log('Approximate error at line:', errorLine);
  if (errorLine > 0 && errorLine <= lines.length) {
    console.log('Context around error:');
    var start = Math.max(0, errorLine - 3);
    var end = Math.min(lines.length, errorLine + 2);
    for (var j = start; j < end; j++) {
      console.log((j + 1) + ': ' + lines[j]);
    }
  }
}
