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

// Narrow down: first 918 lines contain error
// Try first 459 lines
console.log('Trying lines 1-459...');
if (!tryParse(0, 459)) {
  console.log('Error is in lines 1-459');
  
  // Try first 229 lines
  console.log('Trying lines 1-229...');
  if (!tryParse(0, 229)) {
    console.log('Error is in lines 1-229');
    
    // Try first 114 lines
    console.log('Trying lines 1-114...');
    if (!tryParse(0, 114)) {
      console.log('Error is in lines 1-114');
      
      // Try first 57 lines
      console.log('Trying lines 1-57...');
      if (!tryParse(0, 57)) {
        console.log('Error is in lines 1-57');
        
        // Try first 28 lines
        console.log('Trying lines 1-28...');
        if (!tryParse(0, 28)) {
          console.log('Error is in lines 1-28');
          
          // Try first 14 lines
          console.log('Trying lines 1-14...');
          if (!tryParse(0, 14)) {
            console.log('Error is in lines 1-14');
            for (var i = 0; i < 14; i++) {
              console.log((i+1) + ': ' + lines[i]);
            }
          } else {
            console.log('Error is in lines 15-28');
            for (var i = 14; i < 28; i++) {
              console.log((i+1) + ': ' + lines[i]);
            }
          }
        } else {
          console.log('Error is in lines 29-57');
          for (var i = 28; i < 57; i++) {
            console.log((i+1) + ': ' + lines[i]);
          }
        }
      } else {
        console.log('Error is in lines 58-114');
        for (var i = 57; i < 114; i++) {
          console.log((i+1) + ': ' + lines[i]);
        }
      }
    } else {
      console.log('Error is in lines 115-229');
      for (var i = 114; i < 229; i++) {
        console.log((i+1) + ': ' + lines[i]);
      }
    }
  } else {
    console.log('Error is in lines 230-459');
    for (var i = 229; i < 459; i++) {
      console.log((i+1) + ': ' + lines[i]);
    }
  }
} else {
  console.log('First 459 lines are valid, error is in lines 460-918');
}
