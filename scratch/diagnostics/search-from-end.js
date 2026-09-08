const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');
const lines = data.split('\n');

function tryParse(start, end) {
  const subset = lines.slice(start, end).join('\n');
  try {
    JSON.parse(subset);
    return true;
  } catch (e) {
    return false;
  }
}

console.log('Total lines:', lines.length);

// Binary search from the END
const total = lines.length;

console.log('Trying last half (lines ' + Math.floor(total/2) + '-' + total + ')...');
if (!tryParse(Math.floor(total/2), total)) {
  console.log('Error is in second half');
  
  const q3 = Math.floor(total * 3 / 4);
  console.log('Trying lines ' + q3 + '-' + total + '...');
  if (!tryParse(q3, total)) {
    console.log('Error is in lines ' + q3 + '-' + total);
    console.log('Last 100 lines:');
    for (var i = Math.max(0, total - 100); i < total; i++) {
      console.log((i+1) + ': ' + lines[i]);
    }
  } else {
    console.log('Error is in lines ' + Math.floor(total/2) + '-' + q3);
  }
} else {
  console.log('Last half is valid, error is in first half');
}
