// src/pages/LandingPage.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { THEMES } from '../lib/themes'
import './LandingPage.css'

const EXAMPLE_THEMES = [
  { ...THEMES.pastel, sampleTitle: 'Creative Portfolio', sampleDesc: 'Showcase your work beautifully' },
  { ...THEMES.darkneon, sampleTitle: 'Tech Agency', sampleDesc: 'Dark & electric presence' },
  { ...THEMES.neobrutalist, sampleTitle: 'Design Studio', sampleDesc: 'Bold & unapologetic' },
]

const FEATURES = [
  { icon: '🎨', title: '6 Vibe Themes', desc: 'From pastel soft to neo-brutal — pick the mood that fits your brand and make it yours.' },
  { icon: '⚡', title: 'Live Preview', desc: 'See every change in real time across desktop, tablet and mobile before you publish.' },
  { icon: '🌍', title: 'Instant Publish', desc: 'One click and your mini-site is live at a public URL, fully responsive and blazing fast.' },
  { icon: '📊', title: 'View Tracking', desc: 'See exactly how many people are visiting your published pages — all stored in your dashboard.' },
  { icon: '🔒', title: 'Secure Auth', desc: 'Your pages belong to you. Bcrypt passwords, JWT sessions, and zero data leaks.' },
  { icon: '📱', title: 'Mobile First', desc: 'Every theme is built to look stunning at 320px and up — no pinching or horizontal scrolling.' },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero fade-up">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-pill">✦ Theme Generator & Page Builder</div>
            <h1 className="hero-h1">
              Generate your<br />
              <span className="hero-accent">vibe</span>, build<br />
              your site.
            </h1>
            <p className="hero-sub">
              Pick a design theme, fill in your content, and hit publish.
              Your polished mini‑site goes live in minutes — beautiful on every device.
            </p>
            <div className="hero-btns">
              <Link to="/signup" className="btn btn-primary btn-lg">Create your first page →</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-n">6+</span>
                <span className="hero-stat-l">Vibe themes</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-n">Live</span>
                <span className="hero-stat-l">Instant deploy</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-n">Free</span>
                <span className="hero-stat-l">No credit card</span>
              </div>
            </div>
          </div>

          <div className="hero-right fade-up fade-up-delay-2">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-title">My Pages</span>
                <Link to="/signup" className="btn btn-primary btn-sm">+ New Page</Link>
              </div>
              {[
                { name: 'Portfolio 2026', theme: 'Pastel Soft', views: 142, status: 'published' },
                { name: 'Creative Studio', theme: 'Editorial', status: 'draft' },
                { name: 'Neon Agency', theme: 'Dark Neon', views: 67, status: 'published' },
              ].map((p, i) => (
                <div key={i} className="hero-page-row">
                  <div>
                    <div className="hero-page-name">{p.name}</div>
                    <div className="hero-page-meta">{p.theme}{p.views ? ` · ${p.views} views` : ''}</div>
                  </div>
                  <span className={`badge badge-${p.status === 'published' ? 'success' : 'gray'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Theme Showcase */}
      <section className="themes-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-pill">✦ Vibe Presets</div>
            <h2 className="section-h2">Pick your aesthetic</h2>
            <p className="section-sub">Every theme is a complete design system — colors, typography, spacing, and button styles all included.</p>
          </div>
          <div className="themes-grid">
            {EXAMPLE_THEMES.map((theme) => (
              <div key={theme.id} className="theme-card">
                <div
                  className="theme-card-preview"
                  style={{ background: theme.preview[0], border: `2px solid ${theme.preview[2]}` }}
                >
                  <div
                    className="theme-card-bar"
                    style={{ background: theme.preview[1] }}
                  />
                  <div className="theme-card-lines">
                    <div className="theme-card-line" style={{ background: theme.preview[1], opacity: 0.3, width: '70%' }} />
                    <div className="theme-card-line" style={{ background: theme.preview[1], opacity: 0.2, width: '50%' }} />
                    <div
                      className="theme-card-btn-mock"
                      style={{ background: theme.preview[1], color: theme.preview[0] }}
                    >
                      {theme.emoji}
                    </div>
                  </div>
                </div>
                <div className="theme-card-info">
                  <div className="theme-card-name">{theme.name}</div>
                  <div className="theme-card-desc">{theme.sampleDesc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/signup" className="btn btn-ghost btn-lg">See all 6 themes →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-pill">✦ Everything included</div>
            <h2 className="section-h2">All you need to publish</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-pill">✦ Ready?</div>
          <h2 className="cta-h2">Build your vibe today.</h2>
          <p className="cta-sub">Free to start. No design skills needed. Just your ideas.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">Create your first page →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo">✦ VibeKit Studio</div>
          <div className="footer-copy">Built with 🧡 for Purple Merit Technologies Assessment · 2026</div>
        </div>
      </footer>
    </div>
  )
}
