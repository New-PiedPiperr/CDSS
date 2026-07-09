const fs = require('fs');
const path = require('path');

const anklePath = path.join(__dirname, '../public/rules/Ankle Region.json');
const casefilePath = path.join(__dirname, '../public/rules/clinical-tests-for-casefile.json');

// 1. Process Ankle Region.json
let ankleData = JSON.parse(fs.readFileSync(anklePath, 'utf8'));

// Rename "OSTEOARTHRITIS" to "Ankle Osteoarthritis" in all condition names, question condition associations, and effects (triggered, excluded, increase, decrease)
ankleData.conditions.forEach(cond => {
  if (cond.name === 'OSTEOARTHRITIS') {
    cond.name = 'Ankle Osteoarthritis';
  }
  
  if (cond.questions) {
    cond.questions.forEach(q => {
      if (q.condition === 'OSTEOARTHRITIS') {
        q.condition = 'Ankle Osteoarthritis';
      }
      
      const processEffects = (effects) => {
        if (effects) {
          if (effects.triggeredConditions) {
            effects.triggeredConditions = effects.triggeredConditions.map(c => c === 'OSTEOARTHRITIS' ? 'Ankle Osteoarthritis' : c);
          }
          if (effects.excludedConditions) {
            effects.excludedConditions = effects.excludedConditions.map(c => c === 'OSTEOARTHRITIS' ? 'Ankle Osteoarthritis' : c);
          }
          if (effects.increaseLikelihood) {
            effects.increaseLikelihood = effects.increaseLikelihood.map(c => c === 'OSTEOARTHRITIS' ? 'Ankle Osteoarthritis' : c);
          }
          if (effects.decreaseLikelihood) {
            effects.decreaseLikelihood = effects.decreaseLikelihood.map(c => c === 'OSTEOARTHRITIS' ? 'Ankle Osteoarthritis' : c);
          }
        }
      };

      if (q.options) {
        q.options.forEach(opt => processEffects(opt.effects));
      }
      if (q.answers) {
        q.answers.forEach(ans => processEffects(ans.effects));
      }
    });
  }
});

// Update ankle_q4: Morning option should exclude "Plantar Fasciitis", "Calcaneal Bursitis", "Traction Apophysitis (Sever’s Disease)"
const generalAssessment = ankleData.conditions.find(c => c.name === 'General Assessment');
if (generalAssessment && generalAssessment.questions) {
  const q4 = generalAssessment.questions.find(q => q.id === 'ankle_q4');
  if (q4) {
    const morningOpt = q4.options.find(opt => opt.value === 'Morning');
    if (morningOpt && morningOpt.effects) {
      morningOpt.effects.excludedConditions = [
        "Plantar Fasciitis",
        "Calcaneal Bursitis",
        "Traction Apophysitis (Sever’s Disease)"
      ];
    }
    const morningAns = q4.answers?.find(ans => ans.value === 'Morning');
    if (morningAns && morningAns.effects) {
      morningAns.effects.excludedConditions = [
        "Plantar Fasciitis",
        "Calcaneal Bursitis",
        "Traction Apophysitis (Sever’s Disease)"
      ];
    }
  }
}

// Split ankle_q5 under Achilles Tendinopathy
const achillesCond = ankleData.conditions.find(c => c.name === 'Achilles Tendinopathy');
if (achillesCond && achillesCond.questions) {
  const q5Index = achillesCond.questions.findIndex(q => q.id === 'ankle_q5');
  if (q5Index !== -1) {
    const q5 = achillesCond.questions[q5Index];
    
    // Retain only Yes and No for q5
    q5.options = q5.options.filter(opt => opt.value === 'Yes' || opt.value === 'No');
    q5.answers = q5.answers ? q5.answers.filter(ans => ans.value === 'Yes' || ans.value === 'No') : undefined;

    // Create a new question for how the pain began
    const q5_1 = {
      id: "ankle_q5_1",
      questionText: "How did the pain begin?",
      question: "How did the pain begin?",
      condition: "Achilles Tendinopathy",
      category: "general",
      inputType: "select",
      isGating: false,
      requiredConditions: [],
      excludedIfConditions: [],
      options: [
        {
          value: "Sudden",
          effects: {
            nextQuestionId: null,
            skipToQuestionId: null,
            triggeredConditions: [],
            excludedConditions: [
              "Achilles Tendon Rupture"
            ],
            increaseLikelihood: [],
            decreaseLikelihood: [],
            redFlag: false,
            redFlagText: null,
            terminateAssessment: false,
            notes: null
          }
        },
        {
          value: "Gradual",
          effects: {
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
          }
        }
      ],
      answers: [
        {
          value: "Sudden",
          effects: {
            nextQuestionId: null,
            skipToQuestionId: null,
            triggeredConditions: [],
            excludedConditions: [
              "Achilles Tendon Rupture"
            ],
            increaseLikelihood: [],
            decreaseLikelihood: [],
            redFlag: false,
            redFlagText: null,
            terminateAssessment: false,
            notes: null
          }
        },
        {
          value: "Gradual",
          effects: {
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
          }
        }
      ]
    };

    // Insert q5_1 right after q5
    achillesCond.questions.splice(q5Index + 1, 0, q5_1);
  }
}

fs.writeFileSync(anklePath, JSON.stringify(ankleData, null, 2), 'utf8');
console.log('Successfully updated Ankle Region.json');

// 2. Process clinical-tests-for-casefile.json
let casefileData = JSON.parse(fs.readFileSync(casefilePath, 'utf8'));
if (casefileData.conditionTests) {
  casefileData.conditionTests.forEach(item => {
    if (item.condition === 'OSTEOARTHRITIS') {
      item.condition = 'Ankle Osteoarthritis';
    }
  });
}
fs.writeFileSync(casefilePath, JSON.stringify(casefileData, null, 2), 'utf8');
console.log('Successfully updated clinical-tests-for-casefile.json');

// 3. Process clinical-tests-mapping.json
const mappingPath = path.join(__dirname, '../public/rules/clinical-tests-mapping.json');
if (fs.existsSync(mappingPath)) {
  let mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  
  const updateMappingObj = (obj) => {
    if (!obj) return;
    if (obj.conditionName === 'OSTEOARTHRITIS') {
      obj.conditionName = 'Ankle Osteoarthritis';
    }
    if (obj.name === 'OSTEOARTHRITIS') {
      obj.name = 'Ankle Osteoarthritis';
    }
    if (obj.condition === 'OSTEOARTHRITIS') {
      obj.condition = 'Ankle Osteoarthritis';
    }
    if (Array.isArray(obj)) {
      obj.forEach(updateMappingObj);
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
          updateMappingObj(obj[key]);
        } else if (obj[key] === 'OSTEOARTHRITIS') {
          obj[key] = 'Ankle Osteoarthritis';
        }
      });
    }
  };
  
  updateMappingObj(mappingData);
  fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2), 'utf8');
  console.log('Successfully updated clinical-tests-mapping.json');
}

