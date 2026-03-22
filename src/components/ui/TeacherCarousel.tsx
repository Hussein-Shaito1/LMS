'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getAllTeachers, getCoursesByTeacherId } from '@/lib/courses'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const teachers = getAllTeachers()

export default function TeacherCarousel() {
  return (
    <section className="section section--white">
      <div className="container">
        <div className="section__header">
          <span className="section__header-eyebrow">Meet the Experts</span>
          <h2>Learn From Industry Leaders</h2>
          <p>Our instructors bring real-world experience from top companies around the globe.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="teacher-carousel"
        >
          {teachers.map((teacher) => {
            const courseCount = getCoursesByTeacherId(teacher.id).length
            return (
              <SwiperSlide key={teacher.id}>
                <Link href={`/teacher/${teacher.id}`} className="teacher-card">
                  <div className="teacher-card__avatar-wrap">
                    <Image
                      src={teacher.avatar}
                      alt={teacher.name}
                      width={80}
                      height={80}
                      className="teacher-card__avatar"
                    />
                  </div>
                  <h4 className="teacher-card__name">{teacher.name}</h4>
                  <p className="teacher-card__title">{teacher.title}</p>
                  <span className="teacher-card__courses">
                    {courseCount} {courseCount === 1 ? 'course' : 'courses'}
                  </span>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}
