// netlify/functions/auth-signup.js
const bcrypt = require('bcryptjs')
const cookie = require('cookie')
const { connectDB } = require('./_db')
const { signToken, respond, corsHeaders } = require('./_auth')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
  }
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return respond(400, { error: 'Invalid JSON' })
  }

  const { name, email, password } = body

  // Validate inputs server-side
  if (!name || !email || !password) {
    return respond(400, { error: 'Name, email and password are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond(400, { error: 'Invalid email address' })
  }
  if (password.length < 8) {
    return respond(400, { error: 'Password must be at least 8 characters' })
  }

  try {
    const db = await connectDB()
    const users = db.collection('users')

    const existing = await users.findOne({ email: email.toLowerCase() })
    if (existing) {
      return respond(409, { error: 'An account with that email already exists' })
    }

    const hashed = await bcrypt.hash(password, 12)
    const result = await users.insertOne({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      createdAt: new Date()
    })

    const token = signToken({ userId: result.insertedId.toString(), email: email.toLowerCase(), name: name.trim() })

    const cookieStr = cookie.serialize('vk_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return respond(201, {
      user: { id: result.insertedId.toString(), name: name.trim(), email: email.toLowerCase() },
      token
    }, { 'Set-Cookie': cookieStr })

  } catch (err) {
    console.error('Signup error:', err)
    return respond(500, { error: 'Server error, please try again' })
  }
}
