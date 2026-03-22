"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SLIDES = [
  {
    eyebrow: "The Future of Learning is Here",
    title: "Learn Without",
    highlight: "Limits",
    subtitle:
      "Explore 10+ expert-led courses in web development, design, data science, and more. Track your progress and learn at your own pace — completely free.",
    primaryCta: { label: "Browse Courses", href: "#courses" },
    secondaryCta: { label: "Start Learning Free", href: "/register" },
    variant: "slide--blue",
  },
  {
    eyebrow: "In-Demand Skills",
    title: "Master Modern",
    highlight: "Technology",
    subtitle:
      "From React to Python, machine learning to UI/UX — build the skills employers are looking for with hands-on projects and real-world examples.",
    primaryCta: { label: "Explore Courses", href: "#courses" },
    secondaryCta: { label: "View Catalog", href: "/courses" },
    variant: "slide--purple",
  },
  {
    eyebrow: "World-Class Instructors",
    title: "Learn From",
    highlight: "The Best",
    subtitle:
      "Our instructors are industry professionals with years of real-world experience. Get the knowledge that actually matters in the real world.",
    primaryCta: { label: "Browse Courses", href: "#courses" },
    secondaryCta: { label: "Join for Free", href: "/register" },
    variant: "slide--teal",
  },
];

const STATS = [
  { value: "10+", label: "Expert Courses" },
  { value: "50K+", label: "Students Enrolled" },
  { value: "4.8★", label: "Average Rating" },
  { value: "100%", label: "Free to Browse" },
];

export default function HeroSwiper() {
  return (
    <section className="hero-swiper">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide
            key={i}
            className={`hero-swiper__slide ${slide.variant}`}
          >
            <div className="container">
              <div className="hero-swiper__content">
                <div className="hero__eyebrow">
                  <BookOpen size={14} />
                  {slide.eyebrow}
                </div>
                <h1>
                  {slide.title} <span>{slide.highlight}</span>
                </h1>
                <p className="hero__subtitle">{slide.subtitle}</p>
                <div className="hero__actions">
                  <Link
                    href={slide.primaryCta.href}
                    className="btn btn--primary btn--lg"
                  >
                    {slide.primaryCta.label}
                  </Link>
                  <Link
                    href={slide.secondaryCta.href}
                    className="btn btn--secondary btn--lg"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-swiper__stats">
        <div className="container">
          <div className="hero__stats">
            {STATS.map(({ value, label }) => (
              <div key={label} className="hero__stat">
                <div className="hero__stat-value">{value}</div>
                <div className="hero__stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
