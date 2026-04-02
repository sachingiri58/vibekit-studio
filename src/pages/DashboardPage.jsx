// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { pages as pagesApi } from '../lib/api'
import { THEMES } from '../lib/themes'
import Navbar from '../components/Navbar'
import './DashboardPage.css'

function PageSkeleton() {
  return (
    <div className="page-card">
      <div className="skeleton" style={{ height: 80, marginBottom: 16, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '40%' }} />
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [pageList, setPageList] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTheme, setNewTheme] = useState('pastel')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    loadPages()
  }, [])

  async function loadPages() {
    setLoading(true)
    try {
      const list = await pagesApi.list()
      setPageList(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const page = await pagesApi.create({ title: newTitle.trim(), theme: newTheme })
      navigate(`/app/edit/${page.id}`)
    } catch (err) {
      setError(err.message)
      setCreating(false)
    }
  }

  async function handleDuplicate(id) {
    setActionId(id)
    try {
      await pagesApi.duplicate(id)
      await loadPages()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionId(null)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const published = pageList.filter(p => p.status === 'published')
  const drafts = pageList.filter(p => p.status === 'draft')

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-inner">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Hey, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="dash-sub">Manage your mini-sites and vibes</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New Page
          </button>
        </div>

        {error && (
          <div className="dash-error" onClick={() => setError('')}>{error} ✕</div>
        )}

        {/* Create modal */}
        {showCreate && (
          <div className="modal-overlay" onClick={() => setShowCreate(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">New Page</h2>
                <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Page title</label>
                  <input
                    className="form-input"
                    type="text" value={newTitle} autoFocus
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="My Awesome Page"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pick your vibe</label>
                  <div className="theme-picker-grid">
                    {Object.values(THEMES).map(t => (
                      <button
                        key={t.id} type="button"
                        className={`theme-pick-btn ${newTheme === t.id ? 'selected' : ''}`}
                        onClick={() => setNewTheme(t.id)}
                      >
                        <div
                          className="theme-pick-swatch"
                          style={{ background: t.preview[0], borderColor: t.preview[2] }}
                        >
                          <span>{t.emoji}</span>
                        </div>
                        <span className="theme-pick-name">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? <span className="spinner" /> : 'Create & Edit →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats row */}
        {!loading && (
          <div className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-n">{pageList.length}</div>
              <div className="dash-stat-l">Total pages</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-n">{published.length}</div>
              <div className="dash-stat-l">Published</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-n">{pageList.reduce((a, p) => a + (p.viewCount || 0), 0)}</div>
              <div className="dash-stat-l">Total views</div>
            </div>
          </div>
        )}

        {/* Page list */}
        {loading ? (
          <div className="pages-grid">
            {[1, 2, 3].map(i => <PageSkeleton key={i} />)}
          </div>
        ) : pageList.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">🎨</div>
            <h3 className="dash-empty-title">No pages yet</h3>
            <p className="dash-empty-sub">Create your first mini-site to get started</p>
            <button className="btn btn-primary btn-lg" onClick={() => setShowCreate(true)}>
              Create your first page →
            </button>
          </div>
        ) : (
          <>
            {published.length > 0 && (
              <>
                <div className="dash-section-title">Published ({published.length})</div>
                <div className="pages-grid">
                  {published.map(p => <PageCard key={p.id} page={p} onDuplicate={handleDuplicate} actionId={actionId} />)}
                </div>
              </>
            )}
            {drafts.length > 0 && (
              <>
                <div className="dash-section-title">Drafts ({drafts.length})</div>
                <div className="pages-grid">
                  {drafts.map(p => <PageCard key={p.id} page={p} onDuplicate={handleDuplicate} actionId={actionId} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PageCard({ page, onDuplicate, actionId }) {
  const navigate = useNavigate()
  const theme = THEMES[page.theme] || THEMES.pastel
  const busy = actionId === page.id

  return (
    <div className="page-card">
      <div
        className="page-card-thumb"
        style={{ background: `linear-gradient(135deg, ${theme.preview[0]}, ${theme.preview[2]})` }}
      >
        <span className="page-card-emoji">{theme.emoji}</span>
        <span className={`badge badge-${page.status === 'published' ? 'success' : 'gray'}`}>
          {page.status}
        </span>
      </div>
      <div className="page-card-body">
        <div className="page-card-title">{page.title}</div>
        <div className="page-card-meta">
          {theme.name}
          {page.status === 'published' && ` · ${page.viewCount || 0} views`}
        </div>
        {page.status === 'published' && (
          <a
            href={`/p/${page.slug}`} target="_blank" rel="noreferrer"
            className="page-card-url"
          >
            /p/{page.slug} ↗
          </a>
        )}
        <div className="page-card-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/app/edit/${page.id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onDuplicate(page.id)}
            disabled={busy}
          >
            {busy ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Duplicate'}
          </button>
          {page.status === 'published' && (
            <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              View ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
