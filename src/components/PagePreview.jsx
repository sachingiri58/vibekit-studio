// src/components/PagePreview.jsx
// Renders the full themed mini-site preview inline
// Used by both editor (live preview) and the published page

import React, { useState } from 'react'
import { getTheme } from '../lib/themes'
import './PagePreview.css'

export default function PagePreview({ page, isPublished = false, onContact }) {
  const theme = getTheme(page.theme)
  const cssVars = Object.entries(theme.vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ')

  return (
    <div className="page-preview" style={{ cssText: cssVars } /* inline vars via style */}>
      <ThemeWrapper vars={theme.vars}>
        {page.sections.map(section => (
          <SectionRenderer
            key={section.id}
            section={section}
            isPublished={isPublished}
            slug={page.slug}
            onContact={onContact}
          />
        ))}
        <ThemedFooter title={page.title} />
      </ThemeWrapper>
    </div>
  )
}

// Apply theme CSS variables to a wrapper div
function ThemeWrapper({ vars, children }) {
  const style = {}
  Object.entries(vars).forEach(([k, v]) => { style[k] = v })
  return (
    <div className="theme-root" style={style}>
      {children}
    </div>
  )
}

function SectionRenderer({ section, isPublished, slug, onContact }) {
  switch (section.type) {
    case 'hero': return <HeroSection section={section} />
    case 'features': return <FeaturesSection section={section} />
    case 'gallery': return <GallerySection section={section} />
    case 'contact': return <ContactSection section={section} isPublished={isPublished} slug={slug} onContact={onContact} />
    default: return null
  }
}

function HeroSection({ section }) {
  return (
    <section className="t-hero">
      <div className="t-container">
        <h1 className="t-hero-title">{section.title}</h1>
        <p className="t-hero-sub">{section.subtitle}</p>
        {section.buttonText && (
          <a href={section.buttonUrl || '#'} className="t-btn" onClick={e => !section.buttonUrl?.startsWith('http') && e.preventDefault()}>
            {section.buttonText}
          </a>
        )}
      </div>
    </section>
  )
}

function FeaturesSection({ section }) {
  return (
    <section className="t-section">
      <div className="t-container">
        <h2 className="t-section-title">Features</h2>
        <div className="t-features-grid">
          {section.cards.map((card, i) => (
            <div key={i} className="t-feature-card">
              <div className="t-feature-title">{card.title}</div>
              <div className="t-feature-desc">{card.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GallerySection({ section }) {
  return (
    <section className="t-section t-section--alt">
      <div className="t-container">
        <h2 className="t-section-title">Gallery</h2>
        <div className="t-gallery-grid">
          {section.images.map((url, i) => (
            <div key={i} className="t-gallery-item">
              <img src={url} alt={`Gallery image ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection({ section, isPublished, slug, onContact }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('') // ''|'sending'|'success'|'error'
  const [errMsg, setErrMsg] = useState('')

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isPublished) return // no submissions in editor mode
    setStatus('sending')
    setErrMsg('')
    try {
      if (onContact) {
        await onContact(form)
      }
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrMsg(err.message || 'Something went wrong')
    }
  }

  return (
    <section className="t-section">
      <div className="t-container t-container--narrow">
        <h2 className="t-section-title">{section.heading || 'Get In Touch'}</h2>
        {section.subheading && <p className="t-section-sub">{section.subheading}</p>}

        {status === 'success' ? (
          <div className="t-contact-success">
            ✓ Message sent! We'll get back to you soon.
          </div>
        ) : (
          <form className="t-contact-form" onSubmit={handleSubmit}>
            <div className="t-form-row">
              <div className="t-form-group">
                <label className="t-label">Name</label>
                <input className="t-input" type="text" value={form.name} onChange={set('name')} required placeholder="Your name" />
              </div>
              <div className="t-form-group">
                <label className="t-label">Email</label>
                <input className="t-input" type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" />
              </div>
            </div>
            <div className="t-form-group">
              <label className="t-label">Message</label>
              <textarea className="t-input t-textarea" value={form.message} onChange={set('message')} required placeholder="Your message…" rows={4} />
            </div>
            {errMsg && <div className="t-contact-error">{errMsg}</div>}
            <button type="submit" className="t-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : isPublished ? 'Send message' : 'Submit (preview only)'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

function ThemedFooter({ title }) {
  return (
    <footer className="t-footer">
      <div className="t-container">
        <span>{title}</span>
        <span className="t-footer-powered">Powered by <a href="/" target="_blank" rel="noreferrer">VibeKit Studio ✦</a></span>
      </div>
    </footer>
  )
}
