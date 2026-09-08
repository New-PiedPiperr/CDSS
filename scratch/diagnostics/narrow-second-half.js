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

// Error is in lines 5512-7350
// Narrow down
const start = 5512;
const end = 7350;
const mid = Math.floor((start + end) / 2);

console.log('Trying lines ' + start + '-' + mid + '...');
if (!tryParse(start, mid)) {
  console.log('Error is in lines ' + start + '-' + mid);
  
  const q1 = Math.floor((start + mid) / 2);
  console.log('Trying lines ' + start + '-' + q1 + '...');
  if (!tryParse(start, q1)) {
    console.log('Error is in lines ' + start + '-' + q1);
    
    const q2 = Math.floor((start + q1) / 2);
    console.log('Trying lines ' + start + '-' + q2 + '...');
    if (!tryParse(start, q2)) {
      console.log('Error is in lines ' + start + '-' + q2);
      
      const q3 = Math.floor((start + q2) / 2);
      console.log('Trying lines ' + start + '-' + q3 + '...');
      if (!tryParse(start, q3)) {
        console.log('Error is in lines ' + start + '-' + q3);
        
        const q4 = Math.floor((start + q3) / 2);
        console.log('Trying lines ' + start + '-' + q4 + '...');
        if (!tryParse(start, q4)) {
          console.log('Error is in lines ' + start + '-' + q4);
          
          const q5 = Math.floor((start + q4) / 2);
          console.log('Trying lines ' + start + '-' + q5 + '...');
          if (!tryParse(start, q5)) {
            console.log('Error is in lines ' + start + '-' + q5);
            for (var i = start; i < q5; i++) {
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
  console.log('Lines ' + start + '-' + mid + ' are valid, error is in lines ' + (mid+1) + '-' + end);
}
