// netlify/functions/page-by-id.js
// Handles: GET /api/pages/:id
//          PUT /api/pages/:id
//          POST /api/pages/:id/publish
//          POST /api/pages/:id/unpublish
//          POST /api/pages/:id/duplicate

const { ObjectId } = require('mongodb')
const { connectDB } = require('./_db')
const { getUserFromEvent, respond, corsHeaders } = require('./_auth')

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
  }

  const user = getUserFromEvent(event)
  if (!user) return respond(401, { error: 'Unauthorized' })

  // Parse path: /api/pages/:id or /api/pages/:id/action
  const pathParts = event.path.replace(/.*\/pages\//, '').split('/')
  const id = pathParts[0]
  const action = pathParts[1] // publish | unpublish | duplicate

  if (!id || !ObjectId.isValid(id)) {
    return respond(400, { error: 'Invalid page ID' })
  }

  const db = await connectDB()
  const pages = db.collection('pages')

  // Fetch page and verify ownership
  const page = await pages.findOne({ _id: new ObjectId(id) })
  if (!page) return respond(404, { error: 'Page not found' })
  if (page.userId !== user.userId) return respond(403, { error: 'Forbidden' })

  // GET single page
  if (event.httpMethod === 'GET' && !action) {
    return respond(200, { ...page, id: page._id.toString() })
  }

  // PUT update page
  if (event.httpMethod === 'PUT' && !action) {
    let body
    try { body = JSON.parse(event.body || '{}') } catch { return respond(400, { error: 'Invalid JSON' }) }

    // Server-side validation
    const allowed = ['title', 'sections', 'theme']
    const update = {}
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key]
    }
    if (body.title) {
      update.title = body.title.trim()
      if (!update.title) return respond(400, { error: 'Title cannot be empty' })
    }
    update.updatedAt = new Date()

    await pages.updateOne({ _id: new ObjectId(id) }, { $set: update })
    const updated = await pages.findOne({ _id: new ObjectId(id) })
    return respond(200, { ...updated, id: updated._id.toString() })
  }

  // POST /publish
  if (event.httpMethod === 'POST' && action === 'publish') {
    await pages.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'published', updatedAt: new Date() } }
    )
    return respond(200, { message: 'Page published', slug: page.slug })
  }

  // POST /unpublish
  if (event.httpMethod === 'POST' && action === 'unpublish') {
    await pages.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'draft', updatedAt: new Date() } }
    )
    return respond(200, { message: 'Page unpublished' })
  }

  // POST /duplicate
  if (event.httpMethod === 'POST' && action === 'duplicate') {
    const baseSlug = slugify(page.title + ' copy')
    let slug = baseSlug
    let attempt = 0
    while (await pages.findOne({ slug })) {
      attempt++
      slug = `${baseSlug}-${attempt}`
    }
    const now = new Date()
    const clone = {
      ...page,
      _id: undefined,
      title: page.title + ' (Copy)',
      slug,
      status: 'draft',
      viewCount: 0,
      createdAt: now,
      updatedAt: now
    }
    delete clone._id
    const result = await pages.insertOne(clone)
    return respond(201, { ...clone, id: result.insertedId.toString() })
  }

  return respond(405, { error: 'Method not allowed' })
}
