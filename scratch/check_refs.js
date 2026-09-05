const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./public/rules/Knee Region.json', 'utf8'));

let refsCount = 0;
const conds = data.conditions || data;
conds.forEach(c => {
  (c.questions || []).forEach(q => {
    (q.options || q.answers || []).forEach(opt => {
      if (opt.effects) {
        if (opt.effects.nextQuestionId || opt.effects.next_question_id) refsCount++;
        if (opt.effects.skipToQuestionId || opt.effects.skip_to_question_id) refsCount++;
      }
    });
  });
});
console.log('Total explicit question ID references in Knee Region.json:', refsCount);
