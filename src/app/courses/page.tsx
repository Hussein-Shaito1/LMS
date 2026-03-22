"use client";

import CourseCard from "@/components/ui/CourseCard";
import PageTransition from "@/components/ui/PageTransition";
import type { SortOption } from "@/lib/courses";
import {
  filterCourses,
  getAllTags,
  getAllTeachers,
  getCategories,
  getLevels,
} from "@/lib/courses";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [category, setCategory] = useState("All");
  const [teacherId, setTeacherId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const categories = ["All", ...getCategories()];
  const levels = ["All", ...getLevels()];
  const allTags = getAllTags();
  const allTeachers = getAllTeachers();

  const results = useMemo(() => {
    setPage(1);
    return filterCourses({
      query,
      level,
      category,
      teacherId,
      tags: selectedTags,
      sort,
    });
  }, [query, level, category, teacherId, selectedTags, sort]);

  const totalPages = Math.ceil(results.length / PER_PAGE);
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function clearAll() {
    setQuery("");
    setLevel("All");
    setCategory("All");
    setTeacherId("");
    setSelectedTags([]);
    setSort("popular");
  }

  const hasActiveFilters =
    query ||
    level !== "All" ||
    category !== "All" ||
    teacherId ||
    selectedTags.length > 0;

  return (
    <PageTransition>
      <div className="container courses-page">
        {/* Page header */}
        <div className="courses-page__header">
          <h1>All Courses</h1>
          <p>Explore our full library of courses across every topic.</p>
        </div>

        {/* Search + Sort */}
        <div className="filter-bar">
          <div className="search-bar">
            <Search className="search-bar__icon" size={18} />
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="shortest">Shortest Duration</option>
          </select>
        </div>

        {/* Results bar */}
        <div className="results-bar">
          <p className="filter-results">
            Showing <strong>{results.length}</strong> course
            {results.length !== 1 ? "s" : ""}
            {query && ` for "${query}"`}
          </p>
          <div className="results-bar__actions">
            <button
              className={`btn ${sidebarOpen ? "btn--primary" : "btn--secondary"} btn--sm mobile-only`}
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="filter-badge">
                  {[
                    level !== "All" && 1,
                    category !== "All" && 1,
                    teacherId && 1,
                    selectedTags.length,
                  ]
                    .filter(Boolean)
                    .reduce((a: number, b) => a + (b as number), 0)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button className="btn btn--ghost btn--sm" onClick={clearAll}>
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="courses-layout">
          {/* Sidebar filters */}
          <aside
            className={`courses-layout__sidebar card${sidebarOpen ? " is-open" : ""}`}
          >
            {/* Mobile drag handle */}
            <div className="filter-popup-handle" />

            {/* Mobile header */}
            <div className="filter-popup-header">
              <span>Filters</span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <FilterGroup label="Level">
              <div className="filter-group__items">
                <FilterOptions max={5}>
                  {levels.map((l) => (
                    <label key={l} className="filter-check">
                      <input
                        type="radio"
                        name="level"
                        value={l}
                        checked={level === l}
                        onChange={() => setLevel(l)}
                      />
                      {l}
                    </label>
                  ))}
                </FilterOptions>
              </div>
            </FilterGroup>

            <FilterGroup label="Category">
              <div className="filter-group__items">
                <FilterOptions max={5}>
                  {categories.map((c) => (
                    <label key={c} className="filter-check">
                      <input
                        type="radio"
                        name="category"
                        value={c}
                        checked={category === c}
                        onChange={() => setCategory(c)}
                      />
                      {c}
                    </label>
                  ))}
                </FilterOptions>
              </div>
            </FilterGroup>

            <FilterGroup label="Instructor">
              <select
                className="select"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">All Instructors</option>
                {allTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Tags">
              <div className="filter-group__tags">
                <FilterOptions max={6}>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`badge ${selectedTags.includes(tag) ? "badge--primary" : "badge--gray"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </FilterOptions>
              </div>
            </FilterGroup>

            {/* Mobile apply button */}
            <div className="filter-popup-footer">
              <button
                className="btn btn--primary btn--full"
                onClick={() => setSidebarOpen(false)}
              >
                Show {results.length} result{results.length !== 1 ? "s" : ""}
              </button>
              {hasActiveFilters && (
                <button
                  className="btn btn--ghost btn--full"
                  onClick={() => {
                    clearAll();
                    setSidebarOpen(false);
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="courses-layout__results">
            {results.length === 0 ? (
              <div className="filter-empty">
                <BookOpen size={48} />
                <p>No courses match your filters.</p>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={clearAll}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div className="courses-grid" layout>
                {results.map((course, i) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i * 0.04, 0.3),
                    }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function FilterGroup({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <button
        className="filter-group__label"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown
          size={14}
          className={`filter-group__chevron${open ? " filter-group__chevron--open" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterOptions({
  children,
  max = 5,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const all = React.Children.toArray(children);
  const visible = all.slice(0, max);
  const hidden = all.slice(max);
  return (
    <>
      {visible}
      <AnimatePresence initial={false}>
        {showAll && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {hidden}
          </motion.div>
        )}
      </AnimatePresence>
      {hidden.length > 0 && (
        <button
          className="filter-group__show-more"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show less" : `+${hidden.length} more`}
        </button>
      )}
    </>
  );
}
