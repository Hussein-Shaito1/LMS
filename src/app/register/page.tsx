"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      errs.email = "Enter a valid email.";
    if (!password || password.length < 6)
      errs.password = "Password must be at least 6 characters.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      showToast("Account created! Welcome to LearnHub.", "success");
      router.push("/");
    } else {
      showToast(result.error || "Registration failed.", "error");
      setErrors({ email: result.error || "" });
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__header">
          <div className="auth-page__header-logo">
            <BookOpen size={24} />
            LearnHub
          </div>
          <h1>Create your account</h1>
          <p>Join thousands of learners and start your journey today.</p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Full Name
            </label>
            <div className="form__input-wrap">
              <div className="input-wrapper">
                <User className="input-wrapper__icon" size={18} />
                <input
                  id="name"
                  type="text"
                  className={`input input--with-icon${errors.name ? " input--error" : ""}`}
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({});
                  }}
                  autoComplete="name"
                />
              </div>
              <span className="form__error">{errors.name}</span>
            </div>
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email
            </label>
            <div className="form__input-wrap">
              <div className="input-wrapper">
                <Mail className="input-wrapper__icon" size={18} />
                <input
                  id="email"
                  type="email"
                  className={`input input--with-icon${errors.email ? " input--error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  autoComplete="email"
                />
              </div>
              <span className="form__error">{errors.email}</span>
            </div>
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <div className="form__input-wrap">
              <div className="input-wrapper">
                <Lock className="input-wrapper__icon" size={18} />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className={`input input--with-icon input--with-action${errors.password ? " input--error" : ""}`}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-wrapper__action"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="form__error">{errors.password}</span>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--full btn--lg${loading ? " btn--loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn__spinner" /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-page__footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
