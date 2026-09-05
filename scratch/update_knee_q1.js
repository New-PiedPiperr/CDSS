const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'rules', 'Knee Region.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const createEffects = () => ({
  nextQuestionId: null,
  skipToQuestionId: null,
  triggeredConditions: [],
  excludedConditions: [],
  increaseLikelihood: [],
  decreaseLikelihood: [],
  redFlag: false,
  redFlagText: null,
  terminateAssessment: false,
  notes: null
});

const newOptions = [
  { value: "Front part of the knee", effects: createEffects() },
  { value: "Inner or outer side", effects: createEffects() },
  { value: "Back side of the knee", effects: createEffects() }
];

const cond0 = data.conditions ? data.conditions[0] : data[0];
const q1 = cond0.questions[0];

q1.options = newOptions;
q1.answers = newOptions;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated Knee Region Q1 options!');
