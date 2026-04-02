// netlify/functions/_auth.js
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_in_production'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

// Extract JWT from httpOnly cookie OR Authorization header
function getUserFromEvent(event) {
  try {
    // Try cookie first
    const cookies = cookie.parse(event.headers.cookie || '')
    if (cookies.vk_token) {
      return verifyToken(cookies.vk_token)
    }
    // Fallback: Authorization: Bearer <token>
    const auth = event.headers.authorization || ''
    if (auth.startsWith('Bearer ')) {
      return verifyToken(auth.slice(7))
    }
    return null
  } catch {
    return null
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  }
}

function respond(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...extraHeaders },
    body: JSON.stringify(body)
  }
}

module.exports = { signToken, verifyToken, getUserFromEvent, corsHeaders, respond }
