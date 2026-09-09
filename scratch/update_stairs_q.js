const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'rules', 'Knee Region.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const createEffects = (incCond = []) => ({
  nextQuestionId: null,
  skipToQuestionId: null,
  triggeredConditions: [],
  excludedConditions: [],
  increaseLikelihood: incCond,
  decreaseLikelihood: [],
  redFlag: false,
  redFlagText: null,
  terminateAssessment: false,
  notes: null
});

const cond0 = data.conditions ? data.conditions[0] : data[0];
const stairsQ = cond0.questions.find(q => q.id === 'knee_patpaisynpfprunkne_q13' || /descending stairs/i.test(q.questionText || q.question || ''));

if (stairsQ) {
  stairsQ.questionText = "During stair climbing, when is the pain worst?";
  stairsQ.question = "During stair climbing, when is the pain worst?";

  const newOptions = [
    {
      value: "Ascending",
      effects: createEffects()
    },
    {
      value: "Descending (Strong PFPS indicator due to high patellofemoral joint compression)",
      effects: createEffects(["PATELLOFEMORAL PAIN SYNDROME (PFPS – “Runner’s Knee”)"])
    },
    {
      value: "No increase",
      effects: createEffects()
    }
  ];

  stairsQ.options = newOptions;
  stairsQ.answers = newOptions;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated stairs question in Knee Region.json!');
} else {
  console.error('Stairs question not found!');
}
