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

// Binary search from the end
const total = lines.length;
const mid = Math.floor(total / 2);

console.log('Trying lines 1-' + mid + '...');
if (!tryParse(0, mid)) {
  console.log('Error is in first half (1-' + mid + ')');
  
  // Narrow down first half
  const q1 = Math.floor(mid / 2);
  console.log('Trying lines 1-' + q1 + '...');
  if (!tryParse(0, q1)) {
    console.log('Error is in lines 1-' + q1);
    
    const q2 = Math.floor(q1 / 2);
    console.log('Trying lines 1-' + q2 + '...');
    if (!tryParse(0, q2)) {
      console.log('Error is in lines 1-' + q2);
      
      const q3 = Math.floor(q2 / 2);
      console.log('Trying lines 1-' + q3 + '...');
      if (!tryParse(0, q3)) {
        console.log('Error is in lines 1-' + q3);
        
        const q4 = Math.floor(q3 / 2);
        console.log('Trying lines 1-' + q4 + '...');
        if (!tryParse(0, q4)) {
          console.log('Error is in lines 1-' + q4);
          
          const q5 = Math.floor(q4 / 2);
          console.log('Trying lines 1-' + q5 + '...');
          if (!tryParse(0, q5)) {
            console.log('Error is in lines 1-' + q5);
            for (var i = 0; i < q5; i++) {
              console.log((i+1) + ': ' + lines[i]);
            }
          } else {
            console.log('Error is in lines ' + (q5+1) + '-' + q4);
            for (var i = q5; i < q4; i++) {
              console.log((i+1) + ': ' + lines[i]);
            }
          }
        } else {
          console.log('Error is in lines ' + (q4+1) + '-' + q3);
          for (var i = q4; i < q3; i++) {
            console.log((i+1) + ': ' + lines[i]);
          }
        }
      } else {
        console.log('Error is in lines ' + (q3+1) + '-' + q2);
        for (var i = q3; i < q2; i++) {
          console.log((i+1) + ': ' + lines[i]);
        }
      }
    } else {
      console.log('Error is in lines ' + (q2+1) + '-' + q1);
      for (var i = q2; i < q1; i++) {
        console.log((i+1) + ': ' + lines[i]);
      }
    }
  } else {
    console.log('Error is in lines ' + (q1+1) + '-' + mid);
    for (var i = q1; i < mid; i++) {
      console.log((i+1) + ': ' + lines[i]);
    }
  }
} else {
  console.log('First half is valid, error is in lines ' + (mid+1) + '-' + total);
}
