# Dynamic Branching Assessment Engine (V2)

## Overview

This document describes the implementation of the **V2 Dynamic Branching Assessment Engine** for the CDSS (Clinical Decision Support System). The engine provides a state-driven, rule-based question flow for musculoskeletal diagnosis with **conditional branching** and **automatic condition rule-outs**.

## Key Improvements Over V1

| Feature | V1 (Old) | V2 (New) |
|---------|----------|----------|
| Question Flow | Sequential, all questions shown | Conditional, only relevant questions |
| Condition Rule-Out | Increased likelihood (incorrect) | Skips ALL condition questions |
| Question Resolution | Pre-loaded all at once | Dynamically resolved per answer |
| Branching | None | Full jump/skip support |
| Progress Display | Total questions | Estimated remaining questions |
| State Persistence | Basic JSON | Custom serialization for Map/Set |

## Architecture

### 1. Branching Assessment Engine (`src/lib/branching-assessment-engine.js`)

**Purpose:** Core logic for dynamic question branching and condition management.

**Key Functions:**
- `initializeEngine(rulesJson)` - Initialize state with loaded rules, create question maps
- `getCurrentQuestion(state)` - **Dynamic resolution** of next valid question
- `processAnswer(state, questionId, answerValue)` - Process answer with branching effects
- `previousQuestion(state)` - Undo last answer (full state rebuild)
- `completeAssessment(state)` - Generate final summary with ranked conditions
- `prepareForAiAnalysis(state, biodata)` - Prepare payload for AI temporal diagnosis
- `serializeState(state)` / `deserializeState(data)` - Handle Map/Set persistence

### 2. Question Data Model (V2)

```javascript
{
  id: "ankle_q3",
  question: "Do you experience ankle joint stiffness?",
  condition: "General Assessment",    // Which condition this investigates
  category: "stiffness",
  answers: [
    {
      value: "Yes",
      effects: {
        nextQuestionId: null,          // Jump to specific question
        skipToQuestionId: null,        // Skip intervening questions
        triggeredConditions: [],       // Start investigating these
        excludedConditions: [          // ← KEY: Rule out these conditions
          "osteoarthritis"             //   ALL their questions will be skipped
        ],
        increaseLikelihood: [],
        decreaseLikelihood: [],
        redFlag: false,
        redFlagText: null,
        terminateAssessment: false,
      }
    },
    {
      value: "No",
      effects: { ... }
    }
  ],
  requiredConditions: [],    // Only show if these are active
  excludedIfConditions: [],  // Skip if any of these are ruled out
  isGating: false,           // If true, negative answer rules out parent condition
}
```

### 3. State Schema (V2)

```javascript
{
  region: string,
  title: string,
  conditions: [...],                    // All condition definitions
  
  // Efficient data structures
  questionsMap: Map<id, question>,      // O(1) question lookup
  conditionQuestions: Map<cond, ids[]>, // Questions per condition
  questionOrder: string[],              // Default traversal order
  
  // Current state
  currentQuestionId: string | null,
  pendingJump: string | null,           // Next question override from branching
  
  // Answer tracking
  answeredQuestions: [{
    questionId, question, answer, effects, timestamp, conditionContext
  }],
  
  // Condition tracking  
  ruledOutConditions: Set<string>,      // ← Conditions to skip entirely
  skippedQuestions: Set<string>,        // Questions bypassed
  suspectedConditions: Map<string, {
    likelihood: number,                 // 0-100 confidence
    active: boolean,                    // Currently being investigated
    reasons: [],                        // Evidence for/against
    triggerAnswers: [],                 // What triggered investigation
    ruledOut: boolean,
    ruledOutReason: { question, answer }
  }>,
  
  redFlags: [],
  isComplete: boolean,
  completionReason: string,
  startedAt: string,
}
```

### 4. Branching Logic Flow

```
Patient answers question
        │
        ▼
┌───────────────────────────────────┐
│     processAnswer() called        │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ Check for excludedConditions      │
│ If present:                       │
│   • Add to ruledOutConditions Set │
│   • Mark all condition questions  │
│     as skipped                    │
│   • Update condition state        │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ Check for isGating question       │
│ If negative answer:               │
│   • Rule out parent condition     │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ Process triggeredConditions       │
│ Process likelihood changes        │
│ Process red flags                 │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│ Check branching:                  │
│ • nextQuestionId → jump directly  │
│ • skipToQuestionId → skip range   │
│ • neither → continue sequential   │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│    getCurrentQuestion() called    │
│                                   │
│ For each question in order:       │
│   1. Skip if in ruledOutConditions│
│   2. Skip if already answered     │
│   3. Skip if in skippedQuestions  │
│   4. Check requiredConditions     │
│   5. Return first valid question  │
└───────────────────────────────────┘
```

### 5. Question Engine Component (`QuestionEngine.js`)

**Purpose:** React component rendering the dynamic branching flow.

**V2 Behavior:**
1. Loads region-specific JSON rules on mount
2. Initializes V2 branching engine
3. Displays ONE question at a time
4. Click answer → processes → shows next **valid** question
5. Automatically skips questions for ruled-out conditions
6. Shows ruled-out conditions panel (expandable)
7. Progress shows **estimated remaining** (not total)
8. Moves to summary when all relevant questions answered

### 6. Assessment Summary Component

**V2 Additions:**
- Shows "Conditions Ruled Out" section with condition names
- Displays questions skipped count
- Enhanced AI payload with rule-out data

### 7. Assessment Store (`assessmentStore.js`)

**V2 Changes:**
- Custom storage adapter for Map/Set serialization
- `updateEngineState` handles both V1 and V2 field names
- Proper deserialization on hydration

## Example: Ankle Stiffness Rule-Out

```
Question: "Do you experience ankle joint stiffness?"
Patient answers: "No"

Effect (excludedConditions: ["osteoarthritis"]):
  → "Osteoarthritis" added to ruledOutConditions
  → All 5 osteoarthritis questions marked as skipped
  → Next valid question is from different condition
  → Patient sees message: "Osteoarthritis ruled out"

Result: Instead of 84 questions, patient sees ~40-50
```

## Clinician Output (V2)

The final assessment result includes:

```javascript
{
  region: "ankle",
  biodata: { ... },
  
  // Questions answered
  symptomData: [
    { question, response, conditionContext, effects }
  ],
  
  // Conditions ruled out WITH reasons
  conditionsRuledOut: [
    { 
      name: "Osteoarthritis",
      ruledOutReason: {
        question: "Do you experience ankle joint stiffness?",
        answer: "No"
      }
    }
  ],
  
  // Suspected conditions with evidence
  suspectedConditions: [
    {
      name: "Achilles Tendinopathy",
      likelihood: 75,
      active: true,
      triggerAnswers: [...],
      reasons: [...]
    }
  ],
  
  redFlags: [...],
  
  assessmentMetadata: {
    totalQuestionsAnswered: 42,
    totalQuestionsSkipped: 38,
    completionReason: "all_relevant_questions_answered",
    engineVersion: "v2-branching"
  }
}
```

## Migration Notes

### For Existing Rule Files
The V2 engine is backward-compatible with V1 JSON structure:
- `rule_out` is mapped to `excludedConditions`
- `increase_likelihood` → `increaseLikelihood`
- `decrease_likelihood` → `decreaseLikelihood`
- `askedQuestions` → `answeredQuestions`

### For Adding Branching Rules
To add proper branching to existing rules:

1. **Identify gating questions** that should rule out conditions on negative answer
2. **Add excludedConditions** to answer effects:
   ```json
   {
     "value": "No",
     "effects": {
       "excludedConditions": ["Condition Name Here"]
     }
   }
   ```
3. **Add jump logic** for skip scenarios:
   ```json
   {
     "value": "Yes",
     "effects": {
       "nextQuestionId": "specific_q_id",
       "triggeredConditions": ["Start investigating this"]
     }
   }
   ```

## Testing the Engine

The assessment now shows development stats in dev mode:
```
Engine: V2-Branching | Answered: 15 | Skipped: 30
Ruled Out: 5 | Remaining Est: 12
```

Compare with V1:
```
Question 15 of 84
Progress: 18%
```

## TODOs

1. **Rule file enhancement** - Add proper branching logic to all region JSON files
2. **Gating question identification** - Mark which questions should be gating
3. **Validation script** - Verify branching logic doesn't create dead ends
4. **Analytics** - Track questions skipped vs answered for optimization

## Generated Rule Files

| Region | Conditions | Questions | Potential Reduction* |
|--------|------------|-----------|---------------------|
| Ankle | 17 | 85 | 40-50% |
| Cervical | 2 | 29 | 30-40% |
| Elbow | 5 | 25 | 25-35% |
| Lumbar | 6 | 49 | 35-45% |
| Shoulder | 9 | 51 | 30-40% |

*Estimated reduction with proper rule-out logic based on clinical pathways
