# Technical Overview & Architectural Documentation: Study Tracker (ExamPulse Prep AI)

This document provides a comprehensive, highly detailed technical breakdown of the **Study Tracker (ExamPulse Prep AI)** web application. It is designed to serve as an authoritative technical reference for developers, AI assistants, and system architects.

---

## 1. Project Purpose

### What the Application is Designed to Do
**ExamPulse Prep AI** is an interactive web application designed for AWS certification preparation—specifically targeting the **AWS Certified Solutions Architect - Associate (SAA-C03)** exam—as well as custom user-defined certification exams. The application functions as a dual-system study tool:
1. **Interactive Study Checklist**: Allows learners to track topic and service-level mastery across all official exam domains, check off subtopics, and manage custom study topics.
2. **Practice Exam & Quiz Engine**: Enables learners to take full-length 65-question mock exams, targeted single-topic quizzes, or customized exams with flexible question counts, randomized option order, instant rationale feedback, countdown timers, and full historical attempt review.

### The Main User Journey
```
[Open App] ──> [Select Certification Exam (AWS SAA-C03 / Custom)]
                    │
                    ├───> [Study Checklist Mode]
                    │          ├── View Domain & Service Topic Cards
                    │          ├── Check/Uncheck Micro-Tasks (localStorage persisted)
                    │          ├── Search Services & Subtopics
                    │          ├── Add/Edit/Delete Service Topics & Subtopics
                    │          └── Trigger "Quiz Service" for Weak Topics ──┐
                    │                                                        │
                    └───> [Prep Exam Mode] <─────────────────────────────────┘
                               │
                               ├── [Exam Setup]
                               │     ├── Select Mode (Full Mock / Targeted Topic Quiz / Custom Exam)
                               │     ├── Configure Execution Settings (Timer, Instant Feedback)
                               │     └── View Historical Attempts & Review Past Results
                               │
                               ├── [Quiz Engine]
                               │     ├── Answer Single (Select ONE) & Multiple-Answer (Select TWO/THREE) Qs
                               │     ├── Shuffled Question Order & Shuffled Answer Choices (A–F)
                               │     ├── Toggle "Flag for Review" & Open Question Navigation Grid
                               │     ├── View Instant Rationale Feedback (if enabled)
                               │     └── Live Countdown Timer with 5m/15m Pace Warnings
                               │
                               └── [Exam Results & Diagnostics]
                                     ├── Pass/Fail Score Banner (% vs 72% Passing Threshold) + Confetti
                                     ├── AWS SAA-C03 Domain Breakdown Progress Bars
                                     ├── Service Topic Diagnostics + "Review Checklist" Jump Links
                                     ├── Full Question & Explanation Review (Filter All/Correct/Incorrect)
                                     └── Export Clean Multi-Page PDF Report / Download JSON Backup
```

### Supported Exam and Study Features
- **Full Mock Exam**: Standard 65-question mock exam adhering to official AWS SAA-C03 domain weightings (Domain 1: 19 Qs, Domain 2: 17 Qs, Domain 3: 16 Qs, Domain 4: 13 Qs). Timed for 130 minutes (2h 10m).
- **Targeted Topic Quiz**: Single-topic quizzes focused purely on one AWS service/topic (e.g. Amazon S3, AWS IAM, Amazon VPC).
- **Custom Exam Engine**: Flexible exam runner allowing custom question counts (1 to 250 / All Available), domain-balanced or fully random question selection, and timed (2 mins/Q) or untimed execution.
- **Randomisation & Remapping**: Questions and answer options (choices A through F) are randomized using the Fisher-Yates algorithm. Correct answer indices are automatically remapped to match the shuffled option positions.
- **Question Navigation Grid**: Full-screen modal overlay providing jump-to-question buttons color-coded by answered, unanswered, flagged, and current state.
- **Instant Rationale Feedback**: Optional live answer evaluation displaying detailed explanation text immediately after selecting options.
- **Diagnostic Jump Links**: From exam results, users can click "Review [Topic] Checklist" to automatically switch to Checklist mode, scroll to the weak service topic card, and highlight it for 4 seconds.
- **Supabase Integration**: Live fetching of practice questions and topic mappings, plus non-blocking persistence of attempt payloads with full question snapshots (`question_snapshot`).
- **Exporting & Reporting**: Export comprehensive exam results to a formatted multi-page PDF (`jspdf`) or download raw JSON backups.

---

## 2. Technology Stack

| Layer / Category | Technology / Library | Version | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.7` | UI component tree, state management, and DOM rendering. |
| **DOM Renderer** | React DOM | `^19.2.7` | Web DOM bindings for React 19. |
| **Build Tool** | Vite | `^8.1.1` | Fast dev server, HMR, and production bundling. |
| **Vite Plugin** | `@vitejs/plugin-react` | `^6.0.3` | React Fast Refresh support for Vite. |
| **Styling Framework** | Tailwind CSS | `^4.3.3` | Utility-first CSS framework (configured with `@tailwindcss/vite`). |
| **Icons** | Lucide React | `^1.26.0` | Comprehensive UI icon suite (`Award`, `Clock`, `Flag`, `Zap`, `CheckCircle2`, etc.). |
| **PDF Generation** | jsPDF | `^4.2.1` | Client-side export of formatted, multi-page exam attempt PDF reports. |
| **Visual Effects** | Canvas Confetti | `^1.9.4` | Particle celebration animation triggered upon passing an exam. |
| **Linter** | Oxlint | `^1.71.0` | High-performance JavaScript code linter. |
| **Database Client** | Supabase JS | `^2.110.8` | PostgreSQL backend client for fetching questions and persisting attempt records. |
| **Backend / Database** | Supabase (PostgreSQL) | Managed Cloud | Relational database hosting `exam_questions`, `question_topics`, and `exam_attempts`. |
| **Authentication** | **None** | N/A | **No Supabase Auth is implemented**. All operations run under the anonymous public role using `VITE_SUPABASE_PUBLISHABLE_KEY`. |
| **Hosting & Deployment** | Static Web Hosting | N/A | Built via `vite build` to static HTML/JS/CSS output in `dist/`, deployable on Vercel, Netlify, Cloudflare Pages, or GitHub Pages. |

---

## 3. Project Structure

```
study-tracker/
├── index.html                           # Single-Page Application entry point
├── package.json                         # Project dependencies, scripts, and package metadata
├── vite.config.js                       # Vite build & Tailwind CSS plugin configuration
├── .oxlintrc.json                       # Oxlint configuration
├── .env.local                           # Local environment credentials (SUPABASE_URL, keys)
├── README.md                            # High-level project summary
├── SAA-C03_Question_Import_Guide.md     # Detailed documentation for importing SAA-C03 questions
├── data/                                # Local question banks, master checklists, audits, and backups
│   ├── SAA-C03-question-bank-upgraded-250.json  # Authoritative 250-question SAA-C03 question bank
│   ├── saa-c03-question-export.json            # Database export snapshot of questions & topic mappings
│   ├── question-import.json                    # Question import staging file
│   ├── aws_saa_c03_master_checklist_subtopics.json # Authoritative master checklist hierarchy
│   ├── valid-saa-topic-ids.txt                 # Valid topic ID reference list
│   └── backups/                                # Pre-import database snapshot backups
├── supabase/                            # SQL migration scripts for database schema setup
│   ├── exam_attempts_migration.sql      # Schema & RLS migration for exam_attempts table
│   ├── custom_exam_migration.sql        # Schema migration for Custom Exam mode metadata
│   └── saa_c03_questions.sql            # Full DDL & 150-question SQL insert batch
├── scripts/                             # Node.js & Python maintenance and CLI utility scripts
│   ├── importQuestions.js               # Imports data/question-import.json into Supabase
│   ├── replaceSaaQuestions.js           # Safely replaces full 250-question bank in Supabase
│   ├── exportQuestions.js               # Exports Supabase questions & topic mappings to JSON
│   ├── generateSql.js                   # Generates supabase/saa_c03_questions.sql from JSON
│   ├── auditSaaExplanationQuality.py    # Python script for auditing question explanation depth
│   ├── audit_answer_option_quality.py   # Python script for checking option formatting & quality
│   └── perform_full_bank_upgrade.py     # Python script for executing 250-question bank upgrades
├── tests/                               # Automated unit test suite using node:test
│   ├── examUtils.test.js                # Unit tests for question shuffling, domain allocation & validation
│   ├── customExam.test.js               # Unit tests for Custom Exam allocation & Largest-Remainder Method
│   └── upgradedQuestionBank.test.js     # Unit tests verifying integrity of the 250-question bank
└── src/                                 # Application source code
    ├── main.jsx                         # React entry point rendering <App /> inside <StrictMode>
    ├── App.jsx                          # Main UI component, view routing, exam state & finish handler
    ├── index.css                        # Global CSS stylesheet importing Tailwind CSS
    ├── App.css                          # Custom animations & utility classes
    ├── context/
    │   └── ExamContext.jsx              # Global React Context provider for state management & CRUD
    ├── lib/
    │   └── supabase.js                  # Supabase client instantiation
    ├── services/
    │   ├── attemptService.js            # Supabase API calls for saving and fetching exam attempts
    │   └── questionService.js           # Supabase API calls for fetching questions & topic mappings
    ├── utils/
    │   ├── examUtils.js                 # Question selection, option shuffling, and remapping math
    │   ├── exportUtils.js               # jsPDF report generation and JSON backup export utilities
    │   └── storage.js                   # LocalStorage persistence wrappers & JSON backup import/export
    ├── data/
    │   ├── saaC03DomainMapping.js       # Authoritative SAA-C03 domain mapping & allocations
    │   └── examData.js                  # Default certification exam definitions & local question fallback
    └── components/
        ├── Navbar.jsx                   # Sticky top header navigation bar
        ├── Modals/
        │   ├── AddExamModal.jsx         # Modal for creating custom user certification exams
        │   └── ImportExportModal.jsx    # Modal for exporting/importing JSON progress backups
        ├── PrepExam/
        │   ├── ExamSetup.jsx            # Exam mode setup screen & historical attempt history list
        │   ├── QuizEngine.jsx           # Interactive exam execution engine & timer
        │   ├── ExamResults.jsx          # Results dashboard, domain breakdown, diagnostics & review
        │   └── QuestionGrid.jsx         # Question navigation modal grid overlay
        └── StudyChecklist/
            ├── ChecklistView.jsx        # Study Checklist dashboard & progress summary
            ├── DomainCard.jsx           # Domain wrapper card (legacy/grouping)
            └── TopicCard.jsx            # Collapsible service topic card with single-level item CRUD
```

---

## 4. Application Layout

### Main Pages and Screens
The application presents two main view modes toggled via the header Navbar (`viewMode` state):
1. **Checklist View (`viewMode === 'checklist'`)**: Rendered by [ChecklistView.jsx](file:///e:/code/study-tracker/src/components/StudyChecklist/ChecklistView.jsx). Displays exam title, overall mastery gauge, instant search input, collapse/expand all toggles, check-all-groups button, inline form to add new topics, and a list of interactive [TopicCard.jsx](file:///e:/code/study-tracker/src/components/StudyChecklist/TopicCard.jsx) accordions.
2. **Prep Exam View (`viewMode === 'prep-exam'`)**: Managed by [App.jsx](file:///e:/code/study-tracker/src/App.jsx) across three sub-states (`prepState`):
   - **Setup Screen (`prepState === 'setup'`)**: Rendered by [ExamSetup.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamSetup.jsx). Allows selection between *Full Mock Exam*, *Targeted Topic Quiz*, and *Custom Exam*. Configures execution options (Instant Feedback, Timers, Custom Question Counts) and displays historical exam attempt cards.
   - **Quiz Engine (`prepState === 'quiz'`)**: Rendered by [QuizEngine.jsx](file:///e:/code/study-tracker/src/components/PrepExam/QuizEngine.jsx). Full-screen interactive quiz runner showing navigation controls, timer, question prompt, option choices (A–F), instant rationale feedback, question grid modal, submit modal, and quit modal.
   - **Results Screen (`prepState === 'results'`)**: Rendered by [ExamResults.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamResults.jsx). Displays pass/fail score banner, celebratory confetti, time metrics, SAA-C03 domain progress bars, weak topic diagnostic checklist links, full question review with filters, and PDF/JSON export controls.

### Navigation Structure & Shared Components
- **Header Navbar ([Navbar.jsx](file:///e:/code/study-tracker/src/components/Navbar.jsx))**: Sticky top bar (`sticky top-0 z-40`). Features brand logo (`ExamPulse Prep AI`), exam category tabs (AWS SAA-C03 + custom exams), dual view switcher (`Checklist` vs `Prep Exam`), theme toggle (`Sun`/`Moon`), and backup modal trigger (`Database`).
- **Modals**:
  - `AddExamModal`: Form to create new custom exams.
  - `ImportExportModal`: Download/upload complete local data backups.
  - `QuestionGrid`: Full grid overlay to jump directly to any question.
  - `Submit Confirmation Modal`: Warning modal detailing unanswered and flagged counts before final submission.
  - `Quit Confirmation Modal`: Warning modal before abandoning an active exam.
  - `Bulk Paste Modal`: Modal for pasting newline-separated subtopic lists.

### Mobile vs. Desktop Responsiveness
- **Desktop**: Full layout with horizontal exam tabs in Navbar (`hidden md:flex`), side-by-side mode selection cards (`grid-cols-3`), 6-column question navigation grid (`sm:grid-cols-6`), and split layout for exam header banners.
- **Mobile**: Responsive layout. Exam selection tabs collapse into a scrollable horizontal pill list (`flex md:hidden`). Action buttons stack vertically (`flex-col sm:flex-row`). Question grid adjusts to 5 columns (`grid-cols-5`). Text sizes and padding adjust dynamically (`text-xs sm:text-sm`, `p-4 sm:p-8`).

---

## 5. Routing

- **Client-Side Router Library**: **None**. The application does NOT use React Router, TanStack Router, or HTML5 pushState routing.
- **State-Driven View Rendering**: All navigation is controlled dynamically in memory inside [App.jsx](file:///e:/code/study-tracker/src/App.jsx) using top-level React states:
  - `viewMode`: `'checklist'` or `'prep-exam'`
  - `prepState`: `'setup'`, `'quiz'`, or `'results'`

### Complete View Matrix
| View Mode | Sub-State (`prepState`) | Active Component Rendered | Trigger / Condition |
| :--- | :--- | :--- | :--- |
| `checklist` | N/A | [ChecklistView.jsx](file:///e:/code/study-tracker/src/components/StudyChecklist/ChecklistView.jsx) | Click "Checklist" tab in Navbar or trigger diagnostic jump link. |
| `prep-exam` | `setup` | [ExamSetup.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamSetup.jsx) | Click "Prep Exam" tab in Navbar or "Take Practice Exam" CTA. |
| `prep-exam` | `quiz` | [QuizEngine.jsx](file:///e:/code/study-tracker/src/components/PrepExam/QuizEngine.jsx) | Click "Start Practice Exam" or "Retake Exam" from setup/results screen. |
| `prep-exam` | `results` | [ExamResults.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamResults.jsx) | Submit active quiz, timer expires, or click "View Results" on a historical attempt. |

### Protected or Conditional Routes
*Not confirmed from the current project files.* (Because there is no authentication or URL routing system, all view states are publicly accessible).

---

## 6. Study and Exam Workflow

### 1. Selecting an Exam
The user selects an active exam using the Navbar tabs (default: `AWS SAA-C03`). The active exam ID is stored in `localStorage` under `exampulse_active_exam_v1`. Users can also click `+ Add Exam` to open [AddExamModal.jsx](file:///e:/code/study-tracker/src/components/Modals/AddExamModal.jsx) and create custom exam entries.

### 2. Full Mock Exams
When the user selects **Full Mock Exam** in [ExamSetup.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamSetup.jsx):
- The app invokes `prepareFullMockQuestions(fullExamQuestions)` from [examUtils.js](file:///e:/code/study-tracker/src/utils/examUtils.js).
- Draws exactly **65 questions** according to `SAA_C03_FULL_MOCK_ALLOCATION`:
  - Domain 1 (Design Secure Architectures): 19 Qs (30%)
  - Domain 2 (Design Resilient Architectures): 17 Qs (26%)
  - Domain 3 (Design High-Performing Architectures): 16 Qs (24%)
  - Domain 4 (Design Cost-Optimized Architectures): 13 Qs (20%)
- Time allowed: 130 minutes (7,800 seconds).

### 3. Targeted Topic Quizzes
When the user selects **Targeted Topic Quiz**:
- The user selects a specific topic ID (e.g. `topic-s3`) from a dropdown or via a "Quiz Service" button on a `TopicCard`.
- Questions mapped to that topic ID are fetched via `getQuestionsByTopic(examCode, topicId)` from [questionService.js](file:///e:/code/study-tracker/src/services/questionService.js).
- Prepared using `prepareExamQuestions(topicQuestions)`.

### 4. Custom Exams
When the user selects **Custom Exam**:
- Configures requested question count (1 to 250 / All Available), selection type (`balanced`, `random`, `all`), and timer type (`timed` at 2 mins/Q or `untimed`).
- Invokes `prepareCustomExamQuestions(fullExamQuestions, options)` from [examUtils.js](file:///e:/code/study-tracker/src/utils/examUtils.js).
- Uses the **Largest-Remainder Method (Hamilton / Hare-Niemeyer Method)** in `allocateCustomExamDomainQuotas` to calculate exact integer domain quotas based on SAA-C03 domain weights (30%, 26%, 24%, 20%), with shortage redistribution if a pool lacks enough questions.

### 5. Question & Answer Randomisation
Randomisation occurs in two stages inside [examUtils.js](file:///e:/code/study-tracker/src/utils/examUtils.js):
1. **Question Order Shuffling**: `shuffleArray(items)` uses the Fisher-Yates shuffle algorithm to randomize question presentation order.
2. **Answer Option Shuffling & Index Remapping**: `shuffleQuestionOptions(question)`:
   - Maps options to objects tracking their original 0-based indices.
   - Fisher-Yates shuffles the options array.
   - Reconstructs a mapping table: `origToNewMap[originalIndex] = newIndex`.
   - Remaps `correctAnswer` and `correctAnswers` indices to their new positions in the shuffled array and sorts them ascending.

### 6. Single-Answer vs. Multiple-Answer Questions
- **Single-Answer (`type === 'single'`)**: Questions have 4 options (A–D). `requiredCount = 1`. Instruction text: `"Select ONE."` Clicking an option replaces the selection array: `[optIndex]`.
- **Multiple-Answer (`type === 'multiple'`)**: Questions have 5 or 6 options (choices A–E or A–F). `requiredCount` equals `correctAnswers.length` (2 or 3). Instruction text: `"Select TWO."` or `"Select THREE."` Clicking an option toggles the index in/out of the array (up to `requiredCount`).

### 7. Navigating Questions & Saving Answers
- Navigation: Click **Previous** / **Next** buttons in `QuizEngine` or click any number in [QuestionGrid.jsx](file:///e:/code/study-tracker/src/components/PrepExam/QuestionGrid.jsx).
- Answer Storage: Answers are kept in React local state `userAnswers` inside `QuizEngine.jsx` as a JSON map: `{ [questionId]: number[] }`.

### 8. Submitting & Score Calculation
- Submission: Click "Submit Exam" (which shows a confirmation modal) or timer countdown reaches 0 (`secondsRemaining <= 1`).
- Calculation in `handleFinishExam` ([App.jsx](file:///e:/code/study-tracker/src/App.jsx)):
  - Iterates through `questions`. For each question, compares sorted user selection array with sorted `correctAnswers` array.
  - Matches if `selectedSorted.length === correctSorted.length` and every element matches identically.
  - `scorePercentage = Math.round((correctCount / totalQuestions) * 100)`.
  - `passed = scorePercentage >= activeExam.passingScore` (72% for SAA-C03).
  - Also calculates domain-by-domain accuracy in `domainResults`.

### 9. Results & Explanations Display
- Rendered by [ExamResults.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamResults.jsx).
- Displays celebratory confetti (`canvas-confetti`) if passed.
- **Diagnostic Tab**: Shows score percentage banner, time metrics, domain performance progress bars, and topic performance analysis with "Review Checklist" jump buttons.
- **Review Tab**: Lists all questions with choices, user selected letters (e.g. `A, C`), correct answer letters, correctness badges, and the full rationale text (`q.explanation`).

---

## 7. Question Data Structure

### Database Question Schema (`exam_questions` Table)
```sql
CREATE TABLE exam_questions (
  id                   TEXT PRIMARY KEY,         -- e.g. 'q-saa-1'
  exam_code            TEXT NOT NULL,            -- e.g. 'aws-saa-c03'
  difficulty           TEXT,                     -- 'Easy' | 'Medium' | 'Hard'
  question_type        TEXT NOT NULL,            -- 'single' | 'multiple'
  question_text        TEXT NOT NULL,            -- Full question prompt
  option_a             TEXT NOT NULL,            -- Option A text
  option_b             TEXT NOT NULL,            -- Option B text
  option_c             TEXT NOT NULL,            -- Option C text
  option_d             TEXT NOT NULL,            -- Option D text
  option_e             TEXT,                     -- Option E text (nullable for 5/6 option Qs)
  option_f             TEXT,                     -- Option F text (nullable for 6 option Qs)
  correct_answer       INTEGER NOT NULL,         -- Primary 0-based answer index
  correct_answers      INTEGER[],                -- Array of 0-based answer indices [0, 2]
  explanation          TEXT,                     -- Detailed rationale text
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
```

### Application / JSON Question Schema
```json
{
  "id": "q-saa-1",
  "exam_code": "aws-saa-c03",
  "topicId": "topic-s3",
  "topicIds": ["topic-s3"],
  "difficulty": "Medium",
  "type": "single",
  "question": "A company needs to store static assets with 99.999999999% durability...",
  "options": [
    "Amazon EBS volume attached to an EC2 instance",
    "Amazon S3 Standard storage bucket",
    "Amazon EFS file system with Single Zone",
    "Instance store volumes configured in RAID 0"
  ],
  "correctAnswer": 1,
  "correctAnswers": [1],
  "explanation": "Amazon S3 Standard provides 99.999999999% (11 9's) durability for objects stored in buckets...",
  "topics": ["topic-s3"]
}
```

### Detailed Field Explanation
- `id`: Unique string identifier for the question (e.g. `'q-saa-1'`).
- `exam_code` / `examCode`: String code identifying the target exam (e.g. `'aws-saa-c03'`).
- `topicId`: Primary topic ID string mapped to this question (e.g. `'topic-s3'`).
- `topicIds` / `topics`: Array of string topic IDs mapped to this question (supports multi-topic tagging).
- `difficulty`: Difficulty rating string (`'Easy'`, `'Medium'`, or `'Hard'`).
- `type`: Question type string (`'single'` for single-choice, `'multiple'` for multi-choice).
- `question`: Full text string of the question scenario/prompt.
- `options`: Array of option text strings (4 to 6 elements corresponding to choices A through F).
- `correctAnswer`: Single 0-based integer index of the correct choice (used for single-answer questions; set to `null` in raw 250-bank JSON for multi-answer questions).
- `correctAnswers`: Array of 0-based integer indices of correct choices (e.g. `[0, 2]`; set to `null` in raw 250-bank JSON for single-answer questions).
- `explanation`: Comprehensive explanation text detailing why the correct choice is right and distractor options are incorrect.

### Representation of Multiple-Answer Questions
Multiple-answer questions have `type: 'multiple'`, `correctAnswer: null`, `correctAnswers: [0, 2]` (or `[0, 2, 4]`), and an `options` array containing 5 or 6 items. In [questionService.js](file:///e:/code/study-tracker/src/services/questionService.js), database rows are mapped to ensure both `correctAnswer` (primary integer) and `correctAnswers` (array) are populated for seamless application handling.

### Topic Mappings
Topic mappings are stored in the `question_topics` junction table (`question_id`, `topic_id`). In [saaC03DomainMapping.js](file:///e:/code/study-tracker/src/data/saaC03DomainMapping.js):
- `QUESTION_DOMAIN_MAP`: Authoritative dictionary mapping all 250 question IDs directly to single primary AWS SAA-C03 domain IDs (`domain-1`, `domain-2`, `domain-3`, `domain-4`).
- `TOPIC_DOMAIN_MAP`: Dictionary mapping topic IDs (e.g. `topic-s3`) to primary AWS domains.

---

## 8. Database

### Supabase Tables
The application uses three PostgreSQL tables in Supabase:

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│     exam_questions     │      │    question_topics     │      │     exam_attempts      │
├────────────────────────┤      ├────────────────────────┤      ├────────────────────────┤
│ id (PK)                │1    N│ question_id (PK, FK)   │      │ id (PK)                │
│ exam_code              ├──────┼─ topic_id (PK)         │      │ exam_code              │
│ difficulty             │      └────────────────────────┘      │ exam_mode              │
│ question_type          │                                      │ topic_id               │
│ question_text          │                                      │ completed_at           │
│ option_a..option_f     │                                      │ score_percent          │
│ correct_answer         │                                      │ correct_count          │
│ correct_answers        │                                      │ total_questions        │
│ explanation            │                                      │ time_used_seconds      │
│ created_at             │                                      │ time_allowed_seconds   │
└────────────────────────┘                                      │ passed                 │
                                                                │ question_ids           │
                                                                │ answers (JSONB)        │
                                                                │ flagged_question_ids   │
                                                                │ domain_results (JSONB) │
                                                                │ question_snapshot JSONB│
                                                                │ question_bank_version  │
                                                                │ selection_type         │
                                                                │ requested_question_cnt │
                                                                │ actual_question_count  │
                                                                │ timer_type             │
                                                                │ domain_allocation JSONB│
                                                                └────────────────────────┘
```

### Table Details & Columns

#### 1. `exam_questions`
- `id` (TEXT PRIMARY KEY): e.g. `'q-saa-1'`
- `exam_code` (TEXT NOT NULL): e.g. `'aws-saa-c03'`
- `difficulty` (TEXT): `'Easy'`, `'Medium'`, or `'Hard'`
- `question_type` (TEXT NOT NULL): `'single'` or `'multiple'`
- `question_text` (TEXT NOT NULL)
- `option_a` .. `option_f` (TEXT): Options A through D are NOT NULL; E and F are nullable.
- `correct_answer` (INTEGER NOT NULL): Zero-based primary correct index.
- `correct_answers` (INTEGER[]): Array of zero-based correct indices.
- `explanation` (TEXT): Rationale explanation text.
- `created_at` (TIMESTAMPTZ DEFAULT NOW())

#### 2. `question_topics`
- `question_id` (TEXT NOT NULL REFERENCES `exam_questions(id)` ON DELETE CASCADE)
- `topic_id` (TEXT NOT NULL)
- Primary Key: `(question_id, topic_id)`

#### 3. `exam_attempts`
- `id` (TEXT PRIMARY KEY): e.g. `'attempt-1722528000000-a1b2c3'`
- `exam_code` (TEXT NOT NULL)
- `exam_mode` (TEXT NOT NULL): `'full'`, `'targeted'`, or `'custom'`
- `topic_id` (TEXT, nullable): Set for targeted quizzes.
- `completed_at` (TIMESTAMPTZ NOT NULL)
- `score_percent` (INTEGER NOT NULL)
- `correct_count` (INTEGER NOT NULL)
- `total_questions` (INTEGER NOT NULL)
- `time_used_seconds` (INTEGER NOT NULL)
- `time_allowed_seconds` (INTEGER NOT NULL)
- `passed` (BOOLEAN NOT NULL)
- `question_ids` (TEXT[] NOT NULL)
- `answers` (JSONB NOT NULL): `{ [questionId]: number[] }`
- `flagged_question_ids` (TEXT[])
- `domain_results` (JSONB): Domain score breakdown object.
- `question_snapshot` (JSONB NOT NULL): Exact array of shuffled question objects as presented to the user during the attempt.
- `question_bank_version` (TEXT NOT NULL DEFAULT `'saa-c03-v1'`)
- `selection_type` (TEXT, nullable): `'balanced'`, `'random'`, or `'all'`
- `requested_question_count` (INTEGER, nullable)
- `actual_question_count` (INTEGER, nullable)
- `timer_type` (TEXT, nullable): `'timed'` or `'untimed'`
- `domain_allocation` (JSONB, nullable): Domain question count distribution.

### Row Level Security (RLS) Policies
- **Security Context**: The project currently has **no Supabase Auth implementation** (`supabase.auth` is unused). All database access uses the public publishable key (`VITE_SUPABASE_PUBLISHABLE_KEY`).
- **RLS Policies**:
  - `exam_questions`: Public read allowed (`FOR SELECT USING (true)`).
  - `question_topics`: Public read allowed (`FOR SELECT USING (true)`).
  - `exam_attempts`: Public read allowed (`FOR SELECT USING (true)`) and Public insert allowed (`FOR INSERT WITH CHECK (true)`).

### Frontend Data Access Patterns
- **Reading Questions**: `getExamQuestions` and `getQuestionsByTopic` in [questionService.js](file:///e:/code/study-tracker/src/services/questionService.js) fetch rows from `exam_questions` and `question_topics` using Supabase JS client `from('exam_questions').select('*')`.
- **Reading Attempts**: `fetchAttemptsFromSupabase` in [attemptService.js](file:///e:/code/study-tracker/src/services/attemptService.js) fetches records from `exam_attempts` ordered by `completed_at DESC`.
- **Writing Attempts**: `saveAttemptToSupabase` in [attemptService.js](file:///e:/code/study-tracker/src/services/attemptService.js) executes `supabase.from('exam_attempts').insert([richPayload])`.

### Database Functions, Views or Triggers
*Not confirmed from the current project files.* (No custom SQL functions, views, or triggers are defined in the migration scripts).

---

## 9. User Progress

| Data Item | Storage Location | Key / Table Name | Data Format |
| :--- | :--- | :--- | :--- |
| **Checklist Task Checkmarks** | `localStorage` | `exampulse_checklist_v1` | `{ [examId]: { [taskId]: boolean } }` |
| **Flagged Questions** | `localStorage` | `exampulse_flagged_v1` | `{ [examId]: { [questionId]: boolean } }` |
| **Light Exam History Summaries** | `localStorage` | `exampulse_history_v1` | Array of objects (`[{ id, examId, scorePercentage, passed, durationSeconds, mode }]`) |
| **Active Exam Selection** | `localStorage` | `exampulse_active_exam_v1` | String exam ID (e.g. `'aws-saa-c03'`) |
| **Theme Preference** | `localStorage` | `exampulse_theme_v1` | String (`'dark'` or `'light'`) |
| **Custom Exams List** | `localStorage` | `exampulse_exams_v1` | Array of custom exam objects merged with `DEFAULT_EXAMS` |
| **Full Exam Attempt Snapshots** | Supabase DB | `exam_attempts` table | Full records with `question_snapshot`, `answers`, `domain_results`, `score_percent` |
| **In-Memory Attempts List** | React State | `supabaseAttempts` state in `ExamContext` | Loaded from Supabase on exam change; prepended on new attempt completion |
| **Active Quiz Session State** | React State | Component state in `QuizEngine` | `userAnswers`, `secondsRemaining`, `secondsElapsed`, `currentIndex` |

---

## 10. Major Components

### 1. QuizEngine
- **File**: [QuizEngine.jsx](file:///e:/code/study-tracker/src/components/PrepExam/QuizEngine.jsx)
- **Purpose**: Executes practice exams and quizzes. Handles question display, option selection, timer countdown, flagging, instant rationale feedback, and modals.
- **Props**:
  - `config` (Object): Exam configuration (`mode`, `questions`, `enableTimer`, `timerType`, `timeAllowedSeconds`, `instantFeedback`).
  - `onFinishExam` (Function): Callback invoked on submission.
  - `onCancelExam` (Function): Callback invoked when quitting.
- **Important State**: `currentIndex` (number), `userAnswers` (map `{ [qId]: number[] }`), `isGridOpen` (boolean), `showSubmitConfirm` (boolean), `showQuitConfirm` (boolean), `secondsRemaining` (number), `secondsElapsed` (number).
- **Main Functions**: `handleSelectOption(optIdx)`, `handleNext()`, `handlePrev()`, `handleCompleteSubmit(isAutoSubmit)`, `formatTimeRemaining()`, `formatTime()`.
- **Dependencies**: `useExam` context, `QuestionGrid` component, `lucide-react` icons.

### 2. ExamResults
- **File**: [ExamResults.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamResults.jsx)
- **Purpose**: Displays comprehensive results after exam submission or when reviewing a historical attempt.
- **Props**:
  - `attemptResult` (Object): Completed attempt data (`config`, `userAnswers`, `durationSeconds`, `timestamp`).
  - `onRetake` (Function): Callback to retake exam.
  - `onChangeMode` (Function): Callback to return to setup.
  - `isReadOnly` (Boolean): True when reviewing a historical attempt.
  - `saveError` (Boolean): True if Supabase persistence failed.
- **Important State**: `activeTab` (`'diagnostic'` | `'review'`), `filterReview` (`'all'` | `'incorrect'` | `'correct'`), `isGeneratingPDF` (boolean), `pdfError`, `jsonError`.
- **Main Functions**: `handleExportPDF()`, `handleExportJSON()`, `formatTimeUsed()`, confetti `useEffect`.
- **Dependencies**: `useExam` context, `canvas-confetti`, `exportUtils.js` (`generateAttemptPDF`, `exportAttemptJSON`, `buildCompleteAttemptObject`), `saaC03DomainMapping.js`.

### 3. ExamSetup
- **File**: [ExamSetup.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamSetup.jsx)
- **Purpose**: Setup screen for configuring exam modes (Full Mock, Targeted Quiz, Custom Exam), execution toggles, and viewing Supabase Exam History.
- **Props**: `onStartExam` (Function), `presetConfig` (Object), `onViewAttempt` (Function).
- **Important State**: `mode` (`'full'` | `'domain'` | `'custom'`), `selectedDomainId` (string), `instantFeedback` (boolean), `enableTimer` (boolean), `customCountInput` (string), `isAllAvailable` (boolean), `customSelectionType` (`'balanced'` | `'random'`), `customTimerType` (`'timed'` | `'untimed'`), `fullExamQuestions` (array), `topicQuestions` (array), `loadingFull` (boolean), `loadingTopic` (boolean), `error`.
- **Main Functions**: `loadFullExam()`, `loadTopicQuestions()`, `handleQuickSelect(val)`, `handleStart()`.
- **Dependencies**: `useExam` context, `questionService.js`, `examUtils.js`, `lucide-react` icons.

### 4. ChecklistView
- **File**: [ChecklistView.jsx](file:///e:/code/study-tracker/src/components/StudyChecklist/ChecklistView.jsx)
- **Purpose**: Study Checklist dashboard displaying exam mastery, search filter, topic collapse/expand, check all groups, add topic form, and `TopicCard` list.
- **Props**: `onLaunchPrepExam` (Function).
- **Important State**: `searchQuery` (string), `allCollapsed` (boolean), `isAddingTopic` (boolean), `newTopicTitle`, `newTopicCode`, `newTopicWeight`, `newTopicDesc`.
- **Main Functions**: `handleReset()`, `handleCheckAllGroups()`, `handleCreateTopic(e)`.
- **Dependencies**: `useExam` context, `TopicCard` component, `lucide-react` icons.

### 5. TopicCard
- **File**: [TopicCard.jsx](file:///e:/code/study-tracker/src/components/StudyChecklist/TopicCard.jsx)
- **Purpose**: Collapsible accordion card for a single service topic, displaying checklist progress, quiz topic launcher, and single-level item CRUD controls.
- **Props**: `topic` (Object), `searchQuery` (string), `onLaunchTopicQuiz` (Function), `forceCollapsed` (boolean).
- **Important State**: `isOpen` (boolean), `isEditingTopic` (boolean), `editTopicTitle`, `editTopicCode`, `newItemText`, `isAddingItem` (boolean), `showBulkPasteModal` (boolean), `bulkText`, `editingItemId`, `editItemText`.
- **Main Functions**: `handleSaveTopicEdit()`, `handleCreateSingleItem(e)`, `handleCreateBulkItems(e)`.
- **Dependencies**: `useExam` context, `lucide-react` icons.

### 6. Navbar
- **File**: [Navbar.jsx](file:///e:/code/study-tracker/src/components/Navbar.jsx)
- **Purpose**: Sticky top header bar with branding, exam tabs, view switcher, theme toggle, and backup trigger.
- **Props**: `onOpenAddModal` (Function), `onOpenBackupModal` (Function).
- **Important State**: Reads global state directly from `useExam()`.
- **Dependencies**: `useExam` context, `lucide-react` icons.

### 7. QuestionGrid
- **File**: [QuestionGrid.jsx](file:///e:/code/study-tracker/src/components/PrepExam/QuestionGrid.jsx)
- **Purpose**: Modal grid overlay displaying all question numbers color-coded by status (Answered, Unanswered, Flagged, Current).
- **Props**: `isOpen`, `onClose`, `questions`, `answers`, `flaggedMap`, `currentIndex`, `onSelectQuestion`.
- **Dependencies**: `lucide-react` icons.

### 8. AddExamModal
- **File**: [AddExamModal.jsx](file:///e:/code/study-tracker/src/components/Modals/AddExamModal.jsx)
- **Purpose**: Form modal to create custom certification exams.
- **Props**: `isOpen`, `onClose`.
- **Dependencies**: `useExam` context (`addCustomExam`), `lucide-react` icons.

### 9. ImportExportModal
- **File**: [ImportExportModal.jsx](file:///e:/code/study-tracker/src/components/Modals/ImportExportModal.jsx)
- **Purpose**: Modal to export JSON backups or restore local progress from an uploaded JSON backup.
- **Props**: `isOpen`, `onClose`.
- **Dependencies**: `useExam` context (`exportData`, `importData`), `lucide-react` icons.

---

## 11. State Management

```
                       ┌────────────────────────────────┐
                       │          ExamProvider          │
                       │     (src/context/ExamContext)   │
                       └───────────────┬────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
   Persistent State           Persistent State             Transient State
   (localStorage)             (Supabase Database)          (React Memory)
   ──────────────────         ───────────────────          ─────────────────
   - exams                    - exam_attempts              - viewMode ('checklist'|'prep-exam')
   - activeExamId             - exam_questions             - prepState ('setup'|'quiz'|'results')
   - theme ('dark'|'light')   - question_topics            - activeQuizConfig
   - checklist ({...})                                     - activeAttemptResult
   - flagged ({...})                                       - highlightedTopicId
   - examHistory ([...])                                   - modal visibility flags
```

- **React Context**: Managed by `ExamProvider` in [ExamContext.jsx](file:///e:/code/study-tracker/src/context/ExamContext.jsx). Custom hook `useExam()` provides state and actions across the application.
- **Global State Elements**: `exams`, `activeExam`, `activeExamId`, `viewMode`, `theme`, `checklist`, `flagged`, `examHistory`, `supabaseAttempts`, `loadingAttempts`, `highlightedTopicId`.
- **Temporary State**: Modal visibility, active quiz config, active attempt result, user answers array during a quiz, live timers (`secondsRemaining`, `secondsElapsed`), search query, review tab filter.
- **Persistent State**: LocalStorage handles checklist checkmarks, flagged items, theme, active exam selection, custom exams, and light history. Supabase handles question banks, topic mappings, and full attempt payloads with complete `question_snapshot` records.

---

## 12. Import and Export Tools

The repository contains automated scripts in `scripts/` for managing database operations, question imports, safe bank replacements, SQL generation, and audits.

### 1. Question Importer (`scripts/importQuestions.js`)
- **Command**: `npm run import-questions`
- **Purpose**: Reads `data/question-import.json` and inserts valid questions into Supabase `exam_questions` and `question_topics`.
- **Safeguards**:
  - Phase 1: Local schema validation (checks valid ID strings, single vs. multiple option counts, option index bounds, non-empty explanation text, and verifies topic IDs against `DEFAULT_EXAMS`).
  - Phase 2: Transactional database insert. Checks for existing question IDs to skip duplicates. If inserting into `question_topics` fails, it automatically deletes the newly created `exam_questions` row to prevent partial imports.

### 2. Safe Question Bank Replacement (`scripts/replaceSaaQuestions.js`)
- **Command**: `npm run replace-saa-questions` or `node scripts/replaceSaaQuestions.js --dry-run`
- **Purpose**: Safely replaces the complete 250-question SAA-C03 question bank in Supabase using `data/SAA-C03-question-bank-upgraded-250.json`.
- **Safeguards**:
  - **SHA-256 Hash Verification**: Computes SHA-256 hash of the JSON file before and after processing to guarantee file integrity.
  - **Exact ID Set Validation**: Asserts that exactly 250 questions exist with IDs `q-saa-1` through `q-saa-250`.
  - **Automatic Pre-Replacement Backup**: Automatically exports current Supabase state to `data/backups/saa-c03-before-corrected-import.json` before writing.
  - **Dry-Run Mode**: Command `--dry-run` performs full validation and database matching without executing any writes or backups.
  - **Automatic Rollback**: If a database error occurs mid-operation, the script automatically catches the exception and restores `exam_questions` and `question_topics` from the fresh backup (`restoreFromBackup`).

### 3. Question Exporter (`scripts/exportQuestions.js`)
- **Command**: `npm run export-questions`
- **Purpose**: Fetches all questions and topic mappings from Supabase `exam_questions` and `question_topics`, formats them with natural ID sorting (`q-saa-1`, `q-saa-2` ...), and writes them to `data/saa-c03-question-export.json`.
- **Safeguards**: Aborts without overwriting existing files if Supabase returns 0 questions.

### 4. SQL Migration Generator (`scripts/generateSql.js`)
- **Command**: `npm run generate-sql`
- **Purpose**: Reads `data/saa-c03-question-export.json` and generates `supabase/saa_c03_questions.sql`.
- **Safeguards**: Uses PostgreSQL tagged dollar-quoted strings (`$q$...$q$`) for question prompts and explanations to prevent SQL syntax errors from single quotes or apostrophes.

### 5. Python Audit & Upgrade Suite (`scripts/*.py`)
- `auditSaaExplanationQuality.py`: Audits explanation length, sentence structure, and presence of structured sections (`Exam trigger:`, `Exam trap:`, `Memory hook:`).
- `audit_answer_option_quality.py`: Audits option text formatting, length consistency, and distractor quality.
- `perform_full_bank_upgrade.py`: Automates batch upgrades for the 250-question bank.
- `validate_upgraded_bank.py`: Validates schema compliance of upgraded JSON bank files.

---

## 13. Current Limitations

1. **No User Authentication**: The application contains **no user authentication system** (`supabase.auth` is unused). All database queries run under the public publishable key with public RLS policies (`USING (true)`). In a multi-user environment, users share the same database tables.
2. **Hardcoded AWS Domain Logic**: While users can add custom exam metadata via `AddExamModal`, the domain mapping logic (`saaC03DomainMapping.js`, domain weights, 65-question allocation) is hardcoded specifically for AWS SAA-C03. Custom exams use placeholder sample questions.
3. **Duplicated Domain Mapping Utilities**: Domain lookup logic (`getDomainForQuestion`, `getPrimaryDomainIdForQuestion`) is duplicated across `saaC03DomainMapping.js`, `questionService.js`, `examUtils.js`, `App.jsx`, and `ExamResults.jsx`.
4. **Schema Fallback Handling**: In `attemptService.js`, saving an attempt tries a rich payload with Custom Exam metadata first, catching PostgREST error `PGRST204` to fall back to a base payload if dedicated columns are missing on older database schemas.
5. **Unused / Outdated Files**:
   - `src/data/saaC03DomainMapping-before-250-question-update-2026-07-31.js` (legacy domain mapping superseded by `saaC03DomainMapping.js`).
   - `scripts/replaceSaaQuestions.before-250-upgrade.js` (legacy replacement script superseded by `replaceSaaQuestions.js`).
   - Multiple historical snapshot audit files in `data/` (e.g. `SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json`).

---

## 14. Running the Project

### Command Reference
```bash
# 1. Install project dependencies
npm install

# 2. Start Vite local development server
npm run dev

# 3. Run automated unit test suite (Node.js test runner)
npm test

# 4. Run Oxlint code linter
npm run lint

# 5. Build production bundle (outputs to dist/)
npm run build

# 6. Preview production build locally
npm run preview

# 7. Execute Database Maintenance Scripts
npm run import-questions       # Import data/question-import.json into Supabase
npm run replace-saa-questions  # Replace 250-question bank in Supabase
npm run export-questions       # Export Supabase question bank to JSON
npm run generate-sql           # Generate supabase/saa_c03_questions.sql
```

### Required Environment Variables (`.env.local`)
Create a `.env.local` file in the project root with the following variables:

```env
# Frontend Supabase Credentials (Vite Exposed)
VITE_SUPABASE_URL=https://your-supabase-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-publishable-key

# Backend / Script Supabase Credentials (Used by Node.js CLI scripts)
SUPABASE_URL=https://your-supabase-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
```

---

## 15. Deployment

- **Deployment Setup**: The app is built as a static Single Page Application (SPA). Running `npm run build` triggers `vite build`, compiling JSX and Tailwind CSS into optimized static assets in the `dist/` directory.
- **Target Hosting Platforms**: Deploys seamlessly to static hosting providers including **Vercel**, **Netlify**, **Cloudflare Pages**, **AWS Amplify**, or **GitHub Pages**.
- **Configuration Files**: No specialized host configuration files (such as `vercel.json` or `netlify.toml`) are present; hosting platforms automatically detect Vite applications and execute `npm run build` with publish directory `dist`.

---

## 16. Final Architecture Summary

### End-to-End System Explanation
**ExamPulse Prep AI** is a client-side React 19 SPA built with Vite and Tailwind CSS 4, backed by a Supabase PostgreSQL database. Users interact with the app through two main view modes:
1. In **Checklist View**, users track study progress across AWS SAA-C03 service topics. Task checkmarks are persisted in `localStorage`. Users can perform single-level CRUD operations on service topics and subtopics.
2. In **Prep Exam View**, users configure and launch practice exams. Questions and topic mappings are loaded from Supabase (`exam_questions` and `question_topics`). Questions and choice options (choices A through F) are randomized using Fisher-Yates shuffling with remapped correct answer indices.
3. During quiz execution, state is maintained in `userAnswers`. A countdown timer handles timed mode, and `QuestionGrid` enables quick jump navigation.
4. Upon exam submission, score percentages and domain accuracy are computed. Summaries are recorded in `localStorage`, and the complete attempt payload—including an exact `question_snapshot` array—is saved asynchronously to Supabase `exam_attempts`.
5. The **ExamResults** screen presents visual diagnostics, pass/fail score banners, domain performance progress bars, and weak topic "Review Checklist" jump triggers. Users can export results to a multi-page PDF report (`jspdf`) or download JSON backups.

### End-to-End Journey Flow
```
[User opens Web App] ──> [Navbar Header] ──> Select Exam (AWS SAA-C03)
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[ChecklistView]                                 [ExamSetup]
  ├── Track Mastery %                             ├── Select Mode (Full Mock / Targeted / Custom)
  ├── Toggle Micro-Tasks (localStorage)           ├── Configure Timer & Instant Feedback Toggles
  ├── Add/Edit Topics & Subtopics                 └── View Historical Supabase Attempts
  └── Click "Quiz Service" ──┐                          │
                             │                          ▼ (Click "Start Exam")
                             └─────────────────> [QuizEngine]
                                                   ├── Questions & Options Shuffled (Fisher-Yates)
                                                   ├── Answer Selection (Single vs Multi A-F)
                                                   ├── Countdown Timer / Pace Alerts
                                                   ├── Instant Rationale Display (if enabled)
                                                   └── QuestionGrid Overlay & Flagging
                                                        │
                                                        ▼ (Click "Submit Exam" / Timer Expires)
                                                 [App.jsx handleFinishExam]
                                                   ├── Calculate Score %, Domain Stats & Pass/Fail
                                                   ├── Save Summary to localStorage
                                                   └── Save Payload + question_snapshot to Supabase
                                                        │
                                                        ▼
                                                 [ExamResults]
                                                   ├── Score Banner + Confetti
                                                   ├── SAA-C03 Domain Progress Bars
                                                   ├── Weak Topic Diagnostic Jump Links
                                                   ├── Full Question Review (All/Correct/Incorrect)
                                                   └── Export PDF / Download JSON / Retake
```

### The 10 Most Important Files to Read First

1. [src/App.jsx](file:///e:/code/study-tracker/src/App.jsx): Root application controller; manages view mode routing, exam lifecycle transitions, score calculations, and non-blocking Supabase attempt persistence.
2. [src/context/ExamContext.jsx](file:///e:/code/study-tracker/src/context/ExamContext.jsx): Global React Context provider; manages persistent state (`exams`, `checklist`, `flagged`, `history`), Supabase attempts loading, and single-level checklist CRUD operations.
3. [src/components/PrepExam/QuizEngine.jsx](file:///e:/code/study-tracker/src/components/PrepExam/QuizEngine.jsx): Core exam execution engine; handles question display, option selection logic, countdown/elapsed timers, instant feedback, and modal triggers.
4. [src/components/PrepExam/ExamResults.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamResults.jsx): Exam results dashboard; renders score banners, domain breakdown bars, weak topic diagnostic checklist links, full question review, and PDF/JSON export actions.
5. [src/components/PrepExam/ExamSetup.jsx](file:///e:/code/study-tracker/src/components/PrepExam/ExamSetup.jsx): Exam configuration screen; manages mode selection (Full Mock, Targeted Quiz, Custom Exam), custom parameters, and historical Supabase attempt review triggers.
6. [src/utils/examUtils.js](file:///e:/code/study-tracker/src/utils/examUtils.js): Question selection algorithms; implements Fisher-Yates question/option shuffling with answer index remapping, Full Mock allocations, and the Largest-Remainder Method for custom domain balancing.
7. [src/services/questionService.js](file:///e:/code/study-tracker/src/services/questionService.js): Data access layer for questions; fetches `exam_questions` and `question_topics` from Supabase and transforms database rows into application question schema.
8. [src/services/attemptService.js](file:///e:/code/study-tracker/src/services/attemptService.js): Data access layer for exam attempts; saves completed attempts with `question_snapshot` records and fetches attempt history from Supabase.
9. [src/data/saaC03DomainMapping.js](file:///e:/code/study-tracker/src/data/saaC03DomainMapping.js): Authoritative SAA-C03 domain definitions; contains `SAA_C03_DOMAINS`, fixed 65-question mock allocations, domain weights, and `QUESTION_DOMAIN_MAP` for all 250 questions.
10. [src/utils/exportUtils.js](file:///e:/code/study-tracker/src/utils/exportUtils.js): Reporting and export engine; builds standardized attempt payloads, formats multi-page PDF reports using `jspdf`, and handles JSON downloads.
