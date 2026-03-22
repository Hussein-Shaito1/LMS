# LearnHub LMS — Portal Reference Document

> Full technical specification of the existing LMS frontend.
> Use this as the source of truth when building an admin/instructor portal for this platform.

---

## 1. Project Overview

| Property | Value |
|---|---|
| Name | LearnHub |
| Type | Frontend-only LMS (no backend/database) |
| Root path | `c:\Users\Hussein\Desktop\Claude\lms` |
| Framework | Next.js App Router (v16.2.1), React 19, TypeScript |
| Styling | SCSS (BEM methodology), no Tailwind |
| State | Zustand with `persist` middleware (localStorage) |
| Animations | Framer Motion |
| Icons | lucide-react |
| Dev server | `npm run dev` → http://localhost:3000 |

---

## 2. Data Layer

All data is **static JSON** under `data/`. There is no REST API or database — the portal would either extend these JSON files or introduce a real backend.

### 2.1 `data/courses.json`

10 courses total. Each course object:

```ts
{
  id: string            // "course-1" … "course-10"
  title: string
  description: string
  shortDescription: string
  category: string      // "Web Development" | "Python" | "Data Science" | ...
  level: "Beginner" | "Intermediate" | "Advanced"
  instructor: string    // display name
  instructorAvatar: string
  instructorId: string  // "teacher-1" … "teacher-10"
  duration: string      // "10h 30m"
  thumbnail: string     // "/images/..."
  rating: number        // 0–5
  students: number
  lessons: Lesson[]
  tags: string[]
}
```

Each `Lesson`:

```ts
{
  id: string            // "lesson-1"
  title: string
  duration: string      // "12:30"
  videoUrl: string      // YouTube embed URL
  description?: string
  questions?: Question[]
}
```

### 2.2 `data/exams.json`

4 exams total.

```ts
{
  id: string            // "exam-1" … "exam-4"
  title: string
  description: string
  instructions: string
  duration: number      // minutes
  courseId?: string     // links to a course (optional — standalone exams omit this)
  passingScore: number  // percentage, e.g. 70
  questions: Question[]
}
```

- **exam-1** is linked to `course-1`
- **exam-2, exam-3, exam-4** are standalone (no `courseId`)

### 2.3 `data/teachers.json`

10 teacher profiles:

```ts
{
  id: string            // "teacher-1" … "teacher-10"
  name: string
  avatar: string
  title: string         // "Senior React Developer"
  bio: string
  contact?: string      // email
}
```

### 2.4 `data/users.json`

2 seed users (password stored in plain text — mock only):

| Email | Password |
|---|---|
| alex@example.com | password123 |
| jordan@example.com | password123 |

User shape:

```ts
{
  id: string
  name: string
  email: string
  password: string   // only in data/users.json — never exposed to client
  avatar: string
  bio: string
  joinedAt: string   // ISO date
}
```

The client-side `StoredUser` type omits `password`.

---

## 3. Question Types

All 5 question types are shared between **lesson questions** and **exam questions**.

| Type | UI | Answer format stored |
|---|---|---|
| `multiple-choice` | Radio-style option buttons | option `id` string (e.g. `"b"`) |
| `input-text` | Free-text input | raw string, scored case-insensitive trimmed |
| `dropdown` | Native `<select>` | option `id` string |
| `multiselect` | Toggle checkboxes | comma-separated **sorted** ids (e.g. `"a,c,d"`) |
| `sorting` | Drag-and-drop reorder (Framer Motion `Reorder`) | comma-separated ids in user order |

Scoring logic lives in `lib/exams.ts → scoreAnswer(question, answer)`.

---

## 4. State Management (Zustand)

### 4.1 `store/authStore.ts`  →  persisted as `lms_auth_store`

| Field/Method | Type | Notes |
|---|---|---|
| `user` | `StoredUser \| null` | Currently logged-in user |
| `loading` | `boolean` | Hydration guard — `true` until store rehydrates |
| `login(email, password)` | `boolean` | Validates against `data/users.json`, returns success |
| `register(name, email, password)` | `boolean` | Creates new user, persists |
| `logout()` | `void` | Clears user, calls `lmsStore.resetAll()` |
| `updateProfile(data)` | `void` | Updates `name`, `avatar`, `bio` |

### 4.2 `store/lmsStore.ts`  →  persisted as `lms_data_store`

| Field/Method | Type | Notes |
|---|---|---|
| `enrolledCourses` | `string[]` | Array of course IDs |
| `favorites` | `string[]` | Array of course IDs |
| `progress` | `Record<string, string[]>` | `{ [courseId]: [lessonId, ...] }` |
| `answers` | `Answers` | `{ [courseId][lessonId][questionId]: UserAnswer }` |
| `examResults` | `Record<string, ExamResult>` | `{ [examId]: ExamResult }` |
| `enroll(courseId)` | `void` | |
| `isEnrolled(courseId)` | `boolean` | |
| `toggleFavorite(courseId)` | `boolean` | Returns `true` if added |
| `isFavorite(courseId)` | `boolean` | |
| `markLesson(courseId, lessonId)` | `void` | |
| `getCompletedLessons(courseId)` | `string[]` | |
| `submitAnswer(courseId, lessonId, questionId, answer, isCorrect)` | `void` | |
| `getAnswer(courseId, lessonId, questionId)` | `UserAnswer \| undefined` | |
| `getLessonAnswers(courseId, lessonId)` | `Record<string, UserAnswer>` | |
| `saveExamResult(result)` | `void` | |
| `getExamResult(examId)` | `ExamResult \| undefined` | |
| `resetAll()` | `void` | Called on logout — clears all LMS state |

### 4.3 `store/toastStore.ts`  →  in-memory only (not persisted)

| Method | Signature |
|---|---|
| `showToast(message, type)` | `type: 'success' \| 'error' \| 'info' \| 'warning'` |

Context wrappers (`context/AuthContext.tsx`, `context/LMSContext.tsx`, `context/ToastContext.tsx`) are thin no-op re-exports so all page imports remain compatible.

---

## 5. Routes

### Student-facing (existing)

| Route | File | Auth required |
|---|---|---|
| `/` | `app/page.tsx` | No |
| `/courses` | `app/courses/page.tsx` | No |
| `/course/[id]` | `app/course/[id]/page.tsx` | No (enroll requires auth) |
| `/course/[id]/lesson/[lessonId]` | `app/course/[id]/lesson/[lessonId]/page.tsx` | Yes (enrolled) |
| `/teacher/[id]` | `app/teacher/[id]/page.tsx` | No |
| `/exam/[id]` | `app/exam/[id]/page.tsx` | No (start requires auth) |
| `/exam/[id]/start` | `app/exam/[id]/start/page.tsx` | Yes |
| `/exam/[id]/results` | `app/exam/[id]/results/page.tsx` | Yes |
| `/login` | `app/login/page.tsx` | No |
| `/register` | `app/register/page.tsx` | No |
| `/profile` | `app/profile/page.tsx` | Yes |
| `/profile/edit` | `app/profile/edit/page.tsx` | Yes |
| `/my-courses` | `app/my-courses/page.tsx` | Yes |
| `/favorites` | `app/favorites/page.tsx` | Yes |
| `/about` | `app/about/page.tsx` | No |
| `/contact` | `app/contact/page.tsx` | No |
| `/terms` | `app/terms/page.tsx` | No |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | No |

### Suggested portal routes (to build)

| Route | Purpose |
|---|---|
| `/portal` | Dashboard — overview stats |
| `/portal/courses` | List, create, edit, delete courses |
| `/portal/courses/new` | Course creation form |
| `/portal/courses/[id]` | Edit course metadata + lessons |
| `/portal/courses/[id]/lessons` | Manage lesson order, add/remove |
| `/portal/courses/[id]/lessons/[lessonId]` | Edit lesson content + questions |
| `/portal/exams` | List all exams |
| `/portal/exams/new` | Create new exam |
| `/portal/exams/[id]` | Edit exam + questions |
| `/portal/teachers` | List all teachers |
| `/portal/teachers/[id]` | Edit teacher profile |
| `/portal/users` | View all student accounts |
| `/portal/users/[id]` | View student progress + exam results |
| `/portal/analytics` | Enrollment stats, completion rates, exam pass rates |

---

## 6. Key Libraries

```json
{
  "next": "^16.2.1",
  "react": "^19.0.0",
  "typescript": "^5",
  "zustand": "latest",
  "framer-motion": "latest",
  "lucide-react": "latest",
  "sass": "latest"
}
```

---

## 7. SCSS Architecture

```
styles/
  base/
    _reset.scss
    _variables.scss    ← $primary, $border, $error, $radius, $transition, etc.
    _mixins.scss       ← container, flex-center, card, gradient-text, max-md, max-lg, etc.
    _typography.scss
    _animations.scss   ← fadeInUp, fadeInDown, spin, slideInRight keyframes
  components/
    _buttons.scss
    _cards.scss
    _forms.scss
    _toast.scss
    _progress.scss
    _badge.scss
    _modal.scss
    _questions.scss    ← lesson question types styles
    _exam.scss         ← exam-specific styles (topbar, timer, score ring, review)
  layouts/
    _header.scss
    _footer.scss
    _sidebar.scss
  pages/
    _pages.scss        ← page-specific overrides
  main.scss            ← @import all partials
```

Variables are injected globally via `next.config.ts`:
```ts
sassOptions: {
  additionalData: `@import "styles/base/variables"; @import "styles/base/mixins"; @import "styles/base/animations";`
}
```

**Important:** Use `@import` not `@use` for the global inject to avoid namespace scope errors.

---

## 8. Key Utility Functions

### `lib/courses.ts`

```ts
getCourseById(id: string): Course | undefined
getAllCourses(): Course[]
getAllTeachers(): Teacher[]
getTeacherById(id: string): Teacher | undefined
getCoursesByTeacherId(teacherId: string): Course[]
getAllTags(): string[]
getProgressPercent(courseId: string, completedLessons: string[]): number
filterCourses(filters: {
  query?: string
  category?: string
  level?: string
  teacherId?: string
  tags?: string[]
  sort?: 'popular' | 'rating' | 'newest' | 'shortest'
}): Course[]
```

### `lib/exams.ts`

```ts
getAllExams(): Exam[]
getExamById(id: string): Exam | undefined
getExamsByCourseId(courseId: string): Exam[]
scoreAnswer(question: Question, answer: string): boolean
formatTime(seconds: number): string   // "4:32"
```

---

## 9. Component Map

```
components/
  layout/
    Header.tsx          ← sticky nav, auth state, mobile hamburger
    Footer.tsx
    Sidebar.tsx         ← course filter sidebar (animated)
  ui/
    CourseCard.tsx      ← thumbnail, rating, meta, hover animation
    ProgressBar.tsx     ← animated completion bar (size="sm"|"lg")
    SearchFilter.tsx    ← search + sort bar
    FilterPanel.tsx     ← category/level/instructor/tags filters
    StarRating.tsx      ← star display + numeric rating
    Badge.tsx
    Modal.tsx
    Toast.tsx + ToastContainer.tsx
    PageTransition.tsx  ← Framer Motion page fade wrapper
    EmptyState.tsx
  lesson/
    QuestionSection.tsx ← renders lesson questions with answer tracking
  exam/
    ExamTimer.tsx       ← countdown with warning/critical states, onTimeUp callback
    ExamQuestionRenderer.tsx ← renders all 5 question types for exams
```

---

## 10. Exam System

### Timer Behavior

- `ExamTimer` counts down from `durationSeconds`
- Turns yellow (`.exam-timer--warning`) at ≤ 5 minutes
- Turns red (`.exam-timer--critical`) at ≤ 1 minute
- Calls `onTimeUp()` exactly once (guarded by `calledUp` ref) when reaching 0
- `onTimeUp` → `handleSubmit(true)` → auto-submit

### Submit Guard

`submittedRef = useRef(false)` — set to `true` on first submit call. Both manual submit and auto-submit check this, preventing race-condition double submissions.

### Score Calculation

```
score = count of isCorrect answers
percentage = Math.round((score / total) * 100)
passed = percentage >= exam.passingScore
```

### Result Display

- Animated SVG score ring:
  - `r="54"` → `circumference = 2 * Math.PI * 54 ≈ 339.3`
  - Ring animates from `strokeDashoffset = circumference` → `circumference * (1 - percentage/100)` after 300ms delay
- Pass/fail hero banner with color variant (`.exam-result-hero--pass` / `--fail`)
- Per-question answer review with correct/incorrect labeling and explanations

---

## 11. Toast Events

| Trigger | Toast type |
|---|---|
| Login success | success |
| Login error | error |
| Register success | success |
| Register error | error |
| Logout | info |
| Profile updated | success |
| Enrolled in course | success |
| Add to favorites | success |
| Remove from favorites | success |
| Lesson marked complete | success |
| Exam auto-submitted (time up) | info |

---

## 12. Portal Implementation Notes

When building the admin/instructor portal on top of this project:

1. **Data persistence** — Currently pure JSON. The portal will likely need to write back to JSON (via API routes in Next.js) or migrate to a real database (SQLite, Supabase, PlanetScale, etc.).

2. **Auth separation** — Add a separate `portalUser` concept with an `admin` or `instructor` role. Reuse the existing Zustand auth pattern or add a `store/portalAuthStore.ts`.

3. **Shared layout** — The portal should have its own layout (`app/portal/layout.tsx`) separate from the student layout to avoid polluting the student header/footer.

4. **SCSS reuse** — All existing SCSS variables, mixins, and component classes are available globally. Use them in portal components for visual consistency.

5. **Exam editor** — Question types support `options[]` (multiple-choice, dropdown, multiselect, sorting) and `correctAnswer` (string). The editor must handle all 5 types and serialize correctly.

6. **LocalStorage key names**:
   - Auth state: `lms_auth_store`
   - LMS data: `lms_data_store`

7. **No API currently** — `lib/courses.ts` and `lib/exams.ts` read JSON synchronously at import time. A portal will need either Next.js API routes (`app/api/...`) or Server Actions to mutate data.

---

## 13. TypeScript Types Summary

```ts
// Core entities
Course, Lesson, Teacher, User, StoredUser

// Questions (shared between lessons and exams)
Question, QuestionOption, QuestionType, UserAnswer, Answers

// Exams
Exam, ExamAnswer, ExamResult

// UI
Toast, ToastType, Progress
```

All types live in `types/index.ts`.
