/**
 * fix-ankle-rules.js
 * Applies targeted fixes to public/rules/Ankle Region.json:
 *
 * 1. ankle_q5_1 "Sudden" onset: move Achilles Tendon Rupture from
 *    excludedConditions → triggeredConditions + increaseLikelihood.
 *    "Gradual" onset: add excludedConditions + decreaseLikelihood.
 *
 * 2. ankle_q9 "NSAIDs" question: remove the spurious
 *    "Use ultrasound to investigate tears" option from options[] and answers[].
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'rules', 'Ankle Region.json');
const raw = fs.readFileSync(filePath, 'utf-8');
const rules = JSON.parse(raw);

let q5_1Fixed = false;
let q9Fixed = false;

for (const condition of rules.conditions) {
  for (const q of condition.questions || []) {

    // ── FIX 1: ankle_q5_1 ──────────────────────────────────────────────────
    if (q.id === 'ankle_q5_1') {
      for (const arr of [q.options, q.answers]) {
        if (!Array.isArray(arr)) continue;
        for (const opt of arr) {
          if (opt.value === 'Sudden') {
            // Remove from excludedConditions
            opt.effects.excludedConditions = opt.effects.excludedConditions.filter(
              (c) => c !== 'Achilles Tendon Rupture'
            );
            // Add to triggeredConditions (deduplicated)
            if (!opt.effects.triggeredConditions.includes('Achilles Tendon Rupture')) {
              opt.effects.triggeredConditions.push('Achilles Tendon Rupture');
            }
            // Add to increaseLikelihood (deduplicated)
            if (!opt.effects.increaseLikelihood.includes('Achilles Tendon Rupture')) {
              opt.effects.increaseLikelihood.push('Achilles Tendon Rupture');
            }
          } else if (opt.value === 'Gradual') {
            // Add to excludedConditions (deduplicated)
            if (!opt.effects.excludedConditions.includes('Achilles Tendon Rupture')) {
              opt.effects.excludedConditions.push('Achilles Tendon Rupture');
            }
            // Add to decreaseLikelihood (deduplicated)
            if (!opt.effects.decreaseLikelihood.includes('Achilles Tendon Rupture')) {
              opt.effects.decreaseLikelihood.push('Achilles Tendon Rupture');
            }
          }
        }
      }
      q5_1Fixed = true;
    }

    // ── FIX 2: ankle_q9 ────────────────────────────────────────────────────
    if (q.id === 'ankle_q9') {
      const BAD_VALUE = 'Use ultrasound to investigate tears';
      if (Array.isArray(q.options)) {
        q.options = q.options.filter((o) => o.value !== BAD_VALUE);
      }
      if (Array.isArray(q.answers)) {
        q.answers = q.answers.filter((a) => a.value !== BAD_VALUE);
      }
      q9Fixed = true;
    }
  }
}

if (!q5_1Fixed) console.warn('WARNING: ankle_q5_1 not found — no changes applied for fix 1.');
if (!q9Fixed)   console.warn('WARNING: ankle_q9 not found — no changes applied for fix 2.');

fs.writeFileSync(filePath, JSON.stringify(rules, null, 2), 'utf-8');
console.log(`Done. q5_1Fixed=${q5_1Fixed}, q9Fixed=${q9Fixed}`);
