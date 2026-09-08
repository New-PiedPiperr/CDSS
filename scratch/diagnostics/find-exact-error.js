const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');

// Check for control characters (except newline, tab, carriage return)
const controlChars = [];
for (var i = 0; i < data.length; i++) {
  const code = data.charCodeAt(i);
  if (code < 32 && code !== 10 && code !== 13 && code !== 9) {
    controlChars.push({
      pos: i,
      code: code,
      char: data[i],
      context: data.substring(Math.max(0, i - 20), i + 20)
    });
  }
}

console.log('Control characters found:', controlChars.length);
if (controlChars.length > 0) {
  controlChars.forEach(c => {
    console.log('Position', c.pos, ':', c.char, '(code', c.code, ')');
    console.log('Context:', c.context);
  });
}

// Also check for other suspicious patterns
console.log('\nChecking for other issues...');

// Check for unescaped backslashes in strings
const lines = data.split('\n');
for (var i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Look for backslashes that aren't part of escape sequences
  const matches = line.match(/\\([^"\\\/bfnrtu])/g);
  if (matches) {
    console.log('Line ' + (i+1) + ': Suspicious backslashes:', matches);
  }
}

// Try to find the exact error using JSON.parse position
console.log('\nTrying JSON.parse with error position...');
try {
  JSON.parse(data);
  console.log('JSON.parse succeeded');
} catch (e) {
  console.log('Error:', e.message);
  
  // Node.js v20+ includes position in SyntaxError
  if (e.position !== undefined) {
    console.log('Error position:', e.position);
    
    const pos = e.position;
    const lineNo = data.substring(0, pos).split('\n').length;
    const lineStart = data.lastIndexOf('\n', pos - 1) + 1;
    const lineEnd = data.indexOf('\n', pos);
    const line = data.substring(lineStart, lineEnd === -1 ? data.length : lineEnd);
    const col = pos - lineStart;
    
    console.log('Line:', lineNo);
    console.log('Column:', col);
    console.log('Line content:', line);
    console.log('Pointer:', ' '.repeat(Math.min(col, 100)) + '^');
  } else {
    console.log('No position info in error');
  }
}
