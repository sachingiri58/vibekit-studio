// src/pages/PublishedPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { publicApi } from '../lib/api'
import PagePreview from '../components/PagePreview'
import './PublishedPage.css'

export default function PublishedPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPage()
  }, [slug])

  async function loadPage() {
    try {
      const data = await publicApi.getPage(slug)
      setPage(data)
      setLoading(false)
      // Track view (fire and forget)
      publicApi.trackView(slug).catch(() => {})
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function handleContact(form) {
    await publicApi.contact(slug, form)
  }

  if (loading) return (
    <div className="pub-loading">
      <div className="pub-loading-inner">
        <div className="spinner" style={{ width: 36, height: 36 }} />
        <p>Loading page…</p>
      </div>
    </div>
  )

  if (error || !page) return (
    <div className="pub-loading">
      <div className="pub-loading-inner">
        <div className="pub-404-icon">🔍</div>
        <h1>Page not found</h1>
        <p>This page doesn't exist or hasn't been published yet.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>← Go home</Link>
      </div>
    </div>
  )

  return (
    <div className="published-page">
      {/* Slim powered-by banner */}
      <div className="pub-banner">
        <span>Made with <a href="/" target="_blank" rel="noreferrer">VibeKit Studio ✦</a></span>
        <Link to="/signup" className="pub-banner-cta">Create your own →</Link>
      </div>
      <PagePreview page={page} isPublished={true} onContact={handleContact} />
    </div>
  )
}
