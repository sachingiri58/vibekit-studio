// netlify/functions/auth-logout.js
const cookie = require('cookie')
const { respond, corsHeaders } = require('./_auth')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
  }

  const cookieStr = cookie.serialize('vk_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return respond(200, { message: 'Logged out' }, { 'Set-Cookie': cookieStr })
}
