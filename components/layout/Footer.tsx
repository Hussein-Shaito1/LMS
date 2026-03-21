import Link from 'next/link'
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brand-logo">
              <BookOpen size={22} />
              LearnHub
            </div>
            <p className="footer__brand-desc">
              A modern Learning Management System built for students who want to grow their skills and advance their careers.
            </p>
            <div className="footer__brand-social">
              <a href="#" aria-label="GitHub"><Github size={16} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
            </div>
          </div>

          {/* Courses */}
          <div className="footer__col">
            <div className="footer__col-title">Courses</div>
            <div className="footer__col-links">
              <Link href="/?category=Web+Development">Web Development</Link>
              <Link href="/?category=Design">Design</Link>
              <Link href="/?category=Data+Science">Data Science</Link>
              <Link href="/?category=Mobile">Mobile Dev</Link>
              <Link href="/?category=DevOps">DevOps</Link>
            </div>
          </div>

          {/* Company */}
          <div className="footer__col">
            <div className="footer__col-title">Company</div>
            <div className="footer__col-links">
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
          </div>

          {/* Account */}
          <div className="footer__col">
            <div className="footer__col-title">Account</div>
            <div className="footer__col-links">
              <Link href="/login">Log In</Link>
              <Link href="/register">Sign Up</Link>
              <Link href="/my-courses">My Courses</Link>
              <Link href="/favorites">Favorites</Link>
              <Link href="/profile">Profile</Link>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__bottom-copy">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <div className="footer__bottom-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
