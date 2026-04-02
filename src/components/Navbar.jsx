// src/components/Navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className={`navbar ${transparent ? 'navbar--transparent' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">✦</span>
          <span>VibeKit</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links hide-mobile">
          <Link to="/" className="navbar-link">Home</Link>
          {user ? (
            <>
              <Link to="/app" className="navbar-link">Dashboard</Link>
              <button onClick={handleLogout} className="navbar-link navbar-link--btn">Logout</button>
              <Link to="/app" className="btn btn-primary btn-sm">My Pages</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started →</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger hide-desktop"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
          <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
          <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu" onClick={() => setMenuOpen(false)}>
          <Link to="/" className="mobile-link">Home</Link>
          {user ? (
            <>
              <Link to="/app" className="mobile-link">Dashboard</Link>
              <button onClick={handleLogout} className="mobile-link mobile-link--btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Login</Link>
              <Link to="/signup" className="mobile-link mobile-link--cta">Get Started →</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
