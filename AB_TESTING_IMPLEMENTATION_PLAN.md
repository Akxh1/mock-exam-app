# A/B Testing & Expert Evaluation — Development Plan

> **Purpose**: This document is the single authoritative reference for implementing the A/B Testing and Expert/Stakeholder Evaluation system in the X-Scaffold Mock Exam Application. Hand this file to the Mock Exam App development environment and instruct it to follow it exactly.

---

## 1. Project Context

### 1.1 The Mock Exam App

| Aspect | Detail |
|--------|--------|
| **Stack** | React (Vite) + Firebase Firestore |
| **Architecture** | Single-file `App.jsx` with all components |
| **Routing** | React Router: `/`, `/exam`, `/results`, `/admin`, `/lms-explained` |
| **Styling** | `App.css` + `theme.css` (CSS variables, glassmorphism cards) |
| **Question Bank** | `questions.js` — 40 MCQs across 10 topics, each with a `hint` string |
| **Data Store** | Firestore collection `exam_submissions` |
| **Dependencies** | `react-router-dom`, `framer-motion`, `lucide-react`, `firebase` |

### 1.2 What This Feature Adds

Two new top-level features accessible from the Home page:

1. **A/B Testing Module** — Lets participants take two different exam experiences (generic hints vs. research-enhanced adaptive hints) to validate the pedagogical value of the adaptive scaffolding system.
2. **Expert/Stakeholder Evaluation Forum** — Collects structured feedback from domain experts and stakeholders after they experience the A/B tests.

### 1.3 Research Purpose

This A/B test validates the **"Act" layer** of the Predict-Explain-Act framework. Specifically:
- **Test A** represents typical LMS hint behaviour (generic, one-size-fits-all)
- **Test B** represents the research contribution (ML-predicted level → scaffolded adaptive hint)
- The **Evaluation Forum** captures qualitative + quantitative expert opinion on both approaches

---

## 2. Architecture Overview

### 2.1 New Routes

```
/                          → Home (MODIFIED — add 2 new buttons)
/ab-testing                → ABTestHub (NEW — choose Test A, Test B, or Evaluate)
/ab-testing/test-a         → TestAExam (NEW — Generic AI hints exam)
/ab-testing/test-b         → TestBExam (NEW — Adaptive scaffolded hints exam)
/ab-testing/complete       → TestComplete (NEW — post-test navigation page)
/evaluation                → EvaluationForm (NEW — Expert/Stakeholder feedback)
/evaluation/thank-you      → ThankYou (NEW — confirmation page)
```

### 2.2 New Firebase Collections

| Collection | Purpose | Key Fields |
|-----------|---------|------------|
| `ab_test_sessions` | Track which test (A or B) a participant took | `session_id`, `participant_name`, `test_type` ("A" or "B"), `started_at`, `completed_at`, `questions_attempted`, `hints_requested`, `hint_responses[]` |
| `ab_hint_logs` | Log every hint request + response | `session_id`, `test_type`, `question_id`, `hint_text`, `hint_source` ("gemini_api" / "static_fallback" / "structured_l1" / "structured_l2" / "structured_l3"), `response_time_ms`, `timestamp` |
| `evaluation_responses` | Expert/Stakeholder evaluation submissions | `evaluator_name`, `evaluator_role`, `evaluator_institution`, `timestamp`, `responses{}` (all Likert + open-text answers) |

### 2.3 Component Tree

```
App
├── Home (MODIFIED)
├── ABTestHub (NEW)
│   ├── TestAExam (NEW)
│   ├── TestBExam (NEW)
│   └── TestComplete (NEW)
├── EvaluationForm (NEW)
├── ThankYou (NEW)
├── Exam (existing — unchanged)
├── Results (existing — unchanged)
├── AdminPanel (existing — unchanged)
└── LMSExplained (existing — unchanged)
```

---

## 3. Detailed Component Specifications

### 3.1 Home Page Modification

**File**: `App.jsx` — `Home` component (lines ~126-225)

**Change**: Add two new buttons below the existing "Begin Assessment" area, visually separated by a divider and sub-heading.

```
───────────── Existing ─────────────
[Name Input]
[Begin Assessment →]

───────── New Section ──────────────
── Research Validation ──
[🔬 A/B Testing]     [📋 Expert Evaluation]
────────────────────────────────────
```

**Details**:
- Add a horizontal divider line with text "Research Validation" in the center
- Two side-by-side buttons using the existing `.btn-primary` style but with distinct accent colors
  - **A/B Testing** button: Use a purple/violet accent (`#7c3aed`) with `FlaskConical` or `TestTube` icon from lucide
  - **Expert Evaluation** button: Use a teal/emerald accent (`#059669`) with `ClipboardList` icon from lucide
- Both buttons navigate without requiring a name input (unlike "Begin Assessment")
- Buttons should have subtle motion animation on hover (existing pattern)

### 3.2 ABTestHub Page (`/ab-testing`)

**Purpose**: Landing page for the A/B Testing module. Shows three options.

**Layout**:
```
┌──────────────────────────────────────────────┐
│              🔬 A/B Testing Module            │
│                                              │
│  Compare two hint approaches to evaluate     │
│  the effectiveness of adaptive scaffolding   │
│                                              │
│  ┌──────────────┐  ┌──────────────┐          │
│  │   TEST A      │  │   TEST B      │          │
│  │  Generic AI   │  │  Adaptive     │          │
│  │  Hints        │  │  Scaffolding  │          │
│  │               │  │               │          │
│  │  Standard     │  │  Research-    │          │
│  │  one-size-    │  │  enhanced     │          │
│  │  fits-all     │  │  hints based  │          │
│  │  hints        │  │  on mastery   │          │
│  │               │  │  level        │          │
│  │  [Start →]    │  │  [Start →]    │          │
│  └──────────────┘  └──────────────┘          │
│                                              │
│       ┌─────────────────────────────┐        │
│       │  📋 Evaluate Both Tests  →  │        │
│       └─────────────────────────────┘        │
│                                              │
│  ← Back to Home                              │
└──────────────────────────────────────────────┘
```

**Details**:
- No name or credentials required here (anonymous testing)
- But optionally at the top, ask for just a  Participant Name / Identifier — this should be **optional** (have a placeholder saying 'Optional - Enter your name')
- The participant name, if entered, links Test A/B sessions and evaluation together via `participant_name`
- Pass `participant_name` through `navigate()` state if provided
- "Evaluate Both Tests" button navigates to `/evaluation`
- Test A and Test B cards should have distinct visual identity:
  - **Test A**: Blue gradient card (`#3b82f6` → `#1d4ed8`)
  - **Test B**: Purple gradient card (`#7c3aed` → `#4c1d95`)
- The Evaluate button uses green/teal (`#059669`) 

### 3.3 TestAExam — Generic AI Hints (`/ab-testing/test-a`)

**Purpose**: A simplified mock exam where each question has a "Get Hint" button that calls the Gemini API for a **generic, non-personalized** hint. This represents the **control group** — a standard LMS hint experience.

#### 3.3.1 Exam Structure

| Parameter | Value |
|-----------|-------|
| **Questions** | 5 randomly selected from `questions.js` (use existing `getRandomQuestions(5)`) |
| **Features Tracked** | None — no ML features, no confidence slider, no review marking |
| **Submission** | No submission to Firebase `exam_submissions` — this is hint-testing only |
| **Hint Button** | Present on every question — labelled "💡 Get Hint" |
| **Answer Selection** | Optional — student can select MCQ options but it's not graded |

#### 3.3.2 Hint Generation — Test A (Generic)

**Primary**: Call Gemini API with a **generic prompt** (no student context):

```javascript
const generateGenericHint = async (questionText) => {
  const API_KEY = 'YOUR_GEMINI_API_KEY'; // From environment or config
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const prompt = `You are a helpful tutor. A student is practising and needs a hint.

=== QUESTION ===
"${questionText}"

=== INSTRUCTIONS ===
Provide a SHORT, one-sentence hint that nudges the student toward the right approach WITHOUT revealing the answer.
- Maximum 1-2 sentences
- Be encouraging and concise
- Point toward the key concept needed, not the solution
- Output plain text only, no markdown or HTML.

Generate the one-liner hint now:`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 100 }
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const hintText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (hintText) return { text: hintText.trim(), source: 'gemini_api' };
    throw new Error('Empty response from API');

  } catch (error) {
    console.warn('Gemini API failed, using static fallback:', error.message);
    return null; // Triggers fallback
  }
};
```

**Fallback** (if Gemini API fails): Use the existing static `hint` field from `questions.js`:

```javascript
// Each question already has: { hint: "Look for elements that are present in BOTH sets." }
const fallbackHint = question.hint || "Re-read the question carefully and think about the key concept.";
return { text: fallbackHint, source: 'static_fallback' };
```

#### 3.3.3 Hint Display

- Use the existing `HintSidebar` component pattern
- Show a **loading spinner** while waiting for Gemini API (with a 5-second timeout)
- If API fails, show fallback hint with a small badge: `"⚡ Quick Hint"` (don't reveal to user that it's a fallback)
- Log each hint request to `ab_hint_logs` in Firebase with:
  - `session_id`, `test_type: "A"`, `question_id`, `hint_text`, `hint_source`, `response_time_ms`

#### 3.3.4 Test A UI

- **Simplified exam**: No confidence slider, no review checkbox, no tab-switch tracking
- Each question shows: Question text + 4 MCQ options + "💡 Get Hint" button
- Navigation: "Next Question →" button (or "Finish" on last question)
- **Header banner**: Blue strip with "TEST A — Generic Hints" label
- On completion → navigate to `/ab-testing/complete` with `state: { test_type: 'A' }`

### 3.4 TestBExam — Adaptive Scaffolded Hints (`/ab-testing/test-b`)

**Purpose**: A mock exam where the student first selects their mastery/scaffolding level, then receives **level-appropriate structured hints**. This represents the **experimental group** — the research-based adaptive scaffolding approach.

#### 3.4.1 Pre-Exam: Mastery Level Selector

Before starting the exam, show a **dropdown selector** for mastery level:

```
┌──────────────────────────────────────────┐
│     🎯 Select Your Scaffolding Level      │
│                                          │
│  In the full system, this level is        │
│  automatically predicted by the ML model  │
│  based on your diagnostic exam data.      │
│                                          │
│  For this test, please choose a level:    │
│                                          │
│  ┌────────────────────────────────────┐   │
│  │  ▼ Select Level                   │   │
│  │  ─────────────────────────────────│   │
│  │  L1 — Proficient (Socratic)       │   │
│  │  L2 — Developing (Structured)     │   │
│  │  L3 — Struggling (Step-by-step)   │   │
│  └────────────────────────────────────┘   │
│                                          │
│  [Begin Test B →]                         │
└──────────────────────────────────────────┘
```

**Details**:
- The dropdown is a `<select>` with three options
- Brief description of each level shown below dropdown upon selection:
  - **L1**: "Minimal Socratic prompts — you'll receive thought-provoking questions"
  - **L2**: "Structured nudges with concept reminders and common pitfalls"
  - **L3**: "Step-by-step guidance with analogies and encouragement"
- The selected level is stored and used for ALL questions in this session

#### 3.4.2 Exam Structure

| Parameter | Value |
|-----------|-------|
| **Questions** | 5 randomly selected from `questions.js` (use `getRandomQuestions(5)`) |
| **Features Tracked** | None — this is hint-testing only |
| **Submission** | No submission to `exam_submissions` |
| **Hint Button** | Present on every question — labelled "🎯 Get Adaptive Hint" |
| **Answer Selection** | Optional — not graded |

#### 3.4.3 Hint Generation — Test B (Adaptive Per Level)

**Primary**: Call Gemini API with a **level-specific adaptive prompt**:

```javascript
const generateAdaptiveHint = async (questionText, level) => {
  const API_KEY = 'YOUR_GEMINI_API_KEY';
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const levelInstructions = {
    L1: `You are an expert Socratic tutor. The student is PROFICIENT — they understand core concepts well.

=== ADAPTIVE SCAFFOLDING: LEVEL 1 (Socratic/Minimal) ===
- Ask ONE thought-provoking question that guides their thinking
- Do NOT explain the concept — trust their ability to reason
- Reference the specific mathematical/logical principle involved
- Keep it under 40 words
- Tone: Challenging, respectful, like a peer discussion`,

    L2: `You are a supportive, structured tutor. The student is DEVELOPING — they have partial understanding.

=== ADAPTIVE SCAFFOLDING: LEVEL 2 (Structured Nudge) ===
- Give ONE key concept reminder relevant to this question
- Point out a common misconception or mistake to avoid
- Provide the first step of the approach WITHOUT revealing the answer
- Keep it under 80 words
- Tone: Supportive, clear, structured`,

    L3: `You are an empathetic, patient tutor. The student is STRUGGLING — they need significant support.

=== ADAPTIVE SCAFFOLDING: LEVEL 3 (Step-by-Step) ===
- Start with a brief encouraging statement
- Break down the problem using a simple real-world analogy
- Give step-by-step guidance toward understanding (not just the answer)
- Explain the underlying concept in simple terms
- Keep it under 150 words
- Tone: Warm, encouraging, patient — like a mentor`
  };

  const prompt = `${levelInstructions[level]}

=== QUESTION ===
"${questionText}"

=== OUTPUT REQUIREMENTS ===
1. Plain text only (no markdown, no HTML, no bullet symbols)
2. Personalized to the described student level
3. Do NOT reveal the answer directly

Generate the ${level} hint now:`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: level === 'L3' ? 300 : level === 'L2' ? 150 : 80
        }
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const hintText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (hintText) return { text: hintText.trim(), source: `gemini_api_${level.toLowerCase()}` };
    throw new Error('Empty response');

  } catch (error) {
    console.warn(`Gemini API failed for ${level}, using structured fallback:`, error.message);
    return null; // Triggers structured fallback
  }
};
```

**Fallback** (if Gemini API fails): Use **pre-written structured hints** per level per question.

Each question in `questions.js` needs an enhanced hint object. Add this alongside the existing `hint` field (important: do NOT remove the existing `hint` field as the main exam uses it):

```javascript
// Enhanced hint structure for A/B testing
adaptiveHints: {
  L1: "What mathematical principle connects the elements shared between two sets? Think about the definition of the operation.", 
  L2: "Intersection (∩) means finding elements common to BOTH sets. Look at each element in A and check: is it also in B? Start with element 1.",
  L3: "Let's break this down step by step! Think of Set A as a bag of items {1, 2} and Set B as another bag {2, 3}. Intersection means finding items that appear in BOTH bags. Go through each item in Set A one at a time: Is 1 in Set B? Is 2 in Set B? The ones that appear in both bags form your answer. You've got this!"
}
```

> [!IMPORTANT]
> **For each of the 40 questions in `questions.js`**, add an `adaptiveHints` object with L1, L2, and L3 variants. This is the most content-heavy part of the implementation and critical for the fallback mechanism. The L1/L2/L3 hints should be written following the scaffolding principles:
> - **L1**: 1 sentence, Socratic question, no explanation
> - **L2**: 2-3 sentences, concept + first step + common mistake
> - **L3**: 4-6 sentences, analogy + step-by-step + encouragement

#### 3.4.4 Hint Display — Test B

- Same `HintSidebar` pattern but with a **colored level badge** at the top:
  - L1: Green badge `"🟢 Level 1 — Socratic"`
  - L2: Orange badge `"🟠 Level 2 — Structured"`
  - L3: Red badge `"🔴 Level 3 — Guided"`
- Show loading spinner while waiting for API
- **Header banner**: Purple strip with "TEST B — Adaptive Scaffolding (L{n})" label
- Log each hint to `ab_hint_logs` with `hint_source: "gemini_api_l1"` or `"structured_l2"` etc.

#### 3.4.5 Test B UI

- Same simplified exam layout as Test A (no confidence slider, no review checkbox)
- The selected scaffolding level is shown persistently in the header
- On completion → navigate to `/ab-testing/complete` with `state: { test_type: 'B', level: selectedLevel }`

### 3.5 TestComplete Page (`/ab-testing/complete`)

**Purpose**: Post-test navigation page shown after completing Test A or Test B.

```
┌──────────────────────────────────────────┐
│           ✅ Test Complete!               │
│                                          │
│  You've completed Test [A/B].            │
│                                          │
│  ┌────────────────────────────────────┐   │
│  │  📋 Proceed to Evaluation Form  → │   │
│  └────────────────────────────────────┘   │
│                                          │
│  ┌────────────────────────────────────┐   │
│  │  ← Take Another Test              │   │
│  └────────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Details**:
- "Proceed to Evaluation" → navigates to `/evaluation`, passing `participant_name` and `test_type` from state
- "Take Another Test" → navigates back to `/ab-testing`
- Shows which test was just completed ("Test A" or "Test B — Level L2")

### 3.6 EvaluationForm Page (`/evaluation`)

**Purpose**: Structured feedback form for experts and stakeholders. This is a standalone page — accessible via the Evaluation Forum button on Home, the ABTestHub, or the TestComplete page.

#### 3.6.1 Section 1: Evaluator Credentials

```
┌──────────────────────────────────────────┐
│        📋 Expert Evaluation Form          │
│                                          │
│  Your qualifications help us weight       │
│  your feedback appropriately.             │
│                                          │
│  Full Name*: [____________________]       │
│  Role*:      [▼ Select your role   ]      │
│              ─────────────────────        │
│              Educator / Lecturer          │
│              Student                      │
│              Industry Professional        │
│              Educational Technologist     │
│              Researcher                   │
│              Other                        │
│                                          │
│  Institution/Organization: [__________]   │
│  Years of Experience:   [▼ Select   ]     │
│              ─────────────────────        │
│              0-2 years                    │
│              3-5 years                    │
│              6-10 years                   │
│              10+ years                    │
│                                          │
│  Which test(s) did you try?               │
│  [ ] Test A (Generic Hints)               │
│  [ ] Test B (Adaptive Scaffolding)        │
│  [ ] Both                                 │
│  [ ] Neither (evaluating concept only)    │
└──────────────────────────────────────────┘
```

**Required fields**: Name, Role

#### 3.6.2 Section 2: Comparative Evaluation (If they tried both tests)

> [!IMPORTANT]
> Questions must be **non-leading** — they should not bias the evaluator toward either test. Use neutral, balanced phrasing.

**Likert Scale Questions** (1 = Strongly Disagree → 5 = Strongly Agree):

| # | Question |
|---|----------|
| Q1 | "The hints in **Test A** were helpful in guiding my understanding of the questions." |
| Q2 | "The hints in **Test B** were helpful in guiding my understanding of the questions." |
| Q3 | "There was a noticeable difference in quality between the two hint approaches." |
| Q4 | "The level-appropriate scaffolding (L1/L2/L3) in Test B felt tailored to the selected difficulty level." |
| Q5 | "I would prefer hint style A (generic) over hint style B (adaptive) in an educational setting." |
| Q6 | "Adaptive scaffolding could be beneficial for students at different learning levels." |
| Q7 | "The system could realistically be integrated into a Learning Management System." |

**UI**: Each question shows as a card with 5 radio buttons styled as clickable circles (1-5) with labels "Strongly Disagree" on left and "Strongly Agree" on right.

#### 3.6.3 Section 3: Pedagogical Value

**Likert Scale Questions** (1 = Strongly Disagree → 5 = Strongly Agree):

| # | Question |
|---|----------|
| Q8 | "Providing different hint intensities based on student proficiency is pedagogically sound." |
| Q9 | "The Socratic approach (L1) is appropriate for proficient students." |
| Q10 | "The structured nudge approach (L2) provides the right level of support for developing learners." |
| Q11 | "The step-by-step guided approach (L3) would help struggling students build understanding." |
| Q12 | "Using machine learning to automatically determine a student's scaffolding level is a viable approach." |

#### 3.6.4 Section 4: Open-Ended Feedback

| # | Question | Type |
|---|----------|------|
| Q13 | "What, if anything, did you notice as different between Test A and Test B hints?" | Textarea |
| Q14 | "What improvements would you suggest for the adaptive hint system?" | Textarea |
| Q15 | "Are there any concerns you have about using AI/ML for student assessment and scaffolding?" | Textarea |
| Q16 | "Any additional comments or observations?" | Textarea |

#### 3.6.5 Submit

- All responses saved to `evaluation_responses` Firestore collection
- Show loading spinner during submission
- On success → navigate to `/evaluation/thank-you`
- On error → show error message, keep form data

### 3.7 ThankYou Page (`/evaluation/thank-you`)

Simple confirmation page:

```
┌──────────────────────────────────────────┐
│                                          │
│           ✅ Thank You!                   │
│                                          │
│  Your evaluation has been recorded.       │
│  Your feedback is invaluable to this      │
│  research.                               │
│                                          │
│  [← Return to Home]                      │
│                                          │
└──────────────────────────────────────────┘
```

---

## 4. Question Bank Enhancement

### 4.1 Add `adaptiveHints` to All 40 Questions

Each question in `questions.js` needs an `adaptiveHints` field alongside the existing `hint`.

**Example for question 101**:
```javascript
{
  id: 101,
  question: "If A = {1, 2} and B = {2, 3}, what is A ∩ B?",
  options: ["{1, 2, 3}", "{2}", "{1, 3}", "{}"],
  correctAnswer: "{2}",
  difficulty: 1,
  topic: "Sets",
  hint: "Look for elements that are present in BOTH sets.",  // ← Keep this
  adaptiveHints: {  // ← Add this
    L1: "Which set operation examines membership in both operands simultaneously?",
    L2: "Intersection (∩) finds elements common to BOTH sets. Check each element of A: is it also in B? Start with 1 — is 1 in {2, 3}?",
    L3: "Let's break this down! Imagine Set A = {1, 2} is a bag of fruits and Set B = {2, 3} is another bag. Intersection (∩) means finding fruits that appear in BOTH bags. Check each item: Is '1' in bag B? No. Is '2' in bag B? Yes! So the intersection is just {2}. You're doing great!"
  }
}
```

> [!IMPORTANT]
> This is the most labor-intensive part. All 40 questions need L1/L2/L3 hints written following the scaffolding principles. Consider using AI assistance to draft these, then manually reviewing for quality.

---

## 5. Firebase Data Schema

### 5.1 `ab_test_sessions` Collection

```javascript
{
  session_id: "ab_sess_1709xyz",        // Auto-generated UUID
  participant_name: "Jane Doe",          // Optional
  test_type: "A" | "B",
  scaffolding_level: null | "L1" | "L2" | "L3",  // Only for Test B
  started_at: Timestamp,
  completed_at: Timestamp,
  questions_count: 5,
  hints_requested: 3,                    // How many times hint was clicked
  questions: [                           // Question IDs shown
    { question_id: 101, hint_requested: true, selected_answer: "{2}" },
    { question_id: 115, hint_requested: false, selected_answer: null },
    ...
  ]
}
```

### 5.2 `ab_hint_logs` Collection

```javascript
{
  session_id: "ab_sess_1709xyz",
  test_type: "A" | "B",
  scaffolding_level: null | "L1" | "L2" | "L3",
  question_id: 101,
  question_text: "If A = {1, 2}...",
  hint_text: "Look for common elements...",
  hint_source: "gemini_api" | "static_fallback" | "structured_l1" | "structured_l2" | "structured_l3",
  api_response_time_ms: 1243,            // null if fallback
  timestamp: Timestamp
}
```

### 5.3 `evaluation_responses` Collection

```javascript
{
  evaluator_name: "Prof. Smith",
  evaluator_role: "Educator / Lecturer",
  evaluator_institution: "University of Westminster",
  evaluator_experience: "6-10 years",
  tests_tried: ["A", "B"],
  participant_name: "Jane Doe",          // Links to ab_test_sessions if same person
  timestamp: Timestamp,
  
  // Likert responses (1-5)
  q1_test_a_helpful: 3,
  q2_test_b_helpful: 5,
  q3_noticeable_difference: 4,
  q4_level_appropriate: 5,
  q5_prefer_a_over_b: 2,
  q6_adaptive_beneficial: 5,
  q7_lms_integration_viable: 4,
  q8_pedagogically_sound: 5,
  q9_socratic_appropriate: 4,
  q10_structured_appropriate: 5,
  q11_guided_helpful: 5,
  q12_ml_viable: 4,
  
  // Open-ended responses
  q13_difference_noticed: "Test B hints were more detailed...",
  q14_improvements: "Could use more examples...",
  q15_concerns: "Privacy of student data...",
  q16_additional_comments: "Overall impressive system..."
}
```

---

## 6. Gemini API Configuration

### 6.1 API Key Management

Store the Gemini API key in a configuration file or environment variable. **Do NOT hardcode it in the source.**

```javascript
// Option 1: In a .env file (for Vite)
// VITE_GEMINI_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Option 2: Firebase Remote Config (recommended for production)
// Option 3: Hardcoded constant in a separate config.js (simplest for testing)
```

### 6.2 Rate Limiting & Retry

```javascript
const callGeminiWithRetry = async (prompt, config, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: config
        }),
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });

      if (response.status === 429 && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, attempt * 2000)); // Backoff
        continue;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    } catch (error) {
      if (attempt === maxRetries) return null; // All retries exhausted
    }
  }
  return null;
};
```

---

## 7. Styling Guidelines

### 7.1 CSS Variables (Match Existing Theme)

Use the existing `theme.css` CSS variables:
- `--primary`: Main blue
- `--secondary`: Amber/gold
- `--border-color`, `--surface-color`, `--bg-color`

### 7.2 New Accent Colors

```css
:root {
  --ab-test-a: #3b82f6;     /* Blue — Test A */
  --ab-test-b: #7c3aed;     /* Purple — Test B */
  --evaluation: #059669;     /* Emerald — Evaluation */
}
```

### 7.3 New CSS Classes to Add

```css
/* Test header banners */
.test-banner { padding: 0.5rem 1rem; text-align: center; color: white; font-weight: 600; font-size: 0.85rem; letter-spacing: 0.5px; }
.test-banner-a { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.test-banner-b { background: linear-gradient(135deg, #7c3aed, #4c1d95); }

/* Likert scale styling */
.likert-group { display: flex; gap: 0.5rem; justify-content: center; }
.likert-option { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.likert-option:hover { border-color: var(--primary); }
.likert-option.selected { background: var(--primary); color: white; border-color: var(--primary); }

/* Level selector card */
.level-card { background: rgba(255,255,255,0.7); border: 2px solid var(--border-color); border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s; }
.level-card:hover { border-color: var(--primary); }
.level-card.selected { border-color: var(--primary); background: #eff6ff; }
```

---

## 8. Suggested Additions (Research Value)

### 8.1 Post-Question Perception Capture (Recommended)

After each question in both Test A and Test B (after viewing the hint), add a quick **1-tap perception indicator**:

```
Was this hint helpful?  [😕 Not Really]  [😐 Somewhat]  [😊 Very Helpful]
```

This gives per-hint, per-question subjective data that directly measures perceived scaffolding effectiveness. Store in `ab_hint_logs` as `hint_perceived_helpfulness: 1 | 2 | 3`.

### 8.2 Time-on-Hint Tracking

Track how long the hint sidebar is open. Longer time may indicate deeper engagement with the hint content.

```javascript
// When hint opens
const hintOpenTime = Date.now();

// When hint closes or next question
const hintViewDuration = (Date.now() - hintOpenTime) / 1000;
// Store in ab_hint_logs as hint_view_duration_seconds
```

### 8.3 Order Counterbalancing

To reduce order effects, **randomize which test a participant sees first**. On the ABTestHub, show:
- For 50% of visitors: Test A on left, Test B on right
- For 50%: Test B on left, Test A on right

Or add a note encouraging to try both tests.

### 8.4 Consent Notice

Before any test, add a small consent notice:

> "By proceeding, you consent to your interaction data being anonymously recorded for research purposes. No personally identifiable data will be stored."

---

## 9. File Change Summary

| File | Change Type | Description |
|------|------------|-------------|
| `App.jsx` | **MODIFY** | Add 7 new components (ABTestHub, TestAExam, TestBExam, TestComplete, EvaluationForm, ThankYou) + modify Home + add routes |
| `questions.js` | **MODIFY** | Add `adaptiveHints: { L1, L2, L3 }` to all 40 questions |
| `App.css` | **MODIFY** | Add new CSS classes for test banners, Likert scales, level cards, evaluation form |
| `firebase.js` | **NO CHANGE** | Existing Firestore connection works. New collections are auto-created |

---

## 10. Verification Plan

### 10.1 Functional Testing

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **Home page buttons** | Load `/`. Verify two new buttons visible. Click each. | Navigate to `/ab-testing` and `/evaluation` respectively |
| **AB Test Hub** | Load `/ab-testing`. Click Test A button | Navigate to `/ab-testing/test-a` with exam loaded |
| **Test A — API hint** | Start Test A. Click "Get Hint" on any question | Gemini API called, hint displayed in sidebar within 8s |
| **Test A — Fallback** | Disconnect internet or use invalid API key. Click "Get Hint" | Static fallback hint from `questions.js` displayed |
| **Test B — Level select** | Load `/ab-testing/test-b`. Select L3 from dropdown | L3 description shown. Start button enabled |
| **Test B — Adaptive hint** | Select L3. Start exam. Click "Get Adaptive Hint" | Level-3 detailed hint displayed with red badge |
| **Test B — Fallback** | Use invalid API key. Click "Get Adaptive Hint" with L2 selected | Structured L2 fallback from `adaptiveHints` displayed |
| **Test Complete** | Finish Test A exam (answer or skip all 5 questions) | Navigate to `/ab-testing/complete` showing "Test A Complete" |
| **Evaluation form** | Load `/evaluation`. Fill all fields. Submit | Data saved to `evaluation_responses` in Firestore. Redirect to thank-you |
| **Evaluation validation** | Try to submit evaluation without required fields | Validation error shown, form not submitted |
| **Firebase logging** | Complete Test A with 3 hint requests | `ab_test_sessions` has 1 doc, `ab_hint_logs` has 3 docs |

### 10.2 Manual Reviewer Checklist

1. All buttons use consistent styling with existing design
2. Mobile responsive (test on 375px width)
3. No console errors during normal usage
4. Hint sidebar scrollable for long L3 hints
5. Gemini API timeout handled gracefully (no infinite loading)
6. Evaluation form answers all saved correctly in Firestore (verify in Firebase Console)
7. Back navigation works from all new pages

---

## 11. Development Sequence

> [!TIP]
> Follow this order for minimal conflicts:

1. **Phase 1**: Add `adaptiveHints` to `questions.js` (40 questions × 3 levels)
2. **Phase 2**: Add new CSS classes to `App.css`
3. **Phase 3**: Implement components in `App.jsx`:
   - ABTestHub → TestComplete → ThankYou (simple pages first)
   - EvaluationForm (form logic)
   - TestAExam (Gemini API + fallback)
   - TestBExam (level selector + adaptive hints + fallback)
4. **Phase 4**: Modify Home component (add buttons)
5. **Phase 5**: Add routes to `App` component
6. **Phase 6**: Test Firebase writes for all 3 new collections
7. **Phase 7**: End-to-end testing

---

*X-Scaffold Research Project — A/B Testing Implementation Plan*
*Created: March 2026*
