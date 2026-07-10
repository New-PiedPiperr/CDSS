const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');

// Check for BOM or invisible characters at start
console.log('First 100 chars (repr):', JSON.stringify(data.substring(0, 100)));

// Check for common issues
const lines = data.split('\n');
console.log('Total lines:', lines.length);

// Look for any obvious issues
for (var i = 0; i < Math.min(lines.length, 10); i++) {
  console.log('Line ' + (i+1) + ':', JSON.stringify(lines[i]));
}
