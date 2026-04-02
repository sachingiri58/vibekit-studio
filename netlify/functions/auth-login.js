// netlify/functions/auth-login.js
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

  const { email, password } = body
  if (!email || !password) {
    return respond(400, { error: 'Email and password are required' })
  }

  try {
    const db = await connectDB()
    const users = db.collection('users')

    const user = await users.findOne({ email: email.toLowerCase() })
    if (!user) {
      return respond(401, { error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return respond(401, { error: 'Invalid email or password' })
    }

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name })

    const cookieStr = cookie.serialize('vk_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return respond(200, {
      user: { id: user._id.toString(), name: user.name, email: user.email },
      token
    }, { 'Set-Cookie': cookieStr })

  } catch (err) {
    console.error('Login error:', err)
    return respond(500, { error: 'Server error, please try again' })
  }
}
