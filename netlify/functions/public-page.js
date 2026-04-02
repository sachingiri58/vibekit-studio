// netlify/functions/public-page.js
// GET  /api/public/pages/:slug       -> fetch published page data
// POST /api/public/pages/:slug/view  -> increment view count
// POST /api/public/pages/:slug/contact -> store contact submission

const { connectDB } = require('./_db')
const { respond, corsHeaders } = require('./_auth')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
  }

  // Parse slug and action from path
  const pathParts = event.path.replace(/.*\/public\/pages\//, '').split('/')
  const slug = pathParts[0]
  const action = pathParts[1] // view | contact

  if (!slug) return respond(400, { error: 'Slug required' })

  const db = await connectDB()
  const pages = db.collection('pages')

  // GET - fetch published page
  if (event.httpMethod === 'GET' && !action) {
    const page = await pages.findOne({ slug, status: 'published' })
    if (!page) return respond(404, { error: 'Page not found or not published' })
    // Never expose userId or internal fields
    const { _id, userId, ...safe } = page
    return respond(200, { ...safe, id: _id.toString() })
  }

  // POST /view - increment view count
  if (event.httpMethod === 'POST' && action === 'view') {
    const page = await pages.findOne({ slug, status: 'published' })
    if (!page) return respond(404, { error: 'Page not found' })
    await pages.updateOne({ slug }, { $inc: { viewCount: 1 } })
    return respond(200, { message: 'View counted' })
  }

  // POST /contact - store contact form submission
  if (event.httpMethod === 'POST' && action === 'contact') {
    const page = await pages.findOne({ slug, status: 'published' })
    if (!page) return respond(404, { error: 'Page not found' })

    let body
    try { body = JSON.parse(event.body || '{}') } catch { return respond(400, { error: 'Invalid JSON' }) }

    const { name, email, message } = body
    if (!name || !email || !message) {
      return respond(400, { error: 'Name, email, and message are required' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(400, { error: 'Invalid email address' })
    }
    if (message.length > 2000) {
      return respond(400, { error: 'Message too long (max 2000 chars)' })
    }

    const submissions = db.collection('contactSubmissions')
    await submissions.insertOne({
      pageId: page._id.toString(),
      pageSlug: slug,
      pageOwnerId: page.userId,
      name: name.trim(),
      email: email.toLowerCase(),
      message: message.trim(),
      submittedAt: new Date()
    })

    return respond(201, { message: 'Message sent! We will get back to you soon.' })
  }

  return respond(405, { error: 'Method not allowed' })
}
