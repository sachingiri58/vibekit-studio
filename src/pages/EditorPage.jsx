// src/pages/EditorPage.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { pages as pagesApi } from '../lib/api'
import { THEMES, getTheme } from '../lib/themes'
import PagePreview from '../components/PagePreview'
import './EditorPage.css'

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: '🖥', width: '100%' },
  { id: 'tablet', label: 'Tablet', icon: '📱', width: '768px' },
  { id: 'mobile', label: 'Mobile', icon: '📲', width: '375px' },
]

export default function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const saveTimer = useRef(null)

  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')
  const [viewport, setViewport] = useState('desktop')
  const [activeSection, setActiveSection] = useState(null) // 'hero'|'features'|'gallery'|'contact'|'theme'

  useEffect(() => {
    loadPage()
  }, [id])

  async function loadPage() {
    try {
      const data = await pagesApi.get(id)
      setPage(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Auto-save with debounce
  const scheduleSave = useCallback((updatedPage) => {
    clearTimeout(saveTimer.current)
    setSavedMsg('')
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try {
        await pagesApi.update(id, {
          title: updatedPage.title,
          sections: updatedPage.sections,
          theme: updatedPage.theme
        })
        setSavedMsg('Saved ✓')
        setTimeout(() => setSavedMsg(''), 2500)
      } catch {
        setSavedMsg('Save failed')
      } finally {
        setSaving(false)
      }
    }, 900)
  }, [id])

  function updatePage(changes) {
    setPage(prev => {
      const updated = { ...prev, ...changes }
      scheduleSave(updated)
      return updated
    })
  }

  function updateSection(sectionId, changes) {
    setPage(prev => {
      const sections = prev.sections.map(s =>
        s.id === sectionId ? { ...s, ...changes } : s
      )
      const updated = { ...prev, sections }
      scheduleSave(updated)
      return updated
    })
  }

  function moveSection(sectionId, dir) {
    setPage(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId)
      if (idx < 0) return prev
      const newIdx = dir === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.sections.length) return prev
      const sections = [...prev.sections]
      ;[sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]]
      const updated = { ...prev, sections }
      scheduleSave(updated)
      return updated
    })
  }

  async function handlePublish() {
    setSaving(true)
    try {
      if (page.status === 'published') {
        await pagesApi.unpublish(id)
        setPage(p => ({ ...p, status: 'draft' }))
        setSavedMsg('Unpublished')
      } else {
        await pagesApi.publish(id)
        setPage(p => ({ ...p, status: 'published' }))
        setSavedMsg('Published! ✓')
      }
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="editor-loading">
      <div className="spinner" style={{ width: 36, height: 36 }} />
      <p>Loading editor…</p>
    </div>
  )

  if (error) return (
    <div className="editor-loading">
      <p style={{ color: 'var(--error)' }}>{error}</p>
      <button className="btn btn-secondary" onClick={() => navigate('/app')}>← Dashboard</button>
    </div>
  )

  const currentSection = page.sections.find(s => s.id === activeSection)

  return (
    <div className="editor-page">
      {/* Top bar */}
      <header className="editor-topbar">
        <div className="editor-topbar-left">
          <Link to="/app" className="editor-back">← Dashboard</Link>
          <input
            className="editor-title-input"
            value={page.title}
            onChange={e => updatePage({ title: e.target.value })}
          />
        </div>
        <div className="editor-topbar-center">
          {VIEWPORTS.map(v => (
            <button
              key={v.id}
              className={`viewport-btn ${viewport === v.id ? 'active' : ''}`}
              onClick={() => setViewport(v.id)}
              title={v.label}
            >
              <span>{v.icon}</span>
              <span className="hide-mobile">{v.label}</span>
            </button>
          ))}
        </div>
        <div className="editor-topbar-right">
          {savedMsg && <span className="save-msg">{savedMsg}</span>}
          {saving && <span className="spinner" style={{ width: 16, height: 16 }} />}
          {page.status === 'published' && (
            <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              View ↗
            </a>
          )}
          <button
            className={`btn btn-sm ${page.status === 'published' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handlePublish} disabled={saving}
          >
            {page.status === 'published' ? 'Unpublish' : 'Publish →'}
          </button>
        </div>
      </header>

      <div className="editor-body">
        {/* Left panel */}
        <aside className="editor-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Theme / Vibe</div>
            <button
              className={`sidebar-btn ${activeSection === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'theme' ? null : 'theme')}
            >
              {THEMES[page.theme]?.emoji} {THEMES[page.theme]?.name}
              <span className="sidebar-btn-chevron">{activeSection === 'theme' ? '▲' : '▼'}</span>
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Sections</div>
            {page.sections.map((section, idx) => (
              <div key={section.id} className="sidebar-section-row">
                <button
                  className={`sidebar-btn ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                >
                  {sectionIcon(section.type)} {capitalize(section.type)}
                </button>
                <div className="section-move-btns">
                  <button
                    className="move-btn" disabled={idx === 0}
                    onClick={() => moveSection(section.id, 'up')} title="Move up"
                  >▲</button>
                  <button
                    className="move-btn" disabled={idx === page.sections.length - 1}
                    onClick={() => moveSection(section.id, 'down')} title="Move down"
                  >▼</button>
                </div>
              </div>
            ))}
          </div>

          {/* Panel: Theme picker */}
          {activeSection === 'theme' && (
            <div className="editor-panel">
              <div className="panel-title">Pick your vibe</div>
              {Object.values(THEMES).map(t => (
                <button
                  key={t.id}
                  className={`theme-opt ${page.theme === t.id ? 'selected' : ''}`}
                  onClick={() => updatePage({ theme: t.id })}
                >
                  <span
                    className="theme-opt-dot"
                    style={{ background: t.preview[1] }}
                  >{t.emoji}</span>
                  <div>
                    <div className="theme-opt-name">{t.name}</div>
                    <div className="theme-opt-desc">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Panel: Section editors */}
          {currentSection && activeSection !== 'theme' && (
            <div className="editor-panel">
              <SectionEditor
                section={currentSection}
                onChange={(changes) => updateSection(currentSection.id, changes)}
              />
            </div>
          )}
        </aside>

        {/* Preview */}
        <main className="editor-preview-area">
          <div
            className="preview-frame-wrapper"
            style={{
              maxWidth: VIEWPORTS.find(v => v.id === viewport)?.width,
              transition: 'max-width 0.35s ease'
            }}
          >
            <PagePreview page={page} />
          </div>
        </main>
      </div>
    </div>
  )
}

function SectionEditor({ section, onChange }) {
  if (section.type === 'hero') {
    return (
      <>
        <div className="panel-title">🦸 Hero Section</div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" value={section.title} onChange={e => onChange({ title: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Subtitle</label>
          <textarea className="form-input" value={section.subtitle} onChange={e => onChange({ subtitle: e.target.value })} rows={3} />
        </div>
        <div className="form-group">
          <label className="form-label">Button text</label>
          <input className="form-input" value={section.buttonText} onChange={e => onChange({ buttonText: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Button URL</label>
          <input className="form-input" type="url" value={section.buttonUrl} onChange={e => onChange({ buttonUrl: e.target.value })} placeholder="https://" />
        </div>
      </>
    )
  }

  if (section.type === 'features') {
    return (
      <>
        <div className="panel-title">⭐ Features Section</div>
        {section.cards.map((card, i) => (
          <div key={i} className="feature-card-editor">
            <div className="panel-sub">Card {i + 1}</div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={card.title}
                onChange={e => {
                  const cards = [...section.cards]
                  cards[i] = { ...cards[i], title: e.target.value }
                  onChange({ cards })
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" value={card.description} rows={2}
                onChange={e => {
                  const cards = [...section.cards]
                  cards[i] = { ...cards[i], description: e.target.value }
                  onChange({ cards })
                }}
              />
            </div>
          </div>
        ))}
        {section.cards.length < 6 && (
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 8 }}
            onClick={() => onChange({ cards: [...section.cards, { title: 'New Feature', description: 'Describe it here.' }] })}
          >
            + Add card
          </button>
        )}
      </>
    )
  }

  if (section.type === 'gallery') {
    return (
      <>
        <div className="panel-title">🖼 Gallery Section</div>
        {section.images.map((url, i) => (
          <div key={i} className="form-group">
            <label className="form-label">Image {i + 1} URL</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="form-input" value={url}
                onChange={e => {
                  const images = [...section.images]
                  images[i] = e.target.value
                  onChange({ images })
                }}
                placeholder="https://..."
              />
              {section.images.length > 3 && (
                <button className="btn btn-danger btn-sm"
                  onClick={() => onChange({ images: section.images.filter((_, j) => j !== i) })}
                >✕</button>
              )}
            </div>
          </div>
        ))}
        {section.images.length < 8 && (
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 8 }}
            onClick={() => onChange({ images: [...section.images, 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80'] })}
          >
            + Add image
          </button>
        )}
      </>
    )
  }

  if (section.type === 'contact') {
    return (
      <>
        <div className="panel-title">✉️ Contact Section</div>
        <div className="form-group">
          <label className="form-label">Heading</label>
          <input className="form-input" value={section.heading} onChange={e => onChange({ heading: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Subheading</label>
          <textarea className="form-input" value={section.subheading} onChange={e => onChange({ subheading: e.target.value })} rows={2} />
        </div>
      </>
    )
  }

  return null
}

function sectionIcon(type) {
  return { hero: '🦸', features: '⭐', gallery: '🖼', contact: '✉️' }[type] || '📄'
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
