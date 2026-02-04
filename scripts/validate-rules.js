/**
 * Clinical Rules Validation Script
 *
 * Validates all clinical rules JSON files for:
 * 1. Valid JSON structure
 * 2. No orphan questions (questions with no path to them)
 * 3. No circular references
 * 4. All nextQuestionId references point to valid questions
 * 5. Terminal questions are properly marked
 * 6. No instructional text in answer options
 */

const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(__dirname, '..', 'public', 'rules');

// Patterns that indicate instructional text (should not be answer options)
const INSTRUCTIONAL_PATTERNS = [
  /^if\s+(yes|no|patient|the|this)/i,
  /^ask\s+/i,
  /^proceed\s+/i,
  /^rule\s+out/i,
  /^check\s+(if|for|whether)/i,
  /^note:/i,
  /^observe/i,
  /^palpate/i,
  /^perform/i,
  /^use\s+/i,
  /^confirm/i,
  /clinical\s+note/i,
  /^investigate/i,
  /SPECIAL\s+/i,
  /CONFIRMATORY\s+TEST/i,
];

function isInstructionalText(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length > 100) return true;
  return INSTRUCTIONAL_PATTERNS.some((p) => p.test(trimmed));
}

function validateFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📋 Validating: ${fileName}`);

  const issues = [];
  const warnings = [];

  // Load and parse JSON
  let data;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(content);
    console.log(`   ✓ Valid JSON`);
  } catch (e) {
    console.log(`   ✗ Invalid JSON: ${e.message}`);
    return { issues: [`Invalid JSON: ${e.message}`], warnings: [] };
  }

  // Skip files without conditions
  if (!data.conditions || data.conditions.length === 0) {
    console.log(`   ⚠ No conditions found (reference data only)`);
    return { issues: [], warnings: ['No conditions found'] };
  }

  // Collect all question IDs
  const allQuestionIds = new Set();
  const questionMap = new Map();
  const entryPoints = new Set();

  for (const condition of data.conditions) {
    if (condition.questions && condition.questions.length > 0) {
      entryPoints.add(condition.questions[0].id);
    }

    for (const question of condition.questions || []) {
      if (allQuestionIds.has(question.id)) {
        issues.push(`Duplicate question ID: ${question.id}`);
      }
      allQuestionIds.add(question.id);
      questionMap.set(question.id, question);
    }
  }

  console.log(`   ✓ ${allQuestionIds.size} questions found`);
  console.log(`   ✓ ${entryPoints.size} entry points (conditions)`);

  // Validate all references
  const referencedIds = new Set(entryPoints);
  let brokenReferences = 0;
  let terminalsCount = 0;
  let instructionalOptions = 0;

  for (const [id, question] of questionMap) {
    for (const option of question.options || []) {
      // Check for instructional text
      if (isInstructionalText(option.value)) {
        instructionalOptions++;
        warnings.push(
          `Instructional text as option in ${id}: "${option.value.substring(0, 50)}..."`
        );
      }

      // Check references
      if (option.nextQuestionId) {
        referencedIds.add(option.nextQuestionId);
        if (!allQuestionIds.has(option.nextQuestionId)) {
          brokenReferences++;
          issues.push(`Broken reference: ${id} -> ${option.nextQuestionId}`);
        }
      } else if (option.isTerminal) {
        terminalsCount++;
      }
    }
  }

  // Check for orphan questions
  const orphans = [];
  for (const id of allQuestionIds) {
    if (!referencedIds.has(id)) {
      orphans.push(id);
    }
  }

  if (orphans.length > 0) {
    warnings.push(
      `${orphans.length} unreferenced questions (may be intentional): ${orphans.slice(0, 3).join(', ')}${orphans.length > 3 ? '...' : ''}`
    );
  }

  // Check for circular references (simple detection)
  const visited = new Set();
  const stack = new Set();

  function detectCycle(questionId, depth = 0) {
    if (depth > 100) return true; // Prevent infinite recursion
    if (stack.has(questionId)) return true;
    if (visited.has(questionId)) return false;

    const question = questionMap.get(questionId);
    if (!question) return false;

    visited.add(questionId);
    stack.add(questionId);

    for (const option of question.options || []) {
      if (option.nextQuestionId && detectCycle(option.nextQuestionId, depth + 1)) {
        issues.push(`Circular reference detected involving: ${questionId}`);
        return true;
      }
    }

    stack.delete(questionId);
    return false;
  }

  for (const entryPoint of entryPoints) {
    detectCycle(entryPoint);
  }

  // Summary
  console.log(`   ✓ ${terminalsCount} terminal endpoints`);

  if (brokenReferences > 0) {
    console.log(`   ✗ ${brokenReferences} broken references`);
  } else {
    console.log(`   ✓ All references valid`);
  }

  if (instructionalOptions > 0) {
    console.log(`   ⚠ ${instructionalOptions} potential instructional texts in options`);
  }

  if (issues.length === 0) {
    console.log(`   ✅ PASSED`);
  } else {
    console.log(`   ❌ ${issues.length} issues found`);
  }

  return { issues, warnings };
}

function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║      Clinical Rules JSON Validation Report             ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const files = fs
    .readdirSync(RULES_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'index.json');

  const results = {};
  let totalIssues = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const filePath = path.join(RULES_DIR, file);
    const { issues, warnings } = validateFile(filePath);
    results[file] = { issues, warnings };
    totalIssues += issues.length;
    totalWarnings += warnings.length;
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    SUMMARY                             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\nFiles validated: ${files.length}`);
  console.log(`Total issues: ${totalIssues}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (totalIssues === 0) {
    console.log('\n✅ All files passed validation!');
  } else {
    console.log('\n❌ Some files have issues that need attention.');
    console.log('\nDetailed issues:');
    for (const [file, { issues }] of Object.entries(results)) {
      if (issues.length > 0) {
        console.log(`\n${file}:`);
        issues.forEach((issue) => console.log(`  - ${issue}`));
      }
    }
  }

  if (totalWarnings > 0) {
    console.log('\n⚠️  Warnings (may be acceptable):');
    for (const [file, { warnings }] of Object.entries(results)) {
      if (warnings.length > 0) {
        console.log(`\n${file}:`);
        warnings.slice(0, 5).forEach((w) => console.log(`  - ${w}`));
        if (warnings.length > 5) {
          console.log(`  ... and ${warnings.length - 5} more`);
        }
      }
    }
  }
}

main();
