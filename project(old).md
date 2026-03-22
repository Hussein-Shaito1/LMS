# 📚 LMS (Student-Only, JSON-Based)

## 🧠 Overview

This project is a simplified **Learning Management System (LMS)** focused only on **visitors and students**.

There is:

* ❌ No admin panel
* ❌ No backend / API
* ✅ All data comes from local JSON files
* ✅ Frontend-only authentication (mock)
* ✅ Toast notifications for all actions
* ✅ Custom UI built with SCSS (no Tailwind)
* ✅ Smooth animations for better UX

The goal is to build a **modern, animated LMS interface** using static data and clean frontend architecture.

---

## 🎯 Main Goals

* Build a high-quality UI/UX (not basic)
* Use SCSS for structured and reusable styling
* Add animations across the app
* Provide smooth and interactive user experience
* Keep logic simple (no backend)

---

## 👤 User Types

### Visitor

* Browse courses
* View course details
* Access public pages
* Register / Login

### Student (local state only)

* Enroll in courses
* Watch lessons
* Track progress
* Add/remove favorite courses
* Manage profile

---

## 📦 Core Features

### 🔐 Authentication (Frontend Only)

* Login / Register pages
* Store user in localStorage
* Logout functionality

**Toasts:**

* Login success / error
* Register success / error
* Logout confirmation

---

### 👤 User Profile

* View profile info
* Edit profile

**Toasts:**

* Profile updated successfully

---

### 📚 Course Listing

* Load courses from JSON
* Display course cards with hover animations

---

### 📄 Course Details

* Full course info
* Lessons list

**Toasts:**

* Enroll in course
* Add/remove favorites

---

### 🎥 Lesson Player

* Video player
* Lesson navigation

**Toasts:**

* Lesson marked as completed

---

### ✅ Progress Tracking

* Track completed lessons
* Display animated progress bar

---

### ❤️ Favorites

* Add/remove favorites
* Dedicated favorites page

---

### 📘 My Courses

* Show enrolled courses
* Continue learning

---

### 🔍 Search & Filter

* Search by title
* Filter by category and level

---

## 🔔 Toast Notification System

### Requirements

* Toast on every important action
* Smooth animation (fade / slide)
* Auto dismiss
* Types:

  * Success
  * Error
  * Info

---

## 🎬 Animation Requirements (IMPORTANT)

Animations are required across the app to enhance UX.

### Examples:

* Page transitions (fade / slide)
* Course card hover (scale + shadow)
* Buttons (hover + click effects)
* Modal animations
* Toast animations
* Progress bar animation
* Sidebar open/close animation

### Suggested Approach:

* Use CSS animations and transitions (SCSS)
* Optional: use animation library (e.g., Framer Motion)

---

## 🎨 Styling (SCSS REQUIRED)

### Rules:

* ❌ Do NOT use Tailwind CSS
* ✅ Use SCSS (SASS)
* ✅ Use modular and reusable styles

### Structure Example:

```
/styles
  /base
    _reset.scss
    _variables.scss
    _typography.scss
  /components
    _buttons.scss
    _cards.scss
    _forms.scss
  /layouts
    _header.scss
    _footer.scss
    _sidebar.scss
  main.scss
```

### SCSS Features to Use:

* Variables (colors, spacing)
* Mixins
* Nesting
* Reusable classes

---

## 📁 Data Source (JSON)

All data comes from a local JSON file.

---

## 🧱 Pages Structure

### Main Pages

* `/`
* `/course/[id]`
* `/course/[id]/lesson/[lessonId]`

### User Pages

* `/login`
* `/register`
* `/profile`
* `/profile/edit`
* `/my-courses`
* `/favorites`

### Basic Pages

* `/about`
* `/contact`
* `/terms`
* `/privacy-policy`

---

## 💾 Local Storage Structure

```json id="local-storage-final"
{
  "user": {},
  "enrolledCourses": [],
  "favorites": [],
  "progress": {}
}
```

---

## ⚙️ Tech Stack

* Next.js (App Router)
* TypeScript
* SCSS (SASS)
* Local JSON data

---

## 🎯 Expected Outcome

A polished LMS frontend with:

* Smooth animations
* SCSS-based styling system
* Toast feedback system
* Course learning experience
* Profile & favorites management
* Clean and scalable structure

This project should feel like a **real production-ready UI**, not a basic demo.
