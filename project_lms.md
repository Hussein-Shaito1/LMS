---
name: LMS project setup
description: Full LMS frontend project initialized in C:\Users\Hussein\Desktop\Claude\lms — stack, routes, SCSS, state, and all features
type: project
---

Frontend-only LMS (LearnHub) built at `C:\Users\Hussein\Desktop\Claude\lms`.

**Why:** User wanted a polished, production-quality LMS frontend with no backend.

**How to apply:** Use `npm run dev` to start. App uses Next.js 16.2.1 App Router, TypeScript, SCSS (no Tailwind), local JSON data.

---

## Stack

- Next.js 16.2.1 App Router, React 19, TypeScript
- SCSS with `sassOptions.additionalData` using `@import` (NOT `@use`) — variables/mixins injected globally
- Zustand (with `persist` middleware) for all state — auth, LMS data, toasts
- framer-motion for page transitions, Reorder (sorting questions), AnimatePresence (filter collapse/expand)
- lucide-react for icons
- swiper/react (SwiperJS) for HeroSwiper and TeacherCarousel
- react-hook-form for Edit Profile form

---

## State (Zustand stores)

- `store/authStore.ts` — persists `user` to `lms_auth_store`; hydration flag drives `loading`; `logout()` calls `lmsStore.resetAll()`; has `changePassword()` method
- `store/lmsStore.ts` — persists enrollments, favorites, progress, `answers` to `lms_data_store`; includes `submitAnswer`, `getAnswer`, `getLessonAnswers`, `resetAll`
- `store/toastStore.ts` — in-memory only
- `context/AuthContext.tsx`, `context/LMSContext.tsx`, `context/ToastContext.tsx` — thin re-export wrappers; providers render `<>{children}</>` (no-ops)

---

## Data

- `data/courses.json` — 10 courses, each with 6-8 lessons; lessons have `description`, `questions[]`, and `instructorId`
- `data/teachers.json` — 10 teacher profiles: `{ id, name, avatar, title, bio, contact }`
- `data/users.json` — 2 seed users (alex@example.com / password123, jordan@example.com / password123)

---

## Question Types (5 total)

All stored in Zustand `answers` state as `{ [courseId][lessonId][questionId]: UserAnswer }`.
Answer stored as string; multiselect and sorting use comma-separated IDs.

| Type | Description | Answer format |
|---|---|---|
| `multiple-choice` | Single select option buttons | option id |
| `input-text` | Free text input | text string |
| `dropdown` | Native select | option id |
| `multiselect` | Toggle checkboxes, select all that apply | comma-separated sorted ids |
| `sorting` | Drag-and-drop reorder (framer-motion Reorder) | comma-separated ids in user's order |

**Auto-complete:** When all questions in a lesson are answered, the lesson is automatically marked complete (handled in `QuestionSection.tsx`).

---

## Routes (18 total)

| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/courses` | `app/courses/page.tsx` — full filterable/searchable course list |
| `/course/[id]` | `app/course/[id]/page.tsx` — shows linked exams via `getExamsByCourseId` |
| `/course/[id]/lesson/[lessonId]` | `app/course/[id]/lesson/[lessonId]/page.tsx` — video + description + questions |
| `/teacher/[id]` | `app/teacher/[id]/page.tsx` — teacher profile + their courses |
| `/exam/[id]` | `app/exam/[id]/page.tsx` — exam intro, instructions, previous result |
| `/exam/[id]/start` | `app/exam/[id]/start/page.tsx` — active exam with timer, nav sidebar, auto-submit |
| `/exam/[id]/results` | `app/exam/[id]/results/page.tsx` — animated score ring, answer review |
| `/login` | `app/login/page.tsx` |
| `/register` | `app/register/page.tsx` |
| `/profile` | `app/profile/page.tsx` |
| `/profile/edit` | `app/profile/edit/page.tsx` |
| `/my-courses` | `app/my-courses/page.tsx` |
| `/favorites` | `app/favorites/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/contact` | `app/contact/page.tsx` |
| `/terms` | `app/terms/page.tsx` |
| `/privacy-policy` | `app/privacy-policy/page.tsx` |

---

## Home Page (`/`)

- HeroSwiper (SwiperJS fade effect, `crossFade: true`, pagination dots, autoplay 5s, no navigation arrows)
- Stats section inside hero: `section__header` with eyebrow "By The Numbers" + h2 "Trusted by Learners Worldwide"
- Features section: `section--white section--features`
- TeacherCarousel (SwiperJS)
- Courses section: `section--courses`, search + filter via `SearchFilter`, pagination (`PER_PAGE=6`)
- Section custom classes added to all sections for targeted SCSS

---

## CourseCard (`components/ui/CourseCard.tsx`)

- Outer wrapper is `<div className="course-card">` (NOT a Link — avoids nested `<a>` hydration error)
- Title wrapped in `<Link href="/course/[id]" className="course-card__main-link">` — stretched link via `::after` covers the card
- Instructor kept as separate `<Link href="/teacher/[instructorId]">` with `position: relative; z-index: 1`
- Favorite button also has `position: relative; z-index: 1`

---

## Courses List Page (`/courses`)

- `CoursesPage` wraps `CoursesContent` in `<Suspense>` (required for `useSearchParams`)
- All filters synced to URL via `useSearchParams` + `router.replace({ scroll: false })`: `q`, `level`, `category`, `teacher`, `tags`, `sort`, `page`
- State initialized from URL on mount
- Filter sidebar: `useState(false)` — closed by default; CSS shows it always on desktop (no JS needed)
- Filter toggle button has `mobile-only` class — hidden on desktop via CSS
- Mobile filter: full-width/height popup overlay
- `FilterGroup` component: collapse/expand with chevron, AnimatePresence smooth animation
- `FilterOptions` component: shows first N items, AnimatePresence animates "show more/less"
- Top bar: `filter-bar` (search + sort only) + `results-bar` (count + filter toggle + clear)
- Pagination: `Pagination` component, `PER_PAGE=6`
- `setPage(1)` called inside `useMemo` when filters change (resets to page 1)

---

## Teacher Page (`/teacher/[id]`)

- Hero banner: avatar, name, title, bio, contact email
- Stats row: course count, total students, avg rating
- Grid of all courses by that teacher (CourseCard)
- TeacherCarousel on home page uses SwiperJS

---

## Edit Profile (`/profile/edit`)

- Uses `react-hook-form` (`useForm<FormValues>`)
- Password section: Current Password, New Password, Confirm New Password (all with show/hide toggle)
- `changePassword()` called from `authStore` before profile update
- `form__input-wrap` wraps each validated field — error span always rendered (min-height reserves space, no jump)
- Full Name has required indicator: `<span className="form__required">*</span>`
- `form__profile` class on the form for profile-specific absolute error positioning

---

## Header

- `position: fixed` (NOT sticky) — main content has `padding-top: $header-height (70px)` to compensate

---

## Key utilities (`lib/courses.ts`)

- `getAllTeachers()`, `getTeacherById(id)`, `getCoursesByTeacherId(teacherId)`
- `getAllTags()` — unique tags across all courses
- `filterCourses({ query, category, level, teacherId, tags, sort })` — unified filter
- `SortOption` type: `'popular' | 'rating' | 'newest' | 'shortest'`

---

## SCSS

- Variables injected via `sassOptions.additionalData` → `@import "base/variables"; @import "base/mixins"; @import "base/animations";`
- Key variable names: `$primary`, `$border`, `$error` (NOT $danger), `$transition` (NOT $transition-base), `$radius` (NOT $radius-base)
- Components SCSS: `_questions.scss` has styles for all 5 question types including `.ms-option`, `.sort-item`, `.sort-list`
- `.filter-check` and `.select` utility classes added to `main.scss`
- `.badge--primary` added to `_badge.scss`

### Form SCSS (`_forms.scss`)

- `form__required`: `color: $error` — red asterisk on required fields
- `form__input-wrap .form__error`: `display: block; min-height: 1.25rem; padding-top: 3px; line-height: 1` — always reserves space, no layout jump
- `form__profile .form__error`: `position: absolute; bottom: -22px` — for profile edit page
- `input--error`: `border-color: $error` on both `:hover` AND `:focus` — error border has priority over primary focus color
- `auth-page .form`: `gap: 0` with `margin-top: 20px` on `.btn`

---

## Exam System

- `data/exams.json` — 4 exams; exam-1 linked to course-1 via `courseId`, exams 2-4 are standalone
- `lib/exams.ts` — `getAllExams()`, `getExamById()`, `getExamsByCourseId()`, `scoreAnswer(q, answer)`, `formatTime(seconds)`
- `styles/components/_exam.scss` — all exam styles; imported in `main.scss`
- `components/exam/ExamTimer.tsx` — countdown timer; `.exam-timer--warning` (≤5min), `.exam-timer--critical` (≤1min); `calledUp` ref prevents double `onTimeUp` fire
- `components/exam/ExamQuestionRenderer.tsx` — renders all 5 question types; `SortQuestion` subcomponent manages internal Framer Motion `Reorder` state
- `store/lmsStore.ts` — `examResults: Record<string, ExamResult>`, `saveExamResult()`, `getExamResult(examId)`
- Submit guard: `submittedRef = useRef(false)` in start page prevents race between manual + auto-submit
- Score ring: SVG `r=54`, `circumference = 2*PI*54`; animates `strokeDashoffset` from full → `circumference*(1-pct/100)` after 300ms delay
- Course detail page (`/course/[id]`) shows linked exams as `.exam-card` rows inside `.course-exams` card

---

## Key decisions

- SCSS `@import` additionalData (not `@use`) avoids namespace scope issue
- Zustand persist replaces all localStorage helpers from `lib/storage.ts`
- Context files are no-op wrappers so all 15+ component imports remain unchanged
- multiselect correctness: sort both arrays alphabetically, compare joined string
- sorting correctness: compare comma-joined user order vs correctAnswer exactly
- No nested `<a>` tags — CourseCard uses div wrapper + stretched link CSS pattern
- Filter sidebar: CSS-only desktop always-visible (not JS state), JS state only for mobile popup
- `useSearchParams` always requires `<Suspense>` wrapper in Next.js App Router client components
