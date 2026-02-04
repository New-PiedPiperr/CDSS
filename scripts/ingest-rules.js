/**
 * RULE INGESTION SCRIPT
 * ======================
 * Extracts medical assessment rules from DOCX files and converts them to structured JSON.
 *
 * SOURCE OF TRUTH: DOCX files in public/rules/
 * OUTPUT: JSON files alongside DOCX files in public/rules/
 *
 * IMPORTANT CONSTRAINTS:
 * - Do NOT invent medical rules not explicitly present in the documents
 * - Do NOT simplify or paraphrase clinical meaning
 * - Preserve original wording as much as possible
 * - Add TODO markers where content is ambiguous
 *
 * USAGE: node scripts/ingest-rules.js
 */

const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(process.cwd(), 'public', 'rules');

/**
 * Extract text content from a DOCX file
 */
async function extractDocxText(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return {
      text: result.value,
      messages: result.messages,
    };
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    return { text: '', messages: [{ type: 'error', message: error.message }] };
  }
}

/**
 * Parse region name from filename
 */
function getRegionFromFilename(filename) {
  const name = path.basename(filename, '.docx').toLowerCase();
  if (name.includes('cervical')) return 'cervical';
  if (name.includes('lumbar')) return 'lumbar';
  if (name.includes('ankle')) return 'ankle';
  if (name.includes('shoulder')) return 'shoulder';
  if (name.includes('elbow')) return 'elbow';
  if (name.includes('general')) return 'general';
  return name.replace(/\s+/g, '_');
}

/**
 * Categorize question based on content
 */
function categorizeQuestion(text) {
  const upper = text.toUpperCase();

  if (upper.includes('LOCATION') || upper.includes('WHERE') || upper.includes('REGION'))
    return 'location';
  if (upper.includes('WHEN') || upper.includes('MORNING') || upper.includes('NIGHT'))
    return 'temporal';
  if (upper.includes('HOW') && upper.includes('BEGIN')) return 'onset';
  if (upper.includes('STIFF')) return 'stiffness';
  if (upper.includes('NUMB') || upper.includes('TINGL') || upper.includes('BURNING'))
    return 'neurological';
  if (upper.includes('WEAK')) return 'neurological';
  if (upper.includes('BOWEL') || upper.includes('BLADDER')) return 'red_flag';
  if (upper.includes('SCALE') || upper.includes('0-10')) return 'pain_intensity';
  if (upper.includes('RADIAT')) return 'radiation';
  if (upper.includes('SWELL') || upper.includes('INFLAMMATION')) return 'inflammation';
  if (upper.includes('POP') || upper.includes('CRACK') || upper.includes('RIPPING'))
    return 'mechanical';
  if (upper.includes('WALK') || upper.includes('BEAR WEIGHT')) return 'function';
  if (upper.includes('AGE')) return 'demographic';
  if (upper.includes('SEX')) return 'demographic';
  if (upper.includes('SPORT') || upper.includes('ACTIVITY')) return 'activity';
  if (upper.includes('HISTORY') || upper.includes('PREVIOUS')) return 'history';

  return 'general';
}

/**
 * Parse answer line to extract value and effects
 * Effects are typically in parentheses or tabs: (Rule out X), (Confirm X)
 * 
 * IMPORTANT: The displayed value should NOT include rule-out/effect text.
 * Effects are kept in the effects object for logic, but stripped from display value.
 */
function parseAnswerLine(line) {
  const effects = {
    rule_out: [],
    increase_likelihood: [],
    decrease_likelihood: [],
    next_questions: [],
    red_flag: false,
    red_flag_text: null,
    notes: null,
  };

  // Split by tab to find effects notation
  const parts = line.split('\t');
  let value = parts[0].trim();

  // Clean up value - remove leading letter/number markers
  value = value.replace(/^[a-e]\.\s*/i, '').trim();

  // Check for parenthetical content in original line
  const parentheticalMatch = line.match(/\(([^)]+)\)/);

  // Check tabbed content
  const effectsText = parts.slice(1).join(' ').trim();
  const combinedEffects =
    (parentheticalMatch ? parentheticalMatch[1] : '') + ' ' + effectsText;

  if (/rule\s*out/i.test(combinedEffects)) {
    const condition = combinedEffects
      .replace(/.*rule\s*out\s*/i, '')
      .replace(/\).*/, '')
      .trim();
    if (condition) {
      effects.rule_out.push(condition);
    }
  }

  if (/confirm/i.test(combinedEffects)) {
    const condition = combinedEffects
      .replace(/.*confirm\s*/i, '')
      .replace(/\).*/, '')
      .trim();
    if (condition) {
      effects.increase_likelihood.push(condition);
    }
  }

  if (/red\s*flag/i.test(combinedEffects)) {
    effects.red_flag = true;
    effects.red_flag_text = combinedEffects;
  }

  // Capture notes like "(NB: ...)" or "(Though this is...)"
  if (
    parentheticalMatch &&
    !effects.rule_out.length &&
    !effects.increase_likelihood.length
  ) {
    effects.notes = parentheticalMatch[1].trim();
  }

  // CRITICAL: Strip parenthetical content from the display value
  // The effects are kept in the effects object, but not shown to patient
  value = value.replace(/\s*\([^)]*\)\s*/g, '').trim();

  return { value, effects };
}

/**
 * Check if a line looks like a section header or non-answer content
 */
function isNonAnswerLine(line) {
  const upperLine = line.toUpperCase();
  return (
    line.includes('?') ||
    upperLine.startsWith('FOR ') ||
    upperLine.startsWith('OBSERVATION') ||
    upperLine.startsWith('TEST') ||
    upperLine.startsWith('RADIOGRAPHIC') ||
    upperLine.startsWith('CONCERNING') ||
    upperLine.includes('FEATURES:') ||
    upperLine.includes('NB:') ||
    /^AGE\s*\(/i.test(line) ||
    /^THE\s+/i.test(line) || // Explanatory text like "The fracture could be..."
    /^THIS\s+/i.test(line) ||
    /^NOTE:/i.test(line) ||
    /^ASK\s+/i.test(line) ||
    line.length > 100 // Very long lines are usually explanatory text
  );
}

/**
 * Parse structured rules from raw text
 *
 * DOCUMENT FORMAT OBSERVED:
 * - Condition headers start with "For" or "FOR" followed by condition name
 * - Questions end with "?"
 * - Answers are typically Yes/No or lettered options (a. b. c.)
 * - Effects are noted in parentheses or after tabs: (Rule out X), (Confirm X)
 * - TEST sections contain physical examination instructions
 * - Radiographic/Observation sections contain confirmation methods
 */
function parseRulesFromText(rawText, region) {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l);

  const conditions = [];
  let currentCondition = null;
  let currentQuestion = null;
  let questionCounter = 1;
  let inTestSection = false;
  let inObservationSection = false;
  let globalQuestions = []; // Questions before any condition

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Detect condition headers: "For X" or "FOR X" patterns
    // Must not be a question (no ?)
    if (/^FOR\s+/i.test(line) && !line.includes('?')) {
      // Save previous condition
      if (currentCondition) {
        conditions.push(currentCondition);
      }

      const conditionName = line
        .replace(/^FOR\s+/i, '')
        .replace(/\s*\(.*\)\s*$/, '')
        .replace(/[:\s…]*$/, '')
        .trim();

      currentCondition = {
        name: conditionName,
        entry_criteria: [],
        questions: [],
        recommended_tests: [],
        confirmation_methods: [],
        observations: [],
        source_line: i + 1,
      };

      inTestSection = false;
      inObservationSection = false;
      currentQuestion = null;
      continue;
    }

    // Detect General Questions section header
    if (upperLine.includes('GENERAL QUESTIONS')) {
      if (currentCondition) {
        conditions.push(currentCondition);
      }
      currentCondition = {
        name: 'General Assessment',
        entry_criteria: [],
        questions: [],
        recommended_tests: [],
        confirmation_methods: [],
        observations: [],
        source_line: i + 1,
        is_general: true,
      };
      inTestSection = false;
      inObservationSection = false;
      continue;
    }

    // Detect major section headers that create conditions
    if (
      /^FOR\s+[A-Z]+.*INJURIES$/i.test(line) ||
      /^FOR\s+[A-Z]+.*FRACTURES$/i.test(line) ||
      /^RHEUMATOID\s+ARTHRITIS$/i.test(line) ||
      /^OSTEOARTHRITIS$/i.test(line)
    ) {
      if (currentCondition) {
        conditions.push(currentCondition);
      }
      currentCondition = {
        name: line.replace(/^FOR\s+/i, '').trim(),
        entry_criteria: [],
        questions: [],
        recommended_tests: [],
        confirmation_methods: [],
        observations: [],
        source_line: i + 1,
      };
      inTestSection = false;
      inObservationSection = false;
      continue;
    }

    // Detect TEST section
    if (upperLine === 'TEST' || upperLine === 'TESTS') {
      inTestSection = true;
      inObservationSection = false;
      currentQuestion = null;
      continue;
    }

    // Detect Observation section
    if (upperLine.startsWith('OBSERVATION') || upperLine.startsWith('OBSEVATION')) {
      inObservationSection = true;
      inTestSection = false;
      currentQuestion = null;
      continue;
    }

    // Detect Radiographic confirmation line
    if (upperLine.includes('RADIOGRAPHIC') && upperLine.includes('CONFIRM')) {
      if (currentCondition) {
        currentCondition.confirmation_methods.push(line);
      }
      continue;
    }

    // Collect test instructions
    if (inTestSection && currentCondition) {
      // Skip if it's starting a new section
      if (/^FOR\s+/i.test(line)) {
        i--; // Re-process this line as a condition
        inTestSection = false;
        continue;
      }
      if (line.length > 10) {
        currentCondition.recommended_tests.push(line);
      }
      continue;
    }

    // Collect observation instructions
    if (inObservationSection && currentCondition) {
      if (/^FOR\s+/i.test(line)) {
        i--;
        inObservationSection = false;
        continue;
      }
      if (line.length > 5 && !line.includes('?')) {
        currentCondition.observations.push(line);
      }
      continue;
    }

    // Detect questions (lines ending with ?)
    if (line.includes('?')) {
      inTestSection = false;
      inObservationSection = false;

      currentQuestion = {
        id: `${region}_q${questionCounter++}`,
        question: line.replace(/\s*\*+\s*$/, ''), // Remove trailing asterisks
        category: categorizeQuestion(line),
        answers: [],
        source_line: i + 1,
      };

      if (currentCondition) {
        currentCondition.questions.push(currentQuestion);
      } else {
        globalQuestions.push(currentQuestion);
      }
      continue;
    }

    // Detect answers - any line after a question that's not a section header
    // This includes: Yes/No, lettered options (a. b. c.), and plain text options
    if (currentQuestion && !inTestSection && !inObservationSection) {
      // Skip non-answer lines (headers, explanatory text, etc.)
      if (isNonAnswerLine(line)) {
        continue;
      }

      // Check if this looks like an answer option
      const isLettered = /^[a-e]\.\s+/i.test(line);
      const isYesNo = /^(Yes|No)\b/i.test(line);
      const isShortOption = line.length > 1 && line.length < 80;
      
      if (isLettered || isYesNo || isShortOption) {
        const { value, effects } = parseAnswerLine(line);
        
        // Only add if we have a meaningful value
        if (value && value.length > 0 && currentQuestion.answers.length < 15) {
          currentQuestion.answers.push({
            value,
            effects,
          });
        }
        continue;
      }
    }

    // Detect age criteria
    if (currentCondition && /^AGE\s*\(/i.test(line)) {
      currentCondition.entry_criteria.push({
        type: 'age',
        description: line,
      });
    }
  }

  // Push last condition
  if (currentCondition) {
    conditions.push(currentCondition);
  }

  // Add global questions to a general condition if they exist
  if (globalQuestions.length > 0) {
    conditions.unshift({
      name: 'Initial Assessment',
      entry_criteria: [],
      questions: globalQuestions,
      recommended_tests: [],
      confirmation_methods: [],
      observations: [],
      is_general: true,
    });
  }

  // POST-PROCESSING: Set inputType for each question
  // - 'select' if answers were detected (show multiple choice options)
  // - 'text' if no answers detected (show free text input)
  for (const condition of conditions) {
    for (const question of condition.questions) {
      question.inputType = question.answers.length > 0 ? 'select' : 'text';
    }
  }

  return conditions;
}

/**
 * Convert a single DOCX file to JSON
 */
async function convertDocxToJson(docxPath) {
  const filename = path.basename(docxPath);
  const region = getRegionFromFilename(filename);

  console.log(`Processing: ${filename} -> ${region}`);

  const { text, messages } = await extractDocxText(docxPath);

  if (!text) {
    console.warn(`  Warning: No text extracted from ${filename}`);
    return null;
  }

  const conditions = parseRulesFromText(text, region);

  // Count total questions
  const totalQuestions = conditions.reduce((sum, c) => sum + c.questions.length, 0);

  const ruleJson = {
    region,
    title: path.basename(filename, '.docx'),
    source_file: filename,
    extracted_at: new Date().toISOString(),
    /**
     * PARSER NOTE:
     * The conditions below are automatically extracted from the DOCX file.
     * Manual review is recommended to verify clinical accuracy.
     * TODO markers indicate areas needing human verification.
     */
    conditions,
    /**
     * RAW TEXT:
     * Preserved for reference and manual verification.
     * This is the exact text extracted from the source DOCX.
     */
    raw_text: text,
    extraction_messages: messages,
  };

  // Write JSON file alongside DOCX
  const jsonPath = docxPath.replace('.docx', '.json');
  fs.writeFileSync(jsonPath, JSON.stringify(ruleJson, null, 2));

  console.log(`  Created: ${path.basename(jsonPath)}`);
  console.log(`  Conditions found: ${conditions.length}`);
  console.log(`  Total questions: ${totalQuestions}`);

  return ruleJson;
}

/**
 * Main ingestion process
 */
async function ingestAllRules() {
  console.log('='.repeat(60));
  console.log('MEDICAL RULE INGESTION');
  console.log('='.repeat(60));
  console.log(`Source directory: ${RULES_DIR}`);
  console.log('');

  // Find all DOCX files
  const files = fs.readdirSync(RULES_DIR);
  const docxFiles = files.filter((f) => f.endsWith('.docx'));

  console.log(`Found ${docxFiles.length} DOCX files\n`);

  const results = [];

  for (const docxFile of docxFiles) {
    const fullPath = path.join(RULES_DIR, docxFile);
    const result = await convertDocxToJson(fullPath);
    if (result) {
      results.push(result);
    }
    console.log('');
  }

  // Create index file
  const indexPath = path.join(RULES_DIR, 'index.json');
  const index = {
    generated_at: new Date().toISOString(),
    regions: results.map((r) => ({
      region: r.region,
      title: r.title,
      source_file: r.source_file,
      json_file: r.source_file.replace('.docx', '.json'),
      condition_count: r.conditions.length,
      question_count: r.conditions.reduce((sum, c) => sum + c.questions.length, 0),
    })),
  };

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.log('='.repeat(60));
  console.log('INGESTION COMPLETE');
  console.log(`Created ${results.length} JSON rule files`);
  console.log(`Index file: ${indexPath}`);
  console.log('='.repeat(60));
}

// Run if executed directly
if (require.main === module) {
  ingestAllRules().catch(console.error);
}

module.exports = { ingestAllRules, convertDocxToJson, extractDocxText };
