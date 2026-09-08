const fs = require('fs');
const data = fs.readFileSync('public/rules/Ankle Region.json', 'utf8');
try {
  JSON.parse(data);
  console.log('JSON is valid');
} catch (e) {
  console.log('Raw error:', e);
  console.log('Message:', e.message);
}
