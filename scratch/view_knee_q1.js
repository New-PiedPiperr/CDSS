const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('./public/rules/Knee Region.json', 'utf8'));
const cond0 = data.conditions ? data.conditions[0] : data[0];
console.log('Condition 0 name:', cond0.condition || cond0.name);
console.log('Question 1:', JSON.stringify(cond0.questions[0], null, 2));
