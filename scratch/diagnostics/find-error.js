const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');
const lines = data.split('\n');

// Check for common JSON issues
for (var i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Skip empty lines and comments
  if (trimmed === '' || trimmed.startsWith('//')) continue;
  
  // Check for trailing comma before closing bracket/brace
  if ((trimmed.endsWith(',}') || trimmed.endsWith(',]'))) {
    console.log('Line ' + (i+1) + ': Trailing comma: ' + line.substring(0, 80));
  }
  
  // Check for unescaped quotes in values
  if (trimmed.includes('"')) {
    const parts = trimmed.split('"');
    if (parts.length % 2 === 0 && !trimmed.endsWith(',')) {
      console.log('Line ' + (i+1) + ': Possible unescaped quote: ' + line.substring(0, 80));
    }
  }
}

// Try to find the error by binary search
function tryParse(startLine, endLine) {
  const subset = lines.slice(startLine, endLine).join('\n');
  try {
    JSON.parse(subset);
    return true;
  } catch (e) {
    return false;
  }
}

console.log('\n--- Binary search for error ---');

// First half
const mid = Math.floor(lines.length / 2);
console.log('Trying first half (lines 1-' + mid + ')...');
if (!tryParse(0, mid)) {
  console.log('Error is in first half');
  
  // Narrow down further
  const quarter = Math.floor(mid / 2);
  console.log('Trying first quarter (lines 1-' + quarter + ')...');
  if (!tryParse(0, quarter)) {
    console.log('Error is in first quarter');
    
    const eighth = Math.floor(quarter / 2);
    console.log('Trying first eighth (lines 1-' + eighth + ')...');
    if (!tryParse(0, eighth)) {
      console.log('Error is in first eighth');
      console.log('Searching lines 1-' + eighth);
      for (var i = 0; i < eighth; i++) {
        const line = lines[i];
        if (line.includes(']') || line.includes('}')) {
          console.log('Line ' + (i+1) + ': ' + line);
        }
      }
    } else {
      console.log('Error is between lines ' + (eighth+1) + ' and ' + quarter);
      for (var i = eighth; i < quarter; i++) {
        console.log('Line ' + (i+1) + ': ' + lines[i]);
      }
    }
  } else {
    console.log('Error is between lines ' + (quarter+1) + ' and ' + mid);
  }
} else {
  console.log('First half is valid, error is in second half');
}
